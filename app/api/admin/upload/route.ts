import { getMediaBucket, insertMediaRow } from "../../../../db/content-store";
import { isAuthorizedAdminRequest, unauthorizedResponse } from "../../../lib/admin-auth";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const maxFileSize = 6 * 1024 * 1024;

export async function POST(request: Request) {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) return Response.json({ error: "이미지 파일을 선택하세요." }, { status: 400 });
    if (!allowedTypes.has(file.type)) return Response.json({ error: "JPG, PNG, WEBP, GIF 이미지만 업로드할 수 있습니다." }, { status: 400 });
    if (file.size > maxFileSize) return Response.json({ error: "이미지는 6MB 이하만 업로드할 수 있습니다." }, { status: 400 });

    const id = crypto.randomUUID();
    const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || file.type.split("/")[1] || "bin";
    const objectKey = `images/${id}.${extension}`;
    const bucket = await getMediaBucket();
    await bucket.put(objectKey, await file.arrayBuffer(), { httpMetadata: { contentType: file.type } });
    try {
      await insertMediaRow({ id, objectKey, filename: file.name, contentType: file.type, size: String(file.size) });
    } catch (error) {
      await bucket.delete(objectKey);
      throw error;
    }
    return Response.json({ id, url: `/api/media/${id}`, filename: file.name, contentType: file.type, size: file.size }, { status: 201 });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "이미지 업로드에 실패했습니다." }, { status: 500 });
  }
}
