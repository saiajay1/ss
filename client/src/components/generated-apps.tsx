import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Download, Edit3, Smartphone } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import MobilePreview from "./mobile-preview";
import AppModification from "./app-modification";

export default function GeneratedApps() {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const { data: apps, isLoading } = useQuery({
    queryKey: ["/api/apps"],
    retry: false,
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Generated Apps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="flex space-x-2">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-secondary/10 text-secondary";
      case "processing":
        return "bg-accent/10 text-accent";
      case "failed":
        return "bg-destructive/10 text-destructive";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ready":
        return "Ready";
      case "processing":
        return "Processing";
      case "failed":
        return "Failed";
      default:
        return "Unknown";
    }
  };

  const appsArray = Array.isArray(apps) ? apps : [];

  if (selectedApp) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setSelectedApp(null)}
            className="flex items-center gap-2"
          >
            ← Back to Apps
          </Button>
          <h2 className="text-2xl font-bold">{selectedApp.name}</h2>
          <Badge className={getStatusColor(selectedApp.status)}>
            {getStatusText(selectedApp.status)}
          </Badge>
        </div>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="modify" className="flex items-center gap-2">
              <Edit3 className="h-4 w-4" />
              Modify
            </TabsTrigger>
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="mt-6">
            <MobilePreview generatedAppConfig={selectedApp.appConfig} />
          </TabsContent>

          <TabsContent value="modify" className="mt-6">
            <AppModification
              appId={selectedApp.id}
              appName={selectedApp.name}
              currentStatus={selectedApp.status}
              onModificationComplete={(updatedApp) => {
                setSelectedApp(updatedApp);
              }}
            />
          </TabsContent>

          <TabsContent value="export" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Export Your App</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Export functionality will be available soon. Download your mobile app as React Native source code.
                </p>
                <Button disabled>
                  <Download className="h-4 w-4 mr-2" />
                  Download Source Code
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Generated Apps</CardTitle>
      </CardHeader>
      <CardContent>
        {appsArray.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">No apps generated yet. Create your first app above!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appsArray.map((app: any) => (
              <div key={app.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{app.name}</h3>
                  <Badge className={getStatusColor(app.status)}>
                    {getStatusText(app.status)}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {app.description || "AI-generated mobile app from your prompt"}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(app.createdAt), { addSuffix: true })}
                  </span>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      disabled={app.status !== "ready"}
                      className="text-primary hover:text-primary/80"
                      onClick={() => setSelectedApp(app)}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Preview
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      disabled={app.status !== "ready"}
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => setSelectedApp(app)}
                    >
                      <Edit3 className="h-3 w-3 mr-1" />
                      Modify
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
