import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Code, Eye, Loader2, Zap, CheckCircle, Clock, Cpu, Terminal } from "lucide-react";

interface CodeGenerationViewerProps {
  isGenerating: boolean;
  onComplete?: (appConfig: any) => void;
}

export default function CodeGenerationViewer({ isGenerating, onComplete }: CodeGenerationViewerProps) {
  const [codeLines, setCodeLines] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<string>("Initializing...");
  const [generationPhase, setGenerationPhase] = useState<"analyzing" | "designing" | "coding" | "optimizing" | "complete">("analyzing");
  const [completedComponents, setCompletedComponents] = useState<string[]>([]);
  const [progress, setProgress] = useState<number>(0);
  const [linesPerSecond, setLinesPerSecond] = useState<number>(8);
  const [currentTypingLine, setCurrentTypingLine] = useState<string>("");
  const [showCursor, setShowCursor] = useState<boolean>(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Simulate realistic code generation with typing effect
  useEffect(() => {
    if (!isGenerating) {
      setCodeLines([]);
      setCompletedComponents([]);
      setGenerationPhase("analyzing");
      setProgress(0);
      setCurrentTypingLine("");
      setCurrentStep("Ready");
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    const startTime = Date.now();
    
    const codeTemplate = [
      "// 🚀 Generating your mobile app...",
      "",
      "import React from 'react';",
      "import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';",
      "import { LinearGradient } from 'expo-linear-gradient';",
      "",
      "// 🎨 App Theme Configuration",
      "const AppTheme = {",
      "  primary: '#6366F1',",
      "  secondary: '#8B5CF6',",
      "  background: '#FFFFFF',",
      "  surface: '#F8FAFC',",
      "  text: '#1E293B',",
      "  textSecondary: '#64748B',",
      "  success: '#10B981',",
      "  radius: 12,",
      "};",
      "",
      "// 📱 Navigation Header Component",
      "const NavigationHeader = ({ title, showSearch = true }) => {",
      "  return (",
      "    <LinearGradient",
      "      colors={[AppTheme.primary, AppTheme.secondary]}",
      "      style={styles.navigationHeader}",
      "    >",
      "      <Text style={styles.navigationTitle}>{title}</Text>",
      "      {showSearch && (",
      "        <TouchableOpacity style={styles.searchButton}>",
      "          <Text style={styles.searchIcon}>🔍</Text>",
      "        </TouchableOpacity>",
      "      )}",
      "    </LinearGradient>",
      "  );",
      "};",
      "",
      "// 🏪 Product Card Component",
      "const ProductCard = ({ product, onPress }) => {",
      "  return (",
      "    <TouchableOpacity style={styles.productCard} onPress={onPress}>",
      "      <View style={styles.productImageContainer}>",
      "        <View style={styles.productImagePlaceholder}>",
      "          <Text style={styles.productImageIcon}>📦</Text>",
      "        </View>",
      "        <TouchableOpacity style={styles.wishlistButton}>",
      "          <Text style={styles.wishlistIcon}>🤍</Text>",
      "        </TouchableOpacity>",
      "      </View>",
      "      <View style={styles.productInfo}>",
      "        <Text style={styles.productName} numberOfLines={2}>",
      "          {product.name}",
      "        </Text>",
      "        <View style={styles.productRating}>",
      "          <Text style={styles.ratingStars}>⭐⭐⭐⭐⭐</Text>",
      "          <Text style={styles.ratingText}>(4.8)</Text>",
      "        </View>",
      "        <Text style={styles.productPrice}>{product.price}</Text>",
      "      </View>",
      "    </TouchableOpacity>",
      "  );",
      "};",
      "",
      "// 🎯 Hero Section Component",
      "const HeroSection = ({ title, subtitle }) => {",
      "  return (",
      "    <LinearGradient",
      "      colors={['#F8FAFC', '#E2E8F0']}",
      "      style={styles.heroSection}",
      "    >",
      "      <Text style={styles.heroTitle}>{title}</Text>",
      "      <Text style={styles.heroSubtitle}>{subtitle}</Text>",
      "      <TouchableOpacity style={styles.heroButton}>",
      "        <Text style={styles.heroButtonText}>Shop Now</Text>",
      "      </TouchableOpacity>",
      "    </LinearGradient>",
      "  );",
      "};",
      "",
      "// 📂 Category Grid Component",
      "const CategoryGrid = ({ categories }) => {",
      "  return (",
      "    <View style={styles.categorySection}>",
      "      <Text style={styles.sectionTitle}>Categories</Text>",
      "      <View style={styles.categoryGrid}>",
      "        {categories.map((category, index) => (",
      "          <TouchableOpacity key={index} style={styles.categoryCard}>",
      "            <Text style={styles.categoryIcon}>🏷️</Text>",
      "            <Text style={styles.categoryName}>{category.name}</Text>",
      "            <Text style={styles.categoryCount}>{category.count} items</Text>",
      "          </TouchableOpacity>",
      "        ))}",
      "      </View>",
      "    </View>",
      "  );",
      "};",
      "",
      "// 🏠 Main App Component",
      "const MobileApp = () => {",
      "  const sampleProducts = [",
      "    { name: 'Premium Wireless Headphones', price: '$299.99', rating: 4.8 },",
      "    { name: 'Smart Fitness Tracker', price: '$199.99', rating: 4.6 },",
      "    { name: 'Portable Bluetooth Speaker', price: '$89.99', rating: 4.9 },",
      "    { name: 'Wireless Charging Pad', price: '$49.99', rating: 4.7 },",
      "  ];",
      "",
      "  const categories = [",
      "    { name: 'Electronics', count: 156, icon: '📱' },",
      "    { name: 'Fashion', count: 234, icon: '👕' },",
      "    { name: 'Home & Garden', count: 89, icon: '🏡' },",
      "    { name: 'Sports', count: 67, icon: '⚽' },",
      "  ];",
      "",
      "  return (",
      "    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>",
      "      <NavigationHeader title='Your Store' />",
      "      ",
      "      <HeroSection ",
      "        title='Welcome to Your Store'",
      "        subtitle='Discover amazing products at great prices'",
      "      />",
      "",
      "      <CategoryGrid categories={categories} />",
      "",
      "      <View style={styles.productsSection}>",
      "        <Text style={styles.sectionTitle}>Featured Products</Text>",
      "        <View style={styles.productsGrid}>",
      "          {sampleProducts.map((product, index) => (",
      "            <ProductCard ",
      "              key={index} ",
      "              product={product}",
      "              onPress={() => console.log('Product pressed:', product.name)}",
      "            />",
      "          ))}",
      "        </View>",
      "      </View>",
      "",
      "      <View style={styles.bottomSpacing} />",
      "    </ScrollView>",
      "  );",
      "};",
      "",
      "// 🎨 Comprehensive Styling",
      "const styles = StyleSheet.create({",
      "  container: {",
      "    flex: 1,",
      "    backgroundColor: AppTheme.background,",
      "  },",
      "  ",
      "  // Navigation Styles",
      "  navigationHeader: {",
      "    flexDirection: 'row',",
      "    justifyContent: 'space-between',",
      "    alignItems: 'center',",
      "    paddingHorizontal: 20,",
      "    paddingVertical: 16,",
      "    paddingTop: 50,",
      "  },",
      "  navigationTitle: {",
      "    fontSize: 24,",
      "    fontWeight: '700',",
      "    color: 'white',",
      "  },",
      "  searchButton: {",
      "    padding: 8,",
      "    borderRadius: 20,",
      "    backgroundColor: 'rgba(255,255,255,0.2)',",
      "  },",
      "  searchIcon: {",
      "    fontSize: 16,",
      "  },",
      "",
      "  // Hero Section Styles",
      "  heroSection: {",
      "    padding: 24,",
      "    alignItems: 'center',",
      "    marginBottom: 20,",
      "  },",
      "  heroTitle: {",
      "    fontSize: 28,",
      "    fontWeight: '800',",
      "    color: AppTheme.text,",
      "    textAlign: 'center',",
      "    marginBottom: 8,",
      "  },",
      "  heroSubtitle: {",
      "    fontSize: 16,",
      "    color: AppTheme.textSecondary,",
      "    textAlign: 'center',",
      "    marginBottom: 20,",
      "  },",
      "  heroButton: {",
      "    backgroundColor: AppTheme.primary,",
      "    paddingHorizontal: 32,",
      "    paddingVertical: 12,",
      "    borderRadius: AppTheme.radius,",
      "  },",
      "  heroButtonText: {",
      "    color: 'white',",
      "    fontSize: 16,",
      "    fontWeight: '600',",
      "  },",
      "",
      "  // Product Styles",
      "  productsSection: {",
      "    paddingHorizontal: 16,",
      "    marginBottom: 20,",
      "  },",
      "  sectionTitle: {",
      "    fontSize: 22,",
      "    fontWeight: '700',",
      "    color: AppTheme.text,",
      "    marginBottom: 16,",
      "  },",
      "  productsGrid: {",
      "    flexDirection: 'row',",
      "    flexWrap: 'wrap',",
      "    justifyContent: 'space-between',",
      "  },",
      "  productCard: {",
      "    width: '48%',",
      "    backgroundColor: AppTheme.surface,",
      "    borderRadius: AppTheme.radius,",
      "    marginBottom: 16,",
      "    shadowColor: '#000',",
      "    shadowOffset: { width: 0, height: 2 },",
      "    shadowOpacity: 0.1,",
      "    shadowRadius: 4,",
      "    elevation: 3,",
      "  },",
      "  productImageContainer: {",
      "    position: 'relative',",
      "  },",
      "  productImagePlaceholder: {",
      "    height: 120,",
      "    backgroundColor: '#E2E8F0',",
      "    borderTopLeftRadius: AppTheme.radius,",
      "    borderTopRightRadius: AppTheme.radius,",
      "    justifyContent: 'center',",
      "    alignItems: 'center',",
      "  },",
      "  productImageIcon: {",
      "    fontSize: 32,",
      "  },",
      "  wishlistButton: {",
      "    position: 'absolute',",
      "    top: 8,",
      "    right: 8,",
      "    backgroundColor: 'white',",
      "    borderRadius: 20,",
      "    padding: 6,",
      "  },",
      "  wishlistIcon: {",
      "    fontSize: 14,",
      "  },",
      "  productInfo: {",
      "    padding: 12,",
      "  },",
      "  productName: {",
      "    fontSize: 14,",
      "    fontWeight: '600',",
      "    color: AppTheme.text,",
      "    marginBottom: 6,",
      "  },",
      "  productRating: {",
      "    flexDirection: 'row',",
      "    alignItems: 'center',",
      "    marginBottom: 6,",
      "  },",
      "  ratingStars: {",
      "    fontSize: 12,",
      "    marginRight: 4,",
      "  },",
      "  ratingText: {",
      "    fontSize: 12,",
      "    color: AppTheme.textSecondary,",
      "  },",
      "  productPrice: {",
      "    fontSize: 16,",
      "    fontWeight: '700',",
      "    color: AppTheme.primary,",
      "  },",
      "",
      "  // Category Styles",
      "  categorySection: {",
      "    paddingHorizontal: 16,",
      "    marginBottom: 20,",
      "  },",
      "  categoryGrid: {",
      "    flexDirection: 'row',",
      "    flexWrap: 'wrap',",
      "    justifyContent: 'space-between',",
      "  },",
      "  categoryCard: {",
      "    width: '48%',",
      "    backgroundColor: AppTheme.surface,",
      "    borderRadius: AppTheme.radius,",
      "    padding: 16,",
      "    alignItems: 'center',",
      "    marginBottom: 12,",
      "  },",
      "  categoryIcon: {",
      "    fontSize: 24,",
      "    marginBottom: 8,",
      "  },",
      "  categoryName: {",
      "    fontSize: 14,",
      "    fontWeight: '600',",
      "    color: AppTheme.text,",
      "    marginBottom: 4,",
      "  },",
      "  categoryCount: {",
      "    fontSize: 12,",
      "    color: AppTheme.textSecondary,",
      "  },",
      "",
      "  bottomSpacing: {",
      "    height: 40,",
      "  },",
      "});",
      "",
      "export default MobileApp;",
      "",
      "// ✅ App generation complete!"
    ];

    const generationPhases = [
      { name: "analyzing", duration: 1500, message: "Analyzing your requirements and store data..." },
      { name: "designing", duration: 2000, message: "Designing app architecture and UI components..." },
      { name: "coding", duration: 6000, message: "Writing React Native components..." },
      { name: "optimizing", duration: 1500, message: "Optimizing performance and styling..." }
    ];

    let currentPhaseIndex = 0;
    let phaseStartTime = Date.now();

    const updatePhase = () => {
      const elapsed = Date.now() - phaseStartTime;
      const currentPhase = generationPhases[currentPhaseIndex];
      
      if (elapsed >= currentPhase.duration) {
        currentPhaseIndex++;
        phaseStartTime = Date.now();
        
        if (currentPhaseIndex < generationPhases.length) {
          setGenerationPhase(generationPhases[currentPhaseIndex].name as any);
          setCurrentStep(generationPhases[currentPhaseIndex].message);
        } else {
          setGenerationPhase("complete");
          setCurrentStep("Generation complete!");
          setProgress(100);
          
          onComplete?.({
            appName: "Your Generated App",
            primaryColor: "#6366F1",
            layout: {
              heroSection: { 
                title: "Welcome to Your Store", 
                subtitle: "Discover amazing products at great prices",
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
      }
      
      // Update progress
      const totalDuration = generationPhases.reduce((sum: number, p: any) => sum + p.duration, 0);
      const elapsedTotal = generationPhases.slice(0, currentPhaseIndex).reduce((sum: number, p: any) => sum + p.duration, 0) + elapsed;
      setProgress(Math.min(95, (elapsedTotal / totalDuration) * 100));
      
      setCurrentStep(currentPhase.message);
    };

    // Typing animation
    const typeCode = () => {
      if (lineIndex >= codeTemplate.length) {
        updatePhase();
        return;
      }

      const currentLine = codeTemplate[lineIndex];
      
      if (charIndex >= currentLine.length) {
        setCodeLines(prev => [...prev, currentTypingLine]);
        setCurrentTypingLine("");
        lineIndex++;
        charIndex = 0;
        
        // Scroll to bottom
        setTimeout(() => {
          scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 50);
      } else {
        setCurrentTypingLine(currentLine.substring(0, charIndex + 1));
        charIndex++;
      }
      
      updatePhase();
    };

    // Control typing speed based on phase
    const getTypingSpeed = () => {
      switch (generationPhase) {
        case "analyzing": return 100;
        case "designing": return 80;
        case "coding": return 45;
        case "optimizing": return 60;
        default: return 50;
      }
    };

    const interval = setInterval(typeCode, getTypingSpeed());
    
    // Cursor blinking
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(cursorInterval);
    };
  }, [isGenerating, generationPhase, onComplete]);

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case "analyzing": return <Cpu className="w-4 h-4 animate-pulse" />;
      case "designing": return <Eye className="w-4 h-4 animate-bounce" />;
      case "coding": return <Code className="w-4 h-4 animate-spin" />;
      case "optimizing": return <Zap className="w-4 h-4 animate-pulse" />;
      case "complete": return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "analyzing": return "bg-blue-100 text-blue-700";
      case "designing": return "bg-purple-100 text-purple-700";
      case "coding": return "bg-green-100 text-green-700";
      case "optimizing": return "bg-yellow-100 text-yellow-700";
      case "complete": return "bg-emerald-100 text-emerald-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Live Code Generation
          </CardTitle>
          {isGenerating && (
            <Badge variant="secondary" className={`${getPhaseColor(generationPhase)} animate-pulse`}>
              {getPhaseIcon(generationPhase)}
              <span className="ml-2 capitalize">{generationPhase}</span>
            </Badge>
          )}
        </div>
        
        {isGenerating && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{currentStep}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Lines per second: ~{linesPerSecond}</span>
            </div>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-0">
        <Tabs defaultValue="code" className="h-full">
          <TabsList className="mx-6 mb-4">
            <TabsTrigger value="code" className="flex items-center gap-2">
              <Code className="w-4 h-4" />
              Live Code
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Preview
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="code" className="h-[500px] mx-6">
            <ScrollArea className="h-full">
              <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-hidden">
                {codeLines.map((line, index) => (
                  <div 
                    key={index}
                    className={`leading-6 ${
                      line && line.startsWith("//") ? "text-gray-400 italic" : 
                      line && (line.includes("import") || line.includes("export")) ? "text-blue-300" :
                      line && (line.includes("const") || line.includes("function")) ? "text-purple-300" :
                      line && line.includes("styles") ? "text-yellow-300" :
                      "text-gray-100"
                    }`}
                  >
                    {line || "\u00A0"}
                  </div>
                ))}
                
                {/* Current typing line */}
                {isGenerating && currentTypingLine && (
                  <div className="leading-6 text-gray-100 flex">
                    <span>{currentTypingLine}</span>
                    {showCursor && <span className="bg-blue-400 w-2 h-5 inline-block ml-1 animate-pulse"></span>}
                  </div>
                )}
                
                <div ref={scrollRef} />
              </div>
            </ScrollArea>
          </TabsContent>
          
          <TabsContent value="preview" className="h-[500px] mx-6">
            <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
              {generationPhase === "complete" ? (
                <div className="text-center">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Code Generation Complete!</h3>
                  <p className="text-gray-600">Your mobile app code is ready for deployment.</p>
                </div>
              ) : isGenerating ? (
                <div className="text-center">
                  <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Generating Your App...</h3>
                  <p className="text-gray-600">Please wait while we create your mobile app.</p>
                </div>
              ) : (
                <div className="text-center">
                  <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Generate</h3>
                  <p className="text-gray-600">Start app generation to see live code creation.</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}