import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

let dbInstance: ReturnType<typeof drizzle> | null = null;

function getPoolSize() {
  const configured = Number.parseInt(process.env.DB_POOL_MAX ?? "1", 10);
  return Number.isFinite(configured) ? Math.min(10, Math.max(1, configured)) : 1;
}

export function getDb() {
  if (dbInstance) return dbInstance;

  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL 또는 SUPABASE_DATABASE_URL 환경 변수가 필요합니다.");
  }

  const client = postgres(connectionString, {
    // Netlify runs SSR/API code in short-lived serverless instances. Supabase's
    // transaction pooler should therefore use a very small client-side pool.
    max: getPoolSize(),
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

