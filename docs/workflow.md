# GAS学習支援Webアプリ - アジャイル開発ワークフロー

## 📋 プロジェクト概要

**プロジェクト名**: GAS学習支援Webアプリ
**開発期間**: 8-10週間（想定）
**技術スタック**: Next.js + Supabase + Vercel
**開発戦略**: アジャイル（2週間スプリント × 4-5回）
**ランタイム**: bun 1.2.21
**コード品質**: Biome 2.3.9（リンター + フォーマッター）

---

## 🎯 スプリント構成

### Sprint 0: プロジェクトセットアップ（1週間）
**目標**: 開発環境の構築と基盤整備

### Sprint 1: 認証とユーザー管理（2週間）
**目標**: MVP - ユーザー登録・ログイン・承認フロー

### Sprint 2: コンテンツ基盤（2週間）
**目標**: コンテンツ表示と進捗管理の基本機能

### Sprint 3: 課題管理と通知（2週間）
**目標**: 課題提出・フィードバック・通知機能

### Sprint 4: 管理機能と改善（2週間）
**目標**: 運営管理画面と全体最適化

### Sprint 5: テストとリリース準備（1週間）
**目標**: 統合テスト、バグ修正、本番リリース

---

## 📊 ガントチャート

```
Week    1    2    3    4    5    6    7    8    9    10
        |====|====|====|====|====|====|====|====|====|
Sprint0 [██]
Sprint1      [████████]
Sprint2                [████████]
Sprint3                          [████████]
Sprint4                                    [████████]
Sprint5                                              [████]

主要マイルストーン:
W1  ✓ 環境セットアップ完了
W3  ✓ ログイン・認証機能リリース
W5  ✓ コンテンツ閲覧MVP完成
W7  ✓ 課題提出機能リリース
W9  ✓ 運営管理画面完成
W10 ✓ 本番リリース
```

---

## 🏗️ Sprint 0: プロジェクトセットアップ（Week 1）

### タスク一覧

**環境構築** (3日)
- [x] Next.js 16プロジェクト初期化（create-next-app）
- [x] TypeScript + Tailwind CSS設定確認
- [x] Biome設定（リンター + フォーマッター）
- [x] bun セットアップ
- [ ] Git初期化 + リポジトリ作成

**Supabase セットアップ** (2日)
- [ ] Supabaseプロジェクト作成
- [ ] データベーススキーマ設計（初期版）
- [ ] Row Level Security（RLS）ポリシー設計
- [ ] 環境変数設定（.env.local）

**Vercel デプロイ** (1日)
- [ ] Vercelプロジェクト作成
- [ ] 継続的デプロイ設定（main branch）
- [ ] プレビュー環境設定

**開発基盤** (1日)
- [ ] プロジェクト構成設計（app router構造）
- [ ] 共通コンポーネント設計（Button, Input, Card等）
- [ ] レイアウト設計（Header, Footer, Navigation）
- [ ] 開発ガイドライン作成（CLAUDE.md更新）

### 成果物
- ✅ 動作する開発環境
- ✅ Supabaseプロジェクト（スキーマ設計済み）
- ✅ Vercelデプロイパイプライン
- ✅ プロジェクト基盤コード

### 依存関係
なし（プロジェクト開始）

---

## 🔐 Sprint 1: 認証とユーザー管理（Week 2-3）

### タスク一覧

**Supabase Auth統合** (3日)
- [ ] Supabase Auth設定（Google OAuth）
- [ ] Next.js認証フロー実装
- [ ] ミドルウェア設定（認証チェック）
- [ ] セッション管理実装

**ユーザー登録フロー** (3日)
- [ ] 登録画面UI実装
- [ ] ユーザー情報入力フォーム（名前、メール）
- [ ] 未承認状態の管理（approved: false）
- [ ] 承認待ち画面実装

**Slack通知連携** (2日)
- [ ] Slack Webhook設定
- [ ] 新規登録時のSlack通知実装
- [ ] 通知メッセージフォーマット設計

**承認管理機能（運営側）** (3日)
- [ ] 承認待ちユーザー一覧画面
- [ ] 承認/却下ボタン実装
- [ ] 承認処理API実装
- [ ] メール通知実装（承認完了時）

**アクセス制御** (2日)
- [ ] RLSポリシー実装（承認済みユーザーのみアクセス）
- [ ] 未承認ユーザーのリダイレクト処理
- [ ] 権限チェックミドルウェア

### 成果物
- ✅ Googleログイン機能
- ✅ ユーザー登録・承認フロー
- ✅ Slack通知連携
- ✅ 基本的なアクセス制御

### 依存関係
- Sprint 0の完了（環境構築）

