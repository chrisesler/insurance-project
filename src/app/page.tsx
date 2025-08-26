import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Navbar } from '@/components/navbar';
import { Shield, Code, Database, CheckCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Django + Next.js
            <span className="text-blue-600"> Full Stack Demo</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A modern full-stack application demonstrating Django REST API backend 
            with Next.js frontend and Clerk authentication.
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="text-lg px-8 py-6 h-auto">
              View Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-6">
              <Code className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Modern Stack</h3>
              <p className="text-gray-600">
                Next.js 15, TypeScript, Tailwind CSS, and ShadCN components
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Database className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Django API</h3>
              <p className="text-gray-600">
                Django REST Framework with PostgreSQL and JWT authentication
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <Shield className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Auth</h3>
              <p className="text-gray-600">
                Clerk authentication with seamless Django integration
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Architecture Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Technology Stack
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { title: 'Frontend', description: 'Next.js with App Router\nTypeScript & Tailwind' },
                { title: 'Backend', description: 'Django REST API\nPostgreSQL Database' },
                { title: 'Authentication', description: 'Clerk Integration\nJWT Token Handling' },
                { title: 'Deployment', description: 'Vercel Platform\nServerless Functions' },
              ].map(({ title, description }, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-semibold">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold mb-2">{title}</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-line">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                              What&apos;s Included
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              'Clerk Authentication System',
              'Django REST API Endpoints',
              'TypeScript Type Safety',
              'Tailwind CSS Styling',
              'ShadCN UI Components',
              'Responsive Design',
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-lg">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Explore the Demo?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Test the authentication flow and API integration
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6 h-auto">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Cursor Test. Django + Next.js Demo.</p>
        </div>
      </footer>
    </div>
  );
}
