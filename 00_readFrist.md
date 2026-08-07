# KIHC 작업 전 필독 및 진행 기록

> 파일명은 최초 요청에 맞춰 `00_readFrist.md`로 유지한다. 이후 작업자는 구현 전에 이 문서를 먼저 읽고, 작업 완료 후 아래 진행 기록과 검증 상태를 갱신한다.

## 1. 프로젝트 원칙

- 현재 프로젝트 위에서 필요한 부분만 수정한다.
- 이미 정상 동작하는 화면을 이유 없이 다시 만들거나 전체 리팩터링하지 않는다.
- 사용자 지시 범위 밖의 페이지·기능·라이브러리를 임의로 추가하지 않는다.
- 실제로 연결되지 않은 인증, DB 저장, 이메일 전송을 동작하는 것처럼 표시하지 않는다.
- 공개 화면에 연구자료 PDF 경로, 뷰어, 다운로드 기능을 만들지 않는다.
- Public과 Admin은 `app/lib/content.ts`의 동일한 도메인·데이터 접근 경계를 사용한다.

## 2. 현재 구현 상태

### Public

- `/` 홈: Hero, 연구분야, 최신 연구정책자료, 연구회 소식, 공지 팝업
- `/about`: 이사장 소개, 연구회 소개, 설립목적·비전, 조직도 앵커 구성
- `/news`, `/news/[slug]`: 게시판 목록과 상세 화면
- `/research`, `/research/[slug]`: 연구자료 목록과 상세, 원문 열람 문의 모달
- `/contact`: 필수값 검증과 준비 중 안내가 있는 문의 폼
- 공통 Header, desktop dropdown, mobile menu, Footer

### Admin

- 관리자 접속 주소: `https://kihc-research.gangstar1273.chatgpt.site/adminpage1`
- `/adminpage1/login`: ChatGPT 계정 로그인 안내 화면
- `/adminpage1`: D1 콘텐츠 현황 대시보드
- `/adminpage1/news`, `/adminpage1/research`, `/adminpage1/popup`: D1 기반 검색·등록·수정·삭제 및 R2 이미지 업로드
- `/adminpage1/about`, `/adminpage1/settings`: D1 기반 소개·사이트 정보 수정 및 이사장·조직도 이미지 업로드
- 공개 Header/Footer에는 관리자 링크를 노출하지 않으며 기존 `/admin` 경로는 제거함
- 저장 결과는 공동 관리자에게 공유되고 공개 홈페이지에 바로 반영됨
- 공개 홈페이지는 GPT 로그인 없이 접속 가능하며, 관리자 쓰기는 ChatGPT 로그인 사용자에게만 허용됨. 특정 개인 계정 ID를 소스에 고정하지 않음

### Git 공동 작업

- GitHub: `https://github.com/sanokk01/KIHC`
- 같은 저장소를 clone/pull한 팀원은 일반 Git 방식으로 모든 소스 파일을 수정·커밋·push할 수 있음
- 소스 수정과 GitHub/Netlify 배포에는 프로젝트 소유자의 GPT 계정 로그인이 필요하지 않음. 각 팀원은 본인의 GitHub 및 배포 서비스 계정을 사용한다.
- 시작 전 `00_readFrist.md`, `git status`, 최근 commit을 확인하고 완료 후 이 문서를 갱신할 것
- 개인 계정 ID, DB ID, R2 bucket ID, 인증 토큰은 소스에 직접 기록하지 않음. `.openai/hosting.json`에는 논리 binding 이름만 유지
- 현재 로컬 최신 기능 commit `7145cba`는 이 PC의 GitHub 인증 부재로 `origin/main`에 push되지 않음. GitHub 권한이 있는 작업자가 `git push origin main`을 실행해야 다른 팀원이 받을 수 있다.

### 배포 플랫폼 호환성

