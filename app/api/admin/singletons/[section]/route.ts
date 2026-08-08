import { getAdminSingleton, saveAdminSingleton, unavailableStorageResponse } from "../../../../lib/admin-data";
import { isAuthorizedAdminRequest, unauthorizedResponse } from "../../../../lib/admin-auth";
import type { AdminContentRecord } from "../../../../lib/admin-types";

function isSingletonSection(section: string): section is "about" | "settings" {
  return section === "about" || section === "settings";
}

export async function GET(request: Request, { params }: { params: Promise<{ section: string }> }) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();
  const { section } = await params;
  if (!isSingletonSection(section)) return Response.json({ error: "지원하지 않는 설정 구분입니다." }, { status: 404 });
  try {
    return Response.json({ record: await getAdminSingleton(section) });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "설정을 불러오지 못했습니다." }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ section: string }> }) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();
  const { section } = await params;
  if (!isSingletonSection(section)) return Response.json({ error: "지원하지 않는 설정 구분입니다." }, { status: 404 });
  try {
    const record = await request.json() as AdminContentRecord;
    return Response.json({ record: await saveAdminSingleton(section, record) });
  } catch (error) {
    return unavailableStorageResponse(error);
  }
}
