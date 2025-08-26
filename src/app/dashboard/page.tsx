'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Info, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export default function DashboardPage() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const [healthCheckData, setHealthCheckData] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<Record<string, unknown> | null>(null);
  const [loadingHealth, setLoadingHealth] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [errorHealth, setErrorHealth] = useState<string | null>(null);
  const [errorProfile, setErrorProfile] = useState<string | null>(null);

  // Stable API URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

  const fetchHealthCheck = useCallback(async () => {
    setLoadingHealth(true);
    setErrorHealth(null);
    try {
      const response = await fetch(`${API_BASE_URL}/health/`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setHealthCheckData(data.status);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorHealth(`Failed to fetch health check: ${message}`);
      console.error('Health check error:', error);
    } finally {
      setLoadingHealth(false);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    setLoadingProfile(true);
    setErrorProfile(null);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error('No Clerk token found.');
      }

      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      setProfileData(data);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      setErrorProfile(`Failed to fetch user profile: ${message}`);
      console.error('User profile error:', error);
    } finally {
      setLoadingProfile(false);
    }
  }, [getToken]);

  useEffect(() => {
    if (isLoaded && userId) {
      fetchHealthCheck();
      fetchUserProfile();
    }
  }, [isLoaded, userId, fetchHealthCheck, fetchUserProfile]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view the dashboard.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Dashboard</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Clerk User Info</CardTitle>
                <CardDescription>Details from Clerk authentication</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p><strong>User ID:</strong> {userId}</p>
                <p><strong>Session ID:</strong> {sessionId}</p>
                {user && (
                  <>
                    <p><strong>First Name:</strong> {user.firstName}</p>
                    <p><strong>Last Name:</strong> {user.lastName}</p>
                    <p><strong>Email:</strong> {user.primaryEmailAddress?.emailAddress}</p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Django API Health Check</CardTitle>
                <CardDescription>Test connection to the Django backend</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={fetchHealthCheck} disabled={loadingHealth}>
                  {loadingHealth ? 'Loading...' : 'Fetch Health Check'}
                </Button>
                {errorHealth && (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorHealth}</AlertDescription>
                  </Alert>
                )}
                {healthCheckData && (
                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertTitle>Status</AlertTitle>
                    <AlertDescription>API Health: {healthCheckData}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Django User Profile (Protected)</CardTitle>
                <CardDescription>Fetch authenticated user data from Django</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button onClick={fetchUserProfile} disabled={loadingProfile}>
                  {loadingProfile ? 'Loading...' : 'Fetch User Profile'}
                </Button>
                {errorProfile && (
                  <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errorProfile}</AlertDescription>
                  </Alert>
                )}
                {profileData && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>User Profile Data</AlertTitle>
                    <AlertDescription>
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(profileData, null, 2)}
                      </pre>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}