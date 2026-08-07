# 專案演進回顧與未來工作手冊

> 範圍：2026-05-20 `15fdf3f` 至 2026-08-04 `e50a5e6`；整理日 2026-08-08。
> 本文根據 `main` 的 219 個提交、關鍵 diff、現行 `src/`、現行 audits 與既有工作紀錄整理。它記錄的是專案決策演變，不把每個提交簡化成個人能力評價。

## 一句話結論

這個專案真正的進步，不只是從 19 件 Works 增長到四個內容集合，而是逐步學會：**先決定內容角色，再沿既有架構做一條完整垂直切片，最後用數學、真實互動、手機畫面與發布 gate 一起驗收。**

最大的彎路則幾乎都遵循同一模式：先擴張、先清理或先自動化，之後才發現產品邊界、真實瀏覽器行為或驗證方法尚未定義。

## 目前基準

- Git：`main` 與 `origin/main` 同步，HEAD 為 `e50a5e6`。
- 歷史：219 個 `main` 提交。
- 內容：69 Works、21 Explore、11 Exam、1 Contest Studies，共 102 篇。
- 公開狀態：69 Works、21 Explore、11 Exam 已公開；Contest 的 `homogeneous-normalization` 仍是草稿。
- 驗證資產：118 個 Vitest／Playwright 測試檔或 spec、17 個頂層維護 script。
- 本次核對：`npm run typecheck`、iteration-dynamics controls audit、integration audit 均通過；`npm run audit:public-pages -- --json` 的 content、Explore cover、Exam cover、Contest cover 均無 issue。
- 本次沒有重跑完整 `npm test`、`npm run build` 或所有前端 route；本文不把它們寫成已通過。

## 從一開始到現在

| 時期 | 專案狀態 | 做對的優化 | 付出的代價／後來修正 |
|---|---|---|---|
| 5/20–5/27：從 Astro starter 變成作品集 | 5/25 已有 19 Works、5 Explore、24 個測試檔 | 建立 Astro + React + p5、純 CurveModule、registry、build-time thumbnail、Works／Explore 雛形；很早就開始寫 `p5toreact.md`、`textstyle.md` | 產品仍以快速增加內容為主；版本、文件與 runtime 同時快速變動，release 識別開始失真 |
| 5/28–6/12：快速擴張與產品化 | 5/31 為 44 Works、12 Explore；6/12 已到 72 Works、20 Explore | 加入 Explore interactives、封面、SEO、OG、搜尋、Pages、自訂網域、frontend validation、smoke、audit、release scripts | 27 個 draft 一次預建，內容角色尚未完全分清；工具與 scaffolding 的成長快於實際需要 |
| 6/18–6/24：whole-repo 收斂 | 6/23 回到 69 Works、20 Explore；刪除／合併重複內容與未使用 scaffolding | 大量縮小 export、共用 p5 lifecycle、刪除死碼、建立 scan ledger、改回原生 range、收斂更新路徑 | 清理曾越過行為邊界：錯把 range 改成 stepper／假軌道；`86f767e` 的機械改寫造成 6 頁 undefined identifier 與共享 `useEffect` 失效 |
| 7/15–7/17：效能與可靠度轉折 | Works stage chunk 約從 465 KB 降到 15 KB；Explore 約從 230 KB 降到 5 KB，再各自載入 slug root | per-slug code splitting、全站 Works smoke、安裝 TypeScript、清掉約 200 個 type errors，最後把 full `tsc --noEmit` 升成 CI gate | 先前只有 sampled smoke，6 個壞頁曾通過 build 與 unit tests；這是歷史上最明確的「驗證層級不足」事故 |
| 7/20–7/24：內容契約與第三集合 | Exam 從 gated preview 走到公開；加入 3D、線性規劃、觸控與封面 gate | 建立 Content ↔ Interaction contract、控制標籤 audit、Exam 獨立 schema／route／renderer、3D 共用投影層、觸控規則、cover pipeline | 曾把 Explore 寫成 Works 目錄；5/18 Explore 文案描述不存在的控制項；手機觸控、封面透明度與數學錯誤多在發布後才被發現 |
| 7/26–8/2：發現與導覽層 | 40 個跨集合 concepts、concept pages、2 條策展 learning paths | Exam 的 `topics` 與跨集合 `concepts` 分開；學習路徑改成小型人工 manifest，而非假裝能自動產生課程 | 一度想從 `order`／`audience` 推導教學順序；實際會得到傅立葉早於基礎三角等錯序，且把展示站誤當完整課程系統 |
| 8/4：第四集合與新主題 | 69 Works、21 Explore、11 Exam、1 Contest | Contest Studies 成為獨立集合；`homogeneous-normalization` 從錯誤的 Explore-only 想法移到 Contest；iteration classifier 已避免把有限尾段直接叫作混沌 | Contest 與 iteration-dynamics 被包在同一個 13,888 行變更；外部 review freeze 同日加入又取消。8/8 已把 Contest 固定為 draft backlog，並收斂 iteration 公開措辭 |

