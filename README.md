# WalletCalcs — 자동 수익화 웹 도구 포트폴리오

미국 타깃 고RPM(금융·보험·세금) 니치의 무료 계산기 정적 사이트. AdSense 광고 수익이 목표.
기술 스택: 순수 HTML/CSS/JS, 빌드 도구 없음, 호스팅 무료(Cloudflare Pages), 유지보수 0.

## 구조

```
index.html                  홈 (도구 목록)
about/index.html            소개 페이지
css/style.css               공통 스타일 (전체 디자인 시스템)
js/calc.js                  공통 헬퍼 (포맷팅, pmt, amortize, liveCalc 등)
tools/<slug>/index.html     계산기 페이지 (13종, 완전 독립 페이지)
robots.txt / sitemap.xml    SEO
```

각 계산기 페이지 구성 (신규 추가 시 이 패턴 유지):
1. `<head>`: title/description/canonical/OG + JSON-LD (`WebApplication` + `BreadcrumbList` + `FAQPage`)
2. 계산기 카드 (`liveCalc`로 입력 즉시 재계산)
3. `.ad-slot` (AdSense 승인 후 코드 삽입)
4. 800~1200단어 설명 콘텐츠 (`article.content`)
5. FAQ (`details` — JSON-LD FAQPage와 반드시 일치)
6. 관련 도구 3개 내부링크
7. 푸터 disclaimer

## 배포 절차 (사용자 개입 필요 — 총 1시간 이내)

### 1) 도메인 (연 $10~15)
- `walletcalcs.com` 가용 여부 확인 후 Cloudflare Registrar 또는 Namecheap에서 구매.
- 다른 도메인을 쓰면: 프로젝트 전체에서 `walletcalcs.com` 문자열 치환 + 사이트명 로고 변경.

### 2) Cloudflare Pages (무료)
1. github.com에 저장소 생성 → 이 폴더 push (또는 Pages 직접 업로드).
2. Cloudflare 대시보드 → Workers & Pages → Create → Pages → 저장소 연결.
3. 빌드 설정: 프레임워크 없음, 빌드 명령 없음, 출력 디렉터리 `/`.
4. Custom domain에 구매한 도메인 연결.

### 3) Google Search Console (무료, 필수)
1. search.google.com/search-console → 도메인 속성 추가 (DNS 인증은 Cloudflare에서 TXT 레코드 추가).
2. Sitemaps 메뉴에 `sitemap.xml` 제출.
3. 인덱싱은 보통 1~4주 소요.

### 4) AdSense (수익 연결 — 본인 명의 필수)
1. adsense.google.com 가입 (지급 계좌 = 본인 통장).
2. 사이트 추가 → 심사 요청. 신규 사이트는 승인까지 2~6주. **콘텐츠가 어느 정도 인덱싱된 뒤(배포 후 2~4주) 신청하면 승인률이 높음.**
3. 승인 후: 발급받은 스니펫을 각 페이지 `<head>`에 삽입하고 `.ad-slot`에 광고 유닛 배치 (이 작업은 Claude에게 요청).

## 운영 (주간 자동 루프)

매주 Claude가 수행:
1. Search Console 노출 키워드 확인 (사용자가 스크린샷 공유 또는 API 연동)
2. 신규 계산기 2~3개 제작 (위 페이지 패턴 준수, sitemap.xml에 추가, 홈 index.html에 카드 추가)
3. 주간 리포트 생성

## 콘텐츠 정책 (중요 — Google 스팸 정책 회피)

- 도구(계산기)가 주인공, 텍스트는 도구 사용을 돕는 보조. "대량 AI 콘텐츠 블로그"화 금지.
- 세율·한도 등 수치는 반드시 1차 출처(IRS 등) 확인 후 기재. 현재 2026년 수치 사용 중:
  - SS wage base $184,500 / 표준공제 $16,100(single), $32,200(MFJ) / 2026 브라켓 (Rev. Proc. 2025-32)
- 매년 초 세금 관련 페이지 수치 업데이트 필요 (self-employment-tax-calculator 등).

## 로컬 미리보기

`python -m http.server 8123` 후 http://localhost:8123 (절대경로 `/css/...` 사용하므로 루트에서 서빙 필수).
