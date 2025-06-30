import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { SiShopify } from "react-icons/si";
import { Loader2 } from "lucide-react";

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
    retry: false,
  });

  const connectStoreMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await apiRequest("POST", "/api/shopify/connect", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Store Connected",
        description: "Your Shopify store has been successfully connected!",
      });
      setOpen(false);
      setFormData({ shopifyDomain: "", accessToken: "", shopName: "", email: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/shopify/store"] });
    },
    onError: (error) => {
      toast({
        title: "Connection Failed",
        description: "Failed to connect your store. Please check your credentials.",
        variant: "destructive",
      });
      console.error("Error connecting store:", error);
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Store Connection</CardTitle>
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
          <CardTitle>Store Connection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SiShopify className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-gray-600 mb-6">Connect your Shopify store to start building your mobile app</p>
            
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="bg-secondary hover:bg-secondary/90">
                  <SiShopify className="h-4 w-4 mr-2" />
                  Connect Shopify Store
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Connect Your Shopify Store</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="shopName">Store Name *</Label>
                    <Input
                      id="shopName"
                      type="text"
                      value={formData.shopName}
                      onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                      placeholder="My Amazing Store"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="shopifyDomain">Shopify Domain *</Label>
                    <Input
                      id="shopifyDomain"
                      type="text"
                      value={formData.shopifyDomain}
                      onChange={(e) => setFormData({ ...formData, shopifyDomain: e.target.value })}
                      placeholder="your-store.myshopify.com"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="accessToken">Access Token *</Label>
                    <Input
                      id="accessToken"
                      type="password"
                      value={formData.accessToken}
                      onChange={(e) => setFormData({ ...formData, accessToken: e.target.value })}
                      placeholder="shpat_..."
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Store Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="store@example.com"
                    />
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={connectStoreMutation.isPending}>
                      {connectStoreMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting...
                        </>
                      ) : (
                        "Connect Store"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Store Connection</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-secondary rounded-full"></div>
            <span className="text-sm text-secondary font-medium">Connected</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">{(store as any)?.shopName}</h3>
          <p className="text-sm text-gray-600">{(store as any)?.shopifyDomain}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{(store as any)?.productCount || 0}</div>
            <div className="text-sm text-gray-600">Products</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{(store as any)?.collectionCount || 0}</div>
            <div className="text-sm text-gray-600">Collections</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-2xl font-bold text-gray-900">{(store as any)?.orderCount || 0}</div>
            <div className="text-sm text-gray-600">Orders</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
