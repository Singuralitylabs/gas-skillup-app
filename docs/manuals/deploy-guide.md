# デプロイ手順書

GAS学習支援Webアプリのデプロイ手順書です。

## 目次

1. [デプロイ環境](#デプロイ環境)
2. [初回デプロイ](#初回デプロイ)
3. [継続的デプロイ](#継続的デプロイ)
4. [環境変数の設定](#環境変数の設定)
5. [カスタムドメインの設定](#カスタムドメインの設定)
6. [ロールバック](#ロールバック)

---

## デプロイ環境

### 本番環境

| 項目 | 値 |
|------|-----|
| ホスティング | Vercel |
| データベース | Supabase |
| ドメイン | カスタムドメイン（サブドメイン） |
| SSL | 自動（Vercel提供） |

### 環境構成

```
Production (main branch)
    ↓
Preview (feature/* branches)
    ↓
Development (localhost)
```

---

## 初回デプロイ

### 1. Vercelプロジェクトの作成

1. [Vercel](https://vercel.com) にログイン
2. 「New Project」をクリック
3. GitHubリポジトリを選択
4. フレームワークプリセット: 「Next.js」を選択
5. 「Deploy」をクリック

### 2. Supabaseプロジェクトの作成

1. [Supabase](https://supabase.com) にログイン
2. 「New Project」をクリック
3. プロジェクト名とパスワードを設定
4. リージョンを選択（推奨: Tokyo）
5. 「Create new project」をクリック

### 3. データベースの初期化

Supabase SQL Editorで以下を実行：

```sql
-- マイグレーションファイルの内容を実行
-- docs/design/database-design.md を参照
```

### 4. Google OAuth設定

1. [Google Cloud Console](https://console.cloud.google.com) にアクセス
2. 「認証情報」→「認証情報を作成」→「OAuth クライアント ID」
3. アプリケーションの種類: 「ウェブアプリケーション」
4. 承認済みリダイレクト URI に以下を追加：
   - `https://your-project.supabase.co/auth/v1/callback`
   - `https://your-domain.vercel.app/auth/callback`
5. クライアントIDとシークレットをSupabaseに設定

### 5. Supabase認証設定

1. Supabase Dashboard → Authentication → Providers
2. Google を有効化
3. Client ID と Client Secret を入力
4. 「Save」をクリック

---

## 継続的デプロイ

### 自動デプロイフロー

```
Push to main
    ↓
Vercel Build Triggered
    ↓
Build & Test
    ↓
Production Deploy
```

### プレビューデプロイ

- `feature/*` ブランチへのPushで自動的にプレビュー環境が作成
- プレビューURLは `https://gas-skillup-app-xxx-xxx.vercel.app` 形式

### 手動デプロイ

```bash
# Vercel CLIをインストール
bun add -g vercel

# 本番デプロイ
vercel --prod

# プレビューデプロイ
vercel
```

---

## 環境変数の設定

### Vercelでの設定

1. Vercel Dashboard → Project Settings → Environment Variables
2. 以下の変数を追加：

| 変数名 | 説明 | 環境 |
|--------|------|------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL | All |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | All |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key | Production |

### 環境変数の確認方法

Supabase Dashboard → Settings → API で確認できます：
- Project URL
- anon public key
- service_role key（非公開）

### 注意事項

- `NEXT_PUBLIC_` プレフィックスの変数はクライアントサイドで公開される
- `SUPABASE_SERVICE_ROLE_KEY` は絶対にクライアントサイドで使用しない
- 本番環境とプレビュー環境で異なる値を設定可能

---

## カスタムドメインの設定

### 1. Vercelでドメインを追加

1. Vercel Dashboard → Project Settings → Domains
2. 「Add」をクリック
3. ドメイン名を入力（例: `learn.example.com`）
4. 「Add」をクリック

### 2. DNS設定

DNSプロバイダーで以下のレコードを追加：

**Aレコード（サブドメインの場合）**
```
Type: CNAME
Name: learn
Value: cname.vercel-dns.com
```

**ルートドメインの場合**
```
Type: A
Name: @
Value: 76.76.21.21
```

### 3. SSL証明書

- Vercelが自動的にLet's Encrypt証明書を発行
- 通常数分で有効化

### 4. Supabase認証のリダイレクトURL更新

1. Supabase Dashboard → Authentication → URL Configuration
2. Site URL を本番ドメインに更新
3. Redirect URLs にカスタムドメインを追加

---

## ロールバック

### Vercelでのロールバック

1. Vercel Dashboard → Deployments
2. ロールバック先のデプロイを選択
3. 「...」メニュー → 「Promote to Production」

### 即時ロールバック

```bash
# Vercel CLIでロールバック
vercel rollback [deployment-url]
```

### データベースのロールバック

1. Supabase Dashboard → Database → Backups
2. 復元したいバックアップを選択
3. 「Restore」をクリック

**注意**: データベースのロールバックは全データに影響します

---

## デプロイチェックリスト

### 本番デプロイ前

- [ ] `bun run lint` でエラーがないこと
- [ ] `bun run build` が成功すること
- [ ] `bun run test:e2e` が全てパスすること
- [ ] 環境変数が正しく設定されていること
- [ ] 必要なマイグレーションが完了していること

### デプロイ後

- [ ] 本番URLにアクセスできること
- [ ] ログインが正常に動作すること
- [ ] 主要機能が正常に動作すること
- [ ] エラーログに異常がないこと

---

## トラブルシューティング

デプロイに関する問題は [トラブルシューティングガイド](troubleshooting.md) を参照してください。

### よくある問題

| 問題 | 解決方法 |
|------|----------|
| ビルドエラー | ローカルで `bun run build` を実行して確認 |
| 環境変数エラー | Vercel Dashboard で環境変数を確認 |
| 認証エラー | Supabase の Redirect URLs を確認 |
| 404エラー | next.config.ts の設定を確認 |
