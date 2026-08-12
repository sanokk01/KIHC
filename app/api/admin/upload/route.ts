import { isAuthorizedAdminRequest, unauthorizedResponse } from "../../../lib/admin-auth";

export async function POST(request: Request) {
  if (!(await isAuthorizedAdminRequest(request))) return unauthorizedResponse();
  return Response.json({ error: "Supabase Storage 업로드 연결이 필요합니다.", storageConnected: false }, { status: 503 });
}
