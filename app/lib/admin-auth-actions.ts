"use server";

import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  createStoredAdminSession,
  deleteStoredAdminSession,
  getStoredAdminAccount,
} from "../../db/admin-auth-store";
import { ADMIN_SESSION_COOKIE, hashAdminSessionToken, safeAdminReturnTo } from "./admin-auth";
import { verifyAdminPassword } from "./admin-password";

export type AdminAuthState = { error: string };

const SESSION_SECONDS = 60 * 60 * 12;

function text(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function normalizeLoginId(value: string): string {
  return value.toLowerCase();
}

function validLoginId(value: string): boolean {
  return /^[a-z0-9][a-z0-9_-]{3,49}$/.test(value);
}

async function establishSession(): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_SECONDS * 1000);
  await createStoredAdminSession(hashAdminSessionToken(token), expiresAt.toISOString());
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function loginAdminAction(_state: AdminAuthState, formData: FormData): Promise<AdminAuthState> {
  const loginId = normalizeLoginId(text(formData, "loginId"));
  const password = String(formData.get("password") ?? "");
  const returnTo = safeAdminReturnTo(text(formData, "returnTo"));

  if (!validLoginId(loginId) || !password) return { error: "관리자 아이디와 비밀번호를 확인해 주세요." };

  try {
    const account = await getStoredAdminAccount(loginId);
    if (!account || !(await verifyAdminPassword(password, account.passwordHash))) {
      return { error: "관리자 아이디 또는 비밀번호가 올바르지 않습니다." };
    }
    await establishSession();
  } catch {
    return { error: "로그인할 수 없습니다. 잠시 후 다시 시도해 주세요." };
  }

  redirect(returnTo);
}

export async function logoutAdminAction(): Promise<void> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (token) {
    try { await deleteStoredAdminSession(hashAdminSessionToken(token)); }
    catch { /* The cookie is still cleared when the DB is temporarily unavailable. */ }
  }
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/adminpage1/login");
}
