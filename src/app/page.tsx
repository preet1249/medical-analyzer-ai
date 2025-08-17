'use client';

import Link from 'next/link';
import { FileText, Shield, Brain, Zap } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">MedAnalyzer</span>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <section className="pt-20 pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                AI-Powered Medical Report
                <span className="text-blue-600"> Analysis</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Upload your medical reports and get instant, detailed analysis with key findings, 
                recommendations, and personalized insights powered by advanced AI technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/register">
                  <Button size="lg" className="w-full sm:w-auto">
                    Start Analyzing Reports
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Powerful Features for Better Health Insights
              </h2>
              <p className="text-lg text-gray-600">
                Everything you need to understand your medical reports
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <Brain className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  AI-Powered Analysis
                </h3>
                <p className="text-gray-600">
                  Advanced GPT-4o technology analyzes your medical reports with precision 
                  and provides comprehensive insights.
                </p>
              </div>
              
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Secure & Private
                </h3>
                <p className="text-gray-600">
                  Your medical data is encrypted and secure. We prioritize your 
                  privacy with enterprise-grade security measures.
                </p>
              </div>
              
              <div className="text-center p-8 bg-gray-50 rounded-lg">
                <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  Instant Results
                </h3>
                <p className="text-gray-600">
                  Get detailed analysis within seconds. Chat with AI about your 
                  reports for personalized explanations.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of users who trust MedAnalyzer for their health insights
            </p>
            <Link href="/auth/register">
              <Button size="lg" variant="secondary">
                Create Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">MedAnalyzer</span>
            </div>
            <p className="text-gray-400">
              AI-powered medical report analysis for better health understanding
            </p>
            <p className="text-gray-500 mt-4 text-sm">
              © 2024 MedAnalyzer. For educational purposes only. Always consult healthcare professionals.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
