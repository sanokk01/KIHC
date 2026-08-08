import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/", authenticated = true) {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://${authenticated ? "localhost" : "kihc.example"}${pathname}`, { headers: authenticated ? { accept: "text/html", "oai-authenticated-user-id": "test-user", "oai-authenticated-user-email": "admin@kihc.test" } : { accept: "application/json" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the KIHC home flow", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /KIHC 한국인재역량연구회/);
  assert.match(html, /사람의 가능성을 이해하고/);
  assert.match(html, /연구분야/);
  assert.match(html, /최신 연구정책자료/);
  assert.match(html, /연구회 소식/);
  assert.doesNotMatch(html, /\/admin(?:page1)?/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("renders public and admin route shells", async () => {
  const [aboutResponse, adminResponse, oldAdminResponse] = await Promise.all([render("/about"), render("/adminpage1"), render("/admin")]);
  assert.equal(aboutResponse.status, 200);
  assert.equal(adminResponse.status, 200);
  assert.equal(oldAdminResponse.status, 404);

  const [aboutHtml, adminHtml] = await Promise.all([aboutResponse.text(), adminResponse.text()]);
  assert.match(aboutHtml, /이사장 소개/);
  assert.match(aboutHtml, /설립목적 · 비전/);
  assert.match(adminHtml, /KIHC Content Management/);
  assert.match(adminHtml, /현재 활성 팝업/);
});

test("renders functional admin content managers", async () => {
  const responses = await Promise.all(["news", "research", "popup", "about", "settings"].map((section) => render(`/adminpage1/${section}`)));
  responses.forEach((response) => assert.equal(response.status, 200));
  const html = await responses[0].text();
  assert.match(html, /외부 DB 연결 대기/);
  assert.match(html, /새 콘텐츠/);
  assert.doesNotMatch(html, /PDF 다운로드|PDF viewer/i);
});

test("protects admin write APIs while allowing authenticated reads", async () => {
  const [authorized, unauthorized] = await Promise.all([render("/api/admin/content/news"), render("/api/admin/content/news", false)]);
  assert.equal(authorized.status, 200);
  assert.equal(unauthorized.status, 401);
  assert.match(await authorized.text(), /2026년 한국인재역량연구회 연구 방향 안내/);
});

test("returns a clear service-unavailable response while external storage is disconnected", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-storage-write`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("http://localhost/api/admin/content/news", {
      method: "POST",
      headers: { "Content-Type": "application/json", "oai-authenticated-user-id": "test-user" },
      body: JSON.stringify({ title: "저장 테스트" }),
    }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 503);
  assert.match(await response.text(), /외부 데이터베이스 연결 대기/);
});

test("does not expose PDF routes or links", async () => {
  const response = await render("/research/metacognition-and-growth");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /원문 열람 문의/);
  assert.doesNotMatch(html, /\.pdf\b|PDF 다운로드|PDF viewer/i);
});
