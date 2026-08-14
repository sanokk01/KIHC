/**
 * Supabase Storage REST API 직접 호출 (SDK 불필요)
 * 환경변수:
 *   SUPABASE_URL              : https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY : service_role 키 (Settings > API)
 */

const BUCKET = "kihc-media";

function getStorageConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY 환경 변수가 설정되지 않았습니다.\n" +
      "Netlify > Site Settings > Environment Variables 에서 추가하세요."
    );
  }
  return { url: url.replace(/\/$/, ""), key };
}

/**
 * 파일을 Supabase Storage에 업로드하고 공개 URL을 반환합니다.
 */
export async function uploadFileToStorage(
  file: File,
  folder: "images" | "attachments" = "images"
): Promise<string> {
  const { url, key } = getStorageConfig();
  const ext = file.name.split(".").pop() ?? "bin";
  const objectPath = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const arrayBuffer = await file.arrayBuffer();

  const uploadUrl = `${url}/storage/v1/object/${BUCKET}/${objectPath}`;
  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${key}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body: arrayBuffer,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Storage 업로드 실패 (${res.status}): ${err}`);
  }

  // 공개 URL: /storage/v1/object/public/{bucket}/{path}
  return `${url}/storage/v1/object/public/${BUCKET}/${objectPath}`;
}

export { BUCKET };