- ChatGPT Sites/Cloudflare 배포: 현재 구조 그대로 D1 `DB`, R2 `MEDIA`, ChatGPT 로그인 기반 관리자 기능을 모두 사용한다.
- Netlify 배포: 현재 저장소를 그대로 연결하면 전체 기능이 동작한다고 보장할 수 없다. 이 프로젝트는 표준 Next.js 서버가 아니라 vinext + Cloudflare Worker 구조이고, 관리자 데이터/이미지가 Cloudflare D1·R2 binding에 의존한다.
- 따라서 Netlify에서 공개 화면뿐 아니라 관리자 CRUD·이미지·팝업까지 운영하려면 표준 Next.js/OpenNext 호환 구조로 전환하고 DB, 파일 저장소, 관리자 인증을 Netlify 호환 서비스로 교체하는 별도 작업이 필요하다.
- Netlify 링크를 만드는 행위 자체에는 GPT 로그인이 필요 없지만, 위 이식 작업 전에는 해당 링크를 KIHC 완전판 배포로 간주하지 않는다.

### 공통 구조

- Public 콘텐츠 Repository와 기본 fallback 데이터: `app/lib/content.ts`
- 관리자 공통 타입·변환: `app/lib/admin-types.ts`, `app/lib/admin-data.ts`
- DB/R2 접근 경계: `db/content-store.ts`
- D1 Drizzle 스키마: `db/schema.ts`, migration: `drizzle/0000_skinny_viper.sql`
- 관리자 API: `app/api/admin/**`, 공개 이미지 route: `app/api/media/[id]`
- 논리 binding: D1 `DB`, R2 `MEDIA` (`.openai/hosting.json`)
- 공식 로고 원본: `public/kihc-logo.png`
- 가로형 투명 로고: `public/kihc-logo-horizontal.png`
- 공유 이미지: `public/og.png`
- 배포 주소: `https://kihc-research.gangstar1273.chatgpt.site`
- 배포 접근 모드: `public` — 일반 방문자는 GPT 로그인 없이 공개 페이지 열람 가능, `/adminpage1`은 로그인 필요

## 3. 아직 미구현 또는 후속 작업인 부분

- 문의 이메일/API 전송
- 검색 결과 필터링과 실제 pagination
- 관리자 역할 구분(소유자/편집자/열람자)과 초대 관리 UI
- 사용하지 않는 R2 이미지 정리 기능
- 확정 기관 정보, 대표 연락처, 개인정보처리방침 및 저작권 전문
- 실제 운영용 이사장 사진, 조직도 이미지, 연구자료 썸네일 데이터 입력

## 4. DB/API 및 권한 연결 지점

- DB: 공개 읽기는 `app/lib/content.ts`, 관리자 쓰기는 `app/lib/admin-data.ts`가 `db/content-store.ts`를 통해 D1에 접근한다.
- 이미지: `POST /api/admin/upload`가 R2 `MEDIA`에 파일을 저장하고 D1 `media_assets`에 메타데이터를 기록한다. 공개 URL은 `/api/media/[id]`이다.
- 인증: `app/lib/admin-auth.ts`가 관리자 page/API를 보호한다. 배포 환경에서는 ChatGPT 인증 header가 필요하고 localhost는 개발 편의를 위해 허용한다.
- 협업: 소스 수정 권한은 GitHub 저장소 권한으로 관리하고, 배포 관리자 접근 권한은 Sites 공유 설정으로 관리한다.
- 문의: `app/components/ContactForm.tsx`의 submit 경계에 문의 API를 연결한다.
- DB가 없는 Node test 환경에서는 `app/lib/content.ts`의 기본 데이터로 fallback한다. 배포 환경의 D1이 authoritative source이다.

## 5. 검증 기준

매 작업 후 관련 항목을 확인하고, 영향 범위에 따라 전체 검증을 실행한다.

- 주요 route가 정상 렌더링되는가
- Desktop dropdown과 mobile menu가 동작하는가
- 소개 anchor와 modal이 동작하는가
- 모바일에서 Public 화면에 가로 overflow가 없는가
- 필수 폼 validation이 유지되는가
- 공개 경로에 PDF URL 또는 다운로드가 생기지 않았는가
- TypeScript, ESLint, production build, 테스트가 통과하는가
- 배포 화면에서 새 console error가 발생하지 않는가