### テスト項目
- [ ] Google OAuth認証動作確認
- [ ] 未承認ユーザーのアクセス制限確認
- [ ] Slack通知の受信確認
- [ ] 承認フロー全体の動作確認

---

## 📚 Sprint 2: コンテンツ基盤（Week 4-5）

### タスク一覧

**データベーススキーマ** (2日)
- [ ] Phase / Week / Contentテーブル設計
- [ ] コンテンツタイプ定義（video, text, exercise）
- [ ] 進捗管理テーブル設計（user_progress）
- [ ] マイグレーション実行

**コンテンツ一覧画面（受講生）** (3日)
- [ ] Phase一覧表示
- [ ] Week一覧表示（階層構造）
- [ ] コンテンツ一覧表示
- [ ] 進捗状態の可視化（完了チェック）

**コンテンツ詳細画面** (4日)
- [ ] 動画教材表示（YouTube埋め込み）
- [ ] テキスト教材表示（Markdown対応）
- [ ] 演習課題表示
- [ ] 完了ボタン実装

**進捗管理機能** (3日)
- [ ] 進捗記録API実装
- [ ] 進捗率計算ロジック
- [ ] ホーム画面：進捗サマリー表示
- [ ] Phase/Week単位の進捗表示

**コンテンツ管理（運営側）** (3日)
- [ ] コンテンツ管理画面UI
- [ ] コンテンツCRUD API実装
- [ ] Phase/Week作成・編集機能
- [ ] コンテンツ並び替え機能

### 成果物
- ✅ コンテンツ閲覧機能（動画・テキスト・演習）
- ✅ 進捗管理機能
- ✅ 運営側コンテンツ管理画面

### 依存関係
- Sprint 1の完了（認証・ユーザー管理）

### テスト項目
- [ ] YouTube動画の埋め込み表示確認
- [ ] Markdownレンダリング確認
- [ ] 進捗記録・表示の正確性確認
- [ ] コンテンツCRUD操作確認

---

## ✍️ Sprint 3: 課題管理と通知（Week 6-7）

### タスク一覧

**課題提出機能（受講生）** (3日)
- [ ] 課題提出画面UI
- [ ] コード貼り付けフォーム
- [ ] URL共有フォーム
- [ ] 提出API実装

**Slack通知（課題提出時）** (1日)
- [ ] 課題提出時のSlack通知実装
- [ ] 通知内容設計（受講生名、課題名、提出内容へのリンク）

**課題管理（運営側）** (3日)
- [ ] 提出課題一覧画面
- [ ] 未確認課題フィルタ
- [ ] 課題詳細表示
- [ ] フィードバック入力フォーム

**フィードバック機能** (3日)
- [ ] フィードバック保存API
- [ ] メール通知実装（フィードバック完了時）
- [ ] アプリ内通知実装
- [ ] 受講生側：フィードバック確認画面

**お知らせ機能** (3日)
- [ ] お知らせ管理画面（運営）
- [ ] お知らせCRUD API
- [ ] ホーム画面：お知らせ表示
- [ ] お知らせ一覧ページ

### 成果物
- ✅ 課題提出・フィードバック機能
- ✅ お知らせ機能
- ✅ 通知システム（Slack + メール + アプリ内）

### 依存関係
- Sprint 2の完了（コンテンツ基盤）
- Sprint 1の通知基盤（Slack連携）

### テスト項目
- [ ] 課題提出フロー全体確認
- [ ] Slack/メール通知の受信確認
- [ ] フィードバック機能動作確認
- [ ] お知らせ表示・管理確認

---

## 🎛️ Sprint 4: 管理機能と改善（Week 8-9）

### タスク一覧

**運営ダッシュボード** (3日)
- [ ] サマリー画面実装
- [ ] 受講生数・進捗率統計
- [ ] 課題提出状況サマリー
- [ ] グラフ/チャート表示（Chart.js等）

**受講生管理画面** (3日)
- [ ] 受講生一覧表示
- [ ] 個別受講生詳細画面
- [ ] 詳細進捗表示（コンテンツ単位）
- [ ] フィルタ・検索機能

**UI/UX改善** (3日)
- [ ] レスポンシブデザイン対応
- [ ] アクセシビリティ改善
- [ ] ローディング状態の改善
- [ ] エラーハンドリング改善

**パフォーマンス最適化** (2日)
- [ ] 画像最適化（next/image活用）
- [ ] コード分割（dynamic import）
- [ ] キャッシング戦略実装
- [ ] Core Web Vitals改善

**セキュリティ強化** (2日)
- [ ] RLSポリシー全体レビュー
- [ ] 入力バリデーション強化
- [ ] XSS/CSRF対策確認
- [ ] 環境変数セキュリティチェック

### 成果物
- ✅ 運営ダッシュボード
- ✅ 受講生詳細管理機能
- ✅ UI/UX改善版
- ✅ パフォーマンス・セキュリティ強化

