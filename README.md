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

## 배포 현황 (2026-07-07 기준)

- **라이브 URL**: https://walletcalcs.pages.dev (Cloudflare Pages 직접 업로드 방식, 무료)
- **저장소**: https://github.com/godkal/walletcalcs (백업·이력 관리용; push가 배포를 트리거하지 않음)
- **배포 명령**: `npx --yes wrangler@latest pages deploy . --project-name=walletcalcs --branch=main --commit-dirty=true` (wrangler는 이 PC에 OAuth 인증됨)
- **비용 0원 전략**: 트래픽 데이터가 생기면(2~3개월 후) 그때 도메인 구매 → Pages에 커스텀 도메인 연결 → 전체 URL 치환 → AdSense 신청. 무료 서브도메인으로는 AdSense 승인 불가(루트 도메인 필요).

### 남은 단계
1. **Google Search Console**: URL-prefix 속성으로 `https://walletcalcs.pages.dev` 등록 + sitemap 제출 (무료, HTML 파일 인증 가능 — Claude가 인증 파일 배포 가능).
2. **2~3개월 후 트래픽 확인** → 유의미하면 도메인 구매(연 ~2만원) + AdSense 신청.
3. AdSense 승인 후: 스니펫을 각 페이지 `<head>`에, 광고 유닛을 `.ad-slot`에 삽입 (Claude 작업).

## 운영 (주간 자동 루프 — scheduled task `walletcalcs-weekly-expansion`)

매주 월 03:00 Claude가 자동 수행:
1. 신규 계산기 2개 제작 (위 페이지 패턴 준수, sitemap.xml + 홈 index.html 등록)
2. 로컬 검증 → git push → wrangler 배포 → 라이브 200 확인
3. 주간 리포트 생성 (reports/, gitignore됨)

## 콘텐츠 정책 (중요 — Google 스팸 정책 회피)

- 도구(계산기)가 주인공, 텍스트는 도구 사용을 돕는 보조. "대량 AI 콘텐츠 블로그"화 금지.
- 세율·한도 등 수치는 반드시 1차 출처(IRS 등) 확인 후 기재. 현재 2026년 수치 사용 중:
  - SS wage base $184,500 / 표준공제 $16,100(single), $32,200(MFJ) / 2026 브라켓 (Rev. Proc. 2025-32)
- 매년 초 세금 관련 페이지 수치 업데이트 필요 (self-employment-tax-calculator 등).

## 로컬 미리보기

`python -m http.server 8123` 후 http://localhost:8123 (절대경로 `/css/...` 사용하므로 루트에서 서빙 필수).