## 你實際優化了什麼

### 1. 從「很多互動頁」變成四種清楚產品

- **Works**：一個數學對象或技巧的深度互動作品。
- **Explore**：同一主題下的多種讀法，負責建立關係，不複製 Works 的結論。
- **Exam**：一道具體高中三年級考題，解釋考生會卡住的心智步驟。
- **Contest Studies**：競賽問題的可遷移方法、證明與等號位置；不是題庫，也不是進階 Explore。
- **Concept／Learning Path**：發現與策展層，不是第五個內容集合，也不是完整課程系統。

這項定位收斂，是後面 registry、route、schema、封面與驗證能各自穩定的前提。

### 2. 從單頁實作變成可維護的渲染架構

- 純數學／幾何留在 `src/curve`、`src/explore`、`src/exam`、`src/contest`。
- React root 管狀態與控制；renderer 只吃 snapshot；p5 lifecycle 集中在共用 hook。
- Works、Explore、Exam、Contest 各自有 registry 與 stage，不互相假共用。
- 3D 場景重用既有投影與 scene layer，沒有為少量頁面引入 three.js 或第二套 WebGL 世界。
- per-slug lazy import 大幅縮小所有頁面共載的 JavaScript。

### 3. 從「build 有過」變成多層驗證

現在已有不同層級的防線：

- 純幾何 focused tests。
- content、registry、cover、public-page audits。
- full TypeScript gate。
- Works／Explore／Contest controls audit。
- 每個 route 的 Playwright smoke 與 SEO／UX spec。
- `validate:changed` 依變更面選擇檢查。
- `validate:frontend` 把內容、測試、build、DOM 串成同一流程。

其中最重要的觀念改變是：**unit test、build、DOM、canvas screenshot、真實輸入各自只能證明一部分。**

### 4. 從「圖有畫出來」變成可讀、正確、可重現的視覺資產

- Works thumbnails 使用 build-time SVG；Explore／Exam／Contest 使用可重現的 SVG source → PNG pipeline。
- 開始在卡片尺寸與 contact sheet 裡檢查，而不是只看單張大圖。
- 開始把數學正確性納入封面 QA：垂足是否真的在平面、約束線是否通過角點、漸近線方向是否正確。
- 開始區分「元素不存在」與「元素存在但透明度乘完後看不見」。

### 5. 從發布清單變成策展與發現系統

- `order` 被重新確定為 publication/list order，不再假裝是學習順序。
- `audience` 只作展示 metadata，不是全站難度尺。
- concepts 跨 Works／Explore／Exam 聚合；Exam 保留細粒度 `topics`。
- learning paths 使用人工排序與承接文字，承認它是策展，不承諾進度、難度或完整課綱。

## 走過的彎路與判斷錯誤

