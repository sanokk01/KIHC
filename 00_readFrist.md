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

- `/` 홈: Hero와 최근 연구 패널, 연구분야, 연구 정책자료, 주요 연구자료, 연구회 소식, 행사 달력, 주요 바로가기, 복고형 공지 팝업
- `/about`: 이사장 소개, 연구회 소개, 설립목적·비전, 조직도 앵커 구성
- `/research-focus`: KIHC 연구분야, 핵심 가치, 연구 접근방식을 소개하며 한국어·영어 즉시 전환과 공유 가능한 `?lang=en` 주소 지원
- `/ci`: 공식 CI 섬네일 미리보기와 협력 기업 전용 원본·사용 지침 열람 문의
- `/promotional-materials`, `/promotional-materials/[slug]`: 홍보물 섬네일 목록과 보호된 상세 안내
- `/events`, `/events/[slug]`: 강연·세미나·학회 개최 자료 섬네일 목록과 보호된 상세 안내
- `/news`, `/news/[slug]`: 검색 조건·검색어·실제 pagination이 연결된 게시판 목록과 상세 화면
- `/research`, `/research/[slug]`: 연구자료 목록과 상세, 원문 열람 문의 모달
- `/contact`: 필수값 검증, 중복 제출 방지, 별도 전송 경계와 준비 중 안내가 있는 문의 폼
- 공통 Header, desktop dropdown, mobile menu, Footer

### Admin

- 로컬 관리자 접속 주소: `http://localhost:3000/adminpage1`
- `/adminpage1/login`: 로컬 개발 관리자 진입 및 운영 인증 연결 대기 안내 화면
- `/adminpage1`: 외부 DB 연결 대기 상태와 기본 콘텐츠 현황 대시보드
- `/adminpage1/news`, `/adminpage1/research`, `/adminpage1/popup`: 관리 UI와 검색은 유지하되 저장·삭제·이미지 업로드는 외부 DB 연결 전까지 비활성화
- 팝업 관리에는 `상단 이미지 + 내용`과 `이미지 전체 표시` 방식이 있으며, 전체 표시는 이미지를 자르지 않고 원본 비율로 노출
- `/adminpage1/about`, `/adminpage1/settings`: 편집 UI는 유지하되 저장·이미지 업로드는 외부 DB 연결 전까지 비활성화
- 공개 Header/Footer에는 관리자 링크를 노출하지 않으며 기존 `/admin` 경로는 제거함
- 공개 홈페이지는 현재 `app/lib/content.ts`의 기본 데이터를 사용하며 연결되지 않은 DB를 호출하지 않음
- localhost에서는 개발용 관리자 접근을 허용하고 외부 주소에서는 운영 인증 연결 전 관리자 접근을 차단함

### Git 공동 작업

- GitHub: `https://github.com/sanokk01/KIHC`
- 같은 저장소를 clone/pull한 팀원은 일반 Git 방식으로 모든 소스 파일을 수정·커밋·push할 수 있음
- 소스 수정과 GitHub/Netlify 배포에는 프로젝트 소유자의 GPT 계정 로그인이 필요하지 않음. 각 팀원은 본인의 GitHub 및 배포 서비스 계정을 사용한다.
- 시작 전 `00_readFrist.md`, `git status`, 최근 commit을 확인하고 완료 후 이 문서를 갱신할 것
- 현재 작업에서는 자동 `git add`·`commit`·`push`를 실행하지 않는다. 검증 후 변경 파일을 확인하고 커밋과 푸시는 사용자가 직접 수행한다.
- 개인 계정 ID, DB ID, 저장소 ID, 인증 토큰은 소스에 직접 기록하지 않음
- 이 PC에서는 GitHub 인증이 완료되지 않아 최신 로컬 commit이 `origin/main`에 push되지 않을 수 있음. 인수인계 전 `git rev-list --left-right --count origin/main...HEAD`를 확인한다.

### 배포 플랫폼 호환성

