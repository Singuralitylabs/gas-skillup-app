# GAS学習支援Webアプリ - デザインシステム

## 📐 デザイン原則

### コンセプト
**学習に集中できる、明るく親しみやすいデザイン**

- **シンプル**: 情報を整理し、学習に集中できるUI
- **明快**: 重要な情報が一目でわかる視覚的階層
- **親しみやすさ**: 学習者が安心して使える温かみのある色使い
- **レスポンシブ**: あらゆるデバイスで快適に学習できる

---

## 🎨 カラーシステム

### カラーパレット

#### Primary（メインカラー）
学習プラットフォームらしい青系
```css
--color-primary: hsl(217 91% 60%)          /* #4C9AFF */
--color-primary-foreground: hsl(0 0% 100%) /* #FFFFFF */
```
**用途**: ボタン、リンク、アクティブ状態、進捗バー

#### Secondary（サブカラー）
```css
--color-secondary: hsl(210 40% 96%)          /* #F1F5F9 Light */
--color-secondary-foreground: hsl(222 47% 11%) /* #0F172A Dark */
```
**用途**: 背景、セカンダリボタン、カード背景の変化

#### Success（成功・完了）
```css
--color-success: hsl(142 71% 45%)          /* #22C55E */
--color-success-foreground: hsl(0 0% 100%) /* #FFFFFF */
```
**用途**: 完了バッジ、成功メッセージ、チェックマーク

#### Warning（警告・未確認）
```css
--color-warning: hsl(38 92% 50%)           /* #F59E0B */
--color-warning-foreground: hsl(0 0% 100%) /* #FFFFFF */
```
**用途**: 警告バッジ、未確認状態、注意喚起

#### Destructive（エラー・削除）
```css
--color-destructive: hsl(0 84% 60%)          /* #EF4444 */
--color-destructive-foreground: hsl(0 0% 100%) /* #FFFFFF */
```
**用途**: エラーメッセージ、削除ボタン、危険な操作

#### Neutral（グレースケール）
```css
--color-background: hsl(0 0% 100%)       /* #FFFFFF */
--color-foreground: hsl(222 47% 11%)     /* #0F172A */
--color-muted: hsl(210 40% 96%)          /* #F1F5F9 */
--color-muted-foreground: hsl(215 16% 47%) /* #64748B */
--color-border: hsl(214 32% 91%)         /* #E2E8F0 */
```

### ダークモード
```css
@media (prefers-color-scheme: dark) {
  --color-background: hsl(222 47% 11%)     /* #0F172A */
  --color-foreground: hsl(210 40% 98%)     /* #F8FAFC */
  --color-muted: hsl(217 33% 17%)          /* #1E293B */
  --color-muted-foreground: hsl(215 20% 65%) /* #94A3B8 */
  --color-border: hsl(217 33% 17%)         /* #1E293B */
}
```

### カラー使用ガイドライン

#### ✅ 推奨される使い方
- **Primary**: CTA（Call To Action）、主要なアクション
- **Secondary**: 補助的なボタン、背景の差別化
- **Success**: 成功フィードバック、完了状態
- **Warning**: 注意喚起、未処理状態
- **Destructive**: 削除、エラー（慎重に使用）

#### ❌ 避けるべき使い方
- Primaryを背景全体に使用（目が疲れる）
- Warning/Destructiveを多用（不安を煽る）
- 5色以上を同時に使用（視覚的ノイズ）

---

## 🔤 タイポグラフィ

### フォントファミリー
```css
--font-sans: "Geist Sans", sans-serif  /* 本文・UI */
--font-mono: "Geist Mono", monospace   /* コード */
```

### フォントサイズスケール

| サイズ名 | Tailwindクラス | サイズ | 用途 |
|---------|---------------|--------|------|
| **3XL** | `text-3xl` | 30px / 1.875rem | ページタイトル（H1） |
| **2XL** | `text-2xl` | 24px / 1.5rem | セクションタイトル（H2） |
| **XL** | `text-xl` | 20px / 1.25rem | サブセクション（H3） |
| **LG** | `text-lg` | 18px / 1.125rem | 強調テキスト |
| **Base** | `text-base` | 16px / 1rem | 本文（デフォルト） |
| **SM** | `text-sm` | 14px / 0.875rem | 補足情報、ラベル |
| **XS** | `text-xs` | 12px / 0.75rem | キャプション、バッジ |