## 6. 이후 작업 순서

1. 이 문서와 `git status`를 먼저 확인한다.
2. 요청과 직접 관련된 기존 page/component/data 경계를 확인한다.
3. 정상 구현은 유지하고 필요한 범위만 수정한다.
4. 관련 동작을 브라우저에서 확인한다.
5. TypeScript, ESLint, build, 테스트를 실행한다.
6. 이 문서의 현재 상태, Mock 범위, 검증 결과, 진행 기록을 갱신한다.
7. 검증된 버전만 배포한다.

## 7. 다른 AI 에이전트 인수인계 절차

1. `C:\GitHub_clone\KIHC\00_readFrist.md` 전체를 먼저 읽는다.
2. `git status --short`, `git log -5 --oneline`, `.openai/hosting.json`을 확인한다.
3. DB 스키마 변경 시 `db/schema.ts` 수정 후 `drizzle-kit generate`를 실행하고 생성 SQL을 검토한다.
4. 콘텐츠 도메인 필드는 `app/lib/content.ts`, 관리자 입력 타입은 `app/lib/admin-types.ts`, DB 변환은 `app/lib/admin-data.ts`를 함께 맞춘다.
5. 이미지 파일 자체를 D1에 넣지 말고 R2 `MEDIA`에 저장한다.
6. 관리자 API는 `app/lib/admin-auth.ts`의 권한 검사를 반드시 유지한다.
7. TypeScript, ESLint, production build, `tests/rendered-html.test.mjs`를 통과시킨다.
8. 완료 후 진행 기록, 남은 작업, 검증 결과를 이 문서에 추가한다.

## 8. 진행 기록

### 2026-08-08 — 홈페이지 1차 골격

- Public 및 Admin 주요 route와 반응형 레이아웃 구현
- 공통 임시 Repository와 도메인 타입 구성
- 공지 팝업, 소개 앵커, 원문 문의 모달, 문의 validation 구현
- TypeScript, ESLint, production build 및 렌더링 테스트 통과

### 2026-08-08 — 배포본 버그 점검

- Desktop 주요 route 10개 렌더링 및 가로 overflow 없음 확인
- Mobile Public 주요 화면의 가로 overflow 없음 확인
- 소개 앵커, 원문 문의 모달, 문의 필수값 validation 확인
- 배포 환경에서 Next Link 사전 로딩 오류 발견
- mobile menu는 공지 modal이 열린 동안 배경 interaction이 차단되어 미동작처럼 보였으며, 팝업 닫기 후 정상 동작 확인
- 자동 prefetch 비활성화만으로는 오류가 완전히 해소되지 않음을 재확인
- 원인을 배포 런타임의 `next/link` 호환 문제로 좁히고 표준 anchor 기반 `AppLink`로 교체
- 새 배포본에서 console error 0건, mobile menu 열기와 소개 페이지 이동 확인
- 공지 팝업의 `오늘 하루 보지 않음` 선택 후 새로고침 시 재노출되지 않음 확인
- TypeScript, ESLint, production build, 렌더링 테스트 3건 모두 통과
- 수정 후 검증 및 재배포 상태: 완료

### 2026-08-08 — 공식 로고 적용

- 사용자 제공 `logo.PNG`를 원본 그대로 `public/kihc-logo.png`에 추가
- 공통 `Logo` 컴포넌트를 제공된 공식 로고로 교체
- 원본의 넓은 투명 여백은 파일을 변형하지 않고 CSS 표시 영역에서 조정
- Header, Footer, Admin 및 mobile 표시와 가로 overflow 없음 확인
- TypeScript, ESLint, production build, 렌더링 테스트 3건 통과
- 새 배포본에서 공식 로고 asset 로드, 가로 overflow 없음, console error 0건 확인
- 검증 및 재배포 상태: 완료

### 2026-08-08 — 가로형 로고 및 관리자 기능 확장

