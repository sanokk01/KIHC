import { isAuthorizedAdminRequest, unauthorizedResponse } from "../../../lib/admin-auth";
import { uploadFileToStorage } from "../../../lib/supabase-storage";

const ALLOWED_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/zip",
  "application/x-hwp",
  "application/haansofthwp",
]);

const IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export async function POST(request: Request) {
  if (!(await isAuthorizedAdminRequest(request))) return unauthorizedResponse();

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return Response.json({ error: "파일 데이터를 읽지 못했습니다." }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "file 필드가 없거나 유효하지 않습니다." }, { status: 400 });
  }

  const isHwp = file.name.toLowerCase().endsWith(".hwp");
  if (!isHwp && !ALLOWED_TYPES.has(file.type)) {
    return Response.json(
      { error: `허용되지 않는 파일 형식입니다. (${file.type || "알 수 없음"})` },
      { status: 400 }
    );
  }
  if (file.size > MAX_SIZE) {
    return Response.json(
      { error: `파일 크기가 너무 큽니다. 최대 ${MAX_SIZE / 1024 / 1024}MB까지 업로드할 수 있습니다.` },
      { status: 400 }
    );
  }

  try {
    const folder = IMAGE_TYPES.has(file.type) ? "images" : "attachments";
    const url = await uploadFileToStorage(file, folder);
    return Response.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "업로드에 실패했습니다.";
    return Response.json({ error: message }, { status: 500 });
  }
}
