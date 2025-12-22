# GAS学習支援Webアプリ - アジャイル開発ワークフロー

## 📋 プロジェクト概要

**プロジェクト名**: GAS学習支援Webアプリ
**開発期間**: 8-10週間（想定）
**技術スタック**: Next.js + Supabase + Vercel
**開発戦略**: アジャイル（2週間スプリント × 4-5回）
**ランタイム**: bun 1.2.21
**コード品質**: Biome 2.3.9（リンター + フォーマッター）

---

## 🎯 スプリント構成（フロントエンド優先戦略）

### Sprint 0: プロジェクトセットアップ（1週間）
**目標**: 開発環境の構築とフロントエンド基盤整備

### Sprint 1: UI基盤とモックデータ（2週間）
**目標**: 受講生向け画面のUI実装（モックデータ使用）

### Sprint 2: 運営画面とコンポーネント完成（2週間）
**目標**: 運営向け画面のUI実装と全体デザイン統一

### Sprint 3: バックエンド統合（認証・DB）（2週間）
**目標**: Supabase統合、認証実装、モックからリアルデータへ移行

### Sprint 4: 機能完成と改善（2週間）
**目標**: 通知機能、課題フィードバック、全体最適化

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
W1  ✓ フロントエンド開発環境完成
W3  ✓ 受講生向けUI完成（モックデータ）
W5  ✓ 運営画面UI完成・デザイン統一
W7  ✓ バックエンド統合・認証実装完了
W9  ✓ 全機能統合完了
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
- [x] Git初期化 + リポジトリ作成

**設計ドキュメント作成** (2日)
- [x] 画面遷移図作成（受講生・運営それぞれ）
- [x] UI/UX設計書作成（ワイヤーフレーム、デザインシステム）
- [x] データベース設計書作成（ER図、テーブル定義）
- [x] API仕様書作成（エンドポイント一覧）
- [x] モックデータ仕様書作成

**フロントエンド基盤** (2日)
- [x] プロジェクト構成設計（app router構造）
- [x] 共通UIコンポーネント実装（Button, Input, Card, Badge等）
- [x] レイアウトコンポーネント実装（Header, Footer, Navigation, Sidebar）
- [x] Tailwind CSS カスタム設定（カラーパレット、フォント）
- [x] TypeScript型定義（DBスキーマベース）

**Vercel デプロイ** (1日)
- [x] Vercelプロジェクト作成
- [x] 継続的デプロイ設定（main branch）
- [x] プレビュー環境設定

### 成果物
- ✅ 設計ドキュメント一式（画面遷移図、UI/UX設計書、DB設計書、API仕様書）
- ✅ 動作する開発環境
- ✅ Vercelデプロイパイプライン
- ✅ UIコンポーネントライブラリ
- ✅ TypeScript型定義（DBスキーマベース）

### 依存関係
なし（プロジェクト開始）

---

## 🎨 Sprint 1: UI基盤とモックデータ（Week 2-3）

**戦略**: バックエンドなしでフロントエンドを先行開発。モックデータでUIを完成させる。

### タスク一覧

**モックデータ準備** (2日)
- [x] モックデータ構造設計（ユーザー、コンテンツ、課題、進捗）
- [x] モックデータ生成関数実装（lib/mock/）
- [x] ローカルストレージでの状態管理（一時的）
- [x] TypeScript型定義完成

**受講生向けページ実装** (5日)
- [x] ログイン画面（UI のみ、モック認証）
- [x] ホーム画面（進捗サマリー、お知らせ表示）
- [x] コンテンツ一覧画面（Phase/Week階層表示）
- [x] コンテンツ詳細画面（動画・テキスト・演習）
- [x] 課題提出画面（フォーム実装）
- [x] 課題履歴画面（提出済み一覧）

**共通コンポーネント** (3日)
- [x] ProgressBar コンポーネント
- [x] ContentCard コンポーネント
- [x] AnnouncementCard コンポーネント
- [x] SubmissionForm コンポーネント
- [x] LoadingSpinner、EmptyState コンポーネント

**ナビゲーション** (2日)
- [x] ヘッダーナビゲーション
- [x] サイドバーナビゲーション
- [x] モバイルメニュー
- [x] パンくずリスト