- 공식 심벌을 왼쪽, KIHC 및 한국인재역량연구회 글자를 오른쪽에 배치한 가로형 투명 로고 제작
- 공통 Header, Footer, 관리자 화면의 로고를 가로형 자산으로 교체
- 공개 Footer에서 관리자 링크 제거, 관리자 전용 경로를 `/adminpage1`로 변경하고 기존 `/admin` route 제거
- 연구회 소식·연구정책자료·팝업 관리 화면에 검색, 등록, 수정, 삭제 및 상태 관리 구현
- KIHC 소개·사이트 설정 화면에 편집 및 저장 폼 구현
- 실제 DB 연결 전 검증을 위해 브라우저 `localStorage`에만 저장하며, 공개 사이트 미반영 안내를 화면에 명시
- `read_first_me_plz.txt` 요구사항을 재검토하고 PDF 기능 제외, 공통 Repository 경계, Mock 범위 표시 원칙 유지
- TypeScript, ESLint, production build 및 렌더링 테스트 4건 통과
- 로컬 브라우저에서 공개 관리자 링크 0개, 기존 `/admin` 404, `/adminpage1`과 하위 관리 화면 렌더링 확인
- 뉴스 등록·수정·새로고침 유지·삭제, 사이트 설정 저장·새로고침 유지 확인
- 관리자 전체 화면 가로 overflow 0, console error 0건 확인
- 배포 주소에서 가로형 로고 로드, 공개 관리자 링크 0개, `/adminpage1` 진입, 가로 overflow 0, console error 0건 재확인
- 검증 및 배포 상태: 완료

### 2026-08-08 — 관리자 D1/R2 영구 저장 연결

- `.openai/hosting.json`에 D1 `DB`, R2 `MEDIA` 논리 binding 추가
- 콘텐츠, 단일 설정, 미디어 메타데이터 Drizzle 스키마와 최초 migration 생성
- 뉴스·연구자료·팝업 CRUD를 D1 API에 연결하고 기존 localStorage 저장 제거
- 뉴스·연구자료·팝업·이사장·조직도 이미지 업로드를 R2에 연결
- 관리자 저장 결과를 공개 홈·목록·상세·소개·Footer·팝업에서 비동기 조회하도록 연결
- 관리자 page와 쓰기 API에 ChatGPT 사용자 인증 적용. 특정 개인 계정으로 제한하지 않아 초대된 공동 사용자가 각자 로그인해 작업 가능
- Git 저장소를 공유받은 팀원이 동일 파일로 이어서 개발할 수 있도록 구조·작업 순서·주의사항 문서화
- TypeScript, production build 및 렌더링/API 테스트 5건 통과
- Sites 배포 관리자 화면에서 D1 임시 소식 등록 → 공개 `/news` 즉시 반영 → 관리자 삭제까지 실데이터 검증 완료
- R2 업로드 API·관리자 파일 선택 UI·공개 이미지 route는 typecheck/build/test를 통과했으나, 브라우저 자동화 환경의 로컬 파일 선택 제한으로 운영 R2 실파일 업로드는 수동 1회 확인이 남아 있음
- Sites 배포 버전 6이 `https://kihc-research.gangstar1273.chatgpt.site`에 반영된 것을 관리자/공개 화면에서 확인
- Sites 접근 모드를 `public`으로 변경하고 비로그인 HTTP 요청에서 `/` 응답 200, `/adminpage1`의 ChatGPT 인증 이동을 확인
- GitHub `origin/main` push는 이 PC의 GitHub 인증 부재로 실패했으며 기능 구현 commit은 `7145cba`

## 9. 다음 우선순위

다음 상세 지시를 받기 전 임의 구현하지 않는다. 우선 검토 대상은 다음과 같다.

1. 협업 사용자 초대·역할 관리 UI
2. 문의 이메일/API 연결
3. 공개 검색·pagination 연결
4. 운영 이미지와 확정 기관 정보 입력
5. 미사용 R2 이미지 정리 기능
