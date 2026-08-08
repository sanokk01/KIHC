# KIHC 홈페이지

한국인재역량연구회 홈페이지의 로컬 개발용 소스입니다. 현재는 외부 DB와 운영 관리자 인증을 연결하지 않은 상태이며, 공개 화면은 기본 콘텐츠로 동작합니다.

## 로컬 실행

필요 환경:

- Node.js 22.13 이상
- npm

```bash
npm install
npm run dev
```

브라우저에서 다음 주소를 엽니다.

- 홈페이지: `http://localhost:3000`
- 관리자: `http://localhost:3000/adminpage1`

localhost에서는 개발 편의를 위해 로컬 관리자 계정으로 자동 접속합니다. 외부 주소에서는 관리자 인증이 연결되기 전까지 접근할 수 없습니다.

## 검사

```bash
npm run lint
npm run build
node --test tests/rendered-html.test.mjs
```

## 도메인 연결 준비

`.env.example`을 복사해 `.env.local`을 만들고 로컬 주소를 사용합니다.

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

도메인을 구매하고 운영 배포 환경이 결정되면 `NEXT_PUBLIC_SITE_URL`만 실제 도메인으로 변경합니다. 내부 링크와 관리자 경로는 상대 경로이므로 도메인 변경을 위해 소스 URL을 다시 수정할 필요가 없습니다.

## 외부 DB 인수인계

- 저장소 계약: `db/content-store.ts`
- 공개 데이터 접근: `app/lib/content.ts`
- 관리자 데이터 접근: `app/lib/admin-data.ts`
- 저장소 연결 상태: `app/lib/storage-status.ts`
- 관리자 API: `app/api/admin/**`

DB 접속 정보와 비밀값은 Git에 커밋하지 않습니다. 실제 DB와 파일 저장소가 연결되면 `databaseConnected`를 활성화하고 관리자 쓰기 API 테스트를 갱신합니다.

자세한 현재 상태와 작업 기록은 `00_readFrist.md`를 먼저 확인하세요.
