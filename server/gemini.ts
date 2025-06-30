import { GoogleGenAI } from "@google/genai";

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
    const systemPrompt = `You are a mobile app design expert specializing in e-commerce apps for Shopify stores. 
Based on the user's description, generate a comprehensive mobile app configuration that includes:

1. Theme and styling (colors, fonts, layout preferences)
2. Navigation structure (bottom nav, tabs, search functionality)
3. Layout configuration (hero sections, product displays, categories)
4. Features to include (wishlist, reviews, filters, etc.)
5. Sample preview data for demonstration

The user's store information: ${request.storeData ? JSON.stringify(request.storeData) : 'No store data available'}

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

Make the app configuration appropriate for the described use case and store type.`;

    const userPrompt = `App Name: ${request.appName}
Primary Color: ${request.primaryColor}
Description: ${request.prompt}

Please generate a mobile app configuration based on this description.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            appName: { type: "string" },
            primaryColor: { type: "string" },
            theme: {
              type: "object",
              properties: {
                primaryColor: { type: "string" },
                fontFamily: { type: "string" },
                borderRadius: { type: "string" }
              },
              required: ["primaryColor", "fontFamily", "borderRadius"]
            },
            navigation: {
              type: "object",
              properties: {
                showBottomNav: { type: "boolean" },
                showSearch: { type: "boolean" },
                showCart: { type: "boolean" },
                tabs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      icon: { type: "string" },
                      route: { type: "string" }
                    },
                    required: ["name", "icon", "route"]
                  }
                }
              },
              required: ["showBottomNav", "showSearch", "showCart", "tabs"]
            },
            layout: {
              type: "object",
              properties: {
                heroSection: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                    showHero: { type: "boolean" },
                    backgroundType: { type: "string" }
                  },
                  required: ["title", "subtitle", "showHero", "backgroundType"]
                },
                productDisplay: {
                  type: "object",
                  properties: {
                    gridColumns: { type: "number" },
                    showPrices: { type: "boolean" },
                    showRatings: { type: "boolean" },
                    showWishlist: { type: "boolean" }
                  },
                  required: ["gridColumns", "showPrices", "showRatings", "showWishlist"]
                },
                categories: {
                  type: "object",
                  properties: {
                    showCategories: { type: "boolean" },
                    displayStyle: { type: "string" }
                  },
                  required: ["showCategories", "displayStyle"]
                }
              },
              required: ["heroSection", "productDisplay", "categories"]
            },
            features: {
              type: "object",
              properties: {
                wishlist: { type: "boolean" },
                reviews: { type: "boolean" },
                filters: { type: "boolean" },
                notifications: { type: "boolean" },
                userAccount: { type: "boolean" },
                socialSharing: { type: "boolean" }
              },
              required: ["wishlist", "reviews", "filters", "notifications", "userAccount", "socialSharing"]
            },
            previewData: {
              type: "object",
              properties: {
                featuredProducts: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      price: { type: "string" },
                      image: { type: "string" }
                    },
                    required: ["name", "price"]
                  }
                },
                categories: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      count: { type: "number" }
                    },
                    required: ["name", "count"]
                  }
                }
              },
              required: ["featuredProducts", "categories"]
            }
          },
          required: ["appName", "primaryColor", "theme", "navigation", "layout", "features", "previewData"]
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;

    if (rawJson) {
      const appConfig: GeneratedAppConfig = JSON.parse(rawJson);
      return appConfig;
    } else {
      throw new Error("Empty response from Gemini model");
    }
  } catch (error) {
    console.error("Error generating app with Gemini:", error);
    throw new Error(`Failed to generate app: ${error}`);
  }
}