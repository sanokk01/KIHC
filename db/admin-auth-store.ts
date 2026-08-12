import { and, eq, gt, lt } from "drizzle-orm";
import { getDb } from "./index";
import { adminAccounts, adminSessions } from "./schema";

export const PRIMARY_ADMIN_ID = "primary";

export type StoredAdminAccount = {
  id: string;
  loginId: string;
  displayName: string;
  passwordHash: string;
};

export async function hasStoredAdminAccount(): Promise<boolean> {
  const [account] = await getDb()
    .select({ id: adminAccounts.id })
    .from(adminAccounts)
    .where(eq(adminAccounts.id, PRIMARY_ADMIN_ID))
    .limit(1);
  return Boolean(account);
}

export async function createStoredAdminAccount(input: {
  loginId: string;
  displayName: string;
  passwordHash: string;
}): Promise<boolean> {
  const inserted = await getDb()
    .insert(adminAccounts)
    .values({ id: PRIMARY_ADMIN_ID, loginId: input.loginId, displayName: input.displayName, passwordHash: input.passwordHash })
    .onConflictDoNothing()
    .returning({ id: adminAccounts.id });
  return inserted.length === 1;
}

export async function getStoredAdminAccount(loginId: string): Promise<StoredAdminAccount | null> {
  const [account] = await getDb()
    .select({
      id: adminAccounts.id,
      loginId: adminAccounts.loginId,
      displayName: adminAccounts.displayName,
      passwordHash: adminAccounts.passwordHash,
    })
    .from(adminAccounts)
    .where(and(eq(adminAccounts.id, PRIMARY_ADMIN_ID), eq(adminAccounts.loginId, loginId)))
    .limit(1);
  return account ?? null;
}

export async function createStoredAdminSession(tokenHash: string, expiresAt: string): Promise<void> {
  const db = getDb();
  await db.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date().toISOString()));
  await db.insert(adminSessions).values({
    tokenHash,
    accountId: PRIMARY_ADMIN_ID,
    expiresAt,
  });
}

export async function getStoredAdminSession(tokenHash: string): Promise<Omit<StoredAdminAccount, "passwordHash"> | null> {
  const [session] = await getDb()
    .select({
      id: adminAccounts.id,
      loginId: adminAccounts.loginId,
      displayName: adminAccounts.displayName,
    })
    .from(adminSessions)
    .innerJoin(adminAccounts, eq(adminSessions.accountId, adminAccounts.id))
    .where(and(
      eq(adminSessions.tokenHash, tokenHash),
      eq(adminAccounts.id, PRIMARY_ADMIN_ID),
      gt(adminSessions.expiresAt, new Date().toISOString()),
    ))
    .limit(1);
  return session ?? null;
}

export async function deleteStoredAdminSession(tokenHash: string): Promise<void> {
  await getDb().delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash));
}
