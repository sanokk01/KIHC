import { sql } from "drizzle-orm";
import { getDb } from "../../db";

export const databaseConfigured = Boolean(process.env.DATABASE_URL || process.env.SUPABASE_DATABASE_URL);

export type DatabaseStatus = {
  connected: boolean;
  message: string;
};

export async function getDatabaseStatus(): Promise<DatabaseStatus> {
  if (!databaseConfigured) {
    return {
      connected: false,
      message: "DATABASE_URL 또는 SUPABASE_DATABASE_URL 환경 변수가 설정되지 않았습니다.",
    };
  }

  try {
    await getDb().execute(sql`select 1`);
    return { connected: true, message: "PostgreSQL DB에 정상 연결되어 있습니다." };
  } catch {
    return {
      connected: false,
      message: "DB 연결에 실패했습니다. Netlify 환경 변수와 Supabase 연결 상태를 확인해 주세요.",
    };
  }
}

