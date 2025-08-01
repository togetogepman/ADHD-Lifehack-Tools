# ADHD Task Manager 日本語ドキュメント

このアプリケーションは、ADHDの方向けにタスク管理をサポートするシンプルなウェブアプリです。Pomodoroタイマーを使いながら、タスクを一覧管理し、集中すべき作業を明確にします。

## 特徴

- Google Apps Script をバックエンドとして利用し、スプレッドシートにタスクを保存します。
- Pomodoro タイマーにより、現在取り組んでいるタスクを意識しながら作業を進められます。
- React + TypeScript + Vite により高速に動作します。

## セットアップ

1. リポジトリをクローンします。
2. `pnpm install` を実行して依存パッケージをインストールします。（`npm install` でも構いません）
3. `.env.local.example` を `.env.local` にコピーします。
4. `.env.local` 内で `VITE_API_BASE` を Google Apps Script で公開した API の URL に設定します。

## 開発用サーバーの起動

```bash
pnpm run dev
```

上記コマンドを実行すると、ローカルサーバーが起動し、ブラウザで http://localhost:5173 を開くとアプリを確認できます。

## ビルド

```bash
pnpm run build
```

ビルド後、`dist` ディレクトリに静的ファイルが生成されます。

## デプロイ方法

ビルドして生成されたファイルを任意の静的ホスティングサービスに配置することでデプロイできます。Google Apps Script 側の API がアクセス可能であれば動作します。

`pnpm run deploy` を実行すると、ビルド済みの `dist` フォルダを `gh-pages` ブランチに公開し、GitHub Pages からアクセスできるようになります。GitHub リポジトリの **Pages** 設定で公開ブランチを `gh-pages` に指定してください。リポジトリ名に合わせて `vite.config.ts` の `base` オプションも調整可能です。

## 使い方

1. タスクを入力して追加すると、一覧に表示されます。
2. Pomodoro タイマーを開始すると、指定した時間集中して作業を行います。タイマーが終了したら、ポモドーロ数が自動でカウントアップされます。
3. タスクは Google スプレッドシートに保存されるため、後から履歴を確認することもできます。

## ライセンス

このプロジェクトは MIT ライセンスで提供されています。

