'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Navbar } from '@/components/navbar';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { format } from 'date-fns';
import { Plus, Car, FileText, MapPin, User, Shield, DollarSign } from 'lucide-react';

interface Quote {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  dateOfBirth: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  vehicleYear: number;
  vehicleMake: string;
  vehicleModel: string;
  vin: string | null;
  coverageType: string;
  liabilityLimit: number;
  deductible: number;
  premium: number;
  createdAt: string;
  calculatedAt: string | null;
}

export default function ProfilePage() {
  const { user, isLoaded } = useUser();
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user) {
      fetchQuotes();
    }
  }, [isLoaded, user]);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('/api/quote');
      if (response.ok) {
        const data = await response.json();
        setQuotes(data.quotes || []);
      }
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>Please sign in to view your profile.</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="default">Completed</Badge>;
      case 'DRAFT':
        return <Badge variant="outline">Draft</Badge>;
      case 'SUBMITTED':
        return <Badge variant="secondary">Submitted</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getCoverageLabel = (type: string) => {
    switch (type) {
      case 'LIABILITY':
        return 'Liability Only';
      case 'STANDARD':
        return 'Standard Coverage';
      case 'FULL':
        return 'Full Coverage';
      default:
        return type;
    }
  };

  const QuoteDetailsDialog = ({ quote }: { quote: Quote }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Car className="w-5 h-5" />
            <span>Quote Details - {quote.vehicleYear} {quote.vehicleMake} {quote.vehicleModel}</span>
          </DialogTitle>
          <DialogDescription>
            Quote #{quote.id.slice(-8)} • Created {format(new Date(quote.createdAt), 'MMM dd, yyyy')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="w-5 h-5 mr-2" />
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Name:</span>
                <p className="font-medium">{quote.firstName} {quote.lastName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Email:</span>
                <p className="font-medium">{quote.email}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Phone:</span>
                <p className="font-medium">{quote.phone || 'Not provided'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date of Birth:</span>
                <p className="font-medium">{format(new Date(quote.dateOfBirth), 'MMM dd, yyyy')}</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Address
            </h3>
            <div className="text-sm">
              <p className="font-medium">{quote.streetAddress}</p>
              <p className="font-medium">{quote.city}, {quote.state} {quote.zipCode}</p>
            </div>
          </div>

          {/* Vehicle Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Car className="w-5 h-5 mr-2" />
              Vehicle Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Vehicle:</span>
                <p className="font-medium">{quote.vehicleYear} {quote.vehicleMake} {quote.vehicleModel}</p>
              </div>
              <div>
                <span className="text-muted-foreground">VIN:</span>
                <p className="font-medium">{quote.vin || 'Not provided'}</p>
              </div>
            </div>
          </div>

          {/* Coverage Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              Coverage Details
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Coverage Type:</span>
                <p className="font-medium">{getCoverageLabel(quote.coverageType)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Liability Limit:</span>
                <p className="font-medium">${quote.liabilityLimit.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Deductible:</span>
                <p className="font-medium">${quote.deductible.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <DollarSign className="w-5 h-5 mr-2" />
              Pricing
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Annual Premium:</span>
                <p className="font-medium text-green-600 text-lg">${quote.premium.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Monthly Payment:</span>
                <p className="font-medium text-lg">${Math.round(quote.premium / 12).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  const PurchasePolicyDialog = () => (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          Purchase Policy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Purchase Policy</DialogTitle>
          <DialogDescription>
            Complete your policy purchase
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Ready to Purchase</h3>
              <p className="text-muted-foreground mb-4">
                This would take you through the purchase workflow including:
              </p>
              <ul className="text-sm text-left space-y-1 max-w-sm mx-auto">
                <li>• Payment method setup</li>
                <li>• Final policy review</li>
                <li>• Electronic signature</li>
                <li>• Policy document generation</li>
                <li>• Account setup and billing</li>
              </ul>
            </div>
            <div className="pt-4">
              <p className="text-xs text-muted-foreground">
                This is a prototype - actual purchase flow would be implemented here.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col gap-2 justify-between items-center md:flex-row ">
            <div className="w-full">
              <h1 className="text-3xl font-bold">My Insurance Quotes</h1>
              <p className="text-muted-foreground">
                Welcome back, {user.firstName}! Manage your quotes and coverage options.
              </p>
            </div>
            <Link href="/quote" className="w-full md:w-fit">
              <Button size="lg" className="w-full md:w-fit">
                <Plus className="w-4 h-4 mr-2" />
                New Quote
              </Button>
            </Link>
          </div>

          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email:</span>
                    <span>{user.primaryEmailAddress?.emailAddress}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Member since:</span>
                    <span>{user.createdAt ? format(user.createdAt, 'MMM yyyy') : 'Unknown'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total quotes:</span>
                    <span>{quotes.length}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quotes Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Your Quotes</h2>
              {quotes.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {quotes.length} quote{quotes.length !== 1 ? 's' : ''} found
                </span>
              )}
            </div>

            {loading ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p>Loading your quotes...</p>
                </CardContent>
              </Card>
            ) : quotes.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No quotes yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Get started by creating your first auto insurance quote.
                  </p>
                  <Link href="/quote">
                    <Button>
                      <Plus className="w-4 h-4 mr-2" />
                      Create Your First Quote
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {quotes.map((quote) => (
                  <Card key={quote.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center space-x-2">
                          <Car className="w-5 h-5" />
                          <span>
                            {quote.vehicleYear} {quote.vehicleMake} {quote.vehicleModel}
                          </span>
                        </CardTitle>
                        {getStatusBadge(quote.status)}
                      </div>
                      <CardDescription>
                        Created {format(new Date(quote.createdAt), 'MMM dd, yyyy')}
                        {quote.calculatedAt && (
                          <> • Quote calculated {format(new Date(quote.calculatedAt), 'MMM dd, yyyy')}</>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Coverage:</span>
                          <p className="font-medium">{getCoverageLabel(quote.coverageType)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Annual Premium:</span>
                          <p className="font-medium text-green-600">
                            ${quote.premium?.toLocaleString() || 'Calculating...'}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Monthly Payment:</span>
                          <p className="font-medium">
                            ${quote.premium ? Math.round(quote.premium / 12).toLocaleString() : 'Calculating...'}/mo
                          </p>
                        </div>
                      </div>
                      
                      <Separator className="my-4" />
                      
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          Quote #{quote.id.slice(-8)}
                        </div>
                        <div className="space-x-2">
                          <QuoteDetailsDialog quote={quote} />
                          {quote.status === 'COMPLETED' && (
                            <PurchasePolicyDialog />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}