# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

このプロジェクトは `create-next-app` で作成された Next.js 16.0.10 アプリケーションです。使用技術：
- **React 19.2.1** - App Router アーキテクチャを使用
- **TypeScript 5** - strict モード有効
- **Tailwind CSS 4** - PostCSS 設定
- **Biome 2.3.9** - リンター・フォーマッター
- **bun 1.2.21** - JavaScript ランタイム・パッケージマネージャー

## 開発コマンド

⚠️ **重要**: このプロジェクトは `bun` を使用しています。`npm` ではなく `bun` コマンドを使用してください。

### パッケージのインストール
```bash
bun install
```

### 開発サーバーの起動
```bash
bun run dev
```
http://localhost:3000 で起動します。ホットモジュールリプレースメント有効。

### 本番ビルド
```bash
bun run build
```
最適化された本番ビルドを `.next/` ディレクトリに作成します。

### 本番サーバーの起動
```bash
bun run start
```
本番ビルドを実行します（事前に `bun run build` が必要）。

### リンティング
```bash
bun run lint          # コードチェック
bun run lint:fix      # 自動修正可能な問題を修正
```

### フォーマット
```bash
bun run format        # コードフォーマット
```

Biome を使用してコードの品質とスタイルを管理します。

## アーキテクチャ

### App Router 構造
このプロジェクトは Next.js App Router を使用しています（Pages Router ではありません）：
- **app/layout.tsx**: ルートレイアウト、Geist フォント設定（sans と mono バリアント）
- **app/page.tsx**: ホームページコンポーネント
- **app/globals.css**: グローバルスタイル、Tailwind インポートと CSS カスタムプロパティ

### 主要な設定

**パスエイリアス** (tsconfig.json):
- `@/*` がルートディレクトリにマッピングされ、インポートがシンプルに

**TypeScript**:
- Target: ES2017
- Strict モード有効
- JSX モード: `react-jsx`（新しい JSX トランスフォーム、React のインポート不要）

**Tailwind CSS**:
- Tailwind v4 を PostCSS プラグイン `@tailwindcss/postcss` で使用
- CSS カスタムプロパティを `globals.css` で `@theme inline` として定義
- `prefers-color-scheme` によるダークモードサポート
- カスタムカラー変数: `--color-background`, `--color-foreground`
- フォント変数: `--font-geist-sans`, `--font-geist-mono`

**Biome**:
- リンターとフォーマッターを統合
- Next.js と React のルールを移行済み
- `biome.json` で設定管理
- 無視対象: `.next/`, `out/`, `build/`, `next-env.d.ts`
- インポートの自動整理機能有効

### スタイリングパターン
- Tailwind のユーティリティクラスが主なスタイリング方法
- ダークモードクラスは `dark:` プレフィックスを使用
- フォントファミリーは layout.tsx で設定された CSS 変数経由で適用
- レスポンシブデザインは Tailwind のブレークポイントプレフィックスを使用（`sm:`, `md:` など）

## Next.js ベストプラクティス

### Server Components と Client Components

**デフォルトは Server Components**:
- `app/` 配下のコンポーネントはデフォルトで Server Component
- データフェッチング、バックエンドリソースへのアクセスに最適
- バンドルサイズの削減とパフォーマンス向上

**Client Components の使用基準**:
```tsx
'use client'  // ファイル冒頭に追加
```
以下の場合のみ使用：
- `useState`, `useEffect` などの React hooks が必要
- ブラウザ API（`window`, `localStorage` など）を使用
- イベントハンドラー（`onClick`, `onChange` など）が必要
- カスタム hooks を使用

**コンポーネント設計パターン**:
- Client Component は可能な限り下層（リーフ）に配置
- Server Component で Client Component をラップ可能
- Client Component 内で Server Component を children として渡すことは可能

### React 開発のベストプラクティス

#### useEffect の適切な使用（公式ドキュメント準拠）

**⚠️ useEffect は極力避ける**

公式ドキュメント: https://ja.react.dev/learn/you-might-not-need-an-effect

useEffect は**外部システムとの同期**にのみ使用すべきです。以下のケースでは useEffect は不要：

**❌ 避けるべきパターン**:

```tsx
// ❌ BAD: props/state からの派生状態の計算
const [fullName, setFullName] = useState('')
useEffect(() => {
  setFullName(`${firstName} ${lastName}`)
}, [firstName, lastName])

// ✅ GOOD: レンダリング中に直接計算
const fullName = `${firstName} ${lastName}`
```

```tsx
// ❌ BAD: データの変換に useEffect を使用
const [items, setItems] = useState([])
const [filteredItems, setFilteredItems] = useState([])
useEffect(() => {
  setFilteredItems(items.filter(item => item.isActive))
}, [items])

// ✅ GOOD: レンダリング中に計算（または useMemo で最適化）
const filteredItems = items.filter(item => item.isActive)
// パフォーマンスが問題なら:
const filteredItems = useMemo(
  () => items.filter(item => item.isActive),
  [items]
)
```