### 成果物
- ✅ 受講生向け全画面のUI完成
- ✅ モックデータでの動作確認
- ✅ レスポンシブデザイン対応
- ✅ 再利用可能なコンポーネントライブラリ

### 依存関係
- Sprint 0の完了（フロントエンド基盤）

### テスト項目
- [x] 全画面のレスポンシブ確認
- [x] モックデータでの画面遷移確認
- [x] UIコンポーネントの動作確認
- [x] アクセシビリティ基本確認

---

## 🎯 Sprint 2: 運営画面とコンポーネント完成（Week 4-5）

**戦略**: 運営向けUIを完成させ、デザインシステムを統一。まだモックデータを使用。

### タスク一覧

**運営ダッシュボード** (3日)
- [x] ダッシュボード画面UI（統計サマリー表示）
- [x] チャート・グラフコンポーネント（Chart.js or Recharts）
- [x] KPIカード（受講生数、進捗率、課題提出数）
- [x] フィルター・期間選択機能

**受講生管理画面** (3日)
- [ ] 受講生一覧画面（テーブルビュー）
- [ ] 個別受講生詳細画面
- [ ] 進捗詳細表示（Phase/Week/Content単位）
- [ ] 検索・フィルター機能

**課題管理画面** (3日)
- [ ] 提出課題一覧画面
- [ ] 未確認課題フィルター
- [ ] 課題詳細モーダル
- [ ] フィードバック入力フォーム

**コンテンツ管理画面** (3日)
- [ ] コンテンツ管理画面UI
- [ ] Phase/Week/Content CRUD フォーム
- [ ] ドラッグ&ドロップ並び替え
- [ ] Markdown エディタ統合（テキスト教材用）

**デザインシステム統一** (2日)
- [ ] カラーパレット最終調整
- [ ] タイポグラフィ統一
- [ ] スペーシング・レイアウトルール
- [ ] ダークモード対応（オプション）

### 成果物
- ✅ 運営向け全画面のUI完成
- ✅ デザインシステム完成
- ✅ 全コンポーネントのStorybook化（オプション）
- ✅ UI/UXレビュー完了

### 依存関係
- Sprint 1の完了（受講生向けUI）

### テスト項目
- [ ] 運営画面の全機能確認
- [ ] デザイン一貫性チェック
- [ ] レスポンシブ動作確認
- [ ] アクセシビリティ監査

---

## 🔌 Sprint 3: バックエンド統合（認証・DB）（Week 6-7）

**戦略**: Supabase導入、認証実装、モックデータからリアルデータへ移行。

### タスク一覧

**Supabase セットアップ** (2日)
- [ ] Supabaseプロジェクト作成
- [ ] データベーススキーマ設計・実装
- [ ] Row Level Security（RLS）ポリシー設計
- [ ] 環境変数設定（.env.local）

**データベーススキーマ実装** (3日)
- [ ] Phase / Week / Content テーブル
- [ ] User / UserProgress テーブル
- [ ] Submission / Announcement テーブル
- [ ] マイグレーション実行
- [ ] シードデータ投入

**認証機能実装** (3日)
- [ ] Supabase Auth設定（Google OAuth）
- [ ] Next.js認証フロー実装
- [ ] ミドルウェア設定（認証チェック）
- [ ] セッション管理実装
- [ ] ログイン・ログアウト機能

**承認フロー実装** (2日)
- [ ] 承認待ち画面（未承認ユーザー用）
- [ ] 承認管理画面（運営用）
- [ ] 承認/却下処理API
- [ ] アクセス制御（RLS）

**データ移行** (3日)
- [ ] モックデータからSupabaseへの切り替え
- [ ] API層実装（CRUD操作）
- [ ] 状態管理更新（React Query or SWR）
- [ ] エラーハンドリング実装

### 成果物
- ✅ Supabase統合完了
- ✅ 認証・承認システム
- ✅ リアルデータでの動作確認
- ✅ API層完成

### 依存関係
- Sprint 2の完了（全UI完成）

### テスト項目
- [ ] Google OAuth認証動作確認
- [ ] 承認フロー全体確認
- [ ] データベースCRUD操作確認
- [ ] RLSポリシー動作確認

---

## ⚡ Sprint 4: 機能完成と改善（Week 8-9）

