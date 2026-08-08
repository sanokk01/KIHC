import { headers } from "next/headers";
import { redirect } from "next/navigation";

export type AdminUser = {
  userId: string;
  displayName: string;
  email: string;
  fullName: string | null;
};

function isLocalHost(host: string | null) {
  return Boolean(host && (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) || host.startsWith("[::1]")));
}

export async function getAdminUser(): Promise<AdminUser | null> {
  const requestHeaders = await headers();
  if (isLocalHost(requestHeaders.get("host"))) {
    return { userId: "local-admin", displayName: "Local Admin", email: "local@kihc.test", fullName: "Local Admin" };
  }
  return null;
}

export async function requireAdminUser(returnTo: string): Promise<AdminUser> {
  const user = await getAdminUser();
  if (user) return user;
  redirect(`/adminpage1/login?return_to=${encodeURIComponent(safeReturnTo(returnTo))}`);
}

export function isAuthorizedAdminRequest(request: Request): boolean {
  const url = new URL(request.url);
  return url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1";
}

export function unauthorizedResponse() {
  return Response.json({ error: "관리자 인증 연결이 필요합니다." }, { status: 401 });
}

function safeReturnTo(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : "/adminpage1";
}