```tsx
// ❌ BAD: イベントハンドラーの処理に useEffect を使用
const [cart, setCart] = useState([])
useEffect(() => {
  if (cart.length > 0) {
    saveToLocalStorage(cart)
  }
}, [cart])

// ✅ GOOD: イベントハンドラー内で直接処理
const addToCart = (item) => {
  const newCart = [...cart, item]
  setCart(newCart)
  saveToLocalStorage(newCart)
}
```

**✅ useEffect を使うべきケース**:

外部システムとの同期にのみ使用：
```tsx
// ✅ ブラウザ API との同期
useEffect(() => {
  const handleResize = () => setWidth(window.innerWidth)
  window.addEventListener('resize', handleResize)
  return () => window.removeEventListener('resize', handleResize)
}, [])

// ✅ サードパーティライブラリとの同期
useEffect(() => {
  const map = mapApi.createMap(ref.current)
  return () => map.destroy()
}, [])

// ✅ 外部データストアとの同期
useEffect(() => {
  const unsubscribe = store.subscribe(() => {
    setData(store.getData())
  })
  return () => unsubscribe()
}, [])
```

**Next.js では Server Components を優先**:
```tsx
// ❌ Client Component で useEffect を使ってデータフェッチ
'use client'
function Posts() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(setPosts)
  }, [])
  return <div>{/* render */}</div>
}

// ✅ Server Component で直接フェッチ
async function Posts() {
  const posts = await fetch('/api/posts').then(res => res.json())
  return <div>{/* render */}</div>
}
```

#### その他の重要な実装ガイドライン

**状態管理の原則**:

```tsx
// ❌ BAD: 冗長な状態
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [fullName, setFullName] = useState('')  // 派生データを状態にしない

// ✅ GOOD: 必要最小限の状態
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const fullName = `${firstName} ${lastName}`  // 計算で導出
```

**状態の更新は常にイミュータブルに**:

```tsx
// ❌ BAD: 直接変更
const addItem = (item) => {
  items.push(item)  // ミューテーション
  setItems(items)
}

// ✅ GOOD: 新しい配列/オブジェクトを作成
const addItem = (item) => {
  setItems([...items, item])
}

const updateUser = (updates) => {
  setUser({ ...user, ...updates })
}
```

**key prop の適切な使用**:

```tsx
// ❌ BAD: インデックスを key に使用（並び替えや削除がある場合）
{items.map((item, index) => (
  <Item key={index} {...item} />
))}

// ✅ GOOD: 一意で安定した ID を使用
{items.map(item => (
  <Item key={item.id} {...item} />
))}
```

**メモ化の適切な使用**:

```tsx
// useMemo: 高コストな計算結果のキャッシュ
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(a, b)
}, [a, b])

// useCallback: 関数の再生成を防ぐ（子コンポーネントに渡す場合）
const handleClick = useCallback(() => {
  doSomething(a, b)
}, [a, b])

// React.memo: コンポーネントの再レンダリングを防ぐ
const MemoizedComponent = React.memo(function MyComponent({ data }) {
  return <div>{data}</div>
})
```

⚠️ **注意**: 過度なメモ化は逆効果。パフォーマンス問題が確認された場合のみ使用。

**イベントハンドラーでの状態更新**:

```tsx
// ❌ BAD: 複数回の setState が同期的に見える
const handleClick = () => {
  setCount(count + 1)
  setCount(count + 1)  // count は古い値のまま
}

// ✅ GOOD: 関数形式の更新を使用
const handleClick = () => {
  setCount(c => c + 1)
  setCount(c => c + 1)  // 正しく +2 される
}
```

**フォームの扱い**:

```tsx
// Server Actions を使った最新のフォーム処理（Next.js 14+）
// app/actions.ts
'use server'
export async function createPost(formData: FormData) {
  const title = formData.get('title')
  // DB への保存処理
  revalidatePath('/posts')
}

// app/new/page.tsx
import { createPost } from '../actions'

export default function NewPost() {
  return (
    <form action={createPost}>
      <input name="title" required />
      <button type="submit">作成</button>
    </form>
  )
}
```

**条件付きレンダリング**:

```tsx
// ✅ 論理 AND 演算子（falsy 値に注意）
{items.length > 0 && <ItemList items={items} />}

// ⚠️ 注意: 0 が表示される可能性
{items.length && <ItemList items={items} />}  // items.length が 0 なら "0" が表示

// ✅ 三項演算子
{isLoading ? <Spinner /> : <Content />}

// ✅ 早期リターン
if (isLoading) return <Spinner />
return <Content />
```

**非同期処理のエラーハンドリング**:

```tsx
// Server Component
async function getData() {
  try {
    const res = await fetch('https://api.example.com/data')
    if (!res.ok) throw new Error('Failed to fetch')
    return res.json()
  } catch (error) {
    // error.tsx がキャッチする
    throw error
  }
}

// Client Component
const [error, setError] = useState(null)
const handleSubmit = async () => {
  try {
    await submitForm(data)
  } catch (err) {
    setError(err.message)
  }
}
```

### データフェッチング

