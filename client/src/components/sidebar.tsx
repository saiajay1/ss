import { useQuery } from "@tanstack/react-query";
import { Home, Smartphone, Layers, BarChart3, Settings } from "lucide-react";
import { SiShopify } from "react-icons/si";

export default function Sidebar() {
  const { data: store } = useQuery({
    queryKey: ["/api/shopify/store"],
    retry: false,
  });

  const { data: apps } = useQuery({
    queryKey: ["/api/apps"],
    retry: false,
  });

  const appCount = apps?.length || 0;

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 hidden lg:block">
      <div className="p-6">
        <div className="space-y-6">
          {/* Shopify Connection Status */}
          {store ? (
            <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                  <SiShopify className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{store.shopName}</p>
                  <p className="text-xs text-secondary">Connected</p>
                </div>
              </div>
              <button className="mt-3 text-xs text-secondary hover:text-secondary/80 font-medium">
                Manage Connection
              </button>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                  <SiShopify className="text-white text-sm" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">No Store Connected</p>
                  <p className="text-xs text-gray-500">Connect your Shopify store</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="space-y-2">
            <a href="#" className="flex items-center space-x-3 text-primary bg-primary/5 rounded-lg px-3 py-2">
              <Home className="h-4 w-4" />
              <span className="text-sm font-medium">Dashboard</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-3 py-2">
              <Smartphone className="h-4 w-4" />
              <span className="text-sm font-medium">My Apps</span>
              {appCount > 0 && (
                <span className="ml-auto bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {appCount}
                </span>
              )}
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-3 py-2">
              <Layers className="h-4 w-4" />
              <span className="text-sm font-medium">Templates</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-3 py-2">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm font-medium">Analytics</span>
            </a>
            <a href="#" className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg px-3 py-2">
              <Settings className="h-4 w-4" />
              <span className="text-sm font-medium">Settings</span>
            </a>
          </nav>
        </div>
      </div>
    </aside>
  );
}
