import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Code, Eye, Loader2 } from "lucide-react";

interface CodeGenerationViewerProps {
  isGenerating: boolean;
  onComplete?: (appConfig: any) => void;
}

export default function CodeGenerationViewer({ isGenerating, onComplete }: CodeGenerationViewerProps) {
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>("");
  const [generationPhase, setGenerationPhase] = useState<"analyzing" | "designing" | "coding" | "complete">("analyzing");
  const [completedComponents, setCompletedComponents] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate real-time code generation
  useEffect(() => {
    if (!isGenerating) {
      setCodeLines([]);
      setCompletedComponents([]);
      setGenerationPhase("analyzing");
      return;
    }

    let lineIndex = 0;
    const mockCodeGeneration = [
      "// Analyzing your app requirements...",
      "import React from 'react';",
      "import { StyleSheet, View, Text, ScrollView } from 'react-native';",
      "",
      "// Designing app structure...",
      "const AppTheme = {",
      "  primaryColor: '#4F46E5',",
      "  backgroundColor: '#FFFFFF',",
      "  textColor: '#1F2937',",
      "};",
      "",
      "// Creating navigation components...",
      "const NavigationBar = () => {",
      "  return (",
      "    <View style={styles.navbar}>",
      "      <Text style={styles.navTitle}>Your Store</Text>",
      "    </View>",
      "  );",
      "};",
      "",
      "// Building product display...",
      "const ProductCard = ({ product }) => {",
      "  return (",
      "    <View style={styles.productCard}>",
      "      <View style={styles.productImage} />",
      "      <Text style={styles.productName}>{product.name}</Text>",
      "      <Text style={styles.productPrice}>{product.price}</Text>",
      "    </View>",
      "  );",
      "};",
      "",
      "// Implementing main app component...",
      "const MobileApp = () => {",
      "  const featuredProducts = [",
      "    { name: 'Premium Widget', price: '$29.99' },",
      "    { name: 'Deluxe Gadget', price: '$39.99' },",
      "  ];",
      "",
      "  return (",
      "    <ScrollView style={styles.container}>",
      "      <NavigationBar />",
      "      <View style={styles.heroSection}>",
      "        <Text style={styles.heroTitle}>Welcome to Your Store</Text>",
      "        <Text style={styles.heroSubtitle}>Discover amazing products</Text>",
      "      </View>",
      "      <View style={styles.productsGrid}>",
      "        {featuredProducts.map((product, index) => (",
      "          <ProductCard key={index} product={product} />",
      "        ))}",
      "      </View>",
      "    </ScrollView>",
      "  );",
      "};",
      "",
      "// Styling components...",
      "const styles = StyleSheet.create({",
      "  container: {",
      "    flex: 1,",
      "    backgroundColor: AppTheme.backgroundColor,",
      "  },",
      "  navbar: {",
      "    padding: 16,",
      "    backgroundColor: AppTheme.primaryColor,",
      "  },",
      "  navTitle: {",
      "    color: 'white',",
      "    fontSize: 18,",
      "    fontWeight: 'bold',",
      "  },",
      "  heroSection: {",
      "    padding: 20,",
      "    alignItems: 'center',",
      "  },",
      "  heroTitle: {",
      "    fontSize: 24,",
      "    fontWeight: 'bold',",
      "    color: AppTheme.textColor,",
      "  },",
      "  heroSubtitle: {",
      "    fontSize: 16,",
      "    color: '#6B7280',",
      "    marginTop: 8,",
      "  },",
      "  productsGrid: {",
      "    flexDirection: 'row',",
      "    flexWrap: 'wrap',",
      "    padding: 16,",
      "  },",
      "  productCard: {",
      "    width: '48%',",
      "    margin: '1%',",
      "    backgroundColor: '#F9FAFB',",
      "    borderRadius: 8,",
      "    padding: 12,",
      "  },",
      "  productImage: {",
      "    height: 80,",
      "    backgroundColor: '#E5E7EB',",
      "    borderRadius: 4,",
      "    marginBottom: 8,",
      "  },",
      "  productName: {",
      "    fontSize: 14,",
      "    fontWeight: '600',",
      "    color: AppTheme.textColor,",
      "  },",
      "  productPrice: {",
      "    fontSize: 14,",
      "    fontWeight: 'bold',",
      "    color: AppTheme.primaryColor,",
      "    marginTop: 4,",
      "  },",
      "});",
      "",
      "export default MobileApp;",
      "",
      "// App generation complete! 🎉"
    ];

    const phases = [
      { phase: "analyzing", duration: 2000, steps: ["Analyzing requirements", "Processing store data"] },
      { phase: "designing", duration: 3000, steps: ["Creating app structure", "Designing UI components"] },
      { phase: "coding", duration: 8000, steps: ["Writing component code", "Implementing navigation", "Adding styling"] },
      { phase: "complete", duration: 1000, steps: ["Finalizing app", "Ready for preview"] }
    ];

    let phaseIndex = 0;
    let stepIndex = 0;

    const runPhase = () => {
      if (phaseIndex >= phases.length) {
        setGenerationPhase("complete");
        onComplete?.({
          appName: "Your Generated App",
          primaryColor: "#4F46E5",
          layout: {
            heroSection: { title: "Welcome to Your Store", subtitle: "Discover amazing products" },
            productDisplay: { showRatings: true, showWishlist: true },
            categories: { showCategories: true }
          },
          previewData: {
            featuredProducts: [
              { name: "Premium Widget", price: "$29.99" },
              { name: "Deluxe Gadget", price: "$39.99" },
              { name: "Smart Device", price: "$49.99" },
              { name: "Pro Accessory", price: "$19.99" }
            ],
            categories: [
              { name: "Electronics", count: 15 },
              { name: "Accessories", count: 23 },
              { name: "Gadgets", count: 12 },
              { name: "Premium", count: 8 }
            ]
          }
        });
        return;
      }

      const currentPhaseData = phases[phaseIndex];
      setGenerationPhase(currentPhaseData.phase as any);

      // Update steps for current phase
      const stepInterval = setInterval(() => {
        if (stepIndex < currentPhaseData.steps.length) {
          setCurrentStep(currentPhaseData.steps[stepIndex]);
          stepIndex++;
        } else {
          clearInterval(stepInterval);
        }
      }, currentPhaseData.duration / currentPhaseData.steps.length);

      // Add code lines during coding phase
      if (currentPhaseData.phase === "coding") {
        const codeInterval = setInterval(() => {
          if (lineIndex < mockCodeGeneration.length) {
            setCodeLines(prev => [...prev, mockCodeGeneration[lineIndex]]);
            
            // Update completed components
            if (mockCodeGeneration[lineIndex].includes("NavigationBar")) {
              setCompletedComponents(prev => [...prev, "Navigation"]);
            } else if (mockCodeGeneration[lineIndex].includes("ProductCard")) {
              setCompletedComponents(prev => [...prev, "Product Display"]);
            } else if (mockCodeGeneration[lineIndex].includes("MobileApp")) {
              setCompletedComponents(prev => [...prev, "Main App"]);
            } else if (mockCodeGeneration[lineIndex].includes("StyleSheet")) {
              setCompletedComponents(prev => [...prev, "Styling"]);
            }
            
            lineIndex++;
            
            // Auto-scroll to bottom
            setTimeout(() => {
              if (scrollRef.current) {
                scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
              }
            }, 50);
          } else {
            clearInterval(codeInterval);
          }
        }, currentPhaseData.duration / mockCodeGeneration.length);
      }

      // Move to next phase
      setTimeout(() => {
        phaseIndex++;
        stepIndex = 0;
        runPhase();
      }, currentPhaseData.duration);
    };

    runPhase();
  }, [isGenerating, onComplete]);

  if (!isGenerating && codeLines.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Code Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500">
            <Code className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Generate an app to see AI write code in real-time</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Code className="h-5 w-5 mr-2" />
            Code Generation
          </CardTitle>
          <div className="flex items-center space-x-2">
            {isGenerating && <Loader2 className="h-4 w-4 animate-spin" />}
            <Badge variant={generationPhase === "complete" ? "default" : "secondary"}>
              {generationPhase === "analyzing" && "Analyzing"}
              {generationPhase === "designing" && "Designing"}
              {generationPhase === "coding" && "Coding"}
              {generationPhase === "complete" && "Complete"}
            </Badge>
          </div>
        </div>
        {currentStep && (
          <p className="text-sm text-gray-600">{currentStep}</p>
        )}
      </CardHeader>
      <CardContent className="h-[500px]">
        <Tabs defaultValue="code" className="h-full">
          <TabsList className="mb-4">
            <TabsTrigger value="code">Generated Code</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="h-[420px]">
            <ScrollArea className="h-full" ref={scrollRef}>
              <pre className="text-sm font-mono bg-gray-50 p-4 rounded-lg">
                {codeLines.map((line, index) => (
                  <div 
                    key={index}
                    className={`leading-6 ${
                      line.startsWith("//") ? "text-gray-500 italic" : 
                      line.includes("import") || line.includes("export") ? "text-blue-600" :
                      line.includes("const") || line.includes("function") ? "text-purple-600" :
                      "text-gray-800"
                    }`}
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
                {isGenerating && generationPhase === "coding" && (
                  <div className="inline-block w-2 h-5 bg-blue-500 animate-pulse ml-1"></div>
                )}
              </pre>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="components" className="h-[420px]">
            <div className="space-y-3">
              {["Navigation", "Product Display", "Main App", "Styling"].map((component) => (
                <div 
                  key={component}
                  className={`flex items-center p-3 rounded-lg border ${
                    completedComponents.includes(component) 
                      ? "bg-green-50 border-green-200" 
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className={`w-3 h-3 rounded-full mr-3 ${
                    completedComponents.includes(component) 
                      ? "bg-green-500" 
                      : "bg-gray-300"
                  }`} />
                  <span className={
                    completedComponents.includes(component) 
                      ? "text-green-800 font-medium" 
                      : "text-gray-600"
                  }>
                    {component}
                  </span>
                  {completedComponents.includes(component) && (
                    <Badge variant="secondary" className="ml-auto text-xs">
                      Complete
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}