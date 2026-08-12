-- KIHC Supabase 전체 초기화/보완 SQL
-- Supabase Dashboard > SQL Editor에 이 파일 전체를 붙여넣고 Run을 누르세요.
-- 반복 실행할 수 있으며 기존 콘텐츠 값은 보존하고 누락된 기본 필드만 보완합니다.
-- 관리자 계정만 지정된 단일 계정으로 갱신하고 기존 로그인 세션을 종료합니다.

BEGIN;

CREATE TABLE IF NOT EXISTS "content_records" (
  "id" text PRIMARY KEY NOT NULL,
  "section" text NOT NULL,
  "slug" text,
  "title" text NOT NULL,
  "status" text DEFAULT 'draft' NOT NULL,
  "published_at" text,
  "image_url" text,
  "payload" text DEFAULT '{}' NOT NULL,
  "created_at" text DEFAULT (CURRENT_TIMESTAMP::text) NOT NULL,
  "updated_at" text DEFAULT (CURRENT_TIMESTAMP::text) NOT NULL
);

CREATE TABLE IF NOT EXISTS "site_singletons" (
  "key" text PRIMARY KEY NOT NULL,
  "payload" text DEFAULT '{}' NOT NULL,
  "updated_at" text DEFAULT (CURRENT_TIMESTAMP::text) NOT NULL
);

-- 이미지 파일 자체가 아니라 Supabase Storage 객체의 메타데이터를 기록하는 테이블입니다.
-- 공개 화면에서 사용하는 이미지 주소는 content_records.image_url에 저장됩니다.
CREATE TABLE IF NOT EXISTS "media_assets" (
  "id" text PRIMARY KEY NOT NULL,
  "object_key" text NOT NULL,
  "filename" text NOT NULL,
  "content_type" text NOT NULL,
  "size" text NOT NULL,
  "created_at" text DEFAULT (CURRENT_TIMESTAMP::text) NOT NULL,
  CONSTRAINT "media_assets_object_key_unique" UNIQUE ("object_key")
);

CREATE INDEX IF NOT EXISTS "idx_content_section_status_date"
  ON "content_records" USING btree ("section", "status", "published_at");

CREATE UNIQUE INDEX IF NOT EXISTS "idx_content_section_slug"
  ON "content_records" USING btree ("section", "slug");

CREATE TABLE IF NOT EXISTS "admin_accounts" (
  "id" text PRIMARY KEY NOT NULL,
  "login_id" text NOT NULL,
  "display_name" text NOT NULL,
  "password_hash" text NOT NULL,
  "created_at" text DEFAULT (CURRENT_TIMESTAMP::text) NOT NULL,
  "updated_at" text DEFAULT (CURRENT_TIMESTAMP::text) NOT NULL
);

-- 이전 작업에서 email 칼럼으로 관리자 테이블을 만든 경우 login_id로 안전하게 변경합니다.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'admin_accounts' AND column_name = 'email'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'admin_accounts' AND column_name = 'login_id'
  ) THEN
    ALTER TABLE "admin_accounts" RENAME COLUMN "email" TO "login_id";
  END IF;
END
$$;

