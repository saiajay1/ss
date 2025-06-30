import { GoogleGenAI } from "@google/genai";

// Initialize GoogleGenAI with API key
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY || "",
  vertexai: false
});

export interface AppGenerationRequest {
  prompt: string;
  appName: string;
  primaryColor: string;
  storeData?: {
    shopName: string;
    productCount: number;
    collectionCount: number;
    orderCount: number;
  };
}

export interface GeneratedAppConfig {
  appName: string;
  primaryColor: string;
  theme: {
    primaryColor: string;
    fontFamily: string;
    borderRadius: string;
  };
  navigation: {
    showBottomNav: boolean;
    showSearch: boolean;
    showCart: boolean;
    tabs: Array<{
      name: string;
      icon: string;
      route: string;
    }>;
  };
  layout: {
    heroSection: {
      title: string;
      subtitle: string;
      showHero: boolean;
      backgroundType: "color" | "gradient";
    };
    productDisplay: {
      gridColumns: number;
      showPrices: boolean;
      showRatings: boolean;
      showWishlist: boolean;
    };
    categories: {
      showCategories: boolean;
      displayStyle: "grid" | "list" | "carousel";
    };
  };
  features: {
    wishlist: boolean;
    reviews: boolean;
    filters: boolean;
    notifications: boolean;
    userAccount: boolean;
    socialSharing: boolean;
  };
  previewData: {
    featuredProducts: Array<{
      name: string;
      price: string;
      image?: string;
    }>;
    categories: Array<{
      name: string;
      count: number;
    }>;
  };
}

