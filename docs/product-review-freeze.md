# 產品審查凍結與外部回饋包

更新：2026-08-04
凍結基準：`0231aa7 feat(content): add contest studies and iteration dynamics`

## 目前決策

- 定位：面向高中至大一數學好奇者的「作品型知識品牌」。
- 市場：台灣為主，國際可理解性為次要方向。
- 暫停新增題目與功能；只接受錯誤、數學修正與審查素材。
- `iteration-dynamics` 公開；`homogeneous-normalization` 留在獨立 Contest Studies 並保持草稿。
- 解凍門檻：至少 3 份專家回覆，加上 5 次目標使用者觀察。

公開頁基準：Works 69、Explore 21、Exam 11、Contest Studies 0；Contest Studies 另有 1 篇草稿。

## 四個 collection 的工作

| Collection | 使用者工作 | 不做什麼 |
|---|---|---|
| Works | 欣賞並操作單一數學對象的完整作品 | 不承諾課程順序 |
| Explore | 從大概念串起多件互動與觀察 | 不作為進階 Works 分類 |
| Exam | 拆解高三正式試題的關鍵心智步驟 | 不延伸成通用題庫 |
| Contest Studies | 從競賽母題整理方法、證明與等號位置 | 不併入 Explore，也不作模擬考 |

## 內部定位審查

### 已確認，先保持不動

- 首頁先呈現 Works 與 Explore，Exam、Concept 和未發布的 Contest 維持次要入口。
- About 已明示這不是完整課程，而是數學視覺化實驗與作品空間。
- Contest 的 content、registry、route、stage 與 draft/public gate 均獨立，沒有借用 Exam 模板。
- Contest 全部為草稿時，正式站不顯示導覽入口；開發環境仍可審閱完整流程。

### 需要外部證據，現在不改

- 首屏「數學與演算法的實驗」是否足以讓首次訪客知道適合誰、可得到什麼。
- 首次訪客能否只靠「作品集／主題導覽」辨認 Works 與 Explore 的差別。
- 大量內容是否被感覺為可探索的策展，或只是項目很多的目錄。
- Concept 與兩條 learning path 的入口是否太深，無法實際協助「從哪開始」。
- 國際方向目前只有視覺與數學符號可跨語言；正文仍以繁體中文為主。

目前沒有證據支持全面重構。上述問題若只得到單一意見，列入觀察；只有重複出現才改動資訊架構。

## 參照對象

比較使用者任務，不比較功能數量。

