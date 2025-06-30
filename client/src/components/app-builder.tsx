import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { WandSparkles } from "lucide-react";

export default function AppBuilder() {
  const [prompt, setPrompt] = useState("");
  const [appName, setAppName] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateAppMutation = useMutation({
    mutationFn: async (data: { name: string; prompt: string; primaryColor: string }) => {
      const response = await apiRequest("POST", "/api/apps/generate", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "App Generation Started",
        description: "Your mobile app is being generated. This will take a few moments.",
      });
      // Clear form
      setPrompt("");
      setAppName("");
      setPrimaryColor("#4F46E5");
      // Refresh apps list
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
    },
    onError: (error) => {
      toast({
        title: "Generation Failed",
        description: "Failed to generate your app. Please try again.",
        variant: "destructive",
      });
      console.error("Error generating app:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast({
        title: "Missing Description",
        description: "Please describe what kind of app you want to create.",
        variant: "destructive",
      });
      return;
    }

    if (!appName.trim()) {
      toast({
        title: "Missing App Name",
        description: "Please provide a name for your app.",
        variant: "destructive",
      });
      return;
    }

    generateAppMutation.mutate({
      name: appName,
      prompt: prompt,
      primaryColor: primaryColor,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Describe Your App</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">
              What kind of mobile app do you want to create?
            </Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              placeholder="I want a mobile app for my clothing store with a clean, modern design. It should showcase my products beautifully, have easy navigation between categories, and a smooth checkout process. Include a wishlist feature and customer reviews."
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="appName" className="block text-sm font-medium text-gray-700 mb-2">
                App Name
              </Label>
              <Input
                id="appName"
                type="text"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                placeholder="My Store App"
              />
            </div>
            <div>
              <Label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </Label>
              <div className="flex space-x-2">
                <input
                  id="primaryColor"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                />
                <Input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <WandSparkles className="h-4 w-4" />
              <span>AI will generate your app based on your description</span>
            </div>
            <Button 
              type="submit" 
              disabled={generateAppMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {generateAppMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Generating...
                </>
              ) : (
                <>
                  <WandSparkles className="h-4 w-4 mr-2" />
                  Generate App
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
