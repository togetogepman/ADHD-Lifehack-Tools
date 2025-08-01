### 1. ADHD の人が職場でつまづきやすい行動特性 - エビデンス整理
| 領域 | 具体的な困りごと | 代表的な研究・報告 |
|------|-----------------|------------------|
| **タスク開始 (Initiation)** | なかなか着手できず期限ぎりぎりまで放置 | 成人 ADHD では task‐initiation を含む実行機能が職務成果の中央値を大きく下げている  |
| **時間管理・遅延 (Time management)** | 見積もり誤差・遅刻・期限超過 | 仕事の組織化・時間管理の不全が就労維持を阻害  |
| **維持集中と中断 (Sustaining focus / Interruptions)** | こまめな離席・マルチタスクで集中が途切れる | 中断頻度は高く、戦略的な時計チェックが少ないほど成績悪化  |
| **過集中 (Hyper-focus)** | 区切りがつかず予定をオーバー | —（観察的知見が多い） |
| **対人衝突 (Interpersonal conflict)** | 忘却・衝動的発言による摩擦、支援体制不足で訴訟も | 企業が ADHD 研修を怠り差別と認定された判例  |

---

### 2. 現在のアプリで「測れるもの」と「測れないもの」

| カテゴリ | 現仕様で測定可能 | 測定困難／追加要件 |
|----------|----------------|------------------|
| **着手** | Start ボタン時刻 (✔) | “着手せずに諦めたタスク” を取得するには **計画入力UI** が要る |
| **集中維持** | *interruptionCount* と Pause イベント (✔) | 中断理由や外的要因までは取れない |
| **完走率** | finish ログ (✔) | 25 min 未満で放置された「未完了セッション」を自動記録するロジックが必要 |
| **時間帯** | start/end の時刻 (✔) | 就業外での活動を切り分けたければカレンダー連携が必要 |
| **見積 vs 実績** | EstPom と SpentPom (✔) | 日次プラン入力か AI 予測など計画値を事前に持たせる |
| **対人衝突** | — | 自己報告アンケート・同僚評価など別手段が必須 |
| **感情・モチベーション** | — | EMA* 形式のポップアップ質問が必要 |

> *EMA = Ecological Momentary Assessment

---

### 3. 本アプリで実行しうる実験案（例）

| 実験テーマ | 狙い | 必要データ／追加UI | 実施可否 |
|------------|-----|------------------|---------|
| **A. 着手支援機能の効果**<br>（例：朝イチ目標宣言 or “body-doubling” 通知） | 着手率↑／着手遅延↓ | Start 時刻、未着手率 | **可能** – 宣言入力欄・通知トグルを追加 |
| **B. タイムブロッキング vs ポモドーロ** | 完走率・中断率の比較 | セッション種別フラグ | **可能** – モード切替UI |
| **C. 長時間放置セッション検出とフィードバック** | 放置削減効果を検証 | 自動「abandoned」ログ | **可能** – タイマー停止状態を一定時間監視 |
| **D. 時間帯別集中分析** | ADHD当事者の“集中しやすい帯”を定量化 | start/end 時刻 | **可能** – 既存ログで足りる |
| **E. 見積精度トレーニング** | 見積-実績乖離の縮小 | EstPom, SpentPom, 日次計画入力 | **可能**（計画入力UI要） |
| **F. 中断理由別介入実験** | 外的要因/内部要因を区別 | Pause 時に“理由タグ”選択 | **可能** – ポップアップ実装 |
| **G. ストレス反応とコンフリクト** | 感情・衝突の自己申告とパフォーマンス相関 | ミニ質問票、衝突件数 | **困難** – 別システム連携が必要 |

---

### 4. 実験実施のための追加仕様（最小コア）

1. **開始ログ即時送信**  
   - `sendPomodoroLog` を *Start* 時にも呼び出し、`completed:false` で仮ログを作成  
   - 完走時に同じログを `completed:true` へ更新、放置は一定時間後に自動確定

2. **放置判定**  
   - 例：Start から 30 min 経過して *isActive=false* なら *abandoned* を送信

3. **計画入力 UI（任意）**  
   - その日の目標ポモ数やタスク優先度を登録 → 見積‐実績比較が可能

4. **中断理由タグ付け UI（任意）**  
   - Pause ボタンを押した時、*電話／通知／雑念／疲労* など選択式ポップアップ

5. **EMA 質問（任意）**  
   - 例：セッション後に「気分」「ストレス」1-5スケールを入力

---

### 5. 実験では測定できない／別途インフラが要る項目

- 上司・同僚との **実際の衝突件数**（面談ログや HR データ）
- **生理指標**（心拍・皮膚電気活動）による集中度
- **職務評価・昇進** といった長期アウトカム
- **環境要因**（騒音・席配置）— IoT センサーを導入しない限り取得不可

---

### 6. まとめ & 推奨アクション

1. **着手ログ** と **未完了（放置）ログ** を追加実装 → ADHD 特性の核心をとらえる  
2. 必要最小限の追加UIで **開始宣言・中断理由** を収集できる設計にする  
3. 研究フェーズでは **モード別／時間帯別／介入別** に A/B 実験が可能  
4. 対人衝突や情動面の測定は別途アンケート or 組織データ連携で補完する

これらを踏まえ、まずは **着手〜完了〜放置** を網羅的に記録するロギング拡張から着手するのが現実的です。