### 依存関係
- Sprint 1-3の全機能完成

### テスト項目
- [ ] 各種統計データの正確性確認
- [ ] レスポンシブデザイン確認（モバイル・タブレット）
- [ ] パフォーマンス計測（Lighthouse）
- [ ] セキュリティ監査実施

---

## 🚀 Sprint 5: テストとリリース準備（Week 10）

### タスク一覧

**統合テスト** (2日)
- [ ] E2Eテストシナリオ作成
- [ ] 受講生フロー全体テスト
- [ ] 運営フロー全体テスト
- [ ] クロスブラウザテスト

**バグ修正** (2日)
- [ ] 既知のバグ修正
- [ ] テストで発見された問題対応
- [ ] エッジケース処理

**ドキュメント整備** (1日)
- [ ] README.md更新
- [ ] 運営マニュアル作成
- [ ] デプロイ手順書作成
- [ ] トラブルシューティングガイド

**本番リリース準備** (2日)
- [ ] 本番環境設定確認
- [ ] データベースマイグレーション
- [ ] DNS設定（カスタムドメイン）
- [ ] モニタリング設定（Vercel Analytics等）
- [ ] バックアップ設定

### 成果物
- ✅ テスト完了レポート
- ✅ 本番環境構築
- ✅ 運営マニュアル
- ✅ リリース準備完了

### 依存関係
- Sprint 1-4の全機能完成

### テスト項目
- [ ] 全機能の統合テスト完了
- [ ] パフォーマンステスト合格
- [ ] セキュリティテスト合格
- [ ] 本番環境動作確認

---

## 📈 タスク優先度マトリクス

### 🔴 Critical（必須・MVP）
- 認証・ログイン機能
- ユーザー承認フロー
- コンテンツ閲覧（動画・テキスト・演習）
- 進捗記録・表示
- 課題提出・フィードバック

### 🟡 High（重要）
- Slack通知連携
- メール通知
- 運営ダッシュボード
- 受講生管理画面
- お知らせ機能

### 🟢 Medium（推奨）
- UI/UX改善
- パフォーマンス最適化
- レスポンシブデザイン
- アクセシビリティ対応

### ⚪ Low（将来検討）
- 決済機能
- 学習時間記録
- コミュニティ機能
- GitHub連携

---

## 🔄 依存関係図

```
Sprint 0: セットアップ
    ↓
Sprint 1: 認証・ユーザー管理
    ↓
Sprint 2: コンテンツ基盤 ← Sprint 1（認証必須）
    ↓
Sprint 3: 課題管理 ← Sprint 2（コンテンツ必須）
    ↓                ← Sprint 1（通知基盤）
Sprint 4: 管理機能 ← Sprint 1-3（全機能）
    ↓
Sprint 5: テスト・リリース ← Sprint 1-4（全機能）
```

---

## 🛠️ 技術実装詳細

### データベーススキーマ（Supabase）

```sql
-- ユーザーテーブル（Supabase Auth拡張）
users (
  id uuid PRIMARY KEY,
  email text,
  name text,
  role text, -- 'student' | 'instructor'
  approved boolean DEFAULT false,
  created_at timestamp
)

-- Phaseテーブル
phases (
  id uuid PRIMARY KEY,
  title text,
  description text,
  order_index int,
  created_at timestamp
)

-- Weekテーブル
weeks (
  id uuid PRIMARY KEY,
  phase_id uuid REFERENCES phases(id),
  title text,
  description text,
  order_index int,
  created_at timestamp
)

-- コンテンツテーブル
contents (
  id uuid PRIMARY KEY,
  week_id uuid REFERENCES weeks(id),
  type text, -- 'video' | 'text' | 'exercise'
  title text,
  content text, -- YouTube URL or Markdown text
  order_index int,
  created_at timestamp
)

-- 進捗テーブル
user_progress (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  content_id uuid REFERENCES contents(id),
  completed boolean DEFAULT false,
  completed_at timestamp,
  UNIQUE(user_id, content_id)
)

-- 課題提出テーブル
submissions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  content_id uuid REFERENCES contents(id),
  submission_type text, -- 'code' | 'url'
  content text,
  feedback text,
  feedback_at timestamp,
  created_at timestamp
)

-- お知らせテーブル
announcements (
  id uuid PRIMARY KEY,
  title text,
  content text,
  published_at timestamp,
  created_at timestamp
)
```

### APIルート構成