- 현재 작업 기준은 `http://localhost:3000` 로컬 실행이며 자동 배포하지 않는다.
- 내부 페이지·관리자 링크는 상대 경로이므로 이후 구매한 도메인을 연결해도 소스의 링크 주소를 다시 바꿀 필요가 없다.
- 운영 배포 시 `.env.example`의 `NEXT_PUBLIC_SITE_URL`을 실제 `https://도메인` 값으로 설정한다.
- 현재 저장소는 표준 Next.js 16 App Router 구조이며 Vercel·Netlify에서 Git 저장소 연결 방식으로 배포 가능하다.
- Netlify 설정은 `netlify.toml`의 build command `npm run build`, publish directory `.next`, Node.js 22를 사용한다. 기존 사이트 설정이 `dist`라면 새 배포에서 저장소 설정을 다시 읽도록 한다.
- Vercel은 Next.js를 자동 감지하므로 별도 output directory를 지정하지 않는다.
- 관리자 CRUD·이미지·팝업의 실제 저장은 호스팅 문제가 아니라 팀 DB, 파일 저장소와 운영 인증을 연결해야 완성된다.

### 공통 구조

- Public 콘텐츠 Repository와 기본 fallback 데이터: `app/lib/content.ts`
- 관리자 공통 타입과 연결 대기 처리: `app/lib/admin-types.ts`, `app/lib/admin-data.ts`, `app/lib/storage-status.ts`
- 외부 DB/파일 저장소 어댑터 계약: `db/content-store.ts` (`contentStore`는 현재 `null`)
- 이전 D1 스키마 참고본: `db/schema.ts`, `drizzle/0000_skinny_viper.sql` — 현재 런타임에서는 사용하지 않음
- 관리자 API: `app/api/admin/**`, 공개 이미지 route: `app/api/media/[id]`
- 런타임: Next.js 16.2.6 App Router
- Netlify 배포 설정: `netlify.toml`
- 공식 로고 원본: `public/kihc-logo.png`
- 가로형 투명 로고: `public/kihc-logo-horizontal.png`
- 공유 이미지: `public/og.png`
- 로컬 주소: `http://localhost:3000`
- 로컬 관리자 주소: `http://localhost:3000/adminpage1`
- 운영 도메인: 미정 — 도메인 구매 및 배포 환경 결정 후 `.env.local` 또는 호스팅 환경 변수에 설정

## 3. 외부 정보가 필요한 후속 작업

- 문의 이메일/API 실제 전송 — 최초 요구사항에서 이번 단계 제외, 팀 endpoint와 수신 정책 확정 후 연결
- 팀이 보유한 외부 DB와 파일 저장소 어댑터 연결 — 사용자의 DB 연결 해제 지시를 유지
- 외부 도메인용 운영 관리자 인증 — 인증 공급자와 허용 사용자 정책 확정 필요
- 협력 기업 상세자료 인증 — 기업 인증 공급자와 계약 기업 allowlist 확정 전에는 모든 상세자료를 서버에서 차단
- 확정 기관 정보, 대표 연락처, 개인정보처리방침 및 저작권 전문 — 허위 내용을 만들지 않고 제공 대기
- 실제 운영용 이사장 사진, 조직도 이미지, 연구자료 썸네일 데이터 입력 — 공식 자산 제공 대기

관리자 권한 등급·초대 관리 UI는 최초 요구사항의 명시적 제외 항목이므로 미개발 기능으로 보지 않으며 임의 구현하지 않는다.

## 4. DB/API 및 권한 연결 지점

