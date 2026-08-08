import { isContentSection, removeAdminRecord, unavailableStorageResponse } from "../../../../../lib/admin-data";
import { isAuthorizedAdminRequest, unauthorizedResponse } from "../../../../../lib/admin-auth";

export async function DELETE(request: Request, { params }: { params: Promise<{ section: string; id: string }> }) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();
  const { section, id } = await params;
  if (!isContentSection(section)) return Response.json({ error: "지원하지 않는 콘텐츠 구분입니다." }, { status: 404 });
  try {
    await removeAdminRecord(section, id);
    return Response.json({ ok: true });
  } catch (error) {
    return unavailableStorageResponse(error);
  }
}
