'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';
import { useQuote } from '@/lib/providers/quote-context';
import { QuoteService, COVERAGE_OPTIONS } from '@/lib/services/quote-service';
import { QuoteData, QuoteResult } from '@/types';
import { format } from 'date-fns';
import { CheckCircle, Shield } from 'lucide-react';

export function ReviewStep() {
  const { state, prevStep, clearStorage } = useQuote();
  const { isSignedIn } = useUser();
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate quote when component loads
  useState(() => {
    if (!quote && state.firstName && state.vehicleMake && state.coverageType) {
      setIsCalculating(true);
      try {
        const calculatedQuote = QuoteService.calculateQuote(state as QuoteData);
        setQuote(calculatedQuote);
      } catch (error) {
        console.error('Failed to calculate quote:', error);
      } finally {
        setIsCalculating(false);
      }
    }
  });

  const handleSubmitQuote = async () => {
    if (!isSignedIn) {
      // Redirect to sign in - Clerk will handle this
      window.location.href = '/sign-in?redirect_url=' + encodeURIComponent('/quote');
      return;
    }

    setIsSubmitting(true);
    try {
      // Submit quote to API
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...state,
          premium: quote?.premium,
        }),
      });

      if (response.ok) {
        clearStorage();
        // Redirect to profile or success page
        window.location.href = '/profile';
      } else {
        throw new Error('Failed to submit quote');
      }
    } catch (error) {
      console.error('Failed to submit quote:', error);
      alert('Failed to submit quote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const coverageOption = state.coverageType ? COVERAGE_OPTIONS[state.coverageType as keyof typeof COVERAGE_OPTIONS] : null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-2">Review Your Quote</h2>
        <p className="text-muted-foreground">
          Review your information and get your personalized insurance quote.
        </p>
      </div>

      <div className="grid gap-6">
        {/* Quote Result Card */}
        {quote ? (
          <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-blue-900">Your Quote</CardTitle>
                  <CardDescription>Estimated annual premium</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-900">
                    ${quote.premium.toLocaleString()}
                  </div>
                  <div className="text-sm text-blue-700">
                    ${quote.monthlyPayment}/month
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <h4 className="font-semibold text-blue-900">Coverage Breakdown:</h4>
                <div className="grid gap-2 text-sm">
                  {Object.entries(quote.breakdown).map(([type, amount]) => (
                    <div key={type} className="flex justify-between">
                      <span className="capitalize">
                        {type.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span>${amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isCalculating ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p>Calculating your quote...</p>
            </CardContent>
          </Card>
        ) : null}

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Personal Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Name:</span>
              <span>{state.firstName} {state.lastName}</span>
            </div>
            <div className="flex justify-between">
              <span>Email:</span>
              <span>{state.email}</span>
            </div>
            <div className="flex justify-between">
              <span>Phone:</span>
              <span>{state.phone}</span>
            </div>
            <div className="flex justify-between">
              <span>Date of Birth:</span>
              <span>{state.dateOfBirth ? format(new Date(state.dateOfBirth), 'MMM dd, yyyy') : ''}</span>
            </div>
          </CardContent>
        </Card>

        {/* Address Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Address</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Address:</span>
              <span>{state.streetAddress}</span>
            </div>
            <div className="flex justify-between">
              <span>City, State ZIP:</span>
              <span>{state.city}, {state.state} {state.zipCode}</span>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span>Vehicle</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Vehicle:</span>
              <span>{state.vehicleYear} {state.vehicleMake} {state.vehicleModel}</span>
            </div>
            {state.vin && (
              <div className="flex justify-between">
                <span>VIN:</span>
                <span className="font-mono">{state.vin}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Coverage Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-blue-600" />
              <span>Coverage</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span>Coverage Type:</span>
              <Badge variant="secondary">
                {coverageOption?.name}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Liability Limit:</span>
              <span>${state.liabilityLimit?.toLocaleString()}</span>
            </div>
            {(state.coverageType === 'STANDARD' || state.coverageType === 'FULL') && (
              <div className="flex justify-between">
                <span>Deductible:</span>
                <span>${state.deductible?.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={prevStep}>
          Back to Coverage
        </Button>

        <Button
          size="lg"
          onClick={handleSubmitQuote}
          disabled={!quote || isSubmitting}
          className="min-w-[200px]"
        >
          {isSubmitting ? (
            'Submitting...'
          ) : isSignedIn ? (
            'Save My Quote'
          ) : (
            'Sign In to Save Quote'
          )}
        </Button>
      </div>
    </div>
  );
}