- DB: 현재 연결 해제 상태다. 공개 읽기는 `app/lib/content.ts`의 기본 데이터를 반환하고, 관리자 쓰기 API는 명확한 안내와 함께 HTTP 503을 반환한다.
- 이미지: 업로드 API는 외부 저장소 연결 전 HTTP 503을 반환하고 `/api/media/[id]`는 404를 반환한다. 파일 선택 UI도 비활성화되어 잘못된 저장 성공을 표시하지 않는다.
- 연결 지점: `db/content-store.ts`의 `ContentStore` 계약을 팀 DB에 맞게 구현한 뒤 `app/lib/content.ts`, `app/lib/admin-data.ts`, 업로드·미디어 route에 주입한다.
- 인증: `app/lib/admin-auth.ts`가 localhost 개발 접근만 허용한다. 외부 도메인에서는 팀이 선택한 운영 인증을 연결하기 전 page/API 접근을 차단한다.
- 협업: 소스 수정 권한은 GitHub 저장소 권한으로 관리하고, 배포 관리자 접근 권한은 Sites 공유 설정으로 관리한다.
- 문의: `app/components/ContactForm.tsx`의 submit 경계에 문의 API를 연결한다.
- 문의 전송 계약: `app/lib/contact.ts`의 `submitContactInquiry` 구현만 팀 API 호출로 교체한다.
- 협력 기업 열람 권한: `app/lib/partner-access.ts`의 `getPartnerAccess`를 실제 기업 인증과 계약 allowlist 검사로 교체한다.
- 현재 모든 환경은 기본 데이터를 사용한다. 팀 DB 연결이 완료된 뒤에만 외부 DB를 authoritative source로 전환한다.

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
7. 커밋·푸시·배포는 사용자의 명시적 요청이 있을 때만 수행한다. 현재 작업의 커밋과 푸시는 사용자가 직접 진행한다.

개발 중에는 `npm run check`로 증분 타입 검사와 변경 파일 lint만 실행한다. 전체 `npm run verify`는 기능 묶음이 완료되었을 때 한 번 실행해 불필요한 대기를 줄인다.

## 7. 다른 AI 에이전트 인수인계 절차

1. `C:\GitHub_clone\KIHC\00_readFrist.md` 전체를 먼저 읽는다.
2. `git status --short`, `git log -5 --oneline`, `.openai/hosting.json`을 확인한다.
3. 팀이 제공하는 DB 종류, 접속 방식, 환경 변수 이름과 파일 저장소를 먼저 확인한다. 접속 정보와 비밀값은 Git에 기록하지 않는다.
4. `db/content-store.ts`의 `ContentStore` 계약을 실제 저장소로 구현하고 `app/lib/content.ts`, `app/lib/admin-data.ts`, 관리자 API를 함께 연결한다.
5. `.openai/hosting.json`의 D1/R2 값은 팀 저장소가 실제로 필요하다고 확인되기 전까지 `null`로 유지한다.
6. 관리자 API는 `app/lib/admin-auth.ts`의 권한 검사를 반드시 유지하고, 실제 도메인 배포 전에 팀 인증 방식으로 교체한다.
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

### 2026-08-08 — D1/R2 연결 해제 및 외부 DB 인수인계 준비

- `.openai/hosting.json`의 D1/R2 binding을 모두 `null`로 변경
- Public Repository에서 D1 조회를 제거하고 기본 콘텐츠만 반환하도록 전환
- 관리자 조회 화면은 기본 콘텐츠로 유지하고 저장·삭제·이미지 업로드 UI를 연결 대기 상태로 비활성화
- 인증된 쓰기·업로드 API는 잘못된 성공이나 서버 오류 대신 외부 DB 연결 대기 안내와 HTTP 503을 반환
- `/api/media/[id]`는 외부 파일 저장소 연결 전 404를 반환
- `db/content-store.ts`를 특정 DB에 종속되지 않은 `ContentStore` 인수인계 계약으로 정리
- TypeScript, ESLint, production build 및 렌더링/API 테스트 6건 통과

### 2026-08-08 — localhost 우선 실행 및 향후 도메인 준비

- ChatGPT 전용 로그인·로그아웃 경로 의존성 제거
- `.openai/hosting.json`에서 기존 ChatGPT Sites `project_id`를 제거해 로컬 소스와 이전 배포 프로젝트의 고정 연결을 해제
- localhost 관리자 자동 접근과 외부 주소 관리자 차단으로 인증 경계 정리
- Windows에서도 `npm run dev`, `npm run build`, `npm run start`가 동작하도록 package script의 POSIX 환경 변수 문법 제거
- 기본 메타데이터 URL은 `http://localhost:3000`, 운영 시 `NEXT_PUBLIC_SITE_URL` 환경 변수로 구매 도메인을 주입하도록 유지
- `.env.example`과 프로젝트 전용 `README.md`에 로컬 실행·도메인·DB 인수인계 절차 문서화
- 이번 단계는 로컬 전용이며 ChatGPT Sites 재배포를 진행하지 않음
- TypeScript, ESLint, production build, 렌더링/API 테스트 6건 통과
- 새 production server에서 `/`와 `/adminpage1` 응답 200, Local Admin 표시, 외부 DB 연결 대기 표시, ChatGPT 로그인·로그아웃 경로 0건 확인