### フォントウェイト

| ウェイト | Tailwindクラス | 用途 |
|---------|---------------|------|
| **Bold** | `font-bold` (700) | 見出し、強調 |
| **Semibold** | `font-semibold` (600) | サブ見出し、重要項目 |
| **Medium** | `font-medium` (500) | ボタン、ラベル |
| **Normal** | `font-normal` (400) | 本文 |

### 行間（Line Height）

| 行間 | Tailwindクラス | 用途 |
|------|---------------|------|
| **Tight** | `leading-tight` (1.25) | 見出し |
| **Snug** | `leading-snug` (1.375) | サブ見出し |
| **Normal** | `leading-normal` (1.5) | 本文 |
| **Relaxed** | `leading-relaxed` (1.625) | 長文 |

### タイポグラフィ使用例

```tsx
{/* ページタイトル */}
<h1 className="text-3xl font-bold">受講生管理</h1>

{/* セクションタイトル */}
<h2 className="text-2xl font-bold">学習進捗詳細</h2>

{/* カードタイトル */}
<h3 className="text-xl font-semibold">Phase 1: GAS基礎</h3>

{/* 本文 */}
<p className="text-base">通常の本文テキストです。</p>

{/* 補足情報 */}
<p className="text-sm text-muted-foreground">補足情報やラベル</p>

{/* キャプション */}
<span className="text-xs text-muted-foreground">2024年1月1日</span>
```

---

## 📏 スペーシングシステム

### スペーシングスケール

| サイズ | Tailwindクラス | 実際のサイズ | 用途 |
|-------|---------------|------------|------|
| **0.5** | `p-0.5`, `m-0.5` | 2px | 最小の余白 |
| **1** | `p-1`, `m-1` | 4px | タイトな間隔 |
| **2** | `p-2`, `m-2` | 8px | 要素間の小さな間隔 |
| **3** | `p-3`, `m-3` | 12px | デフォルトの小間隔 |
| **4** | `p-4`, `m-4` | 16px | 標準的な間隔 |
| **6** | `p-6`, `m-6` | 24px | カード内のパディング |
| **8** | `p-8`, `m-8` | 32px | セクション間の間隔 |
| **12** | `p-12`, `m-12` | 48px | 大きなセクション区切り |

### スペーシングルール

#### コンポーネント内パディング
```tsx
// Cardコンポーネント
<CardHeader className="p-6">          {/* ヘッダー: 24px */}
<CardContent className="p-6 pt-0">    {/* コンテンツ: 横24px、上0px */}
<CardFooter className="p-6 pt-0">     {/* フッター: 横24px、上0px */}

// ボタン
<Button className="px-4 py-2">        {/* 横16px、縦8px */}
```

#### 要素間マージン
```tsx
// セクション間
<div className="space-y-6">           {/* 縦24px */}

// 小さな要素間
<div className="space-y-2">           {/* 縦8px */}

// インライン要素間
<div className="gap-2">               {/* Flexboxで8px */}
```

#### レイアウトマージン
```tsx
// ページコンテナ
<div className="container py-6 px-6"> {/* 上下24px、左右24px */}

// モバイル対応
<div className="px-4 sm:px-6 lg:px-8"> {/* レスポンシブパディング */}
```

---

## 🔲 ボーダー・角丸・シャドウ

### Border Radius（角丸）

| サイズ | Tailwindクラス | 実際のサイズ | 用途 |
|-------|---------------|------------|------|
| **SM** | `rounded-sm` | 2px | 小さなUI要素 |
| **Default** | `rounded` | 4px | 一般的な要素 |
| **MD** | `rounded-md` | 6px | ボタン、入力欄 |
| **LG** | `rounded-lg` | 8px | カード、モーダル |
| **Full** | `rounded-full` | 9999px | バッジ、アバター |

### Border（境界線）
```css
--color-border: hsl(214 32% 91%)  /* Light */
--color-input: hsl(214 32% 91%)   /* 入力欄の境界 */
```

