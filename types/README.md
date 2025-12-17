# Types Directory

## 📋 ファイル構成

### database.types.ts
**⚠️ 自動生成ファイル - 手動編集禁止**

Supabase CLIで自動生成される型定義ファイルです。

```bash
# プロジェクトIDを指定して生成
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts

# ローカル開発環境から生成
npx supabase gen types typescript --local > types/database.types.ts
```

### index.ts
**カスタム型定義ファイル**

アプリケーション固有の型定義を配置します：
- Enum型（UserRole, ContentType, SubmissionType）
- database.types.tsから派生した使いやすい型エイリアス
- リレーションを含む拡張型
- View Model（UI表示用）
- API Request/Response型

## 🎯 使用方法

### 基本的な使用

```typescript
// ✅ GOOD: index.ts から型をインポート
import type { User, UserRole, ContentType } from '@/types';

// ❌ BAD: database.types.ts から直接インポート
import type { Database } from '@/types/database.types';
```

### 型の使い分け

```typescript
import type {
  User,              // テーブルのRow型
  UserInsert,        // INSERT用の型
  UserUpdate,        // UPDATE用の型
  ContentWithRelations, // リレーション含む拡張型
  ProgressSummary,   // View Model（UI表示用）
} from '@/types';

// データベースからの取得
const user: User = await getUser(id);

// 新規作成
const newUser: UserInsert = {
  id: 'xxx',
  email: 'user@example.com',
  name: 'Test User',
};

// 更新
const updates: UserUpdate = {
  name: 'Updated Name',
};

// リレーション含むデータ
const content: ContentWithRelations = {
  ...contentData,
  week: {
    ...weekData,
    phase: phaseData,
  },
};

// UI表示用
const summary: ProgressSummary = {
  total_contents: 100,
  completed_contents: 45,
  completion_rate: 45,
  phases: [...],
};
```

## 🔄 型の更新フロー

### 1. データベース設計変更時

```bash
# 1. Supabaseでスキーマを更新
# 2. 型定義を再生成
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts

# 3. index.ts のカスタム型も必要に応じて更新
```

### 2. カスタム型の追加

新しいView ModelやAPI型が必要な場合は `index.ts` に追加：

```typescript
// types/index.ts

export type NewViewModel = {
  // 新しい型定義
};
```

## 📝 型定義の原則

1. **database.types.ts は自動生成のみ**
   - 手動編集は絶対にしない
   - Supabaseの型と常に同期

2. **カスタム型は index.ts に**
   - Enum型
   - 派生型
   - View Model
   - API型

3. **型のエイリアスを活用**
   - `Database["public"]["Tables"]["users"]["Row"]` より `User` の方が簡潔

4. **型安全性を維持**
   - `any` は使わない
   - 必要に応じて `unknown` と型ガード

## 🎨 コード例

### データ取得

```typescript
import type { User, Content } from '@/types';

async function getUser(id: string): Promise<User> {
  // Supabaseから取得
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}
```

### リレーション含むデータ

```typescript
import type { ContentWithRelations } from '@/types';

async function getContentWithRelations(id: string): Promise<ContentWithRelations> {
  const { data, error } = await supabase
    .from('contents')
    .select(`
      *,
      week:weeks (
        *,
        phase:phases (*)
      )
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ContentWithRelations;
}
```

### API Response

```typescript
import type { CreateSubmissionRequest, CreateSubmissionResponse } from '@/types';

export async function POST(request: Request): Promise<Response> {
  const body: CreateSubmissionRequest = await request.json();

  // 処理...

  const response: CreateSubmissionResponse = {
    success: true,
    submission: newSubmission,
  };

  return Response.json(response);
}
```
