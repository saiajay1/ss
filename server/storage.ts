import {
  users,
  shopifyStores,
  generatedApps,
  appModifications,
  type User,
  type UpsertUser,
  type ShopifyStore,
  type InsertShopifyStore,
  type GeneratedApp,
  type InsertGeneratedApp,
  type AppModification,
  type InsertAppModification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Shopify store operations
  getShopifyStore(userId: string): Promise<ShopifyStore | undefined>;
  createShopifyStore(store: InsertShopifyStore): Promise<ShopifyStore>;
  updateShopifyStore(id: number, updates: Partial<InsertShopifyStore>): Promise<ShopifyStore>;
  
  // Generated app operations
  getGeneratedApps(userId: string): Promise<GeneratedApp[]>;
  createGeneratedApp(app: InsertGeneratedApp): Promise<GeneratedApp>;
  updateGeneratedApp(id: number, updates: Partial<InsertGeneratedApp>): Promise<GeneratedApp>;
  getGeneratedApp(id: number): Promise<GeneratedApp | undefined>;
  
  // App modification operations
  getAppModifications(appId: number): Promise<AppModification[]>;
  createAppModification(modification: InsertAppModification): Promise<AppModification>;
  updateAppModification(id: number, updates: Partial<InsertAppModification>): Promise<AppModification>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT) these user operations are mandatory for Replit Auth.
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Shopify store operations
  async getShopifyStore(userId: string): Promise<ShopifyStore | undefined> {
    const [store] = await db
      .select()
      .from(shopifyStores)
      .where(eq(shopifyStores.userId, userId));
    return store;
  }

  async createShopifyStore(store: InsertShopifyStore): Promise<ShopifyStore> {
    const [newStore] = await db
      .insert(shopifyStores)
      .values(store)
      .returning();
    return newStore;
  }

  async updateShopifyStore(id: number, updates: Partial<InsertShopifyStore>): Promise<ShopifyStore> {
    const [updatedStore] = await db
      .update(shopifyStores)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(shopifyStores.id, id))
      .returning();
    return updatedStore;
  }

  // Generated app operations
  async getGeneratedApps(userId: string): Promise<GeneratedApp[]> {
    return await db
      .select()
      .from(generatedApps)
      .where(eq(generatedApps.userId, userId))
      .orderBy(desc(generatedApps.createdAt));
  }

  async createGeneratedApp(app: InsertGeneratedApp): Promise<GeneratedApp> {
    const [newApp] = await db
      .insert(generatedApps)
      .values(app)
      .returning();
    return newApp;
  }

  async updateGeneratedApp(id: number, updates: Partial<InsertGeneratedApp>): Promise<GeneratedApp> {
    const [updatedApp] = await db
      .update(generatedApps)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(generatedApps.id, id))
      .returning();
    return updatedApp;
  }

  async getGeneratedApp(id: number): Promise<GeneratedApp | undefined> {
    const [app] = await db
      .select()
      .from(generatedApps)
      .where(eq(generatedApps.id, id));
    return app;
  }

  async getAppModifications(appId: number): Promise<AppModification[]> {
    return await db
      .select()
      .from(appModifications)
      .where(eq(appModifications.appId, appId))
      .orderBy(desc(appModifications.createdAt));
  }

  async createAppModification(modification: InsertAppModification): Promise<AppModification> {
    const result = await db
      .insert(appModifications)
      .values(modification)
      .returning();
    
    return result[0];
  }

  async updateAppModification(id: number, updates: Partial<InsertAppModification>): Promise<AppModification> {
    const result = await db
      .update(appModifications)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(appModifications.id, id))
      .returning();
    
    return result[0];
  }
}

export const storage = new DatabaseStorage();