```
app/api/
  ├── auth/
  │   ├── callback/route.ts (OAuth callback)
  │   └── signout/route.ts
  ├── users/
  │   ├── route.ts (GET: list, POST: create)
  │   ├── [id]/route.ts (GET, PATCH, DELETE)
  │   └── [id]/approve/route.ts (POST)
  ├── contents/
  │   ├── route.ts (GET: list, POST: create)
  │   ├── [id]/route.ts (GET, PATCH, DELETE)
  │   └── [id]/progress/route.ts (POST: mark complete)
  ├── submissions/
  │   ├── route.ts (GET: list, POST: create)
  │   └── [id]/feedback/route.ts (POST)
  ├── announcements/
  │   └── route.ts (GET: list, POST: create)
  └── notifications/
      ├── slack/route.ts (POST)
      └── email/route.ts (POST)
```

### フォルダ構成

```
gas-skillup-app/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── pending-approval/page.tsx
│   ├── (student)/
│   │   ├── home/page.tsx
│   │   ├── contents/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── submissions/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── announcements/page.tsx
│   ├── (instructor)/
│   │   ├── dashboard/page.tsx
│   │   ├── students/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── approvals/page.tsx
│   │   ├── submissions/page.tsx
│   │   ├── contents/page.tsx
│   │   └── announcements/page.tsx
│   ├── api/
│   └── layout.tsx
├── components/
│   ├── ui/ (共通UIコンポーネント)
│   ├── student/ (受講生向けコンポーネント)
│   └── instructor/ (運営向けコンポーネント)
├── lib/
│   ├── supabase/ (Supabaseクライアント)
│   ├── hooks/ (カスタムフック)
│   └── utils/ (ユーティリティ関数)
└── types/
    └── database.types.ts (Supabase型定義)
```

---

## 📋 チェックリスト形式タスク

### Sprint 0
- [ ] Next.jsプロジェクト作成
- [ ] Supabaseプロジェクト作成
- [ ] Vercelデプロイ設定
- [ ] 基本レイアウト実装

### Sprint 1
- [ ] Google OAuth設定
- [ ] ユーザー登録画面
- [ ] 承認待ち画面
- [ ] Slack通知実装
- [ ] 承認管理画面

### Sprint 2
- [ ] DBスキーマ実装
- [ ] コンテンツ一覧画面
- [ ] コンテンツ詳細画面
- [ ] 進捗管理機能
- [ ] 運営側コンテンツ管理

### Sprint 3
- [ ] 課題提出画面
- [ ] 課題管理画面
- [ ] フィードバック機能
- [ ] 通知システム完成
- [ ] お知らせ機能

### Sprint 4
- [ ] ダッシュボード実装
- [ ] 受講生詳細画面
- [ ] UI/UX改善
- [ ] パフォーマンス最適化
- [ ] セキュリティ強化

### Sprint 5
- [ ] E2Eテスト実施
- [ ] バグ修正
- [ ] ドキュメント作成
- [ ] 本番環境構築
- [ ] リリース

---

## 🎯 成功基準（Definition of Done）

各Sprintで以下を満たす必要がある：

1. **機能要件**
   - 全タスクが実装完了
   - 受入テスト合格

2. **品質要件**
   - TypeScriptエラーゼロ
   - Biome チェック合格（警告ゼロ）
   - 主要機能のテスト実装

3. **デプロイ要件**
   - Vercelプレビュー環境で動作確認
   - レビュー承認済み

4. **ドキュメント要件**
   - コード内コメント適切
   - 必要に応じてREADME更新

---

## 📞 コミュニケーション

### デイリースタンドアップ（推奨）
- 昨日やったこと
- 今日やること
- ブロッカー

### スプリントレビュー（2週間ごと）
- 完成機能のデモ
- フィードバック収集

### スプリントレトロスペクティブ
- 良かった点
- 改善点
- Next Actionアイテム

---

## 🔧 開発ツール推奨

- **IDE**: VS Code
- **拡張機能**:
  - Biome (biomejs.biome)
  - Tailwind CSS IntelliSense
  - Database Client (Supabase用)
- **ランタイム**: bun (すべての npm コマンドを bun に置き換え)
- **バージョン管理**: Git + GitHub
- **プロジェクト管理**: GitHub Projects / Notion
- **コミュニケーション**: Slack

### bunコマンド例
```bash
bun install              # パッケージインストール
bun add <package>        # パッケージ追加
bun add -d <package>     # 開発依存パッケージ追加
bun run dev              # 開発サーバー起動
bun run build            # ビルド
bun run lint             # リンティング
bun run format           # フォーマット
```

---

## 📚 参考リソース

- [Next.js公式ドキュメント](https://nextjs.org/docs)
- [Supabase公式ドキュメント](https://supabase.com/docs)
- [Tailwind CSS公式ドキュメント](https://tailwindcss.com/docs)
- [Vercelドキュメント](https://vercel.com/docs)

---

**最終更新**: 2024年12月
**ドキュメントバージョン**: 1.0
