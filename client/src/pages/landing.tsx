import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Smartphone, Zap, ShoppingBag, Users, ArrowRight, CheckCircle } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Smartphone className="h-5 w-5 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">MobileForge</span>
            </div>
            <Button onClick={() => window.location.href = '/api/login'} className="bg-primary hover:bg-primary/90">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Transform Your Shopify Store into a 
            <span className="text-primary"> Mobile App</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Create beautiful, native mobile apps for your Shopify store using simple natural language prompts. 
            No coding required, just describe what you want and watch your app come to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              onClick={() => window.location.href = '/api/login'}
            >
              Start Building <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Build Mobile Apps with AI
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powered by advanced AI, our platform turns your ideas into fully functional mobile apps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI-Powered Generation</CardTitle>
                <CardDescription>
                  Simply describe your app in natural language and watch AI create it
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingBag className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle>Shopify Integration</CardTitle>
                <CardDescription>
                  Seamlessly connect your store data, products, and customer information
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Live Preview</CardTitle>
                <CardDescription>
                  See your app come to life with real-time preview as you build
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Why Choose MobileForge?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">No Coding Required</h3>
                    <p className="text-gray-600">Create professional mobile apps without any technical knowledge</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Fast Deployment</h3>
                    <p className="text-gray-600">Go from idea to app store in minutes, not months</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Fully Customizable</h3>
                    <p className="text-gray-600">Tailor your app's design and functionality to match your brand</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-secondary mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Real-time Sync</h3>
                    <p className="text-gray-600">Your app stays in sync with your Shopify store automatically</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted by 1000+ Merchants</h3>
              <p className="text-gray-600 mb-6">
                Join thousands of successful Shopify merchants who have transformed their business with mobile apps
              </p>
              <Button 
                className="bg-primary hover:bg-primary/90"
                onClick={() => window.location.href = '/api/login'}
              >
                Join Them Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-white" />
            </div>
            <span className="ml-3 text-xl font-bold">MobileForge</span>
          </div>
          <p className="text-gray-400">
            © 2025 MobileForge. All rights reserved. Transform your Shopify store into a mobile app today.
          </p>
        </div>
      </footer>
    </div>
  );
}
