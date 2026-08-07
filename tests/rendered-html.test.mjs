import assert from "node:assert/strict";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
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
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("renders public and admin route shells", async () => {
  const [aboutResponse, adminResponse] = await Promise.all([render("/about"), render("/admin")]);
  assert.equal(aboutResponse.status, 200);
  assert.equal(adminResponse.status, 200);

  const [aboutHtml, adminHtml] = await Promise.all([aboutResponse.text(), adminResponse.text()]);
  assert.match(aboutHtml, /이사장 소개/);
  assert.match(aboutHtml, /설립목적 · 비전/);
  assert.match(adminHtml, /KIHC Content Management/);
  assert.match(adminHtml, /현재 활성 팝업/);
});

test("does not expose PDF routes or links", async () => {
  const response = await render("/research/metacognition-and-growth");
  const html = await response.text();
  assert.equal(response.status, 200);
  assert.match(html, /원문 열람 문의/);
  assert.doesNotMatch(html, /\.pdf\b|PDF 다운로드|PDF viewer/i);
});
