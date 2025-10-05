import { Link } from 'react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Shield, Lock, Zap, ArrowRight } from 'lucide-react';

export default function AboutComponent() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              About Our Authentication App
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern, secure authentication solution built with the latest technologies
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Secure by Default</CardTitle>
                <CardDescription>
                  Built with industry-standard security practices and JWT authentication
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Password Protection</CardTitle>
                <CardDescription>
                  Strong password requirements with validation and secure hashing
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Fast & Modern</CardTitle>
                <CardDescription>
                  Built with React, TypeScript, and modern UI components for the best experience
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* Tech Stack */}
          <Card>
            <CardHeader>
              <CardTitle>Technology Stack</CardTitle>
              <CardDescription>
                Powered by cutting-edge technologies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-2">Frontend</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• React 19</li>
                    <li>• TypeScript</li>
                    <li>• React Router 7</li>
                    <li>• Tailwind CSS</li>
                    <li>• shadcn/ui Components</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Backend</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>• NestJS</li>
                    <li>• JWT Authentication</li>
                    <li>• PostgreSQL</li>
                    <li>• Prisma ORM</li>
                    <li>• bcrypt Password Hashing</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Ready to get started?</h2>
            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="gap-2">
                  Create Account
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/signin">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