| 參照 | 本次要觀察的事 | 不照抄的部分 |
|---|---|---|
| [Mathigon](https://mathigon.org/about/) | 互動如何直接支持主動探索 | 完整課程與大型產品團隊範圍 |
| [Seeing Theory](https://seeing-theory.brown.edu/index.html) | 一個主題內的視覺敘事節奏 | 只聚焦機率統計的內容範圍 |
| [3Blue1Brown](https://www.3blue1brown.com/about/) | 選題、具體圖像先於抽象敘述 | 影片媒介與個人知名度 |
| [AoPS](https://artofproblemsolving.com/resources) | 競賽使用者對題源、完整證明和方法的期待 | 題庫與社群平台規模 |
| [數感實驗室](https://numeracylab.com/) | 台灣語境下的分享性與數學傳播 | 課程、活動與商業服務 |

## 審查素材

外部審查只提供四個入口，避免要求受訪者瀏覽整站：

1. [公開首頁](https://lab.lambliver.dev/)
2. [代表 Work：朱利亞集合](https://lab.lambliver.dev/works/julia-set/)
3. [代表 Explore：疊代動力學](https://lab.lambliver.dev/explore/iteration-dynamics/)
4. Contest 草稿：本機附件 `test-results/product-review/homogeneous-normalization-review.webm`

本機另有標註截圖：`test-results/product-review/contest-draft-annotated.png`。

Contest 數學摘要：設非負實數 $a+b+c=1$，研究

$$
9abc\le ab+bc+ca\le\frac{1+9abc}{4}.
$$

上界先齊次化成三次 Schur 不等式；下界使用兩次 AM-GM。程式測試已覆蓋非負性、共同縮放與全部等號位置。題目歸屬有二手資料交叉佐證為 2010 年全國高中數學聯賽廣東省預賽，但發布前仍需取得原題掃描或可追溯的一手來源。

## 固定六題問卷

1. 只看首頁 30 秒，你認為這個網站是什麼、做給誰用？
2. 如果現在要繼續，你第一個會點哪裡？為什麼？
3. Works、Explore、Exam、Contest Studies 各自有什麼差別？哪兩個最容易混淆？
4. 四份素材中，哪一份最值得繼續看？請指出具體畫面或內容。
5. 哪裡讓你停頓、看不懂、覺得重複，或不知道下一步？
6. 你會把其中哪一頁分享給別人？若都不會，主要原因是什麼？

不問抽象的「喜不喜歡」分數；記錄實際點擊、停頓、理解與理由。

## 目標使用者觀察

樣本固定為高中生 2 位、大一學生 2 位、自主數學學習者 1 位，每次 15–20 分鐘。

1. 30 秒自由看首頁，受訪者口述網站用途與目標對象。
2. 不提示入口，請受訪者選一條路繼續。
3. 依序開四份審查素材；觀察首次操作，不教控制方式。
4. 回答固定六題；只追問「你在哪裡看到／為什麼這樣判斷」。
5. 記錄時間、第一個點擊、卡住位置、collection 分類與分享意願。

## 第一輪專業對象

| 對象 | 想請對方判斷 | 公開聯絡入口 |
|---|---|---|
| 清大林勇吉 | 視覺化是否真的支援數學理解 | [官方簡介](https://gimse.site.nthu.edu.tw/p/404-1115-29744.php?Lang=zh-tw) |
| 師大楊凱琳 | Contest 的解題、證明與閱讀敘事 | [研究頁](https://math.ntnu.edu.tw/~kailin/mysite/Research/default.html) |
| 國北教大游志弘 | 互動、視覺化程式與數位學習體驗 | [官方師資頁](https://me.ntue.edu.tw/p/412-1036-2105.php?Lang=zh-tw) |
| 數感實驗室 | 台灣大眾傳播、選題與分享性 | [官方網站](https://numeracylab.com/) |
| 高中教師／競賽教練 | 教學現場、難度與研題價值 | 優先使用現有人脈；否則請[台灣數學教育學會](https://tame.tw/main.php)轉介 |
| Mathigon | 國際互動數學產品視角 | [官方聯絡頁](https://mathigon.org/contact/) |

第 7 天只追蹤一次。第 14 天若不足三份專家回覆，第二輪改寄均一教育平台與台灣數學教育學會推薦的其他教師。

## 專家邀請信草稿

主旨：邀請 15 分鐘審閱數學互動作品網站與競賽研題草稿

> 您好，我是「羊·實驗」的作者，數學系背景，目前從事前端與 Android 工程。這是一個以互動程式呈現數學概念的個人作品網站，不是完整線上課程。
>
> 我正在決定下一步應繼續擴充內容，還是先調整定位與資訊架構，因此暫停新功能，想邀請您用約 15 分鐘看首頁、兩篇公開作品，以及一段尚未發布的競賽研題操作影片。希望您特別指出：網站的對象是否清楚、四類內容是否容易混淆，以及研題的數學敘事／互動是否真的幫助理解。
>
> 附上四個入口與六個簡短問題。任何直接、負面的意見都很有幫助；若時間不便，也完全不需要回覆。謝謝您。

寄給各對象時，只替換第二段第一句，明確寫出希望對方從「數學視覺化／證明閱讀／互動設計／大眾傳播」哪個角度判斷，不增加泛泛的自我介紹。

## Mathigon invitation draft

Subject: Request for brief feedback on an independent interactive mathematics portfolio

> Hello Mathigon team,
>
> I am building Lamb Lab, an independent interactive mathematics portfolio for math-curious high-school and early-university learners in Taiwan. I have paused feature development while reviewing whether the site's positioning and collection structure are understandable.
>
> Would someone on your team be willing to spend about 15 minutes reviewing the homepage, one visual work, one guided exploration, and a short video of a draft competition-problem study? I am especially interested in whether the interactions support active mathematical thinking and whether a first-time visitor knows where to begin.
>
> Direct critical feedback is welcome. I understand if the team does not have capacity to reply. Thank you.

## 目標使用者邀請草稿

> 我正在測試一個數學互動作品網站，不是在測驗你的數學能力。想請你用 15–20 分鐘自由操作幾個頁面，邊看邊說你以為它在做什麼、哪裡想點、哪裡看不懂。過程不需要準備，也沒有正確答案；我只會記錄操作與意見，不公開姓名。

## 第 7 天追蹤草稿

> 您好，補充提醒前一封數學互動網站審閱邀請。若近期沒有時間，請直接忽略即可；若方便，只回答「網站適合誰」與「最需要先修的一件事」兩題也很有幫助。謝謝您。

## 證據紀錄

每份回饋只記一列；相同人的多句意見不重複計票。

| 日期 | 類型 | 對象代碼 | 首頁定位 | 第一點擊 | collection 混淆 | 數學問題 | 分享意願／理由 | 原話摘要 |
|---|---|---|---|---|---|---|---|---|
|  | 專家／使用者 |  |  |  |  |  |  |  |

## 解凍決策

| 重複證據 | 決策 |
|---|---|
| 定位清楚、collection 可區分、無重大數學問題 | 發布 Contest 首篇，再規劃下一篇 |
| 首頁吸引力不足，但 collection 邊界清楚 | 只調整首頁敘事、選題與排序 |
| 至少 3 位使用者或 2 位專家混淆 collection | 審查導覽、列表與入口；Contest 仍維持獨立 |
| 專家指出定義、條件、等價轉換或推導錯誤 | 維持草稿，修正後重新審查 |
| 只有單一審美偏好，未影響理解 | 保持不動 |

達到 3 份專家回覆與 5 次使用者觀察後，產出「發布前必修／下一輪改善／保持不動」三段決策報告，再解除凍結。
