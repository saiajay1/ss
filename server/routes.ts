import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertShopifyStoreSchema, insertGeneratedAppSchema } from "@shared/schema";
import { generateMobileApp } from "./gemini";
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
      const storeData = shopifyConnectSchema.parse(req.body);
      
      const store = await storage.createShopifyStore({
        userId,
        ...storeData,
      });
      
      res.json(store);
    } catch (error) {
      console.error("Error connecting Shopify store:", error);
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid store data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to connect store" });
      }
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

      // Generate app using Gemini AI
      setTimeout(async () => {
        try {
          const aiConfig = await generateMobileApp({
            prompt: appData.prompt,
            appName: appData.name,
            primaryColor: appData.primaryColor,
            storeData: store ? {
              shopName: store.shopName,
              productCount: store.productCount || 0,
              collectionCount: store.collectionCount || 0,
              orderCount: store.orderCount || 0,
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

  const httpServer = createServer(app);
  return httpServer;
}
