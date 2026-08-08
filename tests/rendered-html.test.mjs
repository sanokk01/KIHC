import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import test, { after, before } from "node:test";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
const nextCli = fileURLToPath(new URL("../node_modules/next/dist/bin/next", import.meta.url));
const testPort = Number(process.env.KIHC_TEST_PORT ?? 31347);
const baseUrl = `http://127.0.0.1:${testPort}`;
let server;
let serverOutput = "";

before(async () => {
  server = spawn(process.execPath, [nextCli, "start", "-H", "127.0.0.1", "-p", String(testPort)], {
    cwd: projectRoot,
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  server.stdout.on("data", (chunk) => { serverOutput += chunk.toString(); });
  server.stderr.on("data", (chunk) => { serverOutput += chunk.toString(); });

  const deadline = Date.now() + 25_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) throw new Error(`Next.js test server exited early.\n${serverOutput}`);
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {
      // The production server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`Next.js test server did not become ready.\n${serverOutput}`);
}, { timeout: 30_000 });

after(async () => {
  if (!server || server.exitCode !== null) return;
  server.kill();
  await new Promise((resolve) => {
    const timer = setTimeout(resolve, 3_000);
    server.once("exit", () => { clearTimeout(timer); resolve(); });
  });
});

async function render(pathname = "/", authenticated = true) {
  return fetch(`${baseUrl}${pathname}`, {
    headers: {
      accept: authenticated ? "text/html" : "application/json",
      host: authenticated ? `localhost:${testPort}` : "kihc.example",
      ...(authenticated ? {} : { "x-forwarded-host": "kihc.example" }),
    },
  });
}

test("server-renders the KIHC home flow", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /KIHC 한국인재역량연구회/);
  assert.match(html, /사람의 가능성을 이해하고/);
  assert.match(html, /연구분야/);
  assert.match(html, /자기이해/);
  assert.match(html, /변화대응/);
  assert.match(html, /문제해결/);
  assert.match(html, /연구 정책자료/);
  assert.match(html, /주요 연구자료/);
  assert.match(html, /연구회 소식/);
  assert.match(html, /행사일정/);
  assert.match(html, /인재역량 연구를 위한 여름 세미나/);
  assert.match(html, /KIHC 소개/);
  assert.match(html, /문의/);
  assert.doesNotMatch(html, /\/admin(?:page1)?/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/);
});

test("filters and paginates the public news board", async () => {
  const [titleSearch, contentSearch, secondPage, emptySearch] = await Promise.all([
    render("/news?q=세미나&field=title"),
    render("/news?q=협력+가능성&field=content"),
    render("/news?page=2"),
    render("/news?q=존재하지않는검색어&field=all"),
  ]);
  const [titleHtml, contentHtml, secondPageHtml, emptyHtml] = await Promise.all([
    titleSearch.text(), contentSearch.text(), secondPage.text(), emptySearch.text(),
  ]);
  assert.match(titleHtml, /인재역량 연구를 위한 여름 세미나 개최/);
  assert.doesNotMatch(titleHtml, /2026년 한국인재역량연구회 연구 방향 안내/);
  assert.match(contentHtml, /인재역량 연구 네트워크 간담회/);
  assert.match(secondPageHtml, /한국인재역량연구회 홈페이지 개편 안내/);
  assert.doesNotMatch(secondPageHtml, /2026년 한국인재역량연구회 연구 방향 안내/);
  assert.match(emptyHtml, /검색 결과가 없습니다/);
});

