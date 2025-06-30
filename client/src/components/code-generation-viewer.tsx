import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Code, Eye, Loader2, Zap, CheckCircle, Clock, Cpu, Terminal, FileCode, Smartphone } from "lucide-react";

interface CodeGenerationViewerProps {
  isGenerating: boolean;
  onComplete?: (appConfig: any) => void;
}

export default function CodeGenerationViewer({ isGenerating, onComplete }: CodeGenerationViewerProps) {
  const [displayedCode, setDisplayedCode] = useState<string>("");
  const [currentStep, setCurrentStep] = useState<string>("Ready to generate...");
  const [generationPhase, setGenerationPhase] = useState<"analyzing" | "designing" | "coding" | "optimizing" | "complete">("analyzing");
  const [completedFiles, setCompletedFiles] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [currentLine, setCurrentLine] = useState<number>(1);
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const [activeFile, setActiveFile] = useState<string>("App.tsx");
  const scrollRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // React Native code template for live typing
  const codeTemplate = `import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// App Theme Configuration
const AppTheme = {
  primary: '#6366F1',
  secondary: '#8B5CF6',
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  success: '#10B981',
  radius: 12,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  }
};

// Navigation Header Component
const NavigationHeader = ({ title, onSearchPress, onCartPress }) => {
  return (
    <LinearGradient
      colors={[AppTheme.primary, AppTheme.secondary]}
      style={styles.navigationHeader}
    >
      <SafeAreaView>
        <View style={styles.headerContent}>
          <Text style={styles.navigationTitle}>{title}</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={onSearchPress}
            >
              <Ionicons name="search" size={20} color="white" />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton} 
              onPress={onCartPress}
            >
              <Ionicons name="bag" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
};

// Product Card Component
const ProductCard = ({ product, onPress }) => {
  return (
    <TouchableOpacity style={styles.productCard} onPress={() => onPress(product)}>
      <View style={styles.productImageContainer}>
        <LinearGradient
          colors={['#F1F5F9', '#E2E8F0']}
          style={styles.productImagePlaceholder}
        >
          <Ionicons name="cube" size={32} color={AppTheme.textSecondary} />
        </LinearGradient>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>
          {product.name}
        </Text>
        <View style={styles.productRating}>
          <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>
          <Text style={styles.ratingText}>(4.8)</Text>
        </View>
        <Text style={styles.productPrice}>{product.price}</Text>
        <TouchableOpacity style={styles.addToCartButton}>
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// Hero Section Component
const HeroSection = ({ title, subtitle, onShopNowPress }) => {
  return (
    <LinearGradient
      colors={['rgba(99, 102, 241, 0.1)', 'rgba(139, 92, 246, 0.1)']}
      style={styles.heroSection}
    >
      <View style={styles.heroContent}>
        <Text style={styles.heroTitle}>{title}</Text>
        <Text style={styles.heroSubtitle}>{subtitle}</Text>
        <TouchableOpacity style={styles.heroButton} onPress={onShopNowPress}>
          <LinearGradient
            colors={[AppTheme.primary, AppTheme.secondary]}
            style={styles.heroButtonGradient}
          >
            <Text style={styles.heroButtonText}>Shop Now</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
};

// Main App Component
const MobileApp = () => {
  const sampleProducts = [
    { 
      id: '1',
      name: 'Premium Wireless Headphones', 
      price: '$299.99'
    },
    { 
      id: '2',
      name: 'Smart Fitness Tracker', 
      price: '$199.99'
    },
    { 
      id: '3',
      name: 'Portable Bluetooth Speaker', 
      price: '$89.99'
    },
    { 
      id: '4',
      name: 'Wireless Charging Pad', 
      price: '$49.99'
    },
  ];

  return (
    <View style={styles.container}>
      <NavigationHeader 
        title="Your Store"
        onSearchPress={() => console.log('Search pressed')}
        onCartPress={() => console.log('Cart pressed')}
      />
      
      <ScrollView 
        style={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <HeroSection 
          title="Welcome to Your Store"
          subtitle="Discover amazing products at unbeatable prices"
          onShopNowPress={() => console.log('Shop now pressed')}
        />

        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Featured Products</Text>
          <View style={styles.productsGrid}>
            {sampleProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product}
                onPress={() => console.log('Product pressed:', product.name)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Comprehensive Styling
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppTheme.background,
  },
  navigationHeader: {
    paddingTop: 0,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.md,
    paddingVertical: AppTheme.spacing.md,
  },
  navigationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: 'white',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: AppTheme.spacing.sm,
  },
  headerButton: {
    padding: AppTheme.spacing.sm,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scrollContent: {
    flex: 1,
  },
  heroSection: {
    margin: AppTheme.spacing.md,
    borderRadius: AppTheme.radius,
    overflow: 'hidden',
  },
  heroContent: {
    padding: AppTheme.spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: AppTheme.text,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  heroSubtitle: {
    fontSize: 16,
    color: AppTheme.textSecondary,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.lg,
  },
  heroButton: {
    borderRadius: AppTheme.radius,
    overflow: 'hidden',
  },
  heroButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    paddingVertical: AppTheme.spacing.md,
    gap: AppTheme.spacing.sm,
  },
  heroButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  productsSection: {
    marginBottom: AppTheme.spacing.lg,
    paddingHorizontal: AppTheme.spacing.md,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: AppTheme.text,
    marginBottom: AppTheme.spacing.md,
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    backgroundColor: AppTheme.surface,
    borderRadius: AppTheme.radius,
    marginBottom: AppTheme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImageContainer: {
    position: 'relative',
  },
  productImagePlaceholder: {
    height: 120,
    borderTopLeftRadius: AppTheme.radius,
    borderTopRightRadius: AppTheme.radius,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productInfo: {
    padding: AppTheme.spacing.md,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: AppTheme.text,
    marginBottom: AppTheme.spacing.xs,
    lineHeight: 18,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.sm,
  },
  ratingStars: {
    fontSize: 12,
    marginRight: AppTheme.spacing.xs,
  },
  ratingText: {
    fontSize: 12,
    color: AppTheme.textSecondary,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: AppTheme.primary,
    marginBottom: AppTheme.spacing.sm,
  },
  addToCartButton: {
    backgroundColor: AppTheme.primary,
    borderRadius: AppTheme.radius / 2,
    paddingVertical: AppTheme.spacing.sm,
    alignItems: 'center',
  },
  addToCartText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default MobileApp;`;

  // Cursor blinking effect
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [displayedCode]);

  // Live typing simulation
  useEffect(() => {
    if (!isGenerating) {
      setDisplayedCode("");
      setCompletedFiles([]);
      setGenerationPhase("analyzing");
      setProgress(0);
      setCurrentLine(1);
      setCurrentStep("Ready to generate...");
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    let charIndex = 0;
    const totalChars = codeTemplate.length;

    const typeNextCharacter = () => {
      if (charIndex >= totalChars) {
        // Generation complete
        setGenerationPhase("complete");
        setCurrentStep("Generation complete!");
        setProgress(100);
        setCompletedFiles(["App.tsx", "styles.js", "components/"]);
        
        onComplete?.({
          appName: "Your Generated App",
          primaryColor: "#6366F1",
          layout: {
            heroSection: { 
              title: "Welcome to Your Store", 
              subtitle: "Discover amazing products at unbeatable prices",
              showHero: true,
              backgroundType: "gradient"
            },
            productDisplay: { 
              gridColumns: 2,
              showRatings: true, 
              showWishlist: true,
              showPrices: true
            },
            categories: { 
              showCategories: true,
              displayStyle: "grid"
            }
          },
          previewData: {
            featuredProducts: [
              { name: "Premium Wireless Headphones", price: "$299.99" },
              { name: "Smart Fitness Tracker", price: "$199.99" },
              { name: "Portable Bluetooth Speaker", price: "$89.99" },
              { name: "Wireless Charging Pad", price: "$49.99" }
            ],
            categories: [
              { name: "Electronics", count: 156 },
              { name: "Fashion", count: 234 },
              { name: "Home & Garden", count: 89 },
              { name: "Sports", count: 67 }
            ]
          }
        });
        return;
      }

      // Update current phase based on progress
      const progressPercent = (charIndex / totalChars) * 100;
      if (progressPercent < 20) {
        setGenerationPhase("analyzing");
        setCurrentStep("Analyzing your Shopify store data...");
      } else if (progressPercent < 35) {
        setGenerationPhase("designing");
        setCurrentStep("Designing UI components and layout...");
      } else if (progressPercent < 85) {
        setGenerationPhase("coding");
        setCurrentStep("Writing React Native components...");
      } else {
        setGenerationPhase("optimizing");
        setCurrentStep("Optimizing performance and styles...");
      }

      // Add next character
      const nextChar = codeTemplate[charIndex];
      setDisplayedCode(prev => prev + nextChar);
      
      // Update line counter
      if (nextChar === '\n') {
        setCurrentLine(prev => prev + 1);
      }

      // Update progress
      setProgress((charIndex / totalChars) * 100);
      
      charIndex++;

      // Variable typing speed for realism
      const delay = nextChar === '\n' ? 100 : 
                   nextChar === ' ' ? 80 : 
                   Math.random() * 60 + 20;

      timeoutRef.current = setTimeout(typeNextCharacter, delay);
    };

    // Start typing after initial delay
    timeoutRef.current = setTimeout(typeNextCharacter, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isGenerating, onComplete, codeTemplate]);

  const getPhaseIcon = () => {
    switch (generationPhase) {
      case "analyzing": return <Cpu className="h-4 w-4" />;
      case "designing": return <Eye className="h-4 w-4" />;
      case "coding": return <Code className="h-4 w-4" />;
      case "optimizing": return <Zap className="h-4 w-4" />;
      case "complete": return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getPhaseColor = () => {
    switch (generationPhase) {
      case "analyzing": return "bg-blue-500";
      case "designing": return "bg-purple-500";
      case "coding": return "bg-green-500";
      case "optimizing": return "bg-orange-500";
      case "complete": return "bg-emerald-500";
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Live Code Generation
        </CardTitle>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className={`${getPhaseColor()} text-white`}>
            {getPhaseIcon()}
            <span className="ml-1 capitalize">{generationPhase}</span>
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            Line {currentLine}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">{currentStep}</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* File Tabs */}
        <Tabs value={activeFile} onValueChange={setActiveFile} className="flex-1 flex flex-col">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="App.tsx" className="flex items-center gap-1">
              <FileCode className="h-3 w-3" />
              App.tsx
            </TabsTrigger>
            <TabsTrigger value="styles.js" className="flex items-center gap-1">
              <Code className="h-3 w-3" />
              Styles
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Smartphone className="h-3 w-3" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="App.tsx" className="flex-1 mt-4">
            <ScrollArea className="h-[400px] w-full border rounded-lg" ref={scrollRef}>
              <div className="p-4 font-mono text-sm bg-gray-950 text-gray-100">
                <pre className="whitespace-pre-wrap">
                  {displayedCode}
                  {showCursor && isGenerating && (
                    <span className="bg-blue-400 text-blue-400 animate-pulse">|</span>
                  )}
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="styles.js" className="flex-1 mt-4">
            <ScrollArea className="h-[400px] w-full border rounded-lg">
              <div className="p-4 font-mono text-sm bg-gray-950 text-gray-100">
                <pre className="whitespace-pre-wrap text-gray-400">
                  {isGenerating ? "// Styles will be generated..." : "// StyleSheet definitions included in main file"}
                </pre>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="preview" className="flex-1 mt-4">
            <div className="h-[400px] w-full border rounded-lg bg-gray-50 flex items-center justify-center">
              {isGenerating ? (
                <div className="text-center space-y-2">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">Building preview...</p>
                </div>
              ) : (
                <div className="text-center space-y-2">
                  <Smartphone className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Preview will appear here</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Completed Files */}
        {completedFiles.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Generated Files:</h4>
            <div className="flex flex-wrap gap-2">
              {completedFiles.map((file, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1 text-green-500" />
                  {file}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}