### 2026-08-08 — 로컬 개발 실행 속도 개선

- `vite.config.ts`에서 개발 서버는 `vinext()`만 로드하고 Cloudflare/Sites 플러그인은 최종 production build에서만 로드하도록 분리
- TypeScript 검사 범위를 실제 앱·DB·worker·Vite 설정으로 축소하고 증분 캐시 사용
- `scripts/lint-changed.mjs`를 추가해 일상 lint는 Git 변경 코드 파일만 검사
- `npm run check`는 빠른 반복 검사용, `npm run verify`는 최종 전체 검증용으로 역할 분리
- 개발 서버 warm 응답 기준 홈 약 0.05초, 관리자 약 0.09초 확인
- 캐시 이후 변경 파일 lint 약 2.6초, 증분 타입 검사 약 2.0초 확인
- 캐시가 준비된 production build 약 6.6초, 렌더링/API 테스트 6건 전체 통과

### 2026-08-08 — HOME 랜딩 페이지 리디자인

- 작업 범위를 `/` HOME으로 제한하고 기존 Header, Footer, route, 관리자 구조, 공지 팝업을 유지
- 대형 Hero와 최근 연구 패널, 3개 연구분야, 연구 정책자료 카드, 짙은 남색 주요 연구자료, 연구회 소식, 4개 주요 바로가기 순서로 랜딩 흐름 재구성
- 연구자료·소식·팝업은 새 Mock 배열이나 데이터 모델을 만들지 않고 기존 `contentRepository` 조회 결과를 재사용
- 모바일에서는 Hero 다음에 최근 연구 패널이 이어지고, 연구 카드 가로 스크롤과 2열 바로가기를 사용하도록 반응형 처리
- 공지 팝업이 열린 동안 배경 interaction이 차단되고 닫은 뒤 모바일 메뉴가 열리는 기존 동작을 확인
- 모바일 메뉴의 `aria-label`이 열린 상태에서도 `메뉴 열기`로 남던 접근성 오류를 `메뉴 닫기`로 교정
- 데스크톱 드롭다운용 hover 이동값이 모바일 메뉴에 적용되어 하위 메뉴가 왼쪽으로 밀리던 오류를 모바일 구간에서 해제
- Desktop과 mobile에서 가로 overflow 없음, 연구·소식·바로가기 상대 경로, 팝업과 모바일 메뉴 동작을 브라우저에서 확인
- TypeScript, 변경 파일 및 전체 ESLint, production build, 렌더링/API 테스트 6건 전체 통과
- 이번 작업에서는 Git 자동 `add`·`commit`·`push`를 수행하지 않으며 사용자가 검증된 변경을 직접 커밋·푸시한다.

### 2026-08-08 — 미개발 기능 점검 및 공개 기능 완성

