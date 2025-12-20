# API仕様書

## 概要

GAS学習支援プラットフォームのREST API仕様。

**ベースURL**: `/api`

**認証方式**: Supabase Auth (Google OAuth 2.0)
- Googleアカウントによるログインのみ
- セッション管理はSupabaseが自動で行う

**共通レスポンスヘッダー**:
```
Content-Type: application/json
```

**共通エラーレスポンス**:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {}
  }
}
```

---

## 1. 認証 (Authentication)

### 1.1 Google OAuth ログイン

**エンドポイント**: `POST /api/auth/google`

**説明**: Googleアカウントでログイン（Supabase Auth使用）

**リクエスト**:
```json
{
  "idToken": "google_id_token_from_client"
}
```

**レスポンス** (200 OK):
```json
{
  "user": {
    "id": "user_123",
    "email": "student@example.com",
    "name": "山田 太郎",
    "role": "student",
    "isApproved": true
  },
  "session": {
    "accessToken": "supabase_access_token",
    "refreshToken": "supabase_refresh_token",
    "expiresIn": 3600
  }
}
```

**エラー**:
- `401 UNAUTHORIZED`: Google認証トークンが無効
- `403 FORBIDDEN`: ユーザーが未承認状態

---

### 1.2 新規登録申請

**エンドポイント**: `POST /api/auth/register`

**説明**: Googleアカウントで新規登録申請（承認待ち状態で作成）

**リクエスト**:
```json
{
  "idToken": "google_id_token_from_client",
  "name": "山田 太郎"
}
```

**レスポンス** (201 Created):
```json
{
  "user": {
    "id": "user_123",
    "email": "student@example.com",
    "name": "山田 太郎",
    "role": "student",
    "isApproved": false
  },
  "message": "登録申請を受け付けました。承認をお待ちください。"
}
```

**副作用**:
- 運営側にSlack通知が送信される

---

### 1.3 ログアウト

**エンドポイント**: `POST /api/auth/logout`

**説明**: 現在のセッションを終了

**認証**: 必須

**リクエスト**: なし

**レスポンス** (200 OK):
```json
{
  "message": "ログアウトしました"
}
```

---

### 1.4 セッション更新

**エンドポイント**: `POST /api/auth/refresh`

**説明**: リフレッシュトークンで新しいアクセストークンを取得

**リクエスト**:
```json
{
  "refreshToken": "supabase_refresh_token"
}
```

**レスポンス** (200 OK):
```json
{
  "accessToken": "new_supabase_access_token",
  "expiresIn": 3600
}
```

**エラー**:
- `401 UNAUTHORIZED`: リフレッシュトークンが無効または期限切れ

---

## 2. ユーザー管理 (Users)

### 2.1 現在のユーザー情報取得

**エンドポイント**: `GET /api/users/me`

**説明**: ログイン中のユーザー情報を取得

**認証**: 必須

**レスポンス** (200 OK):
```json
{
  "id": "user_123",
  "email": "student@example.com",
  "name": "山田 太郎",
  "role": "student",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-20T15:30:00Z"
}
```

---

### 2.2 ユーザー情報更新

**エンドポイント**: `PATCH /api/users/me`

**説明**: ログイン中のユーザー情報を更新

**認証**: 必須

**リクエスト**:
```json
{
  "name": "山田 太郎"
}
```

**レスポンス** (200 OK):
```json
{
  "id": "user_123",
  "email": "student@example.com",
  "name": "山田 太郎",
  "role": "student",
  "updatedAt": "2024-01-20T15:35:00Z"
}
```

**注意**: メールアドレスはGoogleアカウントと紐付いているため変更不可

---

### 2.3 受講生一覧取得 (講師専用)

**エンドポイント**: `GET /api/users/students`

**説明**: 全受講生の一覧を取得

**認証**: 必須 (講師/管理者のみ)

**クエリパラメータ**:
- `page`: ページ番号 (デフォルト: 1)
- `limit`: 1ページあたりの件数 (デフォルト: 20)
- `search`: 名前またはメールで検索
- `isApproved`: 承認状態でフィルタ (`true`, `false`)
- `sortBy`: ソート項目 (`name`, `email`, `createdAt`)
- `order`: ソート順 (`asc`, `desc`)

**レスポンス** (200 OK):
```json
{
  "students": [
    {
      "id": "user_123",
      "email": "student1@example.com",
      "name": "山田 太郎",
      "role": "student",
      "isApproved": true,
      "createdAt": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### 2.4 未承認受講生一覧取得 (講師専用)

**エンドポイント**: `GET /api/users/students/pending`

**説明**: 承認待ちの受講生一覧を取得

**認証**: 必須 (講師/管理者のみ)

**クエリパラメータ**:
- `page`: ページ番号 (デフォルト: 1)
- `limit`: 1ページあたりの件数 (デフォルト: 20)

**レスポンス** (200 OK):
```json
{
  "students": [
    {
      "id": "user_456",
      "email": "new-student@example.com",
      "name": "鈴木 一郎",
      "role": "student",
      "isApproved": false,
      "createdAt": "2024-01-22T09:30:00Z"
    }
  ],
  "pagination": {
    "total": 3,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### 2.5 受講生の承認 (講師専用)

**エンドポイント**: `POST /api/users/students/:studentId/approve`

**説明**: 受講生の登録申請を承認

**認証**: 必須 (講師/管理者のみ)

**リクエスト**: なし

**レスポンス** (200 OK):
```json
{
  "id": "user_456",
  "email": "new-student@example.com",
  "name": "鈴木 一郎",
  "role": "student",
  "isApproved": true,
  "approvedAt": "2024-01-22T10:00:00Z"
}
```

**副作用**:
- 受講生にメール通知が送信される

---

### 2.6 受講生の却下 (講師専用)

**エンドポイント**: `POST /api/users/students/:studentId/reject`

**説明**: 受講生の登録申請を却下

**認証**: 必須 (講師/管理者のみ)

**リクエスト**:
```json
{
  "reason": "却下理由（任意）"
}
```

**レスポンス** (200 OK):
```json
{
  "message": "受講生の申請を却下しました"
}
```

**副作用**:
- 受講生のアカウントが削除される
- 受講生にメール通知が送信される（任意）

---

### 2.7 特定受講生の詳細取得 (講師専用)

**エンドポイント**: `GET /api/users/students/:studentId`

**説明**: 特定の受講生の詳細情報を取得

**認証**: 必須 (講師/管理者のみ)

**レスポンス** (200 OK):
```json
{
  "id": "user_123",
  "email": "student@example.com",
  "name": "山田 太郎",
  "role": "student",
  "createdAt": "2024-01-15T10:00:00Z",
  "stats": {
    "totalContentCompleted": 15,
    "totalSubmissions": 12,
    "currentPhase": 2,
    "currentWeek": 3
  }
}
```

---

## 3. フェーズ管理 (Phases)

### 3.1 フェーズ一覧取得

**エンドポイント**: `GET /api/phases`

**説明**: 全フェーズの一覧を取得

**認証**: 必須

**レスポンス** (200 OK):
```json
{
  "phases": [
    {
      "id": "phase_1",
      "phaseNumber": 1,
      "title": "GAS基礎・JavaScript基礎",
      "description": "Google Apps Scriptの基礎とJavaScriptの基本文法を学びます",
      "order": 1,
      "weeks": [
        {
          "id": "week_1",
          "weekNumber": 1,
          "title": "GAS概要・環境構築",
          "order": 1
        }
      ]
    }
  ]
}
```

---

### 3.2 特定フェーズの詳細取得

**エンドポイント**: `GET /api/phases/:phaseId`

**説明**: 特定フェーズの詳細情報（週とコンテンツを含む）を取得

**認証**: 必須

**レスポンス** (200 OK):
```json
{
  "id": "phase_1",
  "phaseNumber": 1,
  "title": "GAS基礎・JavaScript基礎",
  "description": "Google Apps Scriptの基礎とJavaScriptの基本文法を学びます",
  "order": 1,
  "weeks": [
    {
      "id": "week_1",
      "weekNumber": 1,
      "title": "GAS概要・環境構築",
      "order": 1,
      "contents": [
        {
          "id": "content_1",
          "title": "GASとは",
          "type": "video",
          "duration": 15,
          "order": 1
        }
      ]
    }
  ]
}
```

---

## 4. 週管理 (Weeks)

### 4.1 週一覧取得

**エンドポイント**: `GET /api/weeks`

**説明**: 全週の一覧を取得

**認証**: 必須

**クエリパラメータ**:
- `phaseId`: フェーズIDでフィルタ

**レスポンス** (200 OK):
```json
{
  "weeks": [
    {
      "id": "week_1",
      "phaseId": "phase_1",
      "weekNumber": 1,
      "title": "GAS概要・環境構築",
      "order": 1,
      "contentCount": 5
    }
  ]
}
```

---

### 4.2 特定週の詳細取得

**エンドポイント**: `GET /api/weeks/:weekId`

**説明**: 特定週の詳細情報（コンテンツを含む）を取得

**認証**: 必須

**レスポンス** (200 OK):
```json
{
  "id": "week_1",
  "phaseId": "phase_1",
  "weekNumber": 1,
  "title": "GAS概要・環境構築",
  "order": 1,
  "contents": [
    {
      "id": "content_1",
      "title": "GASとは",
      "type": "video",
      "description": "Google Apps Scriptの概要を学びます",
      "duration": 15,
      "order": 1,
      "isCompleted": false
    }
  ]
}
```

---

## 5. コンテンツ管理 (Contents)

### 5.1 コンテンツ一覧取得

**エンドポイント**: `GET /api/contents`

**説明**: コンテンツ一覧を取得

**認証**: 必須

**クエリパラメータ**:
- `weekId`: 週IDでフィルタ
- `type`: コンテンツタイプでフィルタ (`video`, `text`, `quiz`, `assignment`)
- `page`: ページ番号 (デフォルト: 1)
- `limit`: 1ページあたりの件数 (デフォルト: 20)

**レスポンス** (200 OK):
```json
{
  "contents": [
    {
      "id": "content_1",
      "weekId": "week_1",
      "title": "GASとは",
      "type": "video",
      "duration": 15,
      "order": 1,
      "isCompleted": false
    }
  ],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

### 5.2 特定コンテンツの詳細取得

**エンドポイント**: `GET /api/contents/:contentId`

**説明**: 特定コンテンツの詳細情報を取得

**認証**: 必須

**レスポンス** (200 OK):

**動画の場合**:
```json
{
  "id": "content_1",
  "weekId": "week_1",
  "title": "GASとは",
  "type": "video",
  "description": "Google Apps Scriptの概要を学びます",
  "duration": 15,
  "order": 1,
  "videoUrl": "https://example.com/videos/gas-intro.mp4",
  "thumbnailUrl": "https://example.com/thumbnails/gas-intro.jpg",
  "isCompleted": false
}
```

**テキストの場合**:
```json
{
  "id": "content_2",
  "weekId": "week_1",
  "title": "GASの基本構文",
  "type": "text",
  "description": "GASの基本的な構文を学びます",
  "order": 2,
  "content": "# GASの基本構文\n\n...",
  "isCompleted": true
}
```

**クイズの場合**:
```json
{
  "id": "content_3",
  "weekId": "week_1",
  "title": "GAS基礎クイズ",
  "type": "quiz",
  "description": "GASの基礎知識を確認します",
  "order": 3,
  "questions": [
    {
      "id": "q1",
      "question": "GASとは何の略ですか？",
      "options": [
        "Google Apps Script",
        "Google Application System",
        "Global Application Service"
      ],
      "correctAnswer": 0
    }
  ],
  "isCompleted": false,
  "lastScore": null
}
```

**課題の場合**:
```json
{
  "id": "content_4",
  "weekId": "week_1",
  "title": "スプレッドシート操作課題",
  "type": "assignment",
  "description": "スプレッドシートを操作するGASコードを作成してください",
  "order": 4,
  "requirements": "以下の要件を満たすコードを作成してください...",
  "dueDate": "2024-02-01T23:59:59Z",
  "isCompleted": false,
  "submission": null
}
```

---

### 5.3 コンテンツ完了マーク

**エンドポイント**: `POST /api/contents/:contentId/complete`

**説明**: コンテンツを完了としてマーク

**認証**: 必須

**リクエスト**: なし

**レスポンス** (200 OK):
```json
{
  "contentId": "content_1",
  "userId": "user_123",
  "completedAt": "2024-01-20T16:00:00Z"
}
```

---

### 5.4 コンテンツ作成 (講師専用)

**エンドポイント**: `POST /api/contents`

**説明**: 新しいコンテンツを作成

**認証**: 必須 (講師/管理者のみ)

**リクエスト** (動画の例):
```json
{
  "weekId": "week_1",
  "title": "新しい動画",
  "type": "video",
  "description": "説明文",
  "duration": 20,
  "order": 5,
  "videoUrl": "https://example.com/videos/new-video.mp4",
  "thumbnailUrl": "https://example.com/thumbnails/new-video.jpg"
}
```

**レスポンス** (201 Created):
```json
{
  "id": "content_new",
  "weekId": "week_1",
  "title": "新しい動画",
  "type": "video",
  "createdAt": "2024-01-20T16:05:00Z"
}
```

---

### 5.5 コンテンツ更新 (講師専用)

**エンドポイント**: `PATCH /api/contents/:contentId`

**説明**: コンテンツ情報を更新

**認証**: 必須 (講師/管理者のみ)

**リクエスト**:
```json
{
  "title": "更新されたタイトル",
  "description": "更新された説明文"
}
```

**レスポンス** (200 OK):
```json
{
  "id": "content_1",
  "title": "更新されたタイトル",
  "description": "更新された説明文",
  "updatedAt": "2024-01-20T16:10:00Z"
}
```

---

### 5.6 コンテンツ削除 (講師専用)

**エンドポイント**: `DELETE /api/contents/:contentId`

**説明**: コンテンツを削除

**認証**: 必須 (講師/管理者のみ)

**レスポンス** (204 No Content)

---

## 6. 進捗管理 (Progress)

### 6.1 自分の全体進捗取得

**エンドポイント**: `GET /api/progress/me`

**説明**: ログイン中ユーザーの全体進捗を取得

**認証**: 必須

**レスポンス** (200 OK):
```json
{
  "userId": "user_123",
  "overall": {
    "totalContents": 100,
    "completedContents": 45,
    "completionRate": 45.0,
    "currentPhase": 2,
    "currentWeek": 3
  },
  "phaseProgress": [
    {
      "phaseId": "phase_1",
      "phaseNumber": 1,
      "totalContents": 30,
      "completedContents": 30,
      "completionRate": 100.0
    },
    {
      "phaseId": "phase_2",
      "phaseNumber": 2,
      "totalContents": 35,
      "completedContents": 15,
      "completionRate": 42.9
    }
  ]
}
```

---

### 6.2 フェーズ別進捗取得

**エンドポイント**: `GET /api/progress/phases/:phaseId`

**説明**: 特定フェーズの詳細進捗を取得

**認証**: 必須

**レスポンス** (200 OK):
```json
{
  "userId": "user_123",
  "phaseId": "phase_1",
  "phaseNumber": 1,
  "weekProgress": [
    {
      "weekId": "week_1",
      "weekNumber": 1,
      "totalContents": 5,
      "completedContents": 5,
      "completionRate": 100.0
    },
    {
      "weekId": "week_2",
      "weekNumber": 2,
      "totalContents": 6,
      "completedContents": 4,
      "completionRate": 66.7
    }
  ]
}
```

---

### 6.3 週別進捗取得

**エンドポイント**: `GET /api/progress/weeks/:weekId`

**説明**: 特定週の詳細進捗を取得

**認証**: 必須

**レスポンス** (200 OK):
```json
{
  "userId": "user_123",
  "weekId": "week_1",
  "weekNumber": 1,
  "contentProgress": [
    {
      "contentId": "content_1",
      "title": "GASとは",
      "type": "video",
      "isCompleted": true,
      "completedAt": "2024-01-15T14:30:00Z"
    },
    {
      "contentId": "content_2",
      "title": "GASの基本構文",
      "type": "text",
      "isCompleted": true,
      "completedAt": "2024-01-15T15:00:00Z"
    },
    {
      "contentId": "content_3",
      "title": "GAS基礎クイズ",
      "type": "quiz",
      "isCompleted": false,
      "completedAt": null
    }
  ]
}
```

---

### 6.4 受講生の進捗取得 (講師専用)

**エンドポイント**: `GET /api/progress/students/:studentId`

**説明**: 特定受講生の全体進捗を取得

**認証**: 必須 (講師/管理者のみ)

**レスポンス** (200 OK):
```json
{
  "studentId": "user_123",
  "studentName": "山田 太郎",
  "overall": {
    "totalContents": 100,
    "completedContents": 45,
    "completionRate": 45.0,
    "currentPhase": 2,
    "currentWeek": 3
  },
  "phaseProgress": [
    {
      "phaseId": "phase_1",
      "phaseNumber": 1,
      "completionRate": 100.0
    },
    {
      "phaseId": "phase_2",
      "phaseNumber": 2,
      "completionRate": 42.9
    }
  ],
  "recentActivity": [
    {
      "contentId": "content_15",
      "contentTitle": "配列操作",
      "completedAt": "2024-01-20T14:30:00Z"
    }
  ]
}
```

---

## 7. クイズ管理 (Quizzes)

### 7.1 クイズ回答提出

**エンドポイント**: `POST /api/quizzes/:quizId/submit`

**説明**: クイズの回答を提出して採点

**認証**: 必須

**リクエスト**:
```json
{
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": 0
    },
    {
      "questionId": "q2",
      "selectedAnswer": 2
    }
  ]
}
```

**レスポンス** (200 OK):
```json
{
  "quizId": "content_3",
  "userId": "user_123",
  "score": 80,
  "totalQuestions": 5,
  "correctAnswers": 4,
  "results": [
    {
      "questionId": "q1",
      "isCorrect": true,
      "selectedAnswer": 0,
      "correctAnswer": 0
    },
    {
      "questionId": "q2",
      "isCorrect": false,
      "selectedAnswer": 2,
      "correctAnswer": 1
    }
  ],
  "submittedAt": "2024-01-20T16:20:00Z"
}
```

---

### 7.2 クイズ結果履歴取得

**エンドポイント**: `GET /api/quizzes/:quizId/history`

**説明**: 特定クイズの自分の回答履歴を取得

**認証**: 必須

**レスポンス** (200 OK):
```json
{
  "quizId": "content_3",
  "userId": "user_123",
  "attempts": [
    {
      "attemptNumber": 1,
      "score": 60,
      "submittedAt": "2024-01-18T10:00:00Z"
    },
    {
      "attemptNumber": 2,
      "score": 80,
      "submittedAt": "2024-01-20T16:20:00Z"
    }
  ],
  "bestScore": 80
}
```

---

## 8. 課題提出管理 (Submissions)

### 8.1 課題提出

**エンドポイント**: `POST /api/submissions`

**説明**: 課題の回答を提出（GASコード貼り付けまたはURL共有）

**認証**: 必須

**リクエスト**:
```json
{
  "assignmentId": "content_4",
  "content": "GASコードまたは説明文...",
  "sharedUrls": [
    "https://script.google.com/...",
    "https://docs.google.com/spreadsheets/..."
  ]
}
```

**レスポンス** (201 Created):
```json
{
  "id": "submission_1",
  "assignmentId": "content_4",
  "userId": "user_123",
  "content": "GASコードまたは説明文...",
  "sharedUrls": [
    "https://script.google.com/..."
  ],
  "status": "submitted",
  "submittedAt": "2024-01-20T16:30:00Z"
}
```

**副作用**:
- 運営側にSlack通知が送信される

---

### 8.2 課題提出の更新

**エンドポイント**: `PATCH /api/submissions/:submissionId`

**説明**: 提出済み課題を更新（フィードバック返信前のみ）

**認証**: 必須

**リクエスト**:
```json
{
  "content": "更新されたコード...",
  "sharedUrls": [
    "https://script.google.com/updated-project"
  ]
}
```

**レスポンス** (200 OK):
```json
{
  "id": "submission_1",
  "content": "更新されたコード...",
  "updatedAt": "2024-01-20T17:00:00Z"
}
```

**エラー**:
- `403 FORBIDDEN`: 既にフィードバック返信済みのため更新不可

---

### 8.3 自分の提出履歴取得

**エンドポイント**: `GET /api/submissions/me`

**説明**: ログイン中ユーザーの全提出履歴を取得

**認証**: 必須

**クエリパラメータ**:
- `assignmentId`: 課題IDでフィルタ
- `status`: ステータスでフィルタ (`submitted`, `reviewed`, `returned`)
- `page`: ページ番号
- `limit`: 1ページあたりの件数

**レスポンス** (200 OK):
```json
{
  "submissions": [
    {
      "id": "submission_1",
      "assignmentId": "content_4",
      "assignmentTitle": "スプレッドシート操作課題",
      "status": "reviewed",
      "submittedAt": "2024-01-20T16:30:00Z",
      "reviewedAt": "2024-01-21T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 12,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### 8.4 特定提出の詳細取得

**エンドポイント**: `GET /api/submissions/:submissionId`

**説明**: 特定の提出物の詳細を取得

**認証**: 必須

**レスポンス** (200 OK):
```json
{
  "id": "submission_1",
  "assignmentId": "content_4",
  "assignmentTitle": "スプレッドシート操作課題",
  "userId": "user_123",
  "userName": "山田 太郎",
  "content": "提出されたGASコード...",
  "sharedUrls": [
    "https://script.google.com/..."
  ],
  "status": "reviewed",
  "feedback": "良くできています。ただし、エラーハンドリングを追加すると更に良いでしょう。",
  "submittedAt": "2024-01-20T16:30:00Z",
  "reviewedAt": "2024-01-21T10:00:00Z",
  "reviewedBy": "instructor_1"
}
```

---

### 8.5 全提出物取得 (講師専用)

**エンドポイント**: `GET /api/submissions`

**説明**: 全受講生の提出物を取得

**認証**: 必須 (講師/管理者のみ)

**クエリパラメータ**:
- `assignmentId`: 課題IDでフィルタ
- `studentId`: 受講生IDでフィルタ
- `status`: ステータスでフィルタ (`submitted`, `reviewed`, `returned`)
- `page`: ページ番号
- `limit`: 1ページあたりの件数
- `sortBy`: ソート項目 (`submittedAt`)
- `order`: ソート順 (`asc`, `desc`)

**レスポンス** (200 OK):
```json
{
  "submissions": [
    {
      "id": "submission_1",
      "assignmentId": "content_4",
      "assignmentTitle": "スプレッドシート操作課題",
      "userId": "user_123",
      "userName": "山田 太郎",
      "status": "submitted",
      "submittedAt": "2024-01-20T16:30:00Z"
    }
  ],
  "pagination": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

---

### 8.6 フィードバック記入 (講師専用)

**エンドポイント**: `POST /api/submissions/:submissionId/feedback`

**説明**: 提出された課題にフィードバックを記入

**認証**: 必須 (講師/管理者のみ)

**リクエスト**:
```json
{
  "feedback": "良くできています。ただし、エラーハンドリングを追加すると更に良いでしょう。"
}
```

**レスポンス** (200 OK):
```json
{
  "id": "submission_1",
  "status": "reviewed",
  "feedback": "良くできています。ただし、エラーハンドリングを追加すると更に良いでしょう。",
  "reviewedAt": "2024-01-21T10:00:00Z",
  "reviewedBy": "instructor_1"
}
```

**注意**: 点数・合否判定は行わず、フィードバックのみ記入

---

### 8.7 フィードバックの返却 (講師専用)

**エンドポイント**: `POST /api/submissions/:submissionId/return`

**説明**: フィードバック済みの課題を受講生に返却（通知送信）

**認証**: 必須 (講師/管理者のみ)

**リクエスト**: なし

**レスポンス** (200 OK):
```json
{
  "id": "submission_1",
  "status": "returned",
  "returnedAt": "2024-01-21T10:05:00Z"
}
```

**副作用**:
- 受講生にメール+アプリ内通知が送信される

---

## 9. 統計・分析 (Analytics)

### 9.1 全体統計取得 (講師専用)

**エンドポイント**: `GET /api/analytics/overview`

**説明**: プラットフォーム全体の統計情報を取得

**認証**: 必須 (講師/管理者のみ)

**レスポンス** (200 OK):
```json
{
  "students": {
    "total": 50,
    "active": 45,
    "inactive": 5
  },
  "contents": {
    "total": 100,
    "videos": 40,
    "texts": 30,
    "quizzes": 20,
    "assignments": 10
  },
  "submissions": {
    "total": 250,
    "pending": 15,
    "reviewed": 200,
    "returned": 180
  },
  "completion": {
    "averageRate": 62.5,
    "phase1": 85.0,
    "phase2": 60.0,
    "phase3": 42.5
  }
}
```

---

### 9.2 フェーズ別統計取得 (講師専用)

**エンドポイント**: `GET /api/analytics/phases/:phaseId`

**説明**: 特定フェーズの詳細統計を取得

**認証**: 必須 (講師/管理者のみ)

**レスポンス** (200 OK):
```json
{
  "phaseId": "phase_1",
  "phaseNumber": 1,
  "title": "GAS基礎・JavaScript基礎",
  "students": {
    "total": 50,
    "completed": 35,
    "inProgress": 12,
    "notStarted": 3
  },
  "averageCompletionRate": 85.0,
  "weekStats": [
    {
      "weekId": "week_1",
      "weekNumber": 1,
      "averageCompletionRate": 95.0
    },
    {
      "weekId": "week_2",
      "weekNumber": 2,
      "averageCompletionRate": 88.0
    }
  ]
}
```

---

### 9.3 課題別統計取得 (講師専用)

**エンドポイント**: `GET /api/analytics/assignments/:assignmentId`

**説明**: 特定課題の提出状況統計を取得

**認証**: 必須 (講師/管理者のみ)

**レスポンス** (200 OK):
```json
{
  "assignmentId": "content_4",
  "assignmentTitle": "スプレッドシート操作課題",
  "submissions": {
    "total": 50,
    "submitted": 45,
    "reviewed": 40,
    "returned": 35,
    "pending": 5,
    "notSubmitted": 5
  },
  "submissionRate": 90.0,
  "reviewRate": 88.9,
  "averageReviewTime": 24.5
}
```

**注意**: 点数・合否判定は行わないため、統計に成績情報は含まれない

---

## 10. 通知管理 (Notifications)

### 10.1 通知一覧取得

**エンドポイント**: `GET /api/notifications`

**説明**: ログイン中ユーザーの通知一覧を取得

**認証**: 必須

**クエリパラメータ**:
- `isRead`: 既読フィルタ (`true`, `false`)
- `page`: ページ番号
- `limit`: 1ページあたりの件数

**レスポンス** (200 OK):
```json
{
  "notifications": [
    {
      "id": "notif_1",
      "type": "submission_reviewed",
      "title": "課題にフィードバックが届きました",
      "message": "「スプレッドシート操作課題」のフィードバックが返却されました",
      "isRead": false,
      "createdAt": "2024-01-21T10:05:00Z",
      "relatedId": "submission_1",
      "relatedType": "submission"
    },
    {
      "id": "notif_2",
      "type": "account_approved",
      "title": "アカウントが承認されました",
      "message": "ご登録ありがとうございます。学習コンテンツをご利用いただけます",
      "isRead": true,
      "createdAt": "2024-01-15T11:00:00Z",
      "relatedId": null,
      "relatedType": null
    },
    {
      "id": "notif_3",
      "type": "announcement",
      "title": "新コンテンツ追加のお知らせ",
      "message": "Phase 2のコンテンツを追加しました",
      "isRead": false,
      "createdAt": "2024-01-20T10:00:00Z",
      "relatedId": "announce_1",
      "relatedType": "announcement"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 20,
    "totalPages": 2
  },
  "unreadCount": 5
}
```

---

### 10.2 通知を既読にする

**エンドポイント**: `PATCH /api/notifications/:notificationId/read`

**説明**: 特定の通知を既読にする

**認証**: 必須

**リクエスト**: なし

**レスポンス** (200 OK):
```json
{
  "id": "notif_1",
  "isRead": true,
  "readAt": "2024-01-21T11:00:00Z"
}
```

---

### 10.3 全通知を既読にする

**エンドポイント**: `PATCH /api/notifications/read-all`

**説明**: 全ての未読通知を既読にする

**認証**: 必須

**リクエスト**: なし

**レスポンス** (200 OK):
```json
{
  "message": "全ての通知を既読にしました",
  "updatedCount": 5
}
```

---

## 11. お知らせ管理 (Announcements)

### 11.1 お知らせ一覧取得

**エンドポイント**: `GET /api/announcements`

**説明**: 全お知らせの一覧を取得（受講生・講師共通）

**認証**: 必須

**クエリパラメータ**:
- `page`: ページ番号 (デフォルト: 1)
- `limit`: 1ページあたりの件数 (デフォルト: 20)

**レスポンス** (200 OK):
```json
{
  "announcements": [
    {
      "id": "announce_1",
      "title": "新コンテンツ追加のお知らせ",
      "content": "Phase 2のコンテンツを追加しました...",
      "createdAt": "2024-01-20T10:00:00Z",
      "updatedAt": "2024-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  }
}
```

---

### 11.2 特定お知らせの詳細取得

**エンドポイント**: `GET /api/announcements/:announcementId`

**説明**: 特定のお知らせの詳細を取得

**認証**: 必須

**レスポンス** (200 OK):
```json
{
  "id": "announce_1",
  "title": "新コンテンツ追加のお知らせ",
  "content": "Phase 2のコンテンツを追加しました。詳細は以下の通りです...",
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T10:00:00Z",
  "createdBy": "instructor_1",
  "createdByName": "運営チーム"
}
```

---

### 11.3 お知らせ作成 (講師専用)

**エンドポイント**: `POST /api/announcements`

**説明**: 新しいお知らせを作成

**認証**: 必須 (講師/管理者のみ)

**リクエスト**:
```json
{
  "title": "メンテナンスのお知らせ",
  "content": "2024年1月25日にメンテナンスを実施します..."
}
```

**レスポンス** (201 Created):
```json
{
  "id": "announce_2",
  "title": "メンテナンスのお知らせ",
  "content": "2024年1月25日にメンテナンスを実施します...",
  "createdAt": "2024-01-22T15:00:00Z",
  "createdBy": "instructor_1"
}
```

**副作用**:
- 全受講生にメール+アプリ内通知が送信される

---

### 11.4 お知らせ更新 (講師専用)

**エンドポイント**: `PATCH /api/announcements/:announcementId`

**説明**: お知らせ内容を更新

**認証**: 必須 (講師/管理者のみ)

**リクエスト**:
```json
{
  "title": "メンテナンス延期のお知らせ",
  "content": "メンテナンスを1月26日に延期します..."
}
```

**レスポンス** (200 OK):
```json
{
  "id": "announce_2",
  "title": "メンテナンス延期のお知らせ",
  "content": "メンテナンスを1月26日に延期します...",
  "updatedAt": "2024-01-23T10:00:00Z"
}
```

---

### 11.5 お知らせ削除 (講師専用)

**エンドポイント**: `DELETE /api/announcements/:announcementId`

**説明**: お知らせを削除

**認証**: 必須 (講師/管理者のみ)

**レスポンス** (204 No Content)

---

## 12. ファイルアップロード (File Upload)

### 12.1 ファイルアップロード用URL取得

**エンドポイント**: `POST /api/files/upload-url`

**説明**: ファイルアップロード用の署名付きURLを取得

**認証**: 必須

**リクエスト**:
```json
{
  "fileName": "assignment.gs",
  "fileType": "text/plain",
  "fileSize": 1024,
  "purpose": "submission"
}
```

**レスポンス** (200 OK):
```json
{
  "uploadUrl": "https://storage.example.com/upload/signed-url",
  "fileUrl": "https://storage.example.com/files/assignment.gs",
  "expiresIn": 3600
}
```

---

## エラーコード一覧

| HTTPステータス | エラーコード | 説明 |
|--------------|------------|------|
| 400 | BAD_REQUEST | リクエストが不正 |
| 401 | UNAUTHORIZED | 認証が必要または認証情報が無効 |
| 403 | FORBIDDEN | 権限がない |
| 404 | NOT_FOUND | リソースが見つからない |
| 409 | CONFLICT | リソースの競合 |
| 422 | VALIDATION_ERROR | バリデーションエラー |
| 429 | RATE_LIMIT_EXCEEDED | レート制限超過 |
| 500 | INTERNAL_SERVER_ERROR | サーバー内部エラー |
| 503 | SERVICE_UNAVAILABLE | サービス利用不可 |

---

## レート制限

**一般リクエスト**:
- 100リクエスト/分/ユーザー

**認証関連**:
- Google OAuth: 5リクエスト/分/IP
- 新規登録申請: 3リクエスト/時間/IP

**レート制限超過時のレスポンス**:
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエスト数が制限を超えています",
    "retryAfter": 60
  }
}
```

---

## バージョニング

APIバージョンはURLパスで管理:
- 現在: `/api/v1/...`
- 将来: `/api/v2/...`

バージョン指定なしの `/api/...` は常に最新の安定版を指す。
