# 羊·實驗

數學視覺化與 Generative Art 的個人作品集。以 Astro 產生靜態網站，互動畫布由 React 與 p5.js 驅動。

[正式站](https://lab.lambliver.dev/) · [English](https://lab.lambliver.dev/en/) · [GitHub](https://github.com/lamb-liver/lab)

作者：羊肝（https://lambliver.dev）

網站提供中文與英文兩個版本，英文頁面位於 `/en/` 路徑下（`src/pages/en/`）。

## 快速開始

需求：Node.js 22.12 以上。

```bash
npm ci
npm run dev
```

開啟 <http://localhost:4321/>。

## 常用指令

| 指令 | 用途 |
|------|------|
| `npm run dev` | 啟動本地開發環境 |
| `npm test` | 執行 Vitest |
| `npm run typecheck` | 執行 TypeScript 檢查 |
| `npm run typecheck:fatal` | 執行 CI 使用的完整 TypeScript fatal gate |
| `npm run build` | 建置靜態站到 `dist/` |
| `npm run test:seo-ux` | 驗證 metadata、導覽、filter 與 accessibility shell |
| `npm run test:works-smoke` | 逐頁驗證所有公開 Works 的互動接線 |
| `npm run validate:frontend -- --url <route>` | 依序執行內容檢查、測試、建置與 DOM 驗證 |
| `npm run audit:integration` | 驗證 content、registry 與 stage 接線 |
| `npm run covers:exam` | 由 SVG 來源生成 Exam 列表封面 |
| `npm run audit:exam-covers` | 驗證公開 Exam 的 SVG、PNG、尺寸與 frontmatter |
| `npm run audit:public-pages` | 列出三個 collection 的公開／草稿頁面，並執行發布檢查 |
| `npm run validate:changed` | 依 Git 變更選擇聚焦驗證 |
| `python3 scripts/subset-site-fonts.py` | 文案新增中文字後重建字型子集 |
| `python3 scripts/check-font-glyphs.py` | 檢查字型子集有沒有缺字（CI 也會跑） |

需要視覺證據時才在 `validate:frontend` 後加 `--screenshot`。

## 架構

```text
src/
├── content/             # 三個 collection 的 Markdown
├── curve/               # Works 純幾何、參數與 registries（不依賴 p5／React）
├── explore/             # Explore 專屬幾何與 registries
├── exam/                # Exam 專屬數學與互動 registry
├── components/          # Astro shell、React roots、p5 hooks 與控制項
├── systems/rendering/   # 只接收 snapshot 的共用 renderer
└── pages/               # 三個 collection 與網站 shell routes
```

主要資料流：

```text
Works:   content → work registries → WorkInteractiveStage → CurveRoot → renderer
Explore: content → explore registry → ExploreInteractiveStage → ExploreRoot → renderer
Exam:    content → exam registry → ExamInteractiveStage → ExamRoot → renderer
```

Works、Explore 與 Exam 是三套獨立互動架構；新增頁面時必須同步各自的 content、registry 與 stage map。完整邊界見 [`docs/architecture.md`](docs/architecture.md)。

## 試題視覺化（Exam）

`/exam` 把考題改寫成互動頁，每題固定四節：題意、為什麼會錯、觀念、互動怎麼看。列表用考試類別篩選，順序定義在 `src/content/utils.ts`，類別與出處標示在 `src/lib/examSource.ts`。

| 類別 | slug 前綴 | 題源 | 目前題數 |
|------|-----------|------|----------|
| 學測數A | `gsat-` | 大考中心試卷，附答對率出處 | 5 |
| 分科數甲 | `ast-` | 大考中心試卷，附答對率出處 | 9 |
| AMC 12A／12B | `amc12a-`、`amc12b-` | AoPS 題目頁，標示 © MAA | 3 |
| 高考數學 | `gaokao-` | 考生回憶整理，每題至少兩個來源 | 8 |

題數以 `npm run audit:public-pages` 為準。每題的數學在 `src/exam/<slug>/geometry.ts`（附測試），畫面在 `src/systems/rendering/*ExamRender.ts`，React root 在 `src/components/exam/`。

新增一題：

1. `npm run new:exam` 建立中文草稿，再補 `src/content/en/exam/<slug>.md`。
2. 寫 `geometry.ts` 與測試、renderer、ExamRoot，接上 `src/exam/interactiveSlugs.ts` 與 `ExamInteractiveStage`。
3. `npm run covers:exam` 產生封面；OG 圖在 build 時產生。
4. 文案有新字時跑 `python3 scripts/subset-site-fonts.py`，再跑 `python3 scripts/check-font-glyphs.py`。
5. 跑 `npm run typecheck`、`npm test`、`npm run audit:content`、`npm run audit:exam-covers`、`npm run build`、`npm run audit:integration`。

## 新增內容

```bash
npm run new:work -- <slug>
npm run new:explore -- <slug>
npm run new:exam -- <slug> --year 112 --subject 學測數A --type 多選 --no 11
npm run new:exam -- <slug> --year 2024 --subject 高考數學 --no 新課標I-5
```

產生器預設只建立草稿內容；`new:work` 加 `--interactive` 才會建立最小互動骨架並同步 registries。接線與發布流程：

- Works／Explore：[`docs/p5toreact.md`](docs/p5toreact.md)
- 內容格式：[`docs/textstyle.md`](docs/textstyle.md)
- 完整發布流程：[`docs/lab-release-system.md`](docs/lab-release-system.md)
- Exam 上線審查：[`docs/exam-visualization-plan.md`](docs/exam-visualization-plan.md)

## 部署

正式站是 [lab.lambliver.dev](https://lab.lambliver.dev/)，由 Vercel 從 `main` 建置並提供靜態 `dist/`。GitHub Actions（[`.github/workflows/ci.yml`](.github/workflows/ci.yml)）只跑 typecheck、audit、build 與 e2e，不再部署 GitHub Pages。日常更新合併到 `main` 即上線，不打 SemVer tag。

## 流量與留言

- **Umami**：只在 production 且設了 `PUBLIC_UMAMI_WEBSITE_ID` 時載入；script 走本站 `/stats/*` 反代 `cloud.umami.is`（避開部分 ISP 對 `*.umami.is` 的 DNS 攔截）。`data-domains=lab.lambliver.dev` 擋 localhost 與 preview。Dashboard 在 [cloud.umami.is](https://cloud.umami.is)。變數範例見 [`.env.example`](.env.example)。
- **giscus**：Works / Explore / Exam 詳情頁留言寫進 GitHub Discussions（Announcements）。留言區進入視窗後才載入。需安裝 [giscus app](https://github.com/apps/giscus) 到本 repo。
- **回饋轉 Issue**：規則與標題格式見 [`docs/feedback.md`](docs/feedback.md)。

## 文件

文件索引在 [`docs/README.md`](docs/README.md)，AI／維護規範從 [`docs/AGENTS.md`](docs/AGENTS.md) 開始。當文件與實作不一致時，以 `src/` runtime 為準。

## 技術

Astro 6、React 19、p5.js、TypeScript、Vitest、Playwright、KaTeX；樣式為原生 CSS，沒有 UI framework。

## 聯絡

[lambliver.dev@gmail.com](mailto:lambliver.dev@gmail.com) · [GitHub](https://github.com/lamb-liver) · [Threads](https://www.threads.com/@lambliver0420) · [Facebook](https://www.facebook.com/profile.php?id=61589694329153)