**Server Components でのデータフェッチ**:
```tsx
// app/posts/page.tsx
async function getPosts() {
  const res = await fetch('https://api.example.com/posts', {
    cache: 'force-cache',  // デフォルト: 静的生成
    // next: { revalidate: 3600 }  // ISR: 1時間ごとに再検証
    // cache: 'no-store'  // SSR: 毎回フェッチ
  })
  return res.json()
}

export default async function PostsPage() {
  const posts = await getPosts()
  return <div>{/* render posts */}</div>
}
```

**キャッシング戦略**:
- `cache: 'force-cache'`: 静的生成（デフォルト）
- `next: { revalidate: 秒数 }`: ISR（Incremental Static Regeneration）
- `cache: 'no-store'`: 動的レンダリング（SSR）
- `next: { tags: ['tag-name'] }`: オンデマンド再検証用のタグ付け

**並列データフェッチ**:
```tsx
// 複数のfetchを並列実行
const [posts, users] = await Promise.all([
  getPosts(),
  getUsers()
])
```

### ルーティングとナビゲーション

**ファイルベースルーティング**:
- `app/page.tsx` → `/`
- `app/about/page.tsx` → `/about`
- `app/blog/[slug]/page.tsx` → `/blog/:slug` （動的ルート）
- `app/(group)/page.tsx` → `/` （ルートグループ、URLに影響なし）

**`<Link>` コンポーネントの使用**:
```tsx
import Link from 'next/link'

<Link href="/about">About</Link>
<Link href={`/blog/${post.id}`}>Read more</Link>
```
- クライアントサイドナビゲーションでパフォーマンス向上
- プリフェッチ機能が自動で有効

**プログラマティックナビゲーション**:
```tsx
'use client'
import { useRouter } from 'next/navigation'

export default function Component() {
  const router = useRouter()

  const handleClick = () => {
    router.push('/dashboard')
    // router.back()
    // router.refresh()
  }
}
```

### メタデータと SEO

**静的メタデータ**:
```tsx
// app/page.tsx
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ページタイトル',
  description: 'ページの説明',
  openGraph: {
    title: 'OGタイトル',
    description: 'OG説明',
    images: ['/og-image.jpg'],
  },
}
```

**動的メタデータ**:
```tsx
// app/blog/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await getPost(params.slug)
  return {
    title: post.title,
    description: post.excerpt,
  }
}
```

### 画像最適化

**`next/image` の使用**:
```tsx
import Image from 'next/image'

// ローカル画像（自動サイズ検出）
import profilePic from './profile.jpg'
<Image src={profilePic} alt="Profile" />

// 外部画像（width/height必須）
<Image
  src="https://example.com/image.jpg"
  alt="Description"
  width={500}
  height={300}
  priority  // LCP画像に使用
/>
```

**設定のポイント**:
- `priority`: Above the fold の重要な画像に設定
- `loading="lazy"`: デフォルトで遅延読み込み
- 外部画像は `next.config.ts` で `remotePatterns` 設定が必要

### パフォーマンス最適化

**動的インポート（Code Splitting）**:
```tsx
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <p>Loading...</p>,
  ssr: false  // Client-side のみで読み込む場合
})
```

**React Suspense の活用**:
```tsx
import { Suspense } from 'react'

<Suspense fallback={<Loading />}>
  <AsyncComponent />
</Suspense>
```

**Font Optimization**:
- `next/font/google` を使用（既に layout.tsx で実装済み）
- フォントファイルの自動最適化とプリロード

### エラーハンドリング

**error.tsx でエラーバウンダリ**:
```tsx
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div>
      <h2>Something went wrong!</h2>
      <button onClick={reset}>Try again</button>
    </div>
  )
}
```

**loading.tsx でローディング UI**:
```tsx
// app/loading.tsx
export default function Loading() {
  return <div>Loading...</div>
}
```

**not-found.tsx で 404 ページ**:
```tsx
// app/not-found.tsx
export default function NotFound() {
  return <h2>404 - Page Not Found</h2>
}
```

### 環境変数

**命名規則**:
- `NEXT_PUBLIC_*`: クライアントサイドで使用可能
- それ以外: サーバーサイドのみ

**使用例**:
```tsx
// Server Component or API Route
const apiKey = process.env.API_KEY

// Client Component
const publicKey = process.env.NEXT_PUBLIC_API_KEY
```

### API Routes (Route Handlers)

**ファイル配置**:
```tsx
// app/api/posts/route.ts
export async function GET(request: Request) {
  const posts = await getPosts()
  return Response.json(posts)
}

export async function POST(request: Request) {
  const body = await request.json()
  // 処理
  return Response.json({ success: true })
}
```

**動的ルート**:
```tsx
// app/api/posts/[id]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const post = await getPost(params.id)
  return Response.json(post)
}
```

## 重要な注意事項

- 初期テンプレートからの最小限のカスタマイズのみの新規 Next.js プロジェクト
- テストフレームワークはまだ設定されていません
- デフォルト以外の API ルートやサーバーコンポーネントは追加されていません
- Next.js 16 の新機能と React 19 を使用
- **パッケージ管理**: `bun` を使用（`npm` や `yarn` は使用しない）
- **ロックファイル**: `bun.lock` を使用（`package-lock.json` は不要で .gitignore に含まれる）
