# GAS学習支援Webアプリ

Google Apps Script (GAS) を学ぶ受講生向けの学習支援プラットフォームです。

## 🎯 プロジェクト概要

- **目的**: GAS学習コンテンツの配信、進捗管理、課題提出・フィードバック機能を提供
- **対象ユーザー**: 受講生（学習者）、運営（講師・管理者）
- **主な機能**:
  - 動画・テキスト・演習コンテンツの配信
  - 学習進捗の記録・可視化
  - 課題の提出・フィードバック
  - お知らせ機能
  - 運営ダッシュボード

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 16 (App Router) |
| 言語 | TypeScript 5 |
| ランタイム | Bun 1.2.21 |
| スタイリング | Tailwind CSS 4 |
| データベース | Supabase (PostgreSQL) |
| 認証 | Supabase Auth (Google OAuth) |
| ホスティング | Vercel |
| リンター/フォーマッター | Biome 2.3.9 |
| テスト | Playwright |

## 📁 プロジェクト構成

```
gas-skillup-app/
├── app/                    # Next.js App Router
│   ├── (auth)/            # 認証関連ページ
│   │   ├── login/         # ログインページ
│   │   └── pending-approval/ # 承認待ちページ
│   ├── student/           # 受講生向けページ
│   │   ├── dashboard/     # ダッシュボード
│   │   ├── contents/      # コンテンツ一覧・詳細
│   │   ├── submissions/   # 課題提出
│   │   └── announcements/ # お知らせ
│   ├── instructor/        # 運営向けページ
│   │   ├── dashboard/     # 運営ダッシュボード
│   │   ├── students/      # 受講生管理
│   │   ├── submissions/   # 課題管理
│   │   ├── contents/      # コンテンツ管理
│   │   ├── approvals/     # 承認管理
│   │   └── announcements/ # お知らせ管理
│   ├── _components/       # 共通コンポーネント
│   ├── _lib/             # ユーティリティ、Supabaseクライアント
│   └── _types/           # TypeScript型定義
├── components/ui/         # UIコンポーネント（Button, Card等）
├── lib/                   # ユーティリティ関数
├── tests/                 # E2Eテスト
│   ├── e2e/              # Playwrightテストファイル
│   └── utils/            # テストユーティリティ
├── docs/                  # ドキュメント
│   ├── design/           # 設計ドキュメント
│   └── manuals/          # 運用マニュアル
└── public/               # 静的ファイル
```

## 🚀 セットアップ

### 前提条件

- [Bun](https://bun.sh/) 1.2.21 以上
- [Node.js](https://nodejs.org/) 20.x 以上（一部ツールで必要）
- Supabaseアカウント
- Vercelアカウント（デプロイ用）

### 1. リポジトリのクローン

```bash
git clone https://github.com/your-org/gas-skillup-app.git
cd gas-skillup-app
```

### 2. 依存関係のインストール

```bash
bun install
```

### 3. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定します：

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Supabase Service Role Key (Server Actions用)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. 開発サーバーの起動

```bash
bun run dev
```

http://localhost:3000 でアプリケーションにアクセスできます。

## 📝 開発コマンド

```bash
# 開発サーバー起動
bun run dev

# 本番ビルド
bun run build

# 本番サーバー起動
bun run start

# リンティング
bun run lint

# リンティング（自動修正）
bun run lint:fix

# フォーマット
bun run format

# E2Eテスト実行
bun run test:e2e

# E2Eテスト（UIモード）
bun run test:e2e:ui

# E2Eテスト（ブラウザ表示）
bun run test:e2e:headed

# テストレポート表示
bun run test:e2e:report
```

## 🔐 認証フロー

1. **Google OAuth認証**: ユーザーはGoogleアカウントでログイン
2. **承認待ち**: 新規ユーザーは運営による承認が必要
3. **承認後**: ロールに応じて受講生または運営画面にアクセス可能

```
ログイン → 承認待ち → 承認 → ダッシュボード
```

## 📊 データベース構造

主要テーブル：

- `profiles`: ユーザープロフィール（認証情報と連携）
- `phases`: 学習フェーズ
- `weeks`: 週単位のコンテンツグループ
- `contents`: 学習コンテンツ（動画、テキスト、演習）
- `user_progress`: ユーザーの進捗状況
- `submissions`: 課題提出
- `announcements`: お知らせ

詳細は [データベース設計書](docs/design/database-design.md) を参照してください。

## 🧪 テスト

E2Eテストは Playwright を使用しています。

```bash
# 全テスト実行
bun run test:e2e

# 特定のテストファイルを実行
bunx playwright test tests/e2e/login.spec.ts

# UIモードでテスト実行
bun run test:e2e:ui
```

テストカバレッジ：
- ログインページの表示・動作
- 認証リダイレクト
- ページナビゲーション
- レスポンシブデザイン
- アクセシビリティ基本確認
- パフォーマンス基本確認

## 📚 ドキュメント

- [設計ドキュメント](docs/design/README.md)
- [API仕様書](docs/design/api-spec.md)
- [データベース設計書](docs/design/database-design.md)
- [運営マニュアル](docs/manuals/operation-guide.md)
- [デプロイ手順書](docs/manuals/deploy-guide.md)
- [トラブルシューティング](docs/manuals/troubleshooting.md)

## 🔄 開発フロー

1. `feature/xxx` ブランチを作成
2. 開発・テスト
3. `bun run lint` でコード品質確認
4. Pull Request作成
5. レビュー・承認
6. `main` ブランチにマージ
7. Vercelが自動デプロイ

## 📄 ライセンス

Private - All rights reserved

## 👥 コントリビューター

開発チーム一同
