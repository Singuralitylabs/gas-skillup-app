# トラブルシューティングガイド

GAS学習支援Webアプリで発生する問題と解決方法をまとめています。

## 目次

1. [認証関連](#認証関連)
2. [データベース関連](#データベース関連)
3. [ビルド・デプロイ関連](#ビルドデプロイ関連)
4. [パフォーマンス関連](#パフォーマンス関連)
5. [開発環境関連](#開発環境関連)

---

## 認証関連

### ログインできない

**症状**: Googleログインボタンをクリックしても認証が完了しない

**確認項目**:
1. ブラウザのCookieが有効か確認
2. ポップアップブロッカーが無効か確認
3. Supabaseの環境変数が正しいか確認

**解決方法**:
```bash
# 環境変数の確認
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY
```

### 承認待ち画面から進まない

**症状**: ログイン後、承認待ち画面が表示されたままになる

**確認項目**:
1. Supabase Dashboard で `profiles` テーブルの `approved` カラムを確認
2. ユーザーが正しく作成されているか確認

**解決方法**:
```sql
-- Supabase SQL Editor で実行
UPDATE profiles SET approved = true WHERE email = 'user@example.com';
```

### セッションが維持されない

**症状**: ページを更新するとログアウトされる

**確認項目**:
1. ブラウザのCookie設定
2. Supabaseのセッション設定

**解決方法**:
- ブラウザのプライバシー設定を確認
- シークレットモードでないことを確認
- サードパーティCookieの設定を確認

---

## データベース関連

### データが表示されない

**症状**: ページにデータが表示されない、または空の状態

**確認項目**:
1. Supabase Dashboard でテーブルにデータがあるか確認
2. RLS（Row Level Security）ポリシーを確認
3. ブラウザのコンソールでエラーを確認

**解決方法**:
```sql
-- RLSポリシーの確認
SELECT * FROM pg_policies WHERE tablename = 'contents';

-- 一時的にRLSを無効化してテスト（本番環境では非推奨）
ALTER TABLE contents DISABLE ROW LEVEL SECURITY;
```

### 進捗が保存されない

**症状**: 学習を完了しても進捗が記録されない

**確認項目**:
1. `user_progress` テーブルへの INSERT 権限
2. ネットワークエラーがないか確認
3. コンソールでエラーログを確認

**解決方法**:
```sql
-- RLSポリシーの確認と修正
CREATE POLICY "Users can insert own progress"
ON user_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### 課題提出が失敗する

**症状**: 課題を提出してもエラーが表示される

**確認項目**:
1. `submissions` テーブルへの INSERT 権限
2. 必須フィールドが全て入力されているか
3. ファイルサイズの制限

**解決方法**:
- 入力内容を確認して再提出
- ブラウザのコンソールでエラー内容を確認
- ネットワーク接続を確認

---

## ビルド・デプロイ関連

### ビルドエラー

**症状**: `bun run build` がエラーで失敗する

**よくあるエラーと解決方法**:

1. **TypeScript エラー**
```bash
# 型エラーの確認
bunx tsc --noEmit
```

2. **依存関係エラー**
```bash
# node_modules を削除して再インストール
rm -rf node_modules bun.lockb
bun install
```

3. **環境変数エラー**
```bash
# .env.local が存在することを確認
ls -la .env.local
```

### Vercelデプロイ失敗

**症状**: Vercelへのデプロイがエラーで停止

**確認項目**:
1. Vercel Dashboard のビルドログを確認
2. 環境変数が設定されているか確認
3. ローカルでビルドが成功するか確認

**解決方法**:
```bash
# ローカルでビルドテスト
bun run build

# Vercel CLI でデプロイテスト
vercel
```

### プレビュー環境が動作しない

**症状**: プレビューURLにアクセスしてもエラー

**確認項目**:
1. プレビュー環境用の環境変数
2. Supabaseの Redirect URLs 設定

**解決方法**:
- Vercel Dashboard で Preview 環境の環境変数を確認
- Supabase の URL Configuration でプレビューURLを追加

---

## パフォーマンス関連

### ページの読み込みが遅い

**症状**: ページの表示に時間がかかる

**確認項目**:
1. ネットワークタブで遅いリクエストを特定
2. Lighthouseでパフォーマンス分析
3. データベースクエリの実行時間

**解決方法**:
```bash
# Lighthouseでパフォーマンス測定
bunx lighthouse https://your-domain.com --view
```

- 画像の最適化（next/image を使用）
- 不要なJavaScriptの削減
- データベースインデックスの追加

### メモリ使用量が多い

**症状**: ブラウザのメモリ使用量が増加し続ける

**確認項目**:
1. メモリリークがないか確認
2. 大量のデータを一度に読み込んでいないか

**解決方法**:
- コンポーネントのクリーンアップ処理を確認
- 無限スクロールやページネーションを実装
- React DevTools でコンポーネントの再レンダリングを確認

---

## 開発環境関連

### 開発サーバーが起動しない

**症状**: `bun run dev` でエラーが発生

**よくあるエラーと解決方法**:

1. **ポート競合**
```bash
# ポート3000が使用中か確認
lsof -i :3000

# 別のポートで起動
bun run dev -- -p 3001
```

2. **依存関係の問題**
```bash
rm -rf node_modules .next
bun install
bun run dev
```

3. **環境変数の問題**
```bash
# .env.local の内容を確認
cat .env.local
```

### ホットリロードが効かない

**症状**: コードを変更しても画面が更新されない

**解決方法**:
1. 開発サーバーを再起動
2. ブラウザのキャッシュをクリア
3. `.next` ディレクトリを削除して再起動

```bash
rm -rf .next
bun run dev
```

### リンターエラー

**症状**: `bun run lint` でエラーが表示される

**解決方法**:
```bash
# 自動修正
bun run lint:fix

# フォーマット
bun run format
```

---

## 連絡先

上記の解決方法で問題が解決しない場合：

- **開発チーム**: 技術的な問題
- **運営管理者**: 運用に関する問題
- **GitHub Issues**: バグ報告や機能リクエスト

---

## 付録：診断コマンド

### 環境確認

```bash
# Node.js バージョン
node -v

# Bun バージョン
bun -v

# 依存関係の確認
bun pm ls

# ディスク使用量
du -sh node_modules
```

### ログの確認

```bash
# Vercel ログ
vercel logs

# 開発サーバーログ
bun run dev 2>&1 | tee dev.log
```

### データベース診断

```sql
-- テーブル一覧
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- RLSポリシー一覧
SELECT * FROM pg_policies;

-- 接続数の確認
SELECT count(*) FROM pg_stat_activity;
```
