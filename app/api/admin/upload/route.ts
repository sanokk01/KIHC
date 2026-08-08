import { isAuthorizedAdminRequest, unauthorizedResponse } from "../../../lib/admin-auth";
import { databasePendingMessage } from "../../../lib/storage-status";

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();
  return Response.json({ error: databasePendingMessage, storageConnected: false }, { status: 503 });
}
