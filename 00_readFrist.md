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

- `/adminpage1/login`: 실제 인증이 아님을 명시한 개발용 진입 화면
- `/adminpage1`: 콘텐츠 현황 대시보드
- `/adminpage1/news`, `/adminpage1/research`, `/adminpage1/popup`: 검색·등록·수정·삭제가 동작하는 관리자 미리보기
- `/adminpage1/about`, `/adminpage1/settings`: 입력·수정·저장이 동작하는 관리자 미리보기
- 공개 Header/Footer에는 관리자 링크를 노출하지 않으며 기존 `/admin` 경로는 제거함
- 현재 관리자 저장 기능은 브라우저 `localStorage` 기반이며 공개 홈페이지·서버 DB에는 반영되지 않음

### 공통 구조

- 도메인 타입 및 임시 Repository: `app/lib/content.ts`
- 공식 로고 원본: `public/kihc-logo.png`
- 가로형 투명 로고: `public/kihc-logo-horizontal.png`
- 공유 이미지: `public/og.png`
- 배포 주소: `https://kihc-research.gangstar1273.chatgpt.site`

## 3. 아직 Mock 또는 미구현인 부분

- DB 영구 저장과 실제 CRUD
- 관리자 인증과 접근 제어
- 문의 이메일/API 전송
- 검색 결과 필터링과 실제 pagination
- 이미지 업로드 및 미디어 저장소
- 관리자 미리보기 데이터를 공개 사이트에 반영하는 저장 API
- 확정 기관 정보, 대표 연락처, 개인정보처리방침 및 저작권 전문
- 실제 이사장 사진, 조직도 이미지, 연구자료 썸네일

## 4. DB/API 연결 지점

- DB: `app/lib/content.ts`의 `ContentRepository` 구현을 `DatabaseContentRepository`로 교체한다.
- 인증: `app/adminpage1/login`과 `app/components/AdminLoginForm.tsx`에서 실제 Auth 서비스로 연결한다.
- 문의: `app/components/ContactForm.tsx`의 submit 경계에 문의 API를 연결한다.
- 현재 Mock 데이터가 실제로 저장되는 것처럼 가정하지 않는다.

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

## 7. 진행 기록

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
- 검증 상태: 완료, 배포 진행 중

## 8. 다음 우선순위

다음 상세 지시를 받기 전 임의 구현하지 않는다. 우선 검토 대상은 다음과 같다.

1. DB Repository 구현과 관리자 저장 API 연결
2. 실제 Auth 및 접근 제어 연결
3. 이미지 업로드·미디어 저장소 연결
4. 문의 API 연결
