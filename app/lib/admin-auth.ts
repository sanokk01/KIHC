import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getStoredAdminSession } from "../../db/admin-auth-store";

export const ADMIN_SESSION_COOKIE = "kihc-admin-session";

export type AdminUser = {
  userId: string;
  displayName: string;
  loginId: string;
  fullName: string | null;
};

export function hashAdminSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

async function userForToken(token?: string | null): Promise<AdminUser | null> {
  if (!token) return null;
  try {
    const account = await getStoredAdminSession(hashAdminSessionToken(token));
    if (!account) return null;
    return {
      userId: account.id,
      displayName: account.displayName,
      loginId: account.loginId,
      fullName: account.displayName,
    };
  } catch {
    return null;
  }
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  return userForToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value);
}

export async function requireAdminUser(returnTo: string): Promise<AdminUser> {
  const user = await getAdminUser();
  if (user) return user;
  redirect(`/adminpage1/login?return_to=${encodeURIComponent(safeAdminReturnTo(returnTo))}`);
}

function requestCookie(request: Request, name: string): string | null {
  const header = request.headers.get("cookie");
  if (!header) return null;
  for (const part of header.split(";")) {
    const [rawName, ...rawValue] = part.trim().split("=");
    if (rawName === name) return decodeURIComponent(rawValue.join("="));
  }
  return null;
}

export async function isAuthorizedAdminRequest(request: Request): Promise<boolean> {
  return Boolean(await userForToken(requestCookie(request, ADMIN_SESSION_COOKIE)));
}

export function unauthorizedResponse() {
  return Response.json({ error: "관리자 로그인이 필요합니다." }, { status: 401 });
}

export function safeAdminReturnTo(value: string | null | undefined) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/adminpage1";
}
