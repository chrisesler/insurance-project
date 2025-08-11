import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import { Shield, Clock, DollarSign, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Get Your Auto Insurance Quote in
            <span className="text-blue-600"> 5 Simple Steps</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Compare coverage options and save money on your car insurance. 
            Get an instant quote online in just minutes.
          </p>
          <Link href="/quote">
            <Button size="lg" className="text-lg px-8 py-6 h-auto">
              Get My Quote Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-6">
              <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quick & Easy</h3>
              <p className="text-gray-600">
                Get your quote in under 5 minutes with our streamlined process
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <DollarSign className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Best Rates</h3>
              <p className="text-gray-600">
                Compare multiple coverage options to find the best rate for you
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure & Trusted</h3>
              <p className="text-gray-600">
                Your personal information is protected with enterprise-grade security
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            How It Works
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-5 gap-8">
              {[
                { step: 1, title: 'Personal Info', description: 'Tell us about yourself' },
                { step: 2, title: 'Address', description: 'Where you live matters' },
                { step: 3, title: 'Vehicle Details', description: 'Year, make, and model' },
                { step: 4, title: 'Coverage Options', description: 'Choose your protection level' },
                { step: 5, title: 'Get Quote', description: 'Review and save your quote' },
              ].map(({ step, title, description }) => (
                <div key={step} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                    {step}
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-gray-600">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose AutoQuote?
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'Instant online quotes',
              'Multiple coverage options',
              'Competitive rates',
              'No hidden fees',
              'Expert customer support',
              'Easy policy management',
            ].map((benefit, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-lg">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Save on Your Auto Insurance?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of drivers who trust AutoQuote for their insurance needs
          </p>
          <Link href="/quote">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto">
              Start Your Quote
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 AutoQuote. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
