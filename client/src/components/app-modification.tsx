import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Send, History, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface AppModificationProps {
  appId: number;
  appName: string;
  currentStatus: string;
  onModificationComplete?: (updatedApp: any) => void;
}

export default function AppModification({ 
  appId, 
  appName, 
  currentStatus, 
  onModificationComplete 
}: AppModificationProps) {
  const [modificationPrompt, setModificationPrompt] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const modifyAppMutation = useMutation({
    mutationFn: async (prompt: string) => {
      return await apiRequest(`/api/apps/${appId}/modify`, "POST", {
        modificationPrompt: prompt,
      });
    },
    onSuccess: (updatedApp) => {
      toast({
        title: "App Modified Successfully",
        description: "Your mobile app has been updated with the requested changes.",
      });
      setModificationPrompt("");
      queryClient.invalidateQueries({ queryKey: ["/api/apps"] });
      queryClient.invalidateQueries({ queryKey: ["/api/apps", appId] });
      onModificationComplete?.(updatedApp);
    },
    onError: (error: any) => {
      toast({
        title: "Modification Failed",
        description: error.message || "Failed to modify the app. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modificationPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a modification request.",
        variant: "destructive",
      });
      return;
    }

    modifyAppMutation.mutate(modificationPrompt.trim());
  };

  const isProcessing = currentStatus === "processing" || modifyAppMutation.isPending;

  const suggestionPrompts = [
    "Change the primary color to blue",
    "Add more product categories",
    "Enable dark mode theme",
    "Show 3 columns instead of 2",
    "Add social sharing features",
    "Remove the hero section",
    "Change layout to list view",
    "Add user reviews and ratings"
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Modify "{appName}"
              </CardTitle>
              <CardDescription>
                Describe what changes you'd like to make to your mobile app
              </CardDescription>
            </div>
            <Badge variant={currentStatus === "ready" ? "default" : "secondary"}>
              {currentStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Textarea
                value={modificationPrompt}
                onChange={(e) => setModificationPrompt(e.target.value)}
                placeholder="Describe the changes you want to make... (e.g., 'Change the primary color to green', 'Add more product categories', 'Enable dark mode')"
                className="min-h-[100px] resize-none"
                disabled={isProcessing}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowHistory(!showHistory)}
                className="flex items-center gap-2"
              >
                <History className="h-4 w-4" />
                {showHistory ? "Hide" : "View"} History
              </Button>
              
              <Button
                type="submit"
                disabled={isProcessing || !modificationPrompt.trim()}
                className="flex items-center gap-2"
              >
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {isProcessing ? "Modifying..." : "Apply Changes"}
              </Button>
            </div>
          </form>

          {/* Quick suggestions */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Quick suggestions:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestionPrompts.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setModificationPrompt(suggestion)}
                  disabled={isProcessing}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Processing status */}
      {isProcessing && (
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              <div>
                <p className="font-medium text-blue-700 dark:text-blue-300">
                  Modifying your app...
                </p>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  AI is applying your requested changes. This may take a moment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modification history placeholder */}
      {showHistory && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Modification History</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Modification history will be displayed here once implemented.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}