CREATE TABLE IF NOT EXISTS "admin_sessions" (
  "token_hash" text PRIMARY KEY NOT NULL,
  "account_id" text NOT NULL REFERENCES "admin_accounts"("id") ON DELETE CASCADE,
  "expires_at" text NOT NULL,
  "created_at" text DEFAULT (CURRENT_TIMESTAMP::text) NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_admin_sessions_expires_at"
  ON "admin_sessions" ("expires_at");

-- 지정 계정 외 기존 세션과 계정을 제거합니다.
DELETE FROM "admin_sessions";
DELETE FROM "admin_accounts" WHERE "id" <> 'primary';

CREATE UNIQUE INDEX IF NOT EXISTS "idx_admin_accounts_login_id"
  ON "admin_accounts" ("login_id");

-- 비밀번호 원문은 저장하지 않고 scrypt 해시만 저장합니다.
INSERT INTO "admin_accounts" ("id", "login_id", "display_name", "password_hash")
VALUES (
  'primary',
  'oneteam1',
  'KIHC 관리자',
  'scrypt$6k5zw-38eAtdyIlZ1QL2nw$THzzPDsxXlGygpghRgbc_D9GNw2yJ35-XmSR93KgBnrx8shH7m26NurYKa8S4q8C95AGa9NgFUt0BHuxw-ck7w'
)
ON CONFLICT ("id") DO UPDATE SET
  "login_id" = EXCLUDED."login_id",
  "display_name" = EXCLUDED."display_name",
  "password_hash" = EXCLUDED."password_hash",
  "updated_at" = CURRENT_TIMESTAMP::text;

-- DB 차원에서도 관리자 행과 로그인 아이디를 한 가지 값으로 제한합니다.
ALTER TABLE "admin_accounts" DROP CONSTRAINT IF EXISTS "admin_accounts_singleton_check";
ALTER TABLE "admin_accounts" DROP CONSTRAINT IF EXISTS "admin_accounts_login_id_check";
ALTER TABLE "admin_accounts"
  ADD CONSTRAINT "admin_accounts_singleton_check" CHECK ("id" = 'primary'),
  ADD CONSTRAINT "admin_accounts_login_id_check" CHECK ("login_id" = 'oneteam1');

-- 연구회 소식 초기 데이터
INSERT INTO "content_records" ("id", "section", "slug", "title", "status", "published_at", "image_url", "payload") VALUES
(
  'news-5', 'news', '2026-research-direction', '2026년 한국인재역량연구회 연구 방향 안내', 'published', '2026. 07. 28', NULL,
  jsonb_build_object('excerpt', 'KIHC가 올해 집중해 살펴볼 연구 의제를 안내합니다.', 'content', jsonb_build_array('한국인재역량연구회는 2026년에도 사람의 내면 역량과 지속 가능한 성장의 조건을 중심으로 연구를 이어갑니다.', '구체적인 연구 일정과 공개 자료는 준비되는 대로 홈페이지를 통해 안내하겠습니다.'), 'category1', '공지사항', 'views', 0)::text
),
(
  'news-4', 'news', 'summer-seminar', '인재역량 연구를 위한 여름 세미나 개최', 'published', '2026. 07. 12', NULL,
  jsonb_build_object('excerpt', '연구회원이 함께하는 여름 세미나 소식입니다.', 'content', jsonb_build_array('인재역량의 개념과 현장 적용을 함께 논의하는 세미나를 진행했습니다.'), 'category1', '행사일정', 'category2', '학회', 'heldAt', '2026. 07. 12', 'views', 0)::text
),
(
  'news-3', 'news', 'policy-report-series', 'KIHC 연구정책자료 발간 시리즈 안내', 'published', '2026. 06. 24', NULL,
  jsonb_build_object('excerpt', '새로운 연구정책자료 시리즈를 소개합니다.', 'content', jsonb_build_array('주요 연구 결과를 이해하기 쉬운 형태로 정리한 자료를 순차적으로 소개합니다.'), 'category1', '뉴스레터', 'views', 0)::text
),
(
  'news-2', 'news', 'research-network', '인재역량 연구 네트워크 간담회', 'published', '2026. 05. 30', NULL,
  jsonb_build_object('excerpt', '연구 협력의 방향을 나누었습니다.', 'content', jsonb_build_array('다양한 연구 현장의 목소리를 듣고 협력 가능성을 논의했습니다.'), 'category1', '행사일정', 'category2', '기타', 'heldAt', '2026. 05. 30', 'views', 0)::text
),
(
  'news-1', 'news', 'website-renewal', '한국인재역량연구회 홈페이지 개편 안내', 'published', '2026. 05. 08', NULL,
  jsonb_build_object('excerpt', 'KIHC 홈페이지가 새로운 모습으로 준비되고 있습니다.', 'content', jsonb_build_array('연구회의 방향과 자료를 더 편리하게 살펴볼 수 있도록 홈페이지를 개편하고 있습니다.'), 'category1', '공지사항', 'views', 0)::text
)
ON CONFLICT ("id") DO UPDATE SET
  "payload" = (EXCLUDED."payload"::jsonb || "content_records"."payload"::jsonb)::text;

-- 연구자료 초기 데이터: image_url에 이미지 주소가 저장되며 목록·상세·메인 카드에서 사용됩니다.
INSERT INTO "content_records" ("id", "section", "slug", "title", "status", "published_at", "image_url", "payload") VALUES
(
  'research-3', 'research', 'metacognition-and-growth', '성장을 이끄는 메타인지의 역할과 교육적 시사점', 'published', '2026. 07. 18', NULL,
  jsonb_build_object('author', '한국인재역량연구회 연구팀', 'tableOfContents', jsonb_build_array('메타인지의 개념', '성장 과정에서의 역할', '교육 현장을 위한 제안'), 'summary', '스스로의 생각을 점검하고 조절하는 메타인지가 개인의 성장과 학습에 미치는 영향을 살펴봅니다.', 'keywords', jsonb_build_array('메타인지', '자기조절', '성장'), 'researchType', '협동연구보고서', 'category1', '대분류', 'category2', '중분류', 'views', 350)::text
),
(
  'research-2', 'research', 'resilience-framework', '변화의 시대, 회복탄력성을 바라보는 새로운 관점', 'published', '2026. 06. 10', NULL,
  jsonb_build_object('author', 'KIHC 역량연구분과', 'tableOfContents', jsonb_build_array('변화와 적응', '회복탄력성의 구성 요소', '연구 과제'), 'summary', '회복탄력성을 단순한 인내가 아닌 변화에 대응하고 다시 방향을 세우는 역량으로 해석합니다.', 'keywords', jsonb_build_array('회복탄력성', '변화', '적응'), 'researchType', '기타연구보고서', 'category1', '대분류', 'category2', '중분류', 'views', 120)::text
),
(
  'research-1', 'research', 'value-judgement', '가치판단 역량의 개념과 사회적 의미', 'published', '2026. 05. 16', NULL,
  jsonb_build_object('author', '한국인재역량연구회', 'tableOfContents', jsonb_build_array('가치판단이란', '의사결정과 공동체', '후속 연구 방향'), 'summary', '복잡한 상황에서 기준을 세우고 책임 있게 선택하는 가치판단 역량의 의미를 정리합니다.', 'keywords', jsonb_build_array('가치판단', '의사결정', '공동체'), 'researchType', '협동연구보고서', 'category1', '대분류', 'category2', '중분류', 'views', 550)::text
)
ON CONFLICT ("id") DO UPDATE SET
  "payload" = (EXCLUDED."payload"::jsonb || "content_records"."payload"::jsonb)::text;

-- 홍보물 초기 데이터
INSERT INTO "content_records" ("id", "section", "slug", "title", "status", "published_at", "image_url", "payload") VALUES
(
  'promotion-3', 'promotions', 'kihc-introduction-brochure', 'KIHC 연구회 소개서', 'published', '2026. 08. 08', NULL,
  jsonb_build_object('category1', '기관 소개', 'thumbnailLabel', 'KIHC INTRODUCTION', 'protectedDetails', jsonb_build_array('KIHC 소개와 연구 방향', '주요 연구분야 안내', '협력 및 자료 이용 안내'))::text
),
(
  'promotion-2', 'promotions', 'human-capability-research-leaflet', '인재역량 연구분야 안내 리플릿', 'published', '2026. 07. 18', NULL,
  jsonb_build_object('category1', '연구 안내', 'thumbnailLabel', 'RESEARCH FOCUS', 'protectedDetails', jsonb_build_array('자아확립 연구 개요', '메타인지·회복탄력성 연구 개요', '가치판단·창의적 사고 연구 개요'))::text
),
(
  'promotion-1', 'promotions', 'research-policy-publication-guide', '연구정책자료 발간 안내', 'published', '2026. 06. 24', NULL,
  jsonb_build_object('category1', '발간 안내', 'thumbnailLabel', 'PUBLICATION GUIDE', 'protectedDetails', jsonb_build_array('연구정책자료 구성', '자료 열람과 이용 범위', '협력 기관 문의 절차'))::text
)
ON CONFLICT ("id") DO UPDATE SET
  "payload" = (EXCLUDED."payload"::jsonb || "content_records"."payload"::jsonb)::text;

-- 팝업 초기 데이터
INSERT INTO "content_records" ("id", "section", "slug", "title", "status", "published_at", "image_url", "payload") VALUES
(
  'popup-site-renewal-v2', 'popup', NULL, 'KIHC 홈페이지를 새롭게 준비하고 있습니다', 'published', NULL, NULL,
  jsonb_build_object('content', '연구회의 방향과 주요 자료를 더 편리하게 만나실 수 있도록 홈페이지를 개편 중입니다.', 'link', '/news/website-renewal', 'imageDisplay', 'full')::text
)
ON CONFLICT ("id") DO UPDATE SET
  "payload" = (EXCLUDED."payload"::jsonb || "content_records"."payload"::jsonb)::text;

INSERT INTO "site_singletons" ("key", "payload") VALUES
(
  'settings',
  jsonb_build_object('id', 'settings', 'title', '사이트 설정', 'siteName', '사단법인 한국인재역량연구회', 'footerInformation', '대표자 이수진', 'email', 'annjae52@gmail.com', 'searchKeywords', '메타인지,회복탄력성,가치판단,인재역량,교육')::text
),
(
  'about',
  jsonb_build_object('id', 'about', 'title', 'KIHC 소개', 'chairmanMessage', '한국인재역량연구회는 사람이 자신의 가능성을 발견하고, 변화 속에서도 주체적으로 성장하는 데 필요한 역량을 연구합니다.', 'organizationIntroduction', 'KIHC는 인간의 내면 역량과 성장 조건을 탐구하는 연구 공동체입니다.', 'purpose', '사람의 가능성을 발견하고 키우는 핵심 역량을 체계적으로 연구합니다.', 'vision', '사람을 이해하는 연구가 더 나은 배움과 사회로 이어지는 지식 공동체')::text
)
ON CONFLICT ("key") DO UPDATE SET
  "payload" = (EXCLUDED."payload"::jsonb || "site_singletons"."payload"::jsonb)::text;

-- 브라우저용 Supabase Data API 역할에서는 직접 접근할 수 없게 하고,
-- Netlify 서버의 PostgreSQL 연결을 통해서만 읽고 쓰도록 보호합니다.
ALTER TABLE "content_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "site_singletons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "media_assets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_sessions" ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE "content_records" FROM anon, authenticated;
REVOKE ALL ON TABLE "site_singletons" FROM anon, authenticated;
REVOKE ALL ON TABLE "media_assets" FROM anon, authenticated;
REVOKE ALL ON TABLE "admin_accounts" FROM anon, authenticated;
REVOKE ALL ON TABLE "admin_sessions" FROM anon, authenticated;

COMMIT;

-- 실행 결과 확인: 비밀번호 원문이나 해시 값 자체는 출력하지 않습니다.
SELECT
  "id",
  "login_id",
  "display_name",
  CASE
    WHEN "password_hash" LIKE 'scrypt$%' THEN 'scrypt hash stored'
    ELSE 'check required'
  END AS "password_storage"
FROM "admin_accounts";

SELECT
  "section",
  count(*) AS "record_count",
  count("image_url") AS "records_with_image"
FROM "content_records"
GROUP BY "section"
ORDER BY "section";
