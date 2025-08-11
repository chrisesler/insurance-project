'use client';

import { QuoteProvider } from '@/lib/providers/quote-context';
import { Navbar } from '@/components/navbar';
import { QuoteWizard } from '@/components/quote/quote-wizard';

export default function QuotePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <QuoteProvider>
          <QuoteWizard />
        </QuoteProvider>
      </main>
    </div>
  );
}