| 當時選擇 | 為什麼當時看起來合理 | 回頭看哪裡錯 | 已有修正／之後規則 |
|---|---|---|---|
| 快速建立 27 個 draft 與大量 scaffold | 想先把未來課程地圖鋪好 | 角色、互動與發布順序還沒驗證，造成假進度與維護面 | 產生器預設只做 draft；互動按需要才建立；一次完成一條 vertical slice |
| 把 Explore 寫成多個 Works 的壓縮目錄 | 內容看似完整，也容易重用現成敘述 | 沒有 Explore 自己的共同物件與新結論 | Explore 必須有跨模式不變的主體；每個 mode 要承接前一個，而非只列連結 |
| 全 repo 清理時把 range 改成 stepper／假軌道 | 看似能統一 UI、刪除重複樣式 | 改掉了連續參數的正確原生控制與既有契約 | 數值連續調整用 native range；離散模式才用按鈕；只留單一更新路徑 |
| 機械縮小程式，但未讓完整 typecheck 與全頁 smoke 擋發布 | build 能成功、unit tests 能過、sampled smoke 看似夠快 | client-only component body 沒被 build 執行；6 頁 runtime crash 與共享 effect 失效仍上線 | full `tsc --noEmit` + full Works smoke 成為 gate；共享 root 改動要查所有 caller |
| 只用 DOM／`getImageData` 判斷 p5 頁面 | 自動化成本低、輸出容易比較 | rAF throttling 會讓 DOM 讀數停住，canvas 讀回也可能空白；曾誤報正常頁面 | p5 狀態先截圖強制繪製；DOM 與畫面衝突時先懷疑驗證方式 |
| 寫通用 canvas 掃描器 | 想一次抓全站空白、overflow、觸控問題 | 合成事件不可信、跨頁 pixel threshold 無意義、動畫單次取樣失真、KaTeX clip 造成假 overflow | 真實 mouse/CDP input；同頁前後比較；動畫多次取 max；用 body scrollWidth；仍保留人工檢查 |
| 先做桌面，手機與觸控晚點補 | 桌面開發與滑鼠操作最快 | 3D 與 15 個 gesture page 的手機互動晚於發布才補；`touch-action` 與 compatibility mouse event 判斷錯 | 任何 `mousePressed`／`mouseDragged` 同時檢查 touch wiring；至少驗 390px |
| 只確認封面「有元素」或大圖好看 | source 與 renderer 看似正確 | 卡片尺寸下 alpha 消失；有封面畫出反向漸近線、浮空垂足、錯誤約束角點 | contact sheet + 標題並排 + 數學 spot-check；機器不替代視覺語意判斷 |
| 從 `order`／`audience` 自動產生學習路徑 | metadata 已存在，看似不需新增資料 | publication order 不是教育順序，audience 也不是完整難度；自動序列會教學錯序 | 小型手寫 manifest；不新增 difficulty／progress，直到有真實需求 |
| 把 `homogeneous-normalization` 規劃成 Explore | 它有互動畫面，也能接一般主題導覽 | 核心其實是競賽不等式方法、證明與等號位置，會讓 Explore 定位膨脹 | 放在獨立 Contest Studies；四集合邊界不回退 |
| 新增外部 review freeze | 想用流程控制擴張風險 | 沒有已確認 reviewer、時間盒與輸入，文件本身變成阻塞；同日即取消 | 沒有具體 reviewer／期限／決策問題時，不建立 freeze；直接維持 draft 即可 |
| 版本字樣、package 與 tags 分離 | 早期快速發布，commit title 足以辨認 | `v1.0.2` tag 位於 `v1.0.3` 之後，`v1.0.4` 指向 docs commit；package 停在 1.2.1，但後面有 v2.0.x 標題 | 不重寫舊 tag；從下一版起只選一套 release truth，package、tag、release commit 同步 |
| Contest 與 iteration 一次合併 | 同期完成，合併看似省事 | 兩個不同產品面、52 檔與 13,888 行難以 review；大型 SVG 又遮蔽真實程式 diff | 一個 collection／一條 reader flow／一個 review unit；大型生成資產與邏輯分開檢查 |

## 現在回頭看，優先要修正什麼

### P0：先修「文件不是現況」（2026-08-08 第一輪已完成）

本輪已完成：

- `textstyle.md` 不再硬編 content 數量，改以 `audit:public-pages` 為 live truth。
- public-page、release、art、site UX、math review、AGENTS 與 editing rules 已補齊四集合邊界。
- TypeScript 規則已改成 current full `npm run typecheck` zero-error gate。
- Contest 已明寫為不依賴外部 reviewer 的 draft backlog。

後續原則：遇到其他歷史文件的舊三集合敘述時，依任務範圍逐步修正；不要另開一輪無邊界的全文件重寫。

### P0：收斂 Contest 的產品決策（已決定保持草稿）

`homogeneous-normalization` 保持 `draft: true`，定位為明確 backlog，不再設不存在的外部依賴。未來只有在使用者明確重啟發布時，才執行 repo 內可完成的數學、content／control／cover、typecheck、focused tests、build、desktop + 390px gate。

### P0：修正 iteration-dynamics 的公開數學語氣（已完成）

公開 content 與介面已改用「未偵測到短週期」「密集帶」「有限尾段判讀」；保留標準術語「混沌遊戲」，但不再把有限取樣的視覺跡象寫成 chaos proof。

### P1：整理 Git release 與未合併 refs

- 已決定採持續部署：例行更新不建立 SemVer tag，production revision 以 `main` commit 為準；`package.json` 的 `1.2.1` 只保留為歷史 metadata。
- 不改寫舊 tags；若未來明確重啟版本化 release，再讓 package、tag 與 release commit 同步。
- 盤點 5 個未合併 local branch 與 1 個歷史 stash。
- `codex/concept-aggregation`、兩個單題 Exam branch、`feat/learning-paths` 看起來是 squash merge 後的舊 branch，可在逐一確認後刪除。
- `codex/seo-structured-data` 含兩個 main 尚無直接對應的 SEO／section OG 提交；先重審意圖，再決定以最小 diff 移植或正式放棄，不能和其他舊 branch 一起直接刪。
- `stash@{0}` 來自已修復的 2026-07-17 truncation 事故；確認沒有唯一內容後再移除。

### P1：縮小 review unit

- 一個 commit 優先只處理一個 collection、slug group 或 shared root cause。
- source SVG／PNG 可同 feature 提交，但 review 時先把生成資產排除，讀完程式與數學，再檢查資產。
- 修改 shared p5／renderer／registry 時，先列所有 caller，再修共用 root；不要在每頁加補丁。

