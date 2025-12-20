# モックデータ仕様書

## 概要

GAS学習支援プラットフォームの開発・テスト用モックデータ仕様。

**目的**:
- フロントエンド開発時のAPI連携テスト
- UIコンポーネントの表示確認
- データ構造の検証
- E2Eテストのシナリオ作成

---

## 1. ユーザーデータ (Users)

### 1.1 受講生 (Students)

#### 承認済み受講生
feature/calendar231
```json
{
  "id": "student_001",
  "email": "yamada.taro@example.com",
  "name": "山田 太郎",
  "role": "student",
  "isApproved": true,
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-20T15:30:00Z"
}
```

```json
{
  "id": "student_002",
  "email": "tanaka.hanako@example.com",
  "name": "田中 花子",
  "role": "student",
  "isApproved": true,
  "createdAt": "2024-01-16T09:30:00Z",
  "updatedAt": "2024-01-18T14:20:00Z"
}
```

```json
{
  "id": "student_003",
  "email": "sato.ichiro@example.com",
  "name": "佐藤 一郎",
  "role": "student",
  "isApproved": true,
  "createdAt": "2024-01-17T11:15:00Z",
  "updatedAt": "2024-01-17T11:15:00Z"
}
```

#### 未承認受講生

```json
{
  "id": "student_pending_001",
  "email": "suzuki.jiro@example.com",
  "name": "鈴木 二郎",
  "role": "student",
  "isApproved": false,
  "createdAt": "2024-01-22T09:30:00Z",
  "updatedAt": "2024-01-22T09:30:00Z"
}
```

```json
{
  "id": "student_pending_002",
  "email": "watanabe.saburo@example.com",
  "name": "渡辺 三郎",
  "role": "student",
  "isApproved": false,
  "createdAt": "2024-01-23T14:45:00Z",
  "updatedAt": "2024-01-23T14:45:00Z"
}
```

### 1.2 講師・運営 (Instructors)