test("renders public and admin route shells", async () => {
  const [aboutResponse, researchFocusResponse, englishResearchFocusResponse, adminResponse, oldAdminResponse] = await Promise.all([render("/about"), render("/research-focus"), render("/research-focus?lang=en"), render("/adminpage1"), render("/admin")]);
  assert.equal(aboutResponse.status, 200);
  assert.equal(researchFocusResponse.status, 200);
  assert.equal(englishResearchFocusResponse.status, 200);
  assert.equal(adminResponse.status, 200);
  assert.equal(oldAdminResponse.status, 404);

  const [aboutHtml, researchFocusHtml, englishResearchFocusHtml, adminHtml] = await Promise.all([aboutResponse.text(), researchFocusResponse.text(), englishResearchFocusResponse.text(), adminResponse.text()]);
  assert.match(aboutHtml, /이사장 소개/);
  assert.match(aboutHtml, /설립목적 · 비전/);
  assert.match(researchFocusHtml, /사람의 가능성을 이해하는 연구/);
  assert.match(researchFocusHtml, /연구를 이끄는 핵심 가치/);
  assert.match(englishResearchFocusHtml, /Researching the capabilities that help people grow/);
  assert.match(adminHtml, /KIHC Content Management/);
  assert.match(adminHtml, /현재 활성 팝업/);
  assert.doesNotMatch(adminHtml, /signin-with-chatgpt|signout-with-chatgpt/i);
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
  const [authorized, unauthorized, popupResponse] = await Promise.all([render("/api/admin/content/news"), render("/api/admin/content/news", false), render("/api/admin/content/popup")]);
  assert.equal(authorized.status, 200);
  assert.equal(unauthorized.status, 401);
  assert.equal(popupResponse.status, 200);
  assert.match(await authorized.text(), /2026년 한국인재역량연구회 연구 방향 안내/);
  const popupPayload = JSON.parse(await popupResponse.text());
  assert.equal(popupPayload.records[0].imageDisplay, "full");
});

test("returns a clear service-unavailable response while external storage is disconnected", async () => {
  const response = await fetch(`${baseUrl}/api/admin/content/news`, {
    method: "POST",
    headers: { "Content-Type": "application/json", host: `localhost:${testPort}` },
    body: JSON.stringify({ title: "저장 테스트" }),
  });
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

test("renders CI and partner preview archives without exposing protected details", async () => {
  const [ciResponse, materialsResponse, materialDetailResponse, eventsResponse, eventDetailResponse] = await Promise.all([
    render("/ci"),
    render("/promotional-materials"),
    render("/promotional-materials/kihc-introduction-brochure"),
    render("/events"),
    render("/events/human-capability-summer-seminar"),
  ]);
  [ciResponse, materialsResponse, materialDetailResponse, eventsResponse, eventDetailResponse].forEach((response) => assert.equal(response.status, 200));
  const [ciHtml, materialsHtml, materialDetailHtml, eventsHtml, eventDetailHtml] = await Promise.all([
    ciResponse.text(), materialsResponse.text(), materialDetailResponse.text(), eventsResponse.text(), eventDetailResponse.text(),
  ]);
  assert.match(ciHtml, /공식 CI 미리보기/);
  assert.match(materialsHtml, /KIHC 연구회 소개서/);
  assert.match(eventsHtml, /인재역량 연구를 위한 여름 세미나/);
  assert.match(materialDetailHtml, /협력 기업 전용 상세자료/);
  assert.match(eventDetailHtml, /협력 기업 전용 상세자료/);
  assert.doesNotMatch(materialDetailHtml, /KIHC 소개와 연구 방향/);
  assert.doesNotMatch(eventDetailHtml, /세미나 세부 프로그램/);
  assert.doesNotMatch(`${ciHtml}${materialDetailHtml}${eventDetailHtml}`, /\.pdf\b|다운로드/i);
});

test("public navigation contains no placeholder links and every linked page resolves", async () => {
  const sourcePaths = ["/", "/about", "/research-focus", "/ci", "/news", "/research", "/promotional-materials", "/events", "/contact"];
  const sourceResponses = await Promise.all(sourcePaths.map((pathname) => render(pathname)));
  const sourceHtml = await Promise.all(sourceResponses.map((response) => response.text()));
  const combinedHtml = sourceHtml.join("\n");

  assert.doesNotMatch(combinedHtml, /<a\b[^>]*href=["'](?:|#|javascript:[^"']*)["']/i);

  const linkedPaths = new Set();
  for (const html of sourceHtml) {
    for (const match of html.matchAll(/<a\b[^>]*href=["']([^"']+)["']/gi)) {
      const href = match[1];
      if (!href.startsWith("/") || href.startsWith("/_") || href.startsWith("/api/")) continue;
      const url = new URL(href, "http://localhost");
      linkedPaths.add(`${url.pathname}${url.search}`);
    }
  }

  const linkedResponses = await Promise.all([...linkedPaths].map(async (pathname) => [pathname, await render(pathname)]));
  for (const [pathname, response] of linkedResponses) {
    assert.notEqual(response.status, 404, `Public link must resolve: ${pathname}`);
  }
});
