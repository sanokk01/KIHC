import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

const DEFAULT_DATABASE_URL = "postgres://postgres:oneteam1234!%40@db.obrziymkslkvsvjkjoow.supabase.co:5432/postgres";

let dbInstance: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (dbInstance) return dbInstance;

  const connectionString = process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL || DEFAULT_DATABASE_URL;

  const client = postgres(connectionString, {
    max: 10,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