```json
{
  "id": "instructor_001",
  "email": "admin@example.com",
  "name": "運営 太郎",
  "role": "instructor",
  "isApproved": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

```json
{
  "id": "instructor_002",
  "email": "support@example.com",
  "name": "サポート 花子",
  "role": "instructor",
  "isApproved": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

### 1.3 管理者 (Admins)

```json
{
  "id": "admin_001",
  "email": "superadmin@example.com",
  "name": "システム管理者",
  "role": "admin",
  "isApproved": true,
  "createdAt": "2024-01-01T00:00:00Z",
  "updatedAt": "2024-01-01T00:00:00Z"
}
```

---

## 2. フェーズ・週・コンテンツデータ

### 2.1 Phase 1 - GAS基礎・JavaScript基礎

```json
{
  "id": "phase_1",
  "phaseNumber": 1,
  "title": "GAS基礎・JavaScript基礎",
  "description": "Google Apps Scriptの基礎とJavaScriptの基本文法を学びます",
  "order": 1
}
```

#### Week 1 - GAS概要・環境構築

```json
{
  "id": "week_1_1",
  "phaseId": "phase_1",
  "weekNumber": 1,
  "title": "GAS概要・環境構築",
  "order": 1
}
```

**コンテンツ例**:

```json
[
  {
    "id": "content_1_1_1",
    "weekId": "week_1_1",
    "title": "GASとは",
    "type": "video",
    "description": "Google Apps Scriptの概要を学びます",
    "duration": 15,
    "order": 1,
    "videoUrl": "https://www.youtube.com/watch?v=example1",
    "thumbnailUrl": "https://example.com/thumbnails/gas-intro.jpg"
  },
  {
    "id": "content_1_1_2",
    "weekId": "week_1_1",
    "title": "スクリプトエディタの使い方",
    "type": "text",
    "description": "GASの開発環境であるスクリプトエディタの基本操作を学びます",
    "order": 2,
    "content": "# スクリプトエディタの使い方\n\n## エディタの起動方法\n\n1. Googleスプレッドシートを開く\n2. 「拡張機能」→「Apps Script」をクリック\n\n## 基本操作\n\n..."
  },
  {
    "id": "content_1_1_3",
    "weekId": "week_1_1",
    "title": "GAS基礎クイズ",
    "type": "quiz",
    "description": "GASの基礎知識を確認します",
    "order": 3,
    "questions": [
      {
        "id": "q1_1",
        "question": "GASとは何の略ですか？",
        "options": [
          "Google Apps Script",
          "Google Application System",
          "Global Application Service"
        ],
        "correctAnswer": 0
      },
      {
        "id": "q1_2",
        "question": "GASでスプレッドシートを操作するために使用するサービスは？",
        "options": [
          "DriveApp",
          "SpreadsheetApp",
          "DocumentApp"
        ],
        "correctAnswer": 1
      },
      {
        "id": "q1_3",
        "question": "GASスクリプトを実行するために必要な権限は？",
        "options": [
          "Googleアカウントの承認",
          "管理者権限",
          "特に必要ない"
        ],
        "correctAnswer": 0
      }
    ]
  },
  {
    "id": "content_1_1_4",
    "weekId": "week_1_1",
    "title": "スプレッドシート操作課題",
    "type": "assignment",
    "description": "スプレッドシートを操作するGASコードを作成してください",
    "order": 4,
    "requirements": "以下の要件を満たすGASコードを作成してください：\n1. A1セルに「Hello, GAS!」と入力する\n2. B1セルに現在の日時を入力する\n3. C1セルにA1とB1の値を結合して表示する",
    "dueDate": "2024-02-01T23:59:59Z"
  }
]
```

#### Week 2 - JavaScript基本文法

```json
{
  "id": "week_1_2",
  "phaseId": "phase_1",
  "weekNumber": 2,
  "title": "JavaScript基本文法",
  "order": 2
}
```

**コンテンツ例**:

```json
[
  {
    "id": "content_1_2_1",
    "weekId": "week_1_2",
    "title": "変数と型",
    "type": "video",
    "description": "JavaScriptの変数宣言と基本的なデータ型を学びます",
    "duration": 20,
    "order": 1,
    "videoUrl": "https://www.youtube.com/watch?v=example2",
    "thumbnailUrl": "https://example.com/thumbnails/js-variables.jpg"
  },
  {
    "id": "content_1_2_2",
    "weekId": "week_1_2",
    "title": "条件分岐とループ",
    "type": "text",
    "description": "if文、switch文、for文、while文の使い方を学びます",
    "order": 2,
    "content": "# 条件分岐とループ\n\n## if文\n\n```javascript\nif (条件式) {\n  // 条件が真の場合の処理\n} else {\n  // 条件が偽の場合の処理\n}\n```\n\n..."
  },
  {
    "id": "content_1_2_3",
    "weekId": "week_1_2",
    "title": "JavaScript基礎クイズ",
    "type": "quiz",
    "description": "JavaScript基本文法の理解度を確認します",
    "order": 3,
    "questions": [
      {
        "id": "q2_1",
        "question": "JavaScriptで変数を宣言する際に推奨されるキーワードは？",
        "options": [
          "var",
          "let",
          "const"
        ],
        "correctAnswer": 2
      },
      {
        "id": "q2_2",
        "question": "配列の要素数を取得するプロパティは？",
        "options": [
          "size",
          "length",
          "count"
        ],
        "correctAnswer": 1
      }
    ]
  },
  {
    "id": "content_1_2_4",
    "weekId": "week_1_2",
    "title": "配列操作課題",
    "type": "assignment",
    "description": "配列を操作するGASコードを作成してください",
    "order": 4,
    "requirements": "以下の要件を満たすGASコードを作成してください：\n1. 1から10までの数値を含む配列を作成\n2. 配列の各要素を2倍にする\n3. 結果をスプレッドシートのA列に出力する",
    "dueDate": "2024-02-08T23:59:59Z"
  }
]
```

### 2.2 Phase 2 - GAS応用

```json
{
  "id": "phase_2",
  "phaseNumber": 2,
  "title": "GAS応用",
  "description": "スプレッドシート操作、Googleサービス連携の応用を学びます",
  "order": 2
}
```

#### Week 3 - スプレッドシート応用

```json
{
  "id": "week_2_1",
  "phaseId": "phase_2",
  "weekNumber": 3,
  "title": "スプレッドシート応用",
  "order": 1
}
```

**コンテンツ例**:

```json
[
  {
    "id": "content_2_1_1",
    "weekId": "week_2_1",
    "title": "セル範囲の操作",
    "type": "video",
    "description": "複数セルの一括操作、範囲指定の方法を学びます",
    "duration": 25,
    "order": 1,
    "videoUrl": "https://www.youtube.com/watch?v=example3",
    "thumbnailUrl": "https://example.com/thumbnails/range-operations.jpg"
  },
  {
    "id": "content_2_1_2",
    "weekId": "week_2_1",
    "title": "データの集計と分析",
    "type": "text",
    "description": "GASを使ったデータの集計、フィルタリング、ソート方法",
    "order": 2,
    "content": "# データの集計と分析\n\n## データの取得\n\n```javascript\nconst sheet = SpreadsheetApp.getActiveSheet();\nconst data = sheet.getDataRange().getValues();\n```\n\n..."
  }
]
```

### 2.3 Phase 3 - 実践プロジェクト

```json
{
  "id": "phase_3",
  "phaseNumber": 3,
  "title": "実践プロジェクト",
  "description": "実際の業務で使える自動化ツールを作成します",
  "order": 3
}
```

---

## 3. 進捗データ (Progress)

### 3.1 山田 太郎の進捗

```json
{
  "userId": "student_001",
  "overall": {
    "totalContents": 20,
    "completedContents": 8,
    "completionRate": 40.0,
    "currentPhase": 1,
    "currentWeek": 2
  },
  "phaseProgress": [
    {
      "phaseId": "phase_1",
      "phaseNumber": 1,
      "totalContents": 8,
      "completedContents": 8,
      "completionRate": 100.0
    },
    {
      "phaseId": "phase_2",
      "phaseNumber": 2,
      "totalContents": 8,
      "completedContents": 0,
      "completionRate": 0.0
    },
    {
      "phaseId": "phase_3",
      "phaseNumber": 3,
      "totalContents": 4,
      "completedContents": 0,
      "completionRate": 0.0
    }
  ],
  "completedContents": [
    {
      "contentId": "content_1_1_1",
      "completedAt": "2024-01-15T14:30:00Z"
    },
    {
      "contentId": "content_1_1_2",
      "completedAt": "2024-01-15T15:00:00Z"
    },
    {
      "contentId": "content_1_1_3",
      "completedAt": "2024-01-16T10:20:00Z"
    },
    {
      "contentId": "content_1_1_4",
      "completedAt": "2024-01-17T16:45:00Z"
    },
    {
      "contentId": "content_1_2_1",
      "completedAt": "2024-01-18T11:00:00Z"
    },
    {
      "contentId": "content_1_2_2",
      "completedAt": "2024-01-18T14:15:00Z"
    },
    {
      "contentId": "content_1_2_3",
      "completedAt": "2024-01-19T09:30:00Z"
    },
    {
      "contentId": "content_1_2_4",
      "completedAt": "2024-01-20T15:20:00Z"
    }
  ]
}
```

### 3.2 田中 花子の進捗

```json
{
  "userId": "student_002",
  "overall": {
    "totalContents": 20,
    "completedContents": 4,
    "completionRate": 20.0,
    "currentPhase": 1,
    "currentWeek": 1
  },
  "phaseProgress": [
    {
      "phaseId": "phase_1",
      "phaseNumber": 1,
      "totalContents": 8,
      "completedContents": 4,
      "completionRate": 50.0
    },
    {
      "phaseId": "phase_2",
      "phaseNumber": 2,
      "totalContents": 8,
      "completedContents": 0,
      "completionRate": 0.0
    },
    {
      "phaseId": "phase_3",
      "phaseNumber": 3,
      "totalContents": 4,
      "completedContents": 0,
      "completionRate": 0.0
    }
  ],
  "completedContents": [
    {
      "contentId": "content_1_1_1",
      "completedAt": "2024-01-16T13:00:00Z"
    },
    {
      "contentId": "content_1_1_2",
      "completedAt": "2024-01-17T10:30:00Z"
    },
    {
      "contentId": "content_1_1_3",
      "completedAt": "2024-01-17T15:45:00Z"
    },
    {
      "contentId": "content_1_1_4",
      "completedAt": "2024-01-18T14:00:00Z"
    }
  ]
}
```

### 3.3 佐藤 一郎の進捗

```json
{
  "userId": "student_003",
  "overall": {
    "totalContents": 20,
    "completedContents": 0,
    "completionRate": 0.0,
    "currentPhase": 1,
    "currentWeek": 1
  },
  "phaseProgress": [
    {
      "phaseId": "phase_1",
      "phaseNumber": 1,
      "totalContents": 8,
      "completedContents": 0,
      "completionRate": 0.0
    },
    {
      "phaseId": "phase_2",
      "phaseNumber": 2,
      "totalContents": 8,
      "completedContents": 0,
      "completionRate": 0.0
    },
    {
      "phaseId": "phase_3",
      "phaseNumber": 3,
      "totalContents": 4,
      "completedContents": 0,
      "completionRate": 0.0
    }
  ],
  "completedContents": []
}
```

---

## 4. クイズ結果データ (Quiz Results)

### 4.1 山田 太郎のクイズ結果

```json
{
  "quizId": "content_1_1_3",
  "userId": "student_001",
  "attempts": [
    {
      "attemptNumber": 1,
      "score": 66.7,
      "totalQuestions": 3,
      "correctAnswers": 2,
      "submittedAt": "2024-01-16T10:00:00Z",
      "results": [
        {
          "questionId": "q1_1",
          "isCorrect": true,
          "selectedAnswer": 0,
          "correctAnswer": 0
        },
        {
          "questionId": "q1_2",
          "isCorrect": true,
          "selectedAnswer": 1,
          "correctAnswer": 1
        },
        {
          "questionId": "q1_3",
          "isCorrect": false,
          "selectedAnswer": 2,
          "correctAnswer": 0
        }
      ]
    },
    {
      "attemptNumber": 2,
      "score": 100.0,
      "totalQuestions": 3,
      "correctAnswers": 3,
      "submittedAt": "2024-01-16T10:20:00Z",
      "results": [
        {
          "questionId": "q1_1",
          "isCorrect": true,
          "selectedAnswer": 0,
          "correctAnswer": 0
        },
        {
          "questionId": "q1_2",
          "isCorrect": true,
          "selectedAnswer": 1,
          "correctAnswer": 1
        },
        {
          "questionId": "q1_3",
          "isCorrect": true,
          "selectedAnswer": 0,
          "correctAnswer": 0
        }
      ]
    }
  ],
  "bestScore": 100.0
}
```

### 4.2 田中 花子のクイズ結果

```json
{
  "quizId": "content_1_1_3",
  "userId": "student_002",
  "attempts": [
    {
      "attemptNumber": 1,
      "score": 33.3,
      "totalQuestions": 3,
      "correctAnswers": 1,
      "submittedAt": "2024-01-17T15:45:00Z",
      "results": [
        {
          "questionId": "q1_1",
          "isCorrect": true,
          "selectedAnswer": 0,
          "correctAnswer": 0
        },
        {
          "questionId": "q1_2",
          "isCorrect": false,
          "selectedAnswer": 0,
          "correctAnswer": 1
        },
        {
          "questionId": "q1_3",
          "isCorrect": false,
          "selectedAnswer": 1,
          "correctAnswer": 0
        }
      ]
    }
  ],
  "bestScore": 33.3
}
```

---

## 5. 課題提出データ (Submissions)

### 5.1 山田 太郎の提出物

```json
{
  "id": "submission_001",
  "assignmentId": "content_1_1_4",
  "userId": "student_001",
  "userName": "山田 太郎",
  "content": "function helloGAS() {\n  const sheet = SpreadsheetApp.getActiveSheet();\n  \n  // A1セルに「Hello, GAS!」と入力\n  sheet.getRange('A1').setValue('Hello, GAS!');\n  \n  // B1セルに現在の日時を入力\n  sheet.getRange('B1').setValue(new Date());\n  \n  // C1セルにA1とB1の値を結合して表示\n  const a1 = sheet.getRange('A1').getValue();\n  const b1 = sheet.getRange('B1').getValue();\n  sheet.getRange('C1').setValue(a1 + ' - ' + b1);\n}",
  "sharedUrls": [
    "https://script.google.com/home/projects/ABC123/edit"
  ],
  "status": "returned",
  "feedback": "素晴らしい実装です！要件を全て満たしています。\n\n【良い点】\n- コメントが適切に記載されている\n- コードが読みやすく整理されている\n- getRange()を正しく使用できている\n\n【改善提案】\n- エラーハンドリングを追加すると更に良いでしょう\n- 日時のフォーマットを指定すると見やすくなります",
  "submittedAt": "2024-01-17T16:30:00Z",
  "reviewedAt": "2024-01-18T10:15:00Z",
  "reviewedBy": "instructor_001",
  "returnedAt": "2024-01-18T10:20:00Z"
}
```

```json
{
  "id": "submission_002",
  "assignmentId": "content_1_2_4",
  "userId": "student_001",
  "userName": "山田 太郎",
  "content": "function arrayDoubler() {\n  const sheet = SpreadsheetApp.getActiveSheet();\n  \n  // 1から10までの数値を含む配列を作成\n  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];\n  \n  // 配列の各要素を2倍にする\n  const doubled = numbers.map(num => num * 2);\n  \n  // 結果をスプレッドシートのA列に出力\n  for (let i = 0; i < doubled.length; i++) {\n    sheet.getRange(i + 1, 1).setValue(doubled[i]);\n  }\n}",
  "sharedUrls": [
    "https://script.google.com/home/projects/DEF456/edit",
    "https://docs.google.com/spreadsheets/d/XYZ789/edit"
  ],
  "status": "reviewed",
  "feedback": "良くできています。map()を使った実装は適切です。\n\n【良い点】\n- map()メソッドを正しく活用できている\n- コードが簡潔で分かりやすい\n\n【改善提案】\n- forループの代わりにsetValues()で一括出力すると処理が高速になります\n- 例: sheet.getRange(1, 1, doubled.length, 1).setValues(doubled.map(v => [v]));",
  "submittedAt": "2024-01-20T15:00:00Z",
  "reviewedAt": "2024-01-21T09:30:00Z",
  "reviewedBy": "instructor_001",
  "returnedAt": null
}
```

### 5.2 田中 花子の提出物

```json
{
  "id": "submission_003",
  "assignmentId": "content_1_1_4",
  "userId": "student_002",
  "userName": "田中 花子",
  "content": "function myFirstGAS() {\n  const ss = SpreadsheetApp.getActiveSpreadsheet();\n  const sheet = ss.getActiveSheet();\n  \n  sheet.getRange('A1').setValue('Hello, GAS!');\n  sheet.getRange('B1').setValue(new Date());\n  \n  const text = sheet.getRange('A1').getValue();\n  const date = sheet.getRange('B1').getValue();\n  sheet.getRange('C1').setValue(text + ' ' + date);\n}",
  "sharedUrls": [
    "https://script.google.com/home/projects/GHI789/edit"
  ],
  "status": "submitted",
  "feedback": null,
  "submittedAt": "2024-01-18T13:45:00Z",
  "reviewedAt": null,
  "reviewedBy": null,
  "returnedAt": null
}
```

---

## 6. お知らせデータ (Announcements)

```json
{
  "id": "announce_001",
  "title": "GAS学習支援プラットフォームへようこそ",
  "content": "この度はGAS学習支援プラットフォームにご登録いただきありがとうございます。\n\n本プラットフォームでは、Google Apps Script（GAS）の基礎から応用まで、実践的なスキルを学ぶことができます。\n\n各フェーズのコンテンツを順番に進めていただき、課題を提出してください。講師陣が丁寧にフィードバックいたします。\n\n学習に関する質問は、Slackコミュニティでお気軽にお尋ねください。\n\n一緒に楽しく学んでいきましょう！",
  "createdAt": "2024-01-10T09:00:00Z",
  "updatedAt": "2024-01-10T09:00:00Z",
  "createdBy": "instructor_001",
  "createdByName": "運営 太郎"
}
```

```json
{
  "id": "announce_002",
  "title": "Phase 2 コンテンツ追加のお知らせ",
  "content": "Phase 2「GAS応用」のコンテンツを追加しました。\n\n【追加内容】\n- Week 3: スプレッドシート応用\n- Week 4: Googleサービス連携\n\nPhase 1を完了された方は、ぜひPhase 2にもチャレンジしてみてください。\n\nより実践的な内容となっており、業務で使える自動化スキルが身につきます。",
  "createdAt": "2024-01-20T10:00:00Z",
  "updatedAt": "2024-01-20T10:00:00Z",
  "createdBy": "instructor_001",
  "createdByName": "運営 太郎"
}
```

```json
{
  "id": "announce_003",
  "title": "メンテナンスのお知らせ",
  "content": "【重要】システムメンテナンスのお知らせ\n\n日時: 2024年1月28日（日）02:00 - 06:00\n内容: サーバーメンテナンス\n\nメンテナンス中は、プラットフォームへのアクセスができなくなります。\nご不便をおかけしますが、ご理解とご協力をお願いいたします。\n\nメンテナンス完了後、新機能「学習時間記録」を追加予定です。",
  "createdAt": "2024-01-22T15:00:00Z",
  "updatedAt": "2024-01-23T10:00:00Z",
  "createdBy": "admin_001",
  "createdByName": "システム管理者"
}
```

---

## 7. 通知データ (Notifications)

### 7.1 山田 太郎の通知

```json
[
  {
    "id": "notif_001",
    "userId": "student_001",
    "type": "submission_reviewed",
    "title": "課題にフィードバックが届きました",
    "message": "「スプレッドシート操作課題」のフィードバックが返却されました",
    "isRead": false,
    "createdAt": "2024-01-18T10:20:00Z",
    "relatedId": "submission_001",
    "relatedType": "submission"
  },
  {
    "id": "notif_002",
    "userId": "student_001",
    "type": "announcement",
    "title": "Phase 2 コンテンツ追加のお知らせ",
    "message": "Phase 2「GAS応用」のコンテンツを追加しました",
    "isRead": true,
    "createdAt": "2024-01-20T10:05:00Z",
    "relatedId": "announce_002",
    "relatedType": "announcement"
  },
  {
    "id": "notif_003",
    "userId": "student_001",
    "type": "announcement",
    "title": "メンテナンスのお知らせ",
    "message": "2024年1月28日（日）02:00 - 06:00にメンテナンスを実施します",
    "isRead": false,
    "createdAt": "2024-01-22T15:05:00Z",
    "relatedId": "announce_003",
    "relatedType": "announcement"
  }
]
```

### 7.2 田中 花子の通知

```json
[
  {
    "id": "notif_004",
    "userId": "student_002",
    "type": "account_approved",
    "title": "アカウントが承認されました",
    "message": "ご登録ありがとうございます。学習コンテンツをご利用いただけます",
    "isRead": true,
    "createdAt": "2024-01-16T10:00:00Z",
    "relatedId": null,
    "relatedType": null
  },
  {
    "id": "notif_005",
    "userId": "student_002",
    "type": "announcement",
    "title": "Phase 2 コンテンツ追加のお知らせ",
    "message": "Phase 2「GAS応用」のコンテンツを追加しました",
    "isRead": false,
    "createdAt": "2024-01-20T10:05:00Z",
    "relatedId": "announce_002",
    "relatedType": "announcement"
  }
]
```

---

## 8. 統計データ (Analytics)

### 8.1 全体統計

```json
{
  "students": {
    "total": 5,
    "approved": 3,
    "pending": 2,
    "active": 2,
    "inactive": 1
  },
  "contents": {
    "total": 20,
    "videos": 8,
    "texts": 6,
    "quizzes": 3,
    "assignments": 3
  },
  "submissions": {
    "total": 3,
    "submitted": 1,
    "reviewed": 1,
    "returned": 1
  },
  "completion": {
    "averageRate": 20.0,
    "phase1": 50.0,
    "phase2": 0.0,
    "phase3": 0.0
  }
}
```

### 8.2 フェーズ別統計（Phase 1）

```json
{
  "phaseId": "phase_1",
  "phaseNumber": 1,
  "title": "GAS基礎・JavaScript基礎",
  "students": {
    "total": 3,
    "completed": 1,
    "inProgress": 2,
    "notStarted": 0
  },
  "averageCompletionRate": 50.0,
  "weekStats": [
    {
      "weekId": "week_1_1",
      "weekNumber": 1,
      "averageCompletionRate": 66.7
    },
    {
      "weekId": "week_1_2",
      "weekNumber": 2,
      "averageCompletionRate": 33.3
    }
  ]
}
```

### 8.3 課題別統計

```json
{
  "assignmentId": "content_1_1_4",
  "assignmentTitle": "スプレッドシート操作課題",
  "submissions": {
    "total": 3,
    "submitted": 1,
    "reviewed": 1,
    "returned": 1,
    "pending": 0,
    "notSubmitted": 0
  },
  "submissionRate": 100.0,
  "reviewRate": 66.7,
  "averageReviewTime": 17.75
}
```

---

## 9. モックデータ使用ガイドライン

### 9.1 開発環境での利用

**フロントエンド開発**:
- 各画面のUIコンポーネント実装時にモックデータを使用
- API未実装時のダミーレスポンスとして活用
- ローディング状態、空状態、エラー状態のテストに使用

**バックエンド開発**:
- 初期データベースシードデータとして使用
- API実装時のテストケースとして活用
- レスポンス形式の参考として使用

### 9.2 テストシナリオ例

**受講生の学習フロー**:
1. 未承認ユーザーでログイン → 承認待ち画面表示
2. 講師が承認 → メール・通知受信
3. コンテンツ閲覧 → 動画視聴、テキスト読解
4. クイズ回答 → 即時採点、結果確認
5. 課題提出 → Slack通知（講師側）
6. フィードバック受信 → メール・通知受信

**講師の管理フロー**:
1. ダッシュボードで全体統計確認
2. 未承認受講生一覧確認 → 承認処理
3. 提出課題一覧確認 → フィードバック記入
4. フィードバック返却 → 通知送信
5. 進捗確認 → 個別受講生の詳細確認

### 9.3 データバリエーション

**進捗状況のバリエーション**:
- 完了率 100%（全て完了）
- 完了率 50%（途中まで進行）
- 完了率 0%（未着手）

**課題提出のバリエーション**:
- 提出済み（未レビュー）
- レビュー済み（未返却）
- 返却済み

**承認状態のバリエーション**:
- 承認済みユーザー
- 未承認ユーザー

### 9.4 更新頻度

**静的データ**（頻繁に変更されないもの）:
- ユーザー基本情報
- フェーズ・週・コンテンツ構成
- お知らせ

**動的データ**（状態が変化するもの）:
- 進捗状況
- 課題提出・フィードバック
- 通知
- 統計情報

---

## 10. データ整合性チェックリスト

### 10.1 必須チェック項目

- [ ] ユーザーIDの重複がないこと
- [ ] フェーズ・週・コンテンツのorder値が正しく設定されていること
- [ ] 進捗データのcontentIdが実在するコンテンツを参照していること
- [ ] 提出データのassignmentIdが実在する課題を参照していること
- [ ] 通知データのrelatedIdが実在するリソースを参照していること
- [ ] 日時フォーマットがISO 8601形式（YYYY-MM-DDTHH:mm:ssZ）であること
- [ ] 承認済みユーザーのisApprovedがtrueであること
- [ ] 未承認ユーザーのisApprovedがfalseであること

### 10.2 推奨チェック項目

- [ ] メールアドレスが有効な形式であること
- [ ] 完了率の計算が正しいこと（completedContents / totalContents * 100）
- [ ] 課題提出のstatusが正しい順序で遷移していること（submitted → reviewed → returned）
- [ ] フィードバックがある場合はreviewedAtとreviewedByが設定されていること
- [ ] 返却済みの場合はreturnedAtが設定されていること

---

## 改訂履歴

| 日付 | 内容 |
|:--|:--|
| 2024年1月 | 初版作成 |
