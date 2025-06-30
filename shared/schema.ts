import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shopify stores table
export const shopifyStores = pgTable("shopify_stores", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  shopifyDomain: varchar("shopify_domain").notNull(),
  accessToken: text("access_token").notNull(),
  shopName: varchar("shop_name").notNull(),
  email: varchar("email"),
  currency: varchar("currency"),
  timezone: varchar("timezone"),
  countryName: varchar("country_name"),
  province: varchar("province"),
  city: varchar("city"),
  phone: varchar("phone"),
  description: text("description"),
  productCount: integer("product_count").default(0),
  collectionCount: integer("collection_count").default(0),
  orderCount: integer("order_count").default(0),
  storeData: jsonb("store_data"), // Complete Shopify store data
  lastSyncAt: timestamp("last_sync_at"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Generated mobile apps table
export const generatedApps = pgTable("generated_apps", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  storeId: integer("store_id").references(() => shopifyStores.id),
  name: varchar("name").notNull(),
  description: text("description"),
  prompt: text("prompt").notNull(),
  primaryColor: varchar("primary_color").default("#4F46E5"),
  status: varchar("status").notNull().default("processing"), // processing, ready, failed
  previewData: jsonb("preview_data"),
  appConfig: jsonb("app_config"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  shopifyStores: many(shopifyStores),
  generatedApps: many(generatedApps),
}));

export const shopifyStoresRelations = relations(shopifyStores, ({ one, many }) => ({
  user: one(users, {
    fields: [shopifyStores.userId],
    references: [users.id],
  }),
  generatedApps: many(generatedApps),
}));

export const generatedAppsRelations = relations(generatedApps, ({ one }) => ({
  user: one(users, {
    fields: [generatedApps.userId],
    references: [users.id],
  }),
  store: one(shopifyStores, {
    fields: [generatedApps.storeId],
    references: [shopifyStores.id],
  }),
}));

// Insert schemas
export const insertShopifyStoreSchema = createInsertSchema(shopifyStores).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertGeneratedAppSchema = createInsertSchema(generatedApps).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertShopifyStore = z.infer<typeof insertShopifyStoreSchema>;
export type ShopifyStore = typeof shopifyStores.$inferSelect;
export type InsertGeneratedApp = z.infer<typeof insertGeneratedAppSchema>;
export type GeneratedApp = typeof generatedApps.$inferSelect;
