import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { chatGPTSignInPath, getChatGPTUser, type ChatGPTUser } from "../chatgpt-auth";

function isLocalHost(host: string | null) {
  return Boolean(host && (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host) || host.startsWith("[::1]")));
}

export async function getAdminUser(): Promise<ChatGPTUser | null> {
  const user = await getChatGPTUser();
  if (user) return user;
  const requestHeaders = await headers();
  if (isLocalHost(requestHeaders.get("host"))) {
    return { userId: "local-admin", displayName: "Local Admin", email: "local@kihc.test", fullName: "Local Admin" };
  }
  return null;
}

export async function requireAdminUser(returnTo: string): Promise<ChatGPTUser> {
  const user = await getAdminUser();
  if (user) return user;
  redirect(chatGPTSignInPath(returnTo));
}

export function isAuthorizedAdminRequest(request: Request): boolean {
  const url = new URL(request.url);
  if (url.hostname === "localhost" || url.hostname === "127.0.0.1" || url.hostname === "::1") return true;
  return Boolean(request.headers.get("oai-authenticated-user-id") && request.headers.get("oai-authenticated-user-email"));
}

export function unauthorizedResponse() {
  return Response.json({ error: "관리자 로그인이 필요합니다." }, { status: 401 });
}