export async function generateMobileApp(request: AppGenerationRequest): Promise<GeneratedAppConfig> {
  try {
    const storeContext = request.storeData ? 
      `Store: ${request.storeData.shopName} with ${request.storeData.productCount} products, ${request.storeData.collectionCount} collections, and ${request.storeData.orderCount} orders.` :
      'No store connected yet.';

    const systemPrompt = `You are an expert mobile app designer for e-commerce. Create modern, user-friendly mobile app configurations for Shopify stores.

CONTEXT: ${storeContext}

DESIGN PRINCIPLES:
- Prioritize user experience and conversion optimization
- Use modern mobile design patterns
- Ensure accessibility and intuitive navigation
- Match the app design to the store's business type and customer needs
- Create engaging product discovery experiences

ANALYSIS REQUIREMENTS:
1. Analyze the user's prompt to understand their business type, target audience, and goals
2. Consider store size and product volume when designing layouts
3. Select appropriate features based on business needs
4. Create realistic sample data that matches the business type
5. Choose colors and styling that align with modern mobile design trends

Respond with a JSON object that matches this structure exactly:
{
  "appName": "string",
  "primaryColor": "string (hex color)",
  "theme": {
    "primaryColor": "string (hex color)",
    "fontFamily": "string",
    "borderRadius": "string"
  },
  "navigation": {
    "showBottomNav": boolean,
    "showSearch": boolean,
    "showCart": boolean,
    "tabs": [
      {
        "name": "string",
        "icon": "string",
        "route": "string"
      }
    ]
  },
  "layout": {
    "heroSection": {
      "title": "string",
      "subtitle": "string",
      "showHero": boolean,
      "backgroundType": "color or gradient"
    },
    "productDisplay": {
      "gridColumns": number,
      "showPrices": boolean,
      "showRatings": boolean,
      "showWishlist": boolean
    },
    "categories": {
      "showCategories": boolean,
      "displayStyle": "grid or list or carousel"
    }
  },
  "features": {
    "wishlist": boolean,
    "reviews": boolean,
    "filters": boolean,
    "notifications": boolean,
    "userAccount": boolean,
    "socialSharing": boolean
  },
  "previewData": {
    "featuredProducts": [
      {
        "name": "string",
        "price": "string",
        "image": "string (optional)"
      }
    ],
    "categories": [
      {
        "name": "string",
        "count": number
      }
    ]
  }
}

IMPORTANT GUIDELINES:
- Use realistic product names and categories that match the business type
- Set appropriate grid columns based on store size (1-2 for small stores, 2-3 for larger ones)
- Enable features that make sense for the business (e.g., reviews for retail, filters for large catalogs)
- Create hero section content that reflects the brand and value proposition
- Choose appropriate navigation tabs based on store complexity
- Use color schemes that work well on mobile devices
- Generate 4-6 realistic featured products with proper pricing formats

Make the configuration professional, modern, and optimized for mobile commerce.`;

    const businessTypeAnalysis = `
BUSINESS ANALYSIS:
App Name: "${request.appName}"
User Description: "${request.prompt}"
Primary Color: ${request.primaryColor}
${storeContext}

Based on this information, create a mobile app that:
1. Reflects the business type and target audience
2. Optimizes for the store's product volume and complexity
3. Uses modern mobile UX patterns
4. Includes relevant e-commerce features
5. Has appropriate navigation structure
6. Contains realistic sample content`;

    const userPrompt = `${businessTypeAnalysis}

Generate a comprehensive mobile app configuration that matches the business needs and creates an excellent user experience.`;

    // Use the correct models API for @google/genai v1.7.0
    const prompt = `${systemPrompt}\n\n${userPrompt}\n\nRespond only with valid JSON matching the structure above. No additional text or explanations.`;
    
    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: prompt,
    });
    
    const rawJson = response.text;

    if (!rawJson) {
      throw new Error("Empty response from Gemini model");
    }

    console.log("Raw Gemini response:", rawJson);

    // Parse and validate the response
    let appConfig: GeneratedAppConfig;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanedJson = rawJson.trim();
      if (cleanedJson.startsWith('```json')) {
        cleanedJson = cleanedJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanedJson.startsWith('```')) {
        cleanedJson = cleanedJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      appConfig = JSON.parse(cleanedJson);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      throw new Error("Invalid JSON response from AI model");
    }

    // Validate required fields and provide defaults if missing
    const validatedConfig: GeneratedAppConfig = {
      appName: appConfig.appName || request.appName,
      primaryColor: appConfig.primaryColor || request.primaryColor,
      theme: {
        primaryColor: appConfig.theme?.primaryColor || request.primaryColor,
        fontFamily: appConfig.theme?.fontFamily || "Inter, sans-serif",
        borderRadius: appConfig.theme?.borderRadius || "8px"
      },
      navigation: {
        showBottomNav: appConfig.navigation?.showBottomNav ?? true,
        showSearch: appConfig.navigation?.showSearch ?? true,
        showCart: appConfig.navigation?.showCart ?? true,
        tabs: appConfig.navigation?.tabs || [
          { name: "Home", icon: "home", route: "/" },
          { name: "Shop", icon: "grid", route: "/shop" },
          { name: "Cart", icon: "shopping-bag", route: "/cart" },
          { name: "Profile", icon: "user", route: "/profile" }
        ]
      },
      layout: {
        heroSection: {
          title: appConfig.layout?.heroSection?.title || `Welcome to ${request.appName}`,
          subtitle: appConfig.layout?.heroSection?.subtitle || "Discover amazing products",
          showHero: appConfig.layout?.heroSection?.showHero ?? true,
          backgroundType: appConfig.layout?.heroSection?.backgroundType || "gradient"
        },
        productDisplay: {
          gridColumns: appConfig.layout?.productDisplay?.gridColumns || 2,
          showPrices: appConfig.layout?.productDisplay?.showPrices ?? true,
          showRatings: appConfig.layout?.productDisplay?.showRatings ?? true,
          showWishlist: appConfig.layout?.productDisplay?.showWishlist ?? true
        },
        categories: {
          showCategories: appConfig.layout?.categories?.showCategories ?? true,
          displayStyle: appConfig.layout?.categories?.displayStyle || "grid"
        }
      },
      features: {
        wishlist: appConfig.features?.wishlist ?? true,
        reviews: appConfig.features?.reviews ?? true,
        filters: appConfig.features?.filters ?? true,
        notifications: appConfig.features?.notifications ?? true,
        userAccount: appConfig.features?.userAccount ?? true,
        socialSharing: appConfig.features?.socialSharing ?? false
      },
      previewData: {
        featuredProducts: appConfig.previewData?.featuredProducts || [
          { name: "Featured Product 1", price: "$29.99" },
          { name: "Featured Product 2", price: "$39.99" },
          { name: "Featured Product 3", price: "$19.99" },
          { name: "Featured Product 4", price: "$49.99" }
        ],
        categories: appConfig.previewData?.categories || [
          { name: "All Products", count: 10 },
          { name: "New Arrivals", count: 5 },
          { name: "Best Sellers", count: 8 }
        ]
      }
    };

    return validatedConfig;
  } catch (error) {
    console.error("Error generating app with Gemini:", error);
    
    // Provide a fallback configuration if AI generation fails
    const fallbackConfig: GeneratedAppConfig = {
      appName: request.appName,
      primaryColor: request.primaryColor,
      theme: {
        primaryColor: request.primaryColor,
        fontFamily: "Inter, sans-serif",
        borderRadius: "8px"
      },
      navigation: {
        showBottomNav: true,
        showSearch: true,
        showCart: true,
        tabs: [
          { name: "Home", icon: "home", route: "/" },
          { name: "Shop", icon: "grid", route: "/shop" },
          { name: "Cart", icon: "shopping-bag", route: "/cart" },
          { name: "Profile", icon: "user", route: "/profile" }
        ]
      },
      layout: {
        heroSection: {
          title: `Welcome to ${request.appName}`,
          subtitle: "Discover amazing products",
          showHero: true,
          backgroundType: "gradient"
        },
        productDisplay: {
          gridColumns: 2,
          showPrices: true,
          showRatings: true,
          showWishlist: true
        },
        categories: {
          showCategories: true,
          displayStyle: "grid"
        }
      },
      features: {
        wishlist: true,
        reviews: true,
        filters: true,
        notifications: true,
        userAccount: true,
        socialSharing: false
      },
      previewData: {
        featuredProducts: [
          { name: "Product 1", price: "$29.99" },
          { name: "Product 2", price: "$39.99" },
          { name: "Product 3", price: "$19.99" },
          { name: "Product 4", price: "$49.99" }
        ],
        categories: [
          { name: "All Products", count: 10 },
          { name: "Featured", count: 5 }
        ]
      }
    };

    console.log("Using fallback configuration due to AI generation error");
    return fallbackConfig;
  }
}