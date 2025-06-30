import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SiShopify } from "react-icons/si";
import { Loader2, Store, Package, Tag, ShoppingCart, RefreshCw, Clock, Globe, DollarSign, CheckCircle, AlertCircle } from "lucide-react";

export default function ShopifyConnection() {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    shopifyDomain: "",
    accessToken: "",
    shopName: "",
    email: "",
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: store, isLoading } = useQuery({
    queryKey: ["/api/shopify/store"],
    queryFn: async () => {
      const response = await fetch("/api/shopify/store");
      if (!response.ok) return null;
      return response.json();
    },
  });

  const connectStoreMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/shopify/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to connect store");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Store Connected & Synced",
        description: "Your Shopify store has been connected and all data has been imported!",
      });
      setOpen(false);
      setFormData({ shopifyDomain: "", accessToken: "", shopName: "", email: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/shopify/store"] });
    },
    onError: (error: any) => {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect your store. Please check your credentials.",
        variant: "destructive",
      });
      console.error("Error connecting store:", error);
    },
  });

  const syncStoreMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/shopify/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to sync store");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Store Data Refreshed",
        description: "Your store data has been updated with the latest information from Shopify.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/shopify/store"] });
    },
    onError: (error: any) => {
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to refresh store data.",
        variant: "destructive",
      });
      console.error("Error syncing store:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.shopifyDomain || !formData.accessToken || !formData.shopName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    connectStoreMutation.mutate(formData);
  };

  const handleSync = () => {
    syncStoreMutation.mutate();
  };

  const formatLastSync = (lastSyncAt: string | null) => {
    if (!lastSyncAt) return "Never";
    const date = new Date(lastSyncAt);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Store Connection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-3 gap-4">
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
              <div className="h-16 bg-gray-200 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!store) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            Connect Your Shopify Store
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <SiShopify className="w-8 h-8 text-green-600" />
            <div>
              <h3 className="font-medium text-blue-900">Ready to connect your store?</h3>
              <p className="text-sm text-blue-700">
                Import all your products, categories, and store data to create a personalized mobile app.
              </p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                <SiShopify className="w-4 h-4 mr-2" />
                Connect Shopify Store
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <SiShopify className="w-5 h-5 text-green-600" />
                  Connect Your Shopify Store
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="shopifyDomain">Store Domain *</Label>
                  <Input
                    id="shopifyDomain"
                    placeholder="yourstore"
                    value={formData.shopifyDomain}
                    onChange={(e) => setFormData(prev => ({ ...prev, shopifyDomain: e.target.value }))}
                    required
                  />
                  <p className="text-xs text-gray-500">Enter just the subdomain (without .myshopify.com)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accessToken">Private App Access Token *</Label>
                  <Input
                    id="accessToken"
                    type="password"
                    placeholder="shpat_..."
                    value={formData.accessToken}
                    onChange={(e) => setFormData(prev => ({ ...prev, accessToken: e.target.value }))}
                    required
                  />
                  <p className="text-xs text-gray-500">Create a private app in your Shopify admin to get this token</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shopName">Store Name *</Label>
                  <Input
                    id="shopName"
                    placeholder="My Awesome Store"
                    value={formData.shopName}
                    onChange={(e) => setFormData(prev => ({ ...prev, shopName: e.target.value }))}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Store Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@yourstore.com"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={connectStoreMutation.isPending}
                >
                  {connectStoreMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Connecting & Importing Data...
                    </>
                  ) : (
                    <>
                      <SiShopify className="w-4 h-4 mr-2" />
                      Connect Store
                    </>
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>

          <div className="text-center text-sm text-gray-500">
            <p>Need help? Check out our guide to create a Shopify private app.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Connected store display with real data
  const storeData = store.storeData as any;
  const hasRealData = storeData && storeData.products;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            {store.shopName}
          </CardTitle>
          <Badge variant="secondary" className="bg-green-100 text-green-700">
            <SiShopify className="w-3 h-3 mr-1" />
            Connected
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Store Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <Package className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-900">{store.productCount || 0}</div>
            <div className="text-sm text-blue-700">Products</div>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <Tag className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-900">{store.collectionCount || 0}</div>
            <div className="text-sm text-purple-700">Collections</div>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <ShoppingCart className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-900">{store.orderCount || 0}</div>
            <div className="text-sm text-green-700">Orders</div>
          </div>
          <div className="text-center p-3 bg-orange-50 rounded-lg">
            <DollarSign className="w-6 h-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-900">{store.currency || 'USD'}</div>
            <div className="text-sm text-orange-700">Currency</div>
          </div>
        </div>

        {/* Store Details */}
        {storeData && storeData.store && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Store Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-gray-500" />
                <span className="text-gray-600">Domain:</span>
                <span className="font-medium">{store.shopifyDomain}.myshopify.com</span>
              </div>
              {storeData.store.country_name && (
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Country:</span>
                  <span className="font-medium">{storeData.store.country_name}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Real Products Preview */}
        {hasRealData && storeData.products.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Recent Products</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {storeData.products.slice(0, 4).map((product: any) => (
                <div key={product.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-gray-200 rounded-md flex items-center justify-center">
                    {product.images && product.images[0] ? (
                      <img 
                        src={product.images[0].src} 
                        alt={product.title}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <Package className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{product.title}</div>
                    <div className="text-xs text-gray-500">
                      ${product.variants[0]?.price || '0.00'} • {product.product_type}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Real Collections Preview */}
        {hasRealData && storeData.collections && storeData.collections.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Collections</h4>
            <div className="flex flex-wrap gap-2">
              {storeData.collections.slice(0, 6).map((collection: any) => (
                <Badge key={collection.id} variant="outline" className="text-xs">
                  {collection.title} ({collection.products_count})
                </Badge>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Sync Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Last synced: {formatLastSync(store.lastSyncAt)}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSync}
            disabled={syncStoreMutation.isPending}
          >
            {syncStoreMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh Data
              </>
            )}
          </Button>
        </div>

        {!hasRealData && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div className="text-sm">
              <span className="font-medium text-yellow-800">Store data is being imported.</span>
              <span className="text-yellow-700"> Try refreshing to see your products and collections.</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}