```tsx
// 標準的な境界線
<div className="border border-border">

// 太い境界線
<div className="border-2 border-border">

// 特定の辺のみ
<div className="border-t border-border">  {/* 上のみ */}
<div className="border-b border-border">  {/* 下のみ */}
```

### Shadow（影）

| サイズ | Tailwindクラス | 用途 |
|-------|---------------|------|
| **SM** | `shadow-sm` | カード、軽い浮き |
| **Default** | `shadow` | ボタンホバー、モーダル |
| **MD** | `shadow-md` | ドロップダウン、ポップアップ |
| **LG** | `shadow-lg` | 浮き上がる要素 |

---

## 🧩 コンポーネントパターン

### Button

```tsx
// Primary（デフォルト）
<Button>保存する</Button>
<Button variant="default">保存する</Button>

// Secondary（補助的なアクション）
<Button variant="secondary">キャンセル</Button>

// Outline（非強調アクション）
<Button variant="outline">戻る</Button>

// Destructive（削除など）
<Button variant="destructive">削除</Button>

// サイズ
<Button size="sm">小</Button>
<Button size="default">標準</Button>
<Button size="lg">大</Button>
```

### Badge

```tsx
// ステータス表示
<Badge variant="success">完了済み</Badge>
<Badge variant="warning">未確認</Badge>
<Badge variant="destructive">エラー</Badge>

// コンテンツタイプ
<Badge variant="secondary">動画</Badge>
<Badge variant="secondary">テキスト</Badge>
```

### Card

```tsx
<Card>
  <CardHeader>
    <CardTitle>タイトル</CardTitle>
    <CardDescription>説明文</CardDescription>
  </CardHeader>
  <CardContent>
    コンテンツ
  </CardContent>
  <CardFooter>
    <Button>アクション</Button>
  </CardFooter>
</Card>
```

---

## 📱 レスポンシブデザイン

### ブレークポイント

| サイズ | Tailwindプレフィックス | 最小幅 | デバイス |
|-------|-------------------|--------|---------|
| **Mobile** | (デフォルト) | 0px | スマートフォン |
| **SM** | `sm:` | 640px | 大型スマホ、小型タブレット |
| **MD** | `md:` | 768px | タブレット |
| **LG** | `lg:` | 1024px | デスクトップ |
| **XL** | `xl:` | 1280px | 大型デスクトップ |

### レスポンシブパターン

```tsx
// フォントサイズ
<h1 className="text-2xl sm:text-3xl lg:text-4xl">
  タイトル
</h1>

// スペーシング
<div className="px-4 sm:px-6 lg:px-8">
  コンテンツ
</div>

// レイアウト
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  カードグリッド
</div>

// 表示/非表示
<div className="hidden md:block">
  デスクトップのみ表示
</div>
```

---

## ♿ アクセシビリティ

### カラーコントラスト

- **AA基準**: テキストと背景のコントラスト比 **4.5:1以上**
- **AAA基準**: テキストと背景のコントラスト比 **7:1以上**

現在のカラーシステムはWCAG AA基準を満たすように設定されています。

### Focus State

```tsx
// すべてのインタラクティブ要素にフォーカス表示
<button className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
  ボタン
</button>
```

### Semantic HTML

```tsx
// ✅ 推奨
<nav>ナビゲーション</nav>
<main>メインコンテンツ</main>
<button>クリック可能</button>

// ❌ 非推奨
<div onClick={...}>クリック可能</div>  {/* divではなくbuttonを使用 */}
```

---

## 🎯 実装チェックリスト

### デザインシステム適用時の確認事項

- [ ] カラーはCSS変数（`bg-primary`など）を使用しているか
- [ ] フォントサイズは定義されたスケールを使用しているか
- [ ] スペーシングは4の倍数（Tailwindの基準）を使用しているか
- [ ] レスポンシブ対応されているか（モバイルファースト）
- [ ] アクセシビリティ（フォーカス表示、セマンティックHTML）を考慮しているか
- [ ] ダークモード対応されているか

---

**最終更新**: 2024年12月
**バージョン**: 1.0