- 최초 요구사항과 현재 코드를 대조해 실제 미연결 상태였던 연구회 소식 검색·pagination을 구현
- 제목, 내용, 제목+내용 조건 검색과 URL query 유지, 검색 결과 0건 안내, 이전·다음·페이지 번호 이동을 Repository 경계에 연결
- 공개 상세 조회에서 초안 상태 콘텐츠가 노출되지 않도록 공개 상태 조건을 강화
- 팝업 활성 기간을 시작·종료 시각과 함께 판정하고 `오늘 하루 보지 않음` 날짜를 사용자 로컬 날짜 기준으로 교정
- 문의 제출 로직을 `app/lib/contact.ts`로 분리하고 실제 발송을 가장하지 않는 명확한 대기 응답과 중복 제출 방지 적용
- 관리자 모바일 화면의 전체 페이지 강제 가로 overflow를 제거하고 메뉴, 카드, 표, 편집기, 설정 폼을 작은 화면에서도 사용할 수 있도록 보강
- 외부 DB·메일·운영 인증·공식 기관 정보는 필요한 입력값이 없고 기존 제외/연결 해제 지시가 있으므로 안전한 연결 경계만 유지
- 브라우저에서 제목/내용 검색, 결과 없음, 2페이지 이동, 모바일 소식 목록, 모바일 관리자 표·편집기, 문의 준비 중 응답과 가로 overflow 없음 확인
- TypeScript, 전체 ESLint, production build, 렌더링/API 테스트 7건 전체 통과
- Git 자동 `add`·`commit`·`push` 및 배포는 수행하지 않음

### 2026-08-08 — 복고형 공지 팝업 및 전체 이미지 모드

- 현대적인 카드형 팝업을 각진 이중 테두리, 남색 제목 표시줄, 종이색 본문, 구형 기관 홈페이지 스타일 버튼 영역으로 변경
- 팝업 이미지 표시 방식에 `상단 이미지 + 공지 내용`과 `이미지 전체 표시`를 추가
- 전체 이미지 모드는 원본 비율을 유지하고 `object-fit: contain`으로 잘림 없이 노출하며 데스크톱·모바일 화면 높이를 넘지 않도록 제한
- 관리자 팝업 편집기에 이미지 URL 입력, 업로드 미리보기, 이미지 표시 방식 선택과 안내 문구 추가
- 외부 파일 저장소 연결 전에는 URL·public 경로 미리보기만 가능하고 저장 버튼은 계속 비활성화하여 영구 저장을 가장하지 않음
- 팝업 링크는 안전한 내부 상대 경로와 `http/https` 주소만 허용하고, `Escape` 키 닫기를 지원
- 팝업 콘텐츠 변경에 맞춰 기본 팝업 ID를 갱신해 기존 `오늘 하루 보지 않음` 기록과 새 공지를 구분
- 브라우저에서 복고형 텍스트 팝업, 모바일 배치, `Escape`·닫기, 관리자 설정, 전체 이미지 모드를 확인
- TypeScript, 전체 ESLint, production build, 렌더링/API 테스트 7건 전체 통과
- Git 자동 `add`·`commit`·`push` 및 배포는 수행하지 않음

### 2026-08-08 — 연구·핵심가치 소개 및 한국어·영어 지원

- `/research-focus` 페이지를 추가해 자아확립, 메타인지·회복탄력성, 가치판단·창의적 사고의 연구 질문과 범위를 구체적으로 설명
- 사람 중심, 근거와 깊이, 성장과 연결, 개방과 책임을 KIHC 연구의 핵심 가치로 정리
- 질문 발견 → 개념과 근거 탐색 → 현장과 연결 → 책임 있게 공유하는 연구 접근방식 안내
- 확정되지 않은 연구 성과를 과장하지 않고 현재 연구 방향과 탐구 질문 중심으로 문구 작성
- 페이지 내 한국어·영어 전환, 선택 저장, `?lang=en` 공유 주소와 영어 서버 렌더링 지원
- Header의 `KIHC 소개` 하위 메뉴와 HOME 연구분야 섹션에서 새 페이지로 연결
- 데스크톱·모바일에서 한국어·영어 긴 문구, 카드·가치·연구단계·CTA와 메뉴 배치, 가로 overflow 없음 확인
- 한국어·영어 즉시 전환, 선택 유지, 영어 공유 주소 직접 진입과 한국어 URL 복원을 브라우저에서 확인
- TypeScript, 전체 ESLint, production build, 렌더링/API 테스트 7건 전체 통과
- 현재 번역 범위는 `/research-focus`의 본문과 CTA이며 기존 Public 전체 페이지의 영어 번역은 별도 콘텐츠 검수 후 확장 가능
- Git 자동 `add`·`commit`·`push` 및 배포는 수행하지 않음

