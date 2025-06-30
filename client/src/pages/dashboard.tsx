import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "@/components/sidebar";
import ShopifyConnection from "@/components/shopify-connection";
import AppBuilder from "@/components/app-builder";
import GeneratedApps from "@/components/generated-apps";
import MobilePreview from "@/components/mobile-preview";
import { Bell, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Dashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  const userInitials = user.firstName && user.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user.email ? user.email[0].toUpperCase()
    : "U";

  const userName = user.firstName && user.lastName 
    ? `${user.firstName} ${user.lastName}`
    : user.email || "User";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <i className="fas fa-mobile-alt text-white text-sm"></i>
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">MobileForge</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-primary font-medium">Dashboard</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">My Apps</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">Templates</a>
              <a href="#" className="text-gray-500 hover:text-gray-700">Analytics</a>
            </nav>

            {/* User Profile */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5 text-gray-400" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-700">{userInitials}</span>
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">{userName}</span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-screen pt-16">
        <Sidebar />
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-6 lg:p-8">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Create Your Mobile App</h1>
              <p className="text-gray-600 mt-2">Transform your Shopify store into a beautiful mobile app using natural language</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              {/* App Builder Section */}
              <div className="xl:col-span-2 space-y-6">
                <ShopifyConnection />
                <AppBuilder />
                <GeneratedApps />
              </div>

              {/* Mobile Preview */}
              <div className="xl:col-span-1">
                <MobilePreview />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
