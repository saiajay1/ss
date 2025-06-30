import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Smartphone, Code, Signal, Wifi, Battery, Search, ShoppingBag, Home, Grid3X3, Heart, User, Star } from "lucide-react";

interface MobilePreviewProps {
  generatedAppConfig?: any;
}

export default function MobilePreview({ generatedAppConfig }: MobilePreviewProps) {
  const { data: apps } = useQuery({
    queryKey: ["/api/apps"],
    retry: false,
  });

  // Use generated config if available, otherwise get from apps
  const previewApp = apps && Array.isArray(apps) ? apps.find((app: any) => app.status === "ready") : null;
  const appConfig = generatedAppConfig || previewApp?.appConfig;
  const previewData = generatedAppConfig || previewApp?.previewData || {
    appName: "Your App",
    primaryColor: "#4F46E5",
    featuredProducts: [
      { name: "Connect your store", price: "$0.00" },
      { name: "Generate an app", price: "$0.00" },
    ],
    heroSection: {
      title: "Welcome",
      subtitle: "Create your first app",
    },
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Live Preview</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Mobile Device Mockup */}
        <div className="mx-auto max-w-sm">
          <div className="relative bg-gray-900 rounded-[2.5rem] p-2 shadow-xl">
            {/* Device Frame */}
            <div className="bg-white rounded-[2rem] overflow-hidden h-[600px] relative">
              {/* Status Bar */}
              <div className="bg-gray-50 px-4 py-2 flex justify-between items-center text-xs">
                <span className="font-medium">9:41</span>
                <div className="flex items-center space-x-1">
                  <Signal className="h-3 w-3 text-gray-600" />
                  <Wifi className="h-3 w-3 text-gray-600" />
                  <Battery className="h-3 w-3 text-gray-600" />
                </div>
              </div>

              {/* App Content */}
              <div className="h-full bg-white">
                {/* App Header */}
                <div 
                  className="text-white p-4"
                  style={{ backgroundColor: previewData.primaryColor }}
                >
                  <div className="flex items-center justify-between">
                    <h1 className="font-semibold">{previewData.appName}</h1>
                    <div className="flex items-center space-x-3">
                      <Search className="h-4 w-4" />
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                  </div>
                </div>

                {/* Hero Section */}
                <div 
                  className="relative h-32"
                  style={{ 
                    background: `linear-gradient(to right, ${previewData.primaryColor}, ${previewData.primaryColor}cc)` 
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <h2 className="font-bold text-lg">{previewData.heroSection.title}</h2>
                      <p className="text-sm opacity-90">{previewData.heroSection.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Product Grid */}
                <div className="p-4 flex-1 overflow-y-auto">
                  <h3 className="font-semibold mb-3">Featured Products</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {previewData.featuredProducts.map((product: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-2">
                        <div className="bg-gray-200 h-20 rounded mb-2 flex items-center justify-center">
                          <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        </div>
                        <p className="text-xs font-medium truncate">{product.name}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p 
                            className="text-xs font-semibold"
                            style={{ color: previewData.primaryColor }}
                          >
                            {product.price}
                          </p>
                          {appConfig?.layout?.productDisplay?.showRatings && (
                            <div className="flex items-center">
                              <Star className="h-2 w-2 text-accent fill-current" />
                              <span className="text-xs text-gray-500 ml-1">4.5</span>
                            </div>
                          )}
                        </div>
                        {appConfig?.layout?.productDisplay?.showWishlist && (
                          <div className="mt-1">
                            <Heart className="h-3 w-3 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Categories Section */}
                  {appConfig?.layout?.categories?.showCategories && previewData.categories && (
                    <div className="mt-6">
                      <h3 className="font-semibold mb-3">Shop by Category</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {previewData.categories.slice(0, 4).map((category: any, index: number) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto mb-1"></div>
                            <p className="text-xs font-medium">{category.name}</p>
                            <p className="text-xs text-gray-500">{category.count} items</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Navigation */}
                <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
                  <div className="flex justify-around">
                    <div className="flex flex-col items-center py-1">
                      <Home 
                        className="h-4 w-4 text-sm" 
                        style={{ color: previewData.primaryColor }}
                      />
                      <span 
                        className="text-xs font-medium"
                        style={{ color: previewData.primaryColor }}
                      >
                        Home
                      </span>
                    </div>
                    <div className="flex flex-col items-center py-1">
                      <Grid3X3 className="h-4 w-4 text-gray-400 text-sm" />
                      <span className="text-xs text-gray-400">Categories</span>
                    </div>
                    <div className="flex flex-col items-center py-1">
                      <Heart className="h-4 w-4 text-gray-400 text-sm" />
                      <span className="text-xs text-gray-400">Wishlist</span>
                    </div>
                    <div className="flex flex-col items-center py-1">
                      <User className="h-4 w-4 text-gray-400 text-sm" />
                      <span className="text-xs text-gray-400">Profile</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Controls */}
        <div className="mt-6 space-y-3">
          <Button className="w-full bg-primary hover:bg-primary/90">
            <Smartphone className="h-4 w-4 mr-2" />
            Test on Device
          </Button>
          <Button variant="outline" className="w-full">
            <Code className="h-4 w-4 mr-2" />
            View Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
