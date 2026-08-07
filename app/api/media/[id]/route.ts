import { getMediaBucket, getMediaRow } from "../../../../db/content-store";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const media = await getMediaRow(id);
    if (!media) return new Response("Not found", { status: 404 });
    const bucket = await getMediaBucket();
    const object = await bucket.get(media.objectKey);
    if (!object) return new Response("Not found", { status: 404 });
    return new Response(object.body, {
      headers: {
        "Content-Type": object.httpMetadata?.contentType || media.contentType,
        "Content-Length": String(object.size),
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(media.filename)}`,
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
