-- Existing Supabase projects can run this file safely in SQL Editor.
-- The application connects with the server-side postgres role, while RLS
-- prevents the browser-facing Data API roles from reading these tables.

CREATE TABLE IF NOT EXISTS "admin_accounts" (
  "id" text PRIMARY KEY NOT NULL,
  "login_id" text NOT NULL UNIQUE,
  "display_name" text NOT NULL,
  "password_hash" text NOT NULL,
  "created_at" text DEFAULT (CURRENT_TIMESTAMP::text) NOT NULL,
  "updated_at" text DEFAULT (CURRENT_TIMESTAMP::text) NOT NULL,
  CONSTRAINT "admin_accounts_singleton_check" CHECK ("id" = 'primary'),
  CONSTRAINT "admin_accounts_login_id_check" CHECK ("login_id" = 'oneteam1')
);

CREATE TABLE IF NOT EXISTS "admin_sessions" (
  "token_hash" text PRIMARY KEY NOT NULL,
  "account_id" text NOT NULL REFERENCES "admin_accounts"("id") ON DELETE CASCADE,
  "expires_at" text NOT NULL,
  "created_at" text DEFAULT (CURRENT_TIMESTAMP::text) NOT NULL
);

CREATE INDEX IF NOT EXISTS "idx_admin_sessions_expires_at"
  ON "admin_sessions" ("expires_at");

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

DELETE FROM "admin_sessions";

ALTER TABLE "content_records" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "site_singletons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "media_assets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_accounts" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "admin_sessions" ENABLE ROW LEVEL SECURITY;
