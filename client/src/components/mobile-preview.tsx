import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Code, Signal, Wifi, Battery, Search, ShoppingBag, Home, Grid3X3, Heart, User, Star, ChevronLeft, Plus, Minus } from "lucide-react";

interface MobilePreviewProps {
  generatedAppConfig?: any;
}

export default function MobilePreview({ generatedAppConfig }: MobilePreviewProps) {
  const [currentScreen, setCurrentScreen] = useState<"home" | "product" | "cart" | "wishlist" | "profile">("home");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [isInteractive, setIsInteractive] = useState(true);

  const { data: apps } = useQuery({
    queryKey: ["/api/apps"],
    retry: false,
  });

  // Parse app config data properly
  let parsedConfig = null;
  
  if (generatedAppConfig) {
    // If generatedAppConfig is passed directly from generated-apps component
    if (generatedAppConfig.appConfig) {
      try {
        parsedConfig = typeof generatedAppConfig.appConfig === 'string' 
          ? JSON.parse(generatedAppConfig.appConfig) 
          : generatedAppConfig.appConfig;
      } catch (e) {
        console.error('Failed to parse app config:', e);
        parsedConfig = null;
      }
    } else {
      // If it's the config object itself
      parsedConfig = generatedAppConfig;
    }
  } else {
    const previewApp = apps && Array.isArray(apps) ? apps.find((app: any) => app.status === "ready") : null;
    if (previewApp?.appConfig) {
      try {
        parsedConfig = typeof previewApp.appConfig === 'string' 
          ? JSON.parse(previewApp.appConfig) 
          : previewApp.appConfig;
      } catch (e) {
        console.error('Failed to parse app config:', e);
        parsedConfig = null;
      }
    }
  }
  
  // Create proper preview data structure with fallbacks
  const defaultData = {
    appName: "Your Store",
    primaryColor: "#6366F1",
    heroSection: {
      title: "Welcome to Your Store",
      subtitle: "Start building your mobile app",
    },
    featuredProducts: [
      { id: "1", name: "Premium Wireless Headphones", price: "$299.99", rating: 4.8, image: null },
      { id: "2", name: "Smart Fitness Tracker", price: "$199.99", rating: 4.6, image: null },
      { id: "3", name: "Portable Bluetooth Speaker", price: "$89.99", rating: 4.9, image: null },
      { id: "4", name: "Wireless Charging Pad", price: "$49.99", rating: 4.7, image: null },
    ],
    categories: [
      { name: "Electronics", count: 156, icon: "📱" },
      { name: "Fashion", count: 234, icon: "👕" },
      { name: "Home & Garden", count: 89, icon: "🏡" },
      { name: "Sports", count: 67, icon: "⚽" },
    ]
  };
  
  // Merge parsed config with defaults, ensuring robust fallbacks
  const previewData = {
    appName: parsedConfig?.appName || defaultData.appName,
    primaryColor: parsedConfig?.primaryColor || parsedConfig?.theme?.primaryColor || defaultData.primaryColor,
    heroSection: {
      title: parsedConfig?.layout?.heroSection?.title || parsedConfig?.heroSection?.title || defaultData.heroSection.title,
      subtitle: parsedConfig?.layout?.heroSection?.subtitle || parsedConfig?.heroSection?.subtitle || defaultData.heroSection.subtitle,
    },
    featuredProducts: (() => {
      const products = parsedConfig?.previewData?.featuredProducts || parsedConfig?.featuredProducts;
      if (products && Array.isArray(products)) {
        return products.map((product: any, index: number) => ({
          id: product.id || `${index + 1}`,
          name: product.name || `Product ${index + 1}`,
          price: product.price || "$0.00",
          rating: product.rating || 4.5,
          image: product.image || null
        }));
      }
      return defaultData.featuredProducts;
    })(),
    categories: (() => {
      const categories = parsedConfig?.previewData?.categories || parsedConfig?.categories;
      if (categories && Array.isArray(categories)) {
        return categories.map((category: any, index: number) => ({
          name: category.name || `Category ${index + 1}`,
          count: category.count || 0,
          icon: category.icon || "📦"
        }));
      }
      return defaultData.categories;
    })()
  };

  const handleProductPress = (product: any) => {
    setSelectedProduct(product);
    setCurrentScreen("product");
  };

  const handleAddToCart = (product: any) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleToggleWishlist = (product: any) => {
    setWishlistItems(prev => {
      const isWishlisted = prev.some(item => item.id === product.id);
      if (isWishlisted) {
        return prev.filter(item => item.id !== product.id);
      }
      return [...prev, product];
    });
  };

  const renderHomeScreen = () => (
    <div className="h-full bg-white overflow-y-auto">
      {/* Hero Section */}
      <div 
        className="relative h-32 flex items-center justify-center"
        style={{ 
          background: `linear-gradient(135deg, ${previewData?.primaryColor || '#6366F1'}, ${previewData?.primaryColor || '#6366F1'}cc)` 
        }}
      >
        <div className="text-center text-white px-4">
          <h2 className="font-bold text-lg mb-1">{previewData?.heroSection?.title || 'Welcome'}</h2>
          <p className="text-sm opacity-90">{previewData?.heroSection?.subtitle || 'Start building your mobile app'}</p>
        </div>
      </div>

      {/* Categories */}
      <div className="p-4">
        <h3 className="font-semibold mb-3">Categories</h3>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {(previewData?.categories || []).slice(0, 4).map((category: any, index: number) => (
            <button
              key={index}
              className="bg-gray-50 rounded-lg p-3 text-center hover:bg-gray-100 transition-colors"
              onClick={() => isInteractive && console.log('Category clicked:', category.name)}
            >
              <div className="text-2xl mb-1">{category.icon || '📦'}</div>
              <p className="text-xs font-medium">{category.name}</p>
              <p className="text-xs text-gray-500">{category.count} items</p>
            </button>
          ))}
        </div>

        {/* Products */}
        <h3 className="font-semibold mb-3">Featured Products</h3>
        <div className="grid grid-cols-2 gap-3">
          {(previewData?.featuredProducts || []).map((product: any, index: number) => (
            <button
              key={index}
              className="bg-gray-50 rounded-lg p-2 text-left hover:bg-gray-100 transition-colors"
              onClick={() => isInteractive && handleProductPress(product)}
            >
              <div className="bg-gray-200 h-20 rounded mb-2 flex items-center justify-center relative">
                <div className="w-8 h-8 bg-gray-300 rounded"></div>
                <button
                  className="absolute top-1 right-1 p-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    isInteractive && handleToggleWishlist(product);
                  }}
                >
                  <Heart 
                    className={`h-3 w-3 ${wishlistItems.some(item => item.id === product.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                  />
                </button>
              </div>
              <p className="text-xs font-medium truncate mb-1">{product?.name || 'Product'}</p>
              <div className="flex items-center justify-between">
                <p 
                  className="text-xs font-semibold"
                  style={{ color: previewData?.primaryColor || '#6366F1' }}
                >
                  {product?.price || '$0.00'}
                </p>
                <div className="flex items-center">
                  <Star className="h-2 w-2 text-yellow-400 fill-current" />
                  <span className="text-xs text-gray-500 ml-1">{product?.rating || '4.5'}</span>
                </div>
              </div>
              <button
                className="w-full mt-2 py-1 px-2 rounded text-xs text-white font-medium"
                style={{ backgroundColor: previewData?.primaryColor || '#6366F1' }}
                onClick={(e) => {
                  e.stopPropagation();
                  isInteractive && handleAddToCart(product);
                }}
              >
                Add to Cart
              </button>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderProductScreen = () => (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div 
        className="p-4 text-white flex items-center"
        style={{ backgroundColor: previewData?.primaryColor || '#6366F1' }}
      >
        <button 
          onClick={() => setCurrentScreen("home")}
          className="mr-3"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold">Product Details</h1>
      </div>

      {selectedProduct && (
        <div className="p-4">
          {/* Product Image */}
          <div className="bg-gray-200 h-48 rounded-lg mb-4 flex items-center justify-center">
            <div className="w-16 h-16 bg-gray-300 rounded"></div>
          </div>

          {/* Product Info */}
          <h2 className="text-lg font-bold mb-2">{selectedProduct.name}</h2>
          <div className="flex items-center mb-2">
            <div className="flex">
              {[1,2,3,4,5].map(star => (
                <Star key={star} className="h-4 w-4 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({selectedProduct.rating})</span>
          </div>
          <p className="text-2xl font-bold mb-4" style={{ color: previewData?.primaryColor }}>
            {selectedProduct.price}
          </p>
          <p className="text-gray-600 mb-6">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
          </p>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              className="w-full py-3 rounded-lg text-white font-semibold"
              style={{ backgroundColor: previewData?.primaryColor }}
              onClick={() => handleAddToCart(selectedProduct)}
            >
              Add to Cart
            </button>
            <button
              className="w-full py-3 rounded-lg border-2 font-semibold"
              style={{ borderColor: previewData?.primaryColor, color: previewData?.primaryColor }}
              onClick={() => handleToggleWishlist(selectedProduct)}
            >
              {wishlistItems.some(item => item.id === selectedProduct.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderCartScreen = () => (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div 
        className="p-4 text-white"
        style={{ backgroundColor: previewData?.primaryColor || '#6366F1' }}
      >
        <h1 className="font-semibold">Shopping Cart ({cartItems.length})</h1>
      </div>

      <div className="p-4">
        {cartItems.length === 0 ? (
          <div className="text-center py-8">
            <ShoppingBag className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex items-center bg-gray-50 rounded-lg p-3">
                <div className="w-12 h-12 bg-gray-200 rounded mr-3"></div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{item.name}</p>
                  <p className="text-xs text-gray-600">{item.price}</p>
                </div>
                <div className="flex items-center">
                  <button 
                    className="p-1"
                    onClick={() => {
                      setCartItems(prev => prev.map(cartItem => 
                        cartItem.id === item.id && cartItem.quantity > 1
                          ? { ...cartItem, quantity: cartItem.quantity - 1 }
                          : cartItem
                      ));
                    }}
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="mx-2 text-sm">{item.quantity}</span>
                  <button 
                    className="p-1"
                    onClick={() => {
                      setCartItems(prev => prev.map(cartItem => 
                        cartItem.id === item.id
                          ? { ...cartItem, quantity: cartItem.quantity + 1 }
                          : cartItem
                      ));
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
            <button
              className="w-full py-3 rounded-lg text-white font-semibold mt-6"
              style={{ backgroundColor: previewData?.primaryColor }}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderWishlistScreen = () => (
    <div className="h-full bg-white overflow-y-auto">
      {/* Header */}
      <div 
        className="p-4 text-white"
        style={{ backgroundColor: previewData?.primaryColor || '#6366F1' }}
      >
        <h1 className="font-semibold">Wishlist ({wishlistItems.length})</h1>
      </div>

      <div className="p-4">
        {wishlistItems.length === 0 ? (
          <div className="text-center py-8">
            <Heart className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500">Your wishlist is empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {wishlistItems.map((product, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-2">
                <div className="bg-gray-200 h-20 rounded mb-2 flex items-center justify-center relative">
                  <div className="w-8 h-8 bg-gray-300 rounded"></div>
                  <button
                    className="absolute top-1 right-1 p-1"
                    onClick={() => handleToggleWishlist(product)}
                  >
                    <Heart className="h-3 w-3 text-red-500 fill-current" />
                  </button>
                </div>
                <p className="text-xs font-medium truncate">{product.name}</p>
                <p className="text-xs font-semibold" style={{ color: previewData?.primaryColor }}>
                  {product.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case "product": return renderProductScreen();
      case "cart": return renderCartScreen();
      case "wishlist": return renderWishlistScreen();
      default: return renderHomeScreen();
    }
  };

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Interactive Preview</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={isInteractive ? "default" : "secondary"}>
              {isInteractive ? "Live" : "Static"}
            </Badge>
            <button
              onClick={() => setIsInteractive(!isInteractive)}
              className="text-xs px-2 py-1 rounded border"
            >
              {isInteractive ? "Disable" : "Enable"} Interaction
            </button>
          </div>
        </div>
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

              {/* App Header */}
              <div 
                className="text-white p-4"
                style={{ backgroundColor: previewData.primaryColor }}
              >
                <div className="flex items-center justify-between">
                  <h1 className="font-semibold">{previewData.appName}</h1>
                  <div className="flex items-center space-x-3">
                    <Search className="h-4 w-4" />
                    <div className="relative">
                      <ShoppingBag className="h-4 w-4" />
                      {cartItems.length > 0 && (
                        <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                          {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* App Content */}
              <div className="flex-1 overflow-hidden">
                {renderCurrentScreen()}
              </div>

              {/* Bottom Navigation */}
              <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2">
                <div className="flex justify-around">
                  {[
                    { name: "Home", icon: Home, screen: "home" },
                    { name: "Shop", icon: Grid3X3, screen: "home" },
                    { name: "Cart", icon: ShoppingBag, screen: "cart", count: cartItems.reduce((sum, item) => sum + item.quantity, 0) },
                    { name: "Wishlist", icon: Heart, screen: "wishlist", count: wishlistItems.length },
                  ].map((tab, index) => {
                    const IconComponent = tab.icon;
                    const isActive = currentScreen === tab.screen || (tab.screen === "home" && currentScreen === "home");
                    
                    return (
                      <button
                        key={index}
                        className="flex flex-col items-center py-1 relative"
                        onClick={() => isInteractive && setCurrentScreen(tab.screen as any)}
                      >
                        <div className="relative">
                          <IconComponent 
                            className={`h-4 w-4 ${isActive ? '' : 'text-gray-400'}`}
                            style={{ color: isActive ? (previewData?.primaryColor || '#6366F1') : undefined }}
                          />
                          {tab.count && tab.count > 0 && (
                            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-3 w-3 flex items-center justify-center">
                              {tab.count}
                            </div>
                          )}
                        </div>
                        <span 
                          className={`text-xs ${isActive ? 'font-medium' : 'text-gray-400'}`}
                          style={{ color: isActive ? (previewData?.primaryColor || '#6366F1') : undefined }}
                        >
                          {tab.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Controls */}
        <div className="mt-6 space-y-3">
          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => window.open('https://expo.dev/', '_blank')}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Test on Device
          </Button>
          <Button variant="outline" className="w-full">
            <Code className="h-4 w-4 mr-2" />
            Export Code
          </Button>
        </div>

        {/* Interaction Stats */}
        {isInteractive && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Preview Stats</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>Cart Items: {cartItems.reduce((sum, item) => sum + item.quantity, 0)}</div>
              <div>Wishlist: {wishlistItems.length}</div>
              <div>Current Screen: {currentScreen}</div>
              <div>Interactive: Yes</div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}