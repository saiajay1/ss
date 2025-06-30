import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon for serverless environment
neonConfig.webSocketConstructor = ws;
neonConfig.useSecureWebSocket = true;
neonConfig.pipelineConnect = false;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create pool with proper error handling
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 1, // Limit connections in serverless environment
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

export const db = drizzle({ client: pool, schema });