**戦略**: 残りの機能（通知、課題フィードバック）実装と全体最適化。

### タスク一覧

**課題提出・フィードバック機能** (4日)
- [ ] 課題提出API実装
- [ ] 提出履歴表示機能
- [ ] フィードバック機能実装
- [ ] フィードバック通知（アプリ内）

**通知システム** (3日)
- [ ] Slack Webhook設定
- [ ] 新規登録時のSlack通知
- [ ] 課題提出時のSlack通知
- [ ] メール通知実装（Resend or Supabase Email）
- [ ] アプリ内通知システム

**お知らせ機能** (2日)
- [ ] お知らせCRUD API実装
- [ ] お知らせ管理画面機能完成
- [ ] ホーム画面・一覧ページへの統合

**UI/UX改善** (2日)
- [ ] ローディング状態の改善
- [ ] エラーハンドリング統一
- [ ] トースト通知実装
- [ ] アニメーション追加

**パフォーマンス最適化** (2日)
- [ ] 画像最適化（next/image活用）
- [ ] コード分割（dynamic import）
- [ ] React Query キャッシング最適化
- [ ] Core Web Vitals改善

**セキュリティ強化** (1日)
- [ ] RLSポリシー全体レビュー
- [ ] 入力バリデーション強化
- [ ] XSS/CSRF対策確認

### 成果物
- ✅ 全機能完成
- ✅ 通知システム稼働
- ✅ UI/UX最適化完了
- ✅ パフォーマンス・セキュリティ強化

### 依存関係
- Sprint 3の完了（バックエンド統合）

### テスト項目
- [ ] 課題提出フロー全体確認
- [ ] Slack/メール通知受信確認
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

## 🔄 依存関係図（フロントエンド優先）

```
Sprint 0: フロントエンド基盤セットアップ
    ↓
Sprint 1: 受講生向けUI（モックデータ）
    ↓
Sprint 2: 運営向けUI（モックデータ） ← Sprint 1（デザインベース）
    ↓
Sprint 3: バックエンド統合 ← Sprint 2（全UI完成）
    ↓
Sprint 4: 機能完成・最適化 ← Sprint 3（データ層完成）
    ↓
Sprint 5: テスト・リリース ← Sprint 1-4（全機能）
```

### フロントエンド優先戦略の利点

✅ **早期にUIを確認**: モックデータで画面を先に作成し、デザイン・UXを早期確認
✅ **並行開発可能**: UIとバックエンドを別々に開発できる
✅ **変更に強い**: バックエンド変更時もUIへの影響を最小化
✅ **プレビュー可能**: Vercelで早期からUIをステークホルダーに共有
✅ **段階的移行**: モックデータ→リアルデータへスムーズに移行

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

### Sprint 0（フロントエンド基盤）
- [x] Next.jsプロジェクト作成
- [x] bun + Biome セットアップ
- [ ] 画面遷移図作成
- [ ] UI/UX設計書作成
- [ ] データベース設計書作成
- [ ] API仕様書作成
- [ ] 共通UIコンポーネント実装
- [ ] レイアウトコンポーネント実装
- [ ] TypeScript型定義（DBスキーマベース）
- [ ] Vercelデプロイ設定

### Sprint 1（受講生UI + モック）
- [ ] モックデータ生成関数
- [ ] ログイン画面UI
- [ ] ホーム画面
- [ ] コンテンツ一覧・詳細画面
- [ ] 課題提出・履歴画面
- [ ] ナビゲーション実装

### Sprint 2（運営UI + デザイン統一）
- [ ] ダッシュボード画面UI
- [ ] 受講生管理画面
- [ ] 課題管理画面
- [ ] コンテンツ管理画面
- [ ] デザインシステム統一
- [ ] レスポンシブ対応完成

### Sprint 3（バックエンド統合）
- [ ] Supabaseプロジェクト作成
- [ ] DBスキーマ実装
- [ ] Google OAuth設定
- [ ] 認証フロー実装
- [ ] モックからリアルデータへ移行
- [ ] API層実装

### Sprint 4（機能完成）
- [ ] 課題提出・フィードバック機能
- [ ] Slack/メール通知実装
- [ ] お知らせ機能
- [ ] UI/UX改善
- [ ] パフォーマンス最適化

### Sprint 5（リリース）
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
