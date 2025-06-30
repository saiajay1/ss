import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertShopifyStoreSchema, insertGeneratedAppSchema } from "@shared/schema";
import { generateMobileApp } from "./gemini";
import { createShopifyAPI } from "./shopify";
import { z } from "zod";

const shopifyConnectSchema = z.object({
  shopifyDomain: z.string().min(1),
  accessToken: z.string().min(1),
  shopName: z.string().min(1),
  email: z.string().email().optional(),
  currency: z.string().optional(),
  timezone: z.string().optional(),
  productCount: z.number().optional(),
  collectionCount: z.number().optional(),
  orderCount: z.number().optional(),
});

const generateAppSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  prompt: z.string().min(1),
  primaryColor: z.string().default("#4F46E5"),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Shopify store routes
  app.get('/api/shopify/store', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const store = await storage.getShopifyStore(userId);
      res.json(store);
    } catch (error) {
      console.error("Error fetching Shopify store:", error);
      res.status(500).json({ message: "Failed to fetch store" });
    }
  });

  app.post('/api/shopify/connect', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = shopifyConnectSchema.parse(req.body);
      
      console.log(`Connecting Shopify store for user ${userId}: ${validatedData.shopifyDomain}`);
      
      // Initialize Shopify API and validate connection
      const shopifyAPI = createShopifyAPI(validatedData.shopifyDomain, validatedData.accessToken);
      
      const isValid = await shopifyAPI.validateConnection();
      if (!isValid) {
        return res.status(400).json({ 
          message: "Invalid Shopify domain or access token. Please check your credentials." 
        });
      }
      
      // Fetch complete store data from Shopify
      console.log("Fetching complete store data from Shopify...");
      const storeData = await shopifyAPI.getAllStoreData();
      
      // Check if store already exists for this user
      const existingStore = await storage.getShopifyStore(userId);
      if (existingStore) {
        // Update existing store with real Shopify data
        const updatedStore = await storage.updateShopifyStore(existingStore.id, {
          shopifyDomain: validatedData.shopifyDomain,
          accessToken: validatedData.accessToken,
          shopName: storeData.store.name,
          email: storeData.store.email,
          currency: storeData.store.currency,
          timezone: storeData.store.timezone,
          countryName: storeData.store.country_name,
          province: storeData.store.province,
          city: storeData.store.city,
          phone: storeData.store.phone,
          description: storeData.store.description,
          productCount: storeData.totalProducts,
          collectionCount: storeData.totalCollections,
          orderCount: storeData.totalOrders,
          storeData: storeData, // Store complete data for app generation
          lastSyncAt: new Date(),
        });
        
        console.log(`Updated store data: ${storeData.totalProducts} products, ${storeData.totalCollections} collections`);
        res.json(updatedStore);
      } else {
        // Create new store with real Shopify data
        const newStore = await storage.createShopifyStore({
          userId,
          shopifyDomain: validatedData.shopifyDomain,
          accessToken: validatedData.accessToken,
          shopName: storeData.store.name,
          email: storeData.store.email,
          currency: storeData.store.currency,
          timezone: storeData.store.timezone,
          countryName: storeData.store.country_name,
          province: storeData.store.province,
          city: storeData.store.city,
          phone: storeData.store.phone,
          description: storeData.store.description,
          productCount: storeData.totalProducts,
          collectionCount: storeData.totalCollections,
          orderCount: storeData.totalOrders,
          storeData: storeData, // Store complete data for app generation
          lastSyncAt: new Date(),
        });
        
        console.log(`Created new store: ${storeData.totalProducts} products, ${storeData.totalCollections} collections`);
        res.json(newStore);
      }
    } catch (error) {
      console.error("Error connecting Shopify store:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Failed to connect store" 
      });
    }
  });

  // Sync Shopify store data
  app.post('/api/shopify/sync', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const store = await storage.getShopifyStore(userId);
      
      if (!store) {
        return res.status(404).json({ message: "No Shopify store connected" });
      }
      
      console.log(`Syncing Shopify data for ${store.shopName}...`);
      
      // Re-fetch store data from Shopify
      const shopifyAPI = createShopifyAPI(store.shopifyDomain, store.accessToken);
      const storeData = await shopifyAPI.getAllStoreData();
      
      // Update store with fresh data
      const updatedStore = await storage.updateShopifyStore(store.id, {
        shopName: storeData.store.name,
        email: storeData.store.email,
        currency: storeData.store.currency,
        timezone: storeData.store.timezone,
        countryName: storeData.store.country_name,
        province: storeData.store.province,
        city: storeData.store.city,
        phone: storeData.store.phone,
        description: storeData.store.description,
        productCount: storeData.totalProducts,
        collectionCount: storeData.totalCollections,
        orderCount: storeData.totalOrders,
        storeData: storeData,
        lastSyncAt: new Date(),
      });
      
      console.log(`Sync complete: ${storeData.totalProducts} products, ${storeData.totalCollections} collections`);
      res.json(updatedStore);
    } catch (error) {
      console.error("Error syncing Shopify store:", error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to sync store" 
      });
    }
  });

  // Generated apps routes
  app.get('/api/apps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const apps = await storage.getGeneratedApps(userId);
      res.json(apps);
    } catch (error) {
      console.error("Error fetching generated apps:", error);
      res.status(500).json({ message: "Failed to fetch apps" });
    }
  });

  app.post('/api/apps/generate', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appData = generateAppSchema.parse(req.body);
      
      // Get user's Shopify store
      const store = await storage.getShopifyStore(userId);
      
      // Create the app with processing status
      const app = await storage.createGeneratedApp({
        userId,
        storeId: store?.id,
        ...appData,
        status: "processing",
      });

      // Generate app using Gemini AI with real Shopify data
      setTimeout(async () => {
        try {
          const aiConfig = await generateMobileApp({
            prompt: appData.prompt,
            appName: appData.name,
            primaryColor: appData.primaryColor,
            storeData: store && store.storeData ? {
              shopName: store.shopName,
              productCount: store.productCount || 0,
              collectionCount: store.collectionCount || 0,
              orderCount: store.orderCount || 0,
              realProducts: (store.storeData as any)?.products || [],
              realCollections: (store.storeData as any)?.collections || [],
              storeInfo: (store.storeData as any)?.store || null,
            } : undefined,
          });

          await storage.updateGeneratedApp(app.id, {
            status: "ready",
            previewData: {
              appName: aiConfig.appName,
              primaryColor: aiConfig.primaryColor,
              featuredProducts: aiConfig.previewData.featuredProducts,
              heroSection: aiConfig.layout.heroSection,
              categories: aiConfig.previewData.categories,
            },
            appConfig: aiConfig,
          });
        } catch (error) {
          console.error("Error generating app with AI:", error);
          await storage.updateGeneratedApp(app.id, {
            status: "failed",
          });
        }
      }, 2000); // 2 second delay to allow for AI processing
      
      res.json(app);
    } catch (error) {
      console.error("Error generating app:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid app data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to generate app" });
      }
    }
  });

  app.get('/api/apps/:id', isAuthenticated, async (req: any, res) => {
    try {
      const appId = parseInt(req.params.id);
      const app = await storage.getGeneratedApp(appId);
      
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      
      // Ensure user owns the app
      const userId = req.user.claims.sub;
      if (app.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      res.json(app);
    } catch (error) {
      console.error("Error fetching app:", error);
      res.status(500).json({ message: "Failed to fetch app" });
    }
  });

  // Modify existing app with AI
  app.post('/api/apps/:id/modify', isAuthenticated, async (req: any, res) => {
    try {
      const appId = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      const { modificationPrompt } = req.body;
      
      if (!modificationPrompt || typeof modificationPrompt !== "string") {
        return res.status(400).json({ message: "Modification prompt is required" });
      }

      // Get existing app
      const existingApp = await storage.getGeneratedApp(appId);
      if (!existingApp) {
        return res.status(404).json({ message: "App not found" });
      }

      // Ensure user owns this app
      if (existingApp.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      if (!existingApp.appConfig) {
        return res.status(400).json({ message: "App configuration not found" });
      }

      // Get store data if available
      let storeData;
      if (existingApp.storeId) {
        const store = await storage.getShopifyStore(userId);
        if (store && store.storeData) {
          const storeDataObj = store.storeData as any;
          storeData = {
            shopName: store.shopName,
            productCount: store.productCount || 0,
            collectionCount: store.collectionCount || 0,
            orderCount: store.orderCount || 0,
            realProducts: storeDataObj.products || [],
            realCollections: storeDataObj.collections || [],
            storeInfo: storeDataObj.store || {}
          };
        }
      }

      // Create modification request
      const modification = await storage.createAppModification({
        appId: appId,
        userId: userId,
        modificationPrompt,
        status: "processing",
        previousConfig: existingApp.appConfig
      });

      // Update app status to processing
      await storage.updateGeneratedApp(appId, {
        status: "processing"
      });

      // Generate modified config with AI
      try {
        const { modifyMobileApp } = await import("./gemini.ts");
        const newConfig = await modifyMobileApp(
          existingApp.appConfig as any,
          modificationPrompt,
          storeData
        );

        // Update the app with new configuration
        const updatedApp = await storage.updateGeneratedApp(appId, {
          appConfig: newConfig,
          status: "ready"
        });

        // Update modification status
        await storage.updateAppModification(modification.id, {
          status: "completed",
          newConfig: newConfig
        });

        res.json(updatedApp);
      } catch (aiError) {
        console.error("AI modification error:", aiError);
        
        // Update modification status to failed
        await storage.updateAppModification(modification.id, {
          status: "failed"
        });

        // Revert app status
        await storage.updateGeneratedApp(appId, {
          status: "ready"
        });

        res.status(500).json({ message: "Failed to generate app modifications" });
      }
    } catch (error) {
      console.error("Error modifying app:", error);
      res.status(500).json({ message: "Failed to modify app" });
    }
  });

  // Get modification history for an app
  app.get('/api/apps/:id/modifications', isAuthenticated, async (req: any, res) => {
    try {
      const appId = parseInt(req.params.id);
      const userId = req.user.claims.sub;

      // Verify app exists and user owns it
      const app = await storage.getGeneratedApp(appId);
      if (!app) {
        return res.status(404).json({ message: "App not found" });
      }
      
      if (app.userId !== userId) {
        return res.status(403).json({ message: "Access denied" });
      }

      const modifications = await storage.getAppModifications(appId);
      res.json(modifications);
    } catch (error) {
      console.error("Error fetching modifications:", error);
      res.status(500).json({ message: "Failed to fetch modifications" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