### 2026-08-08 — CI·홍보물·강연/학회 공개 미리보기와 협력 기업 보호

- `/ci`에서 가로형 공식 로고의 밝은/어두운 배경 섬네일을 제공하고 원본 파일·사용 규정은 문의 흐름으로 보호
- `/promotional-materials` 목록/상세와 `/events` 목록/상세 route 추가
- 공개 사용자는 제목·분류·날짜·섬네일만 확인하고 보호된 세부 항목은 서버 응답 HTML에 포함하지 않도록 처리
- 상세 페이지의 `상세자료 열람 문의`에서 협력 기업 전용 안내 후 `/contact`로 이동 가능
- 문의 모달 닫기와 `Escape` 키, 목록 돌아가기, desktop/mobile 반응형 지원
- Header의 `KIHC 소개`에 CI 소개, `열린소식`에 홍보물과 강연·학회 메뉴 추가
- 실제 기업 인증 또는 임시 URL token을 임의 구현하지 않고 `app/lib/partner-access.ts` 서버 권한 경계는 기본 차단 상태로 유지
- 현재 홍보물·행사 항목은 기존 프로젝트 흐름에 맞춘 기본 데이터이며, 실제 DB 연결 후 공식 제목·섬네일·행사 기록으로 교체 필요
- 브라우저에서 CI 미리보기, 홍보물·행사 목록/상세, 문의 모달, 모바일 메뉴와 가로 overflow 없음 확인
- 외부 상세 HTML에서 보호 문구와 PDF·다운로드 링크가 노출되지 않음을 자동 테스트로 확인
- TypeScript, ESLint, production build, 렌더링/API 테스트 8건 전체 통과
- Git 자동 `add`·`commit`·`push` 및 배포는 수행하지 않음

### 2026-08-08 — 공개 화면 클릭 동작 점검 및 밝은 메인 컬러 적용

- HOME, 연구회 소개, 연구·핵심가치, CI, 열린소식, 연구정책자료, 홍보물, 강연·학회, 문의 화면의 링크와 버튼을 전수 점검
- 빈 링크, `#` 임시 링크, `javascript:` 가짜 링크가 없고 공개 화면에서 연결한 내부 페이지가 모두 404 없이 열리는 자동 검사를 추가
- HOME의 연구자료·소식 카드, 바로가기, 상세·목록 이동, 문의 모달, 언어 전환, 모바일 메뉴를 실제 클릭 기준으로 재확인하도록 검증 범위를 확대
- 관리자 저장·삭제·파일 업로드 버튼은 외부 DB 및 저장소 연결 전까지 의도적으로 비활성화되며, 연결 대기 안내를 함께 표시하는 현재 정책을 유지
- 기존의 짙은 남색 중심 팔레트를 로고와 어울리는 밝은 블루·청록 계열로 변경하고 HOME Hero, 연구 분야 카드, 연구·핵심가치, CI, 홍보물, 행사, Footer, 팝업 제목 표시줄에 일관되게 적용
- 흰색 글자가 올라가는 배경은 충분한 명도 대비가 남도록 중간 밝기의 블루를 사용하여 가독성을 유지
- Git 자동 `add`·`commit`·`push` 및 배포는 수행하지 않음

### 2026-08-08 — HOME 행사 달력과 기관형 UI 정리

- 기존 HOME 흐름인 Hero → 연구분야 → 연구자료 → 주요 연구자료 → 연구회 소식 → 바로가기를 유지하고, 연구회 소식과 바로가기 사이에 행사일정 달력을 추가
- 행사 달력은 기존 행사 Repository 데이터를 사용하며 월 이동, 행사 표시, 월별 일정 목록과 행사 상세 이동을 지원
- 현재 기본 데이터 중 가장 최근 행사가 있는 달을 처음 표시하여 빈 달력으로 시작하지 않도록 처리
- 모바일에서는 달력 안의 긴 행사명을 일정 표시점으로 단순화하고, 아래 일정 목록에서 전체 제목을 확인하도록 구성
- 인위적인 원형 장식, 과한 영문 장식체, 큰 카드 높이, 떠오르는 hover와 강한 그림자를 줄이고 한글 중심의 연구기관형 타이포그래피·선 구분·정보 밀도로 조정
- 추가 권장 기능은 현재 흐름을 유지하는 범위에서 `전체 통합검색 → 연구자료 분류·키워드 필터 → 알림마당 탭 → 전체 메뉴 → 관련기관 링크` 순서로 정리
- 실제 일정 등록·수정은 외부 DB 연결 후 관리자 행사 관리 기능으로 확장 필요
- Git 자동 `add`·`commit`·`push` 및 배포는 수행하지 않음

