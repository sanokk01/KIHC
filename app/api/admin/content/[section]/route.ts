import { getAdminRecords, isContentSection, saveAdminRecord, unavailableStorageResponse } from "../../../../lib/admin-data";
import { isAuthorizedAdminRequest, unauthorizedResponse } from "../../../../lib/admin-auth";
import type { AdminContentRecord } from "../../../../lib/admin-types";

export async function GET(request: Request, { params }: { params: Promise<{ section: string }> }) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();
  const { section } = await params;
  if (!isContentSection(section)) return Response.json({ error: "지원하지 않는 콘텐츠 구분입니다." }, { status: 404 });
  try {
    return Response.json({ records: await getAdminRecords(section) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "데이터를 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ section: string }> }) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();
  const { section } = await params;
  if (!isContentSection(section)) return Response.json({ error: "지원하지 않는 콘텐츠 구분입니다." }, { status: 404 });
  try {
    const record = await request.json() as AdminContentRecord;
    if (!record.title?.trim()) return Response.json({ error: "제목을 입력하세요." }, { status: 400 });
    return Response.json({ record: await saveAdminRecord(section, record) });
  } catch (error) {
    return unavailableStorageResponse(error);
  }
}