### P2：降低歷史維護噪音

- `scripts/explore-covers/iteration-dynamics.svg` 約 436 KB、11,025 行，是 repo 最大 tracked text file。若視覺不受損，可用較少點、合併 path 或簡化 source，避免每次 review 被資產淹沒。
- `docs/review-scan-ledger.md` 很有歷史價值，但不應繼續充當每日 runtime spec。完成本輪文件同步後，可把它定位為 historical ledger；日常決策回到 `AGENTS.md`、architecture、domain docs 與 executable audits。

## 以後固定採用的工作流程

### 0. 開始前先寫 6 行 brief

每次新增或大改先回答：

1. 讀者要理解什麼？
2. 它屬於 Works／Explore／Exam／Contest 哪一個？為什麼？
3. 讀者唯一最重要的操作是什麼？
4. 畫面唯一最重要的可見結論是什麼？
5. 哪個既有 slug／root／renderer／audit 最接近，可直接沿用？
6. 這次明確不做什麼？

第 2 題答不清楚時先不寫程式。第 5 題沒有查過時先不新增抽象。

### 1. 先追一條既有 vertical slice

依 collection 找一個相近、已公開且穩定的頁面，完整讀過：

```text
content → schema → registry → stage → root → geometry → renderer → cover → audit/test
```

只重用已存在的形狀；不要先建通用 engine、factory、第五個 collection 或未來用的 metadata。

### 2. 一次完成一條草稿垂直切片

- 預設 `draft: true`。
- 先完成一頁真實內容、一個真實互動與一個真實 cover，再考慮同組第二頁。
- Explore 要證明它不是 Works 目錄；Exam 要證明它仍是高三考試準備；Contest 要證明它在講方法／證明而非題庫。
- 不預接七個 placeholder、不替未發生需求建 progression／difficulty／generic engine。

### 3. 用變更風險選最小可靠 gate

| 變更 | 先跑 | 再跑 |
|---|---|---|
| 純文案／frontmatter | `npm run audit:content` | 對應 controls audit；涉及公開／route 再跑 integration、build |
| 純 geometry／數學 | focused Vitest + `npm run typecheck` | 對應 route smoke；公開 claim 做人工數學審查 |
| Root／hook／renderer | focused test + `npm run typecheck` | `npm run validate:changed -- --dry-run` 後跑選中的 smoke；shared root 要掃全部 callers |
| Cover／thumbnail | 對應 cover audit／thumbnail tests | card-size contact sheet + 數學 spot-check |
| 新 collection item／公開 | content、integration、cover、controls、typecheck | `npm test`、`npm run build`、desktop + 390px route 驗證 |
| Shared lifecycle／registry／CI | focused regression | full affected collection smoke；必要時全站 test/build |

命令格式要照 script 真實介面。例如單頁 Explore controls：

```bash
npm run audit:explore-controls -- iteration-dynamics
```

不要多傳一個 `--`，否則 script 會把它當 slug。

### 4. 前端結論要來自真實狀態

- p5／canvas：先截圖強制繪製，再判斷 DOM 與畫面。
- 互動：用真實 mouse／touch input；不要只 dispatch synthetic event。
- 行動版：至少 390px；有拖曳就檢查 touch wiring 與 `touch-action`。
- 封面：縮成卡片尺寸、與標題和鄰圖一起看。
- 數學：檢查定義域、退化情形、等號位置、極限／漸近行為，以及文案是否把 heuristic 寫成 proof。

### 5. 發布與 Git 只保留一套事實

1. `git status --short --branch`，先確認沒有混入其他工作。
2. `git diff --check`。
3. 只 stage 本次 exact scope。
4. 使用 Conventional Commit；不要用模糊的 `v2.0.3` 當功能提交名稱。
5. 有版本時，package、tag、release commit 同一次更新；沒有版本時就不造版本字樣。
6. push／merge 後確認 local／remote main 同步，並保留未納入的工作。

### 6. 每次交付只留下這個紀錄

```text
目標：
所屬 collection／邊界判斷：
重用的既有路徑：
本次刻意不做：
驗證：實際跑過的命令與 route
未完成／風險：
commit／PR：
```

這比再增加一份長期手動清單更可靠；可變數量交給 audits，決策才寫進文件。

## 下一步建議順序

1. 重審 SEO branch 後，再清理已被 squash merge 取代的 branch／stash。
2. 下一個 feature 全程試行本文的 6 行 brief → 單一 vertical slice → 風險式驗證 → exact-scope release。
3. 若 review noise 實際造成成本，再簡化 iteration-dynamics SVG；目前不為縮檔而重做視覺。

做到這三件事後，這個專案不需要更多流程；需要的是讓現有架構、文件與 gate 說同一件事。