### 2026-08-08 — 모바일 회귀 점검 및 연구분야 정보 구조 개선

- 모바일 HOME에서 전체 가로 넘침, 메뉴, 연구분야 카드, 행사 달력, Footer의 실제 크기와 클릭 영역을 점검
- 연구분야의 330px 높이 대형 카드를 제거하고 모바일에서는 번호·제목·설명·핵심어가 한 줄 흐름으로 읽히는 압축형 레이아웃으로 변경
- 데스크톱 연구분야는 세 연구축을 동일한 정보 구조로 정리하고 분야별 상단 색상선, 핵심 키워드와 절제된 hover를 적용
- `자아확립 — 자기이해·방향설정`, `메타인지·회복탄력성 — 자기조절·변화대응`, `가치판단·창의적 사고 — 의사결정·문제해결`로 한눈에 구분
- 모바일 달력 월 이동 버튼을 44px로 확대하고 행사 표시 링크는 시각적으로 작은 점을 유지하면서 실제 클릭 영역을 날짜 셀 안으로 확대
- 모바일의 주요 텍스트 링크와 Footer 정책 링크에 최소 클릭 높이를 추가
- Git 자동 `add`·`commit`·`push` 및 배포는 수행하지 않음

### 2026-08-08 — vinext/Cloudflare 구조에서 표준 Next.js로 전환

- 기존 App Router 화면·API·관리자 경로는 유지하고 실행 명령을 `next dev`, `next build`, `next start`로 전환
- `next` 16.2.6을 정식 런타임 의존성으로 추가하고 vinext, Vite RSC, Cloudflare Worker 및 Wrangler 전용 의존성과 설정을 제거
- Cloudflare 전용 worker entry, Vite plugin과 Sites hosting metadata를 제거하여 Vercel·Netlify가 저장소를 표준 Next.js 프로젝트로 자동 인식하도록 변경
- Netlify의 build command `npm run build`, publish directory `.next`, Node.js 22 설정을 `netlify.toml`에 고정하여 기존 `dist` 설정으로 인한 기본 404 재발 방지
- Netlify `URL`과 Vercel `VERCEL_URL`을 metadata base 후보로 사용하고 실제 도메인은 `NEXT_PUBLIC_SITE_URL`로 우선 지정
- 렌더링/API 테스트를 vinext Worker 직접 호출 방식에서 실제 Next.js production server HTTP 검증 방식으로 전환
- 외부 DB, 관리자 인증, 문의 전송 경계의 연결 대기 정책은 변경하지 않음
- Git 자동 `add`·`commit`·`push` 및 실제 Netlify/Vercel 배포는 수행하지 않음

## 9. 다음 우선순위

다음 상세 지시를 받기 전 임의 구현하지 않는다. 우선 검토 대상은 다음과 같다.

1. 전체 콘텐츠 통합검색과 연구자료 분류·키워드 필터
2. 공지·연구회 동정·보도자료를 묶는 알림마당 탭
3. 전체 메뉴와 관련기관 링크
4. 팀 외부 DB와 파일 저장소 어댑터 연결
5. 문의 이메일/API endpoint 연결
6. 외부 도메인용 운영 관리자 인증 연결
7. 협력 기업 인증 공급자와 계약 기업 allowlist 연결
8. CI 원본·홍보물·행사 섬네일과 확정 기관·법적 고지 정보 입력
9. 외부 파일 저장소 연결 후 미사용 이미지 정리 정책 확정
.