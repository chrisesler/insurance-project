'use client';

import Link from 'next/link';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';

export function Navbar() {
  const { isSignedIn, user } = useUser();

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">AutoQuote</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link href="/quote" className="text-sm font-medium text-gray-700 hover:text-blue-600">
              Get Quote
            </Link>
            
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile" className="text-sm font-medium text-gray-700 hover:text-blue-600">
                  My Quotes
                </Link>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <SignInButton>
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm">
                    Sign Up
                  </Button>
                </SignUpButton>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}