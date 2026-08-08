import { drizzle } from "drizzle-orm/d1";

export function getDb(): ReturnType<typeof drizzle> {
  throw new Error("외부 데이터베이스가 아직 연결되지 않았습니다. 새 DB 어댑터를 db/index.ts에 연결하세요.");
}
