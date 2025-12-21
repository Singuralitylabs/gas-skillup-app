# モックデータ仕様書（MVP版）

## 概要

GAS学習支援プラットフォームのMVP開発用モックデータ仕様。

**目的**:
- フロントエンド開発時のAPI連携テスト
- UIコンポーネントの表示確認
- データ構造の検証

**方針**:
- データベース設計書（database-design.md）に準拠
- MVP に必要な最小限のデータのみを含む
- ContentType は `video | text | exercise` のみ

---

## 1. ユーザーデータ (Users)

### 1.1 受講生 (Students)

#### 承認済み受講生

```json
{
  "id": "student_001",
  "email": "yamada.taro@example.com",
  "name": "山田 太郎",
  "role": "student",
  "approved": true,
  "created_at": "2024-01-15T10:00:00Z"
}
```

```json
{
  "id": "student_002",
  "email": "tanaka.hanako@example.com",
  "name": "田中 花子",
  "role": "student",
  "approved": true,
  "created_at": "2024-01-16T09:30:00Z"
}
```

#### 未承認受講生

```json
{
  "id": "student_pending_001",
  "email": "suzuki.jiro@example.com",
  "name": "鈴木 二郎",
  "role": "student",
  "approved": false,
  "created_at": "2024-01-22T09:30:00Z"
}
```

### 1.2 講師・運営 (Instructors)

```json
{
  "id": "instructor_001",
  "email": "admin@example.com",
  "name": "佐藤 花子",
  "role": "instructor",
  "approved": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 1.3 管理者 (Admins)

```json
{
  "id": "admin_001",
  "email": "superadmin@example.com",
  "name": "システム管理者",
  "role": "admin",
  "approved": true,
  "created_at": "2024-01-01T00:00:00Z"
}
```

---

## 2. フェーズ・週・コンテンツデータ

### 2.1 Phase 1 - GAS基礎・JavaScript基礎

```json
{
  "id": "phase_1",
  "title": "GAS基礎・JavaScript基礎",
  "description": "Google Apps Scriptの基礎とJavaScriptの基本文法を学びます",
  "order_index": 1,
  "created_at": "2024-01-01T00:00:00Z"
}
```

#### Week 1 - GAS概要・環境構築

```json
{
  "id": "week_1_1",
  "phase_id": "phase_1",
  "title": "GAS概要・環境構築",
  "description": "Google Apps Scriptの概要と開発環境の使い方を学びます",
  "order_index": 1,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**コンテンツ**:

```json
[
  {
    "id": "content_1_1_1",
    "week_id": "week_1_1",
    "type": "video",
    "title": "GASとは",
    "content": "https://www.youtube.com/watch?v=example1",
    "order_index": 1,
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "content_1_1_2",
    "week_id": "week_1_1",
    "type": "text",
    "title": "スクリプトエディタの使い方",
    "content": "# スクリプトエディタの使い方\n\n## エディタの起動方法\n\n1. Googleスプレッドシートを開く\n2. 「拡張機能」→「Apps Script」をクリック\n\n## 基本操作\n\n- コードの記述\n- 実行とデバッグ\n- ログの確認",
    "order_index": 2,
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "content_1_1_3",
    "week_id": "week_1_1",
    "type": "exercise",
    "title": "スプレッドシート操作課題",
    "content": "以下の要件を満たすGASコードを作成してください：\n1. A1セルに「Hello, GAS!」と入力する\n2. B1セルに現在の日時を入力する\n3. C1セルにA1とB1の値を結合して表示する",
    "order_index": 3,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

#### Week 2 - JavaScript基本文法

```json
{
  "id": "week_1_2",
  "phase_id": "phase_1",
  "title": "JavaScript基本文法",
  "description": "JavaScriptの変数、条件分岐、ループを学びます",
  "order_index": 2,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**コンテンツ**:

```json
[
  {
    "id": "content_1_2_1",
    "week_id": "week_1_2",
    "type": "video",
    "title": "変数と型",
    "content": "https://www.youtube.com/watch?v=example2",
    "order_index": 1,
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "content_1_2_2",
    "week_id": "week_1_2",
    "type": "text",
    "title": "条件分岐とループ",
    "content": "# 条件分岐とループ\n\n## if文\n\n```javascript\nif (条件式) {\n  // 条件が真の場合の処理\n} else {\n  // 条件が偽の場合の処理\n}\n```\n\n## for文\n\n```javascript\nfor (let i = 0; i < 10; i++) {\n  // 繰り返し処理\n}\n```",
    "order_index": 2,
    "created_at": "2024-01-01T00:00:00Z"
  },
  {
    "id": "content_1_2_3",
    "week_id": "week_1_2",
    "type": "exercise",
    "title": "配列操作課題",
    "content": "以下の要件を満たすGASコードを作成してください：\n1. 1から10までの数値を含む配列を作成\n2. 配列の各要素を2倍にする\n3. 結果をスプレッドシートのA列に出力する",
    "order_index": 3,
    "created_at": "2024-01-01T00:00:00Z"
  }
]
```

---

## 3. 進捗データ (User Progress)

### 3.1 山田 太郎の進捗（100%完了）

```json
[
  {
    "id": "progress_001",
    "user_id": "student_001",
    "content_id": "content_1_1_1",
    "completed": true,
    "completed_at": "2024-01-15T14:30:00Z"
  },
  {
    "id": "progress_002",
    "user_id": "student_001",
    "content_id": "content_1_1_2",
    "completed": true,
    "completed_at": "2024-01-15T15:00:00Z"
  },
  {
    "id": "progress_003",
    "user_id": "student_001",
    "content_id": "content_1_1_3",
    "completed": true,
    "completed_at": "2024-01-17T16:45:00Z"
  },
  {
    "id": "progress_004",
    "user_id": "student_001",
    "content_id": "content_1_2_1",
    "completed": true,
    "completed_at": "2024-01-18T11:00:00Z"
  },
  {
    "id": "progress_005",
    "user_id": "student_001",
    "content_id": "content_1_2_2",
    "completed": true,
    "completed_at": "2024-01-18T14:15:00Z"
  },
  {
    "id": "progress_006",
    "user_id": "student_001",
    "content_id": "content_1_2_3",
    "completed": true,
    "completed_at": "2024-01-20T15:20:00Z"
  }
]
```

### 3.2 田中 花子の進捗（50%完了）

```json
[
  {
    "id": "progress_007",
    "user_id": "student_002",
    "content_id": "content_1_1_1",
    "completed": true,
    "completed_at": "2024-01-16T13:00:00Z"
  },
  {
    "id": "progress_008",
    "user_id": "student_002",
    "content_id": "content_1_1_2",
    "completed": true,
    "completed_at": "2024-01-17T10:30:00Z"
  },
  {
    "id": "progress_009",
    "user_id": "student_002",
    "content_id": "content_1_1_3",
    "completed": true,
    "completed_at": "2024-01-18T14:00:00Z"
  },
  {
    "id": "progress_010",
    "user_id": "student_002",
    "content_id": "content_1_2_1",
    "completed": false,
    "completed_at": null
  },
  {
    "id": "progress_011",
    "user_id": "student_002",
    "content_id": "content_1_2_2",
    "completed": false,
    "completed_at": null
  },
  {
    "id": "progress_012",
    "user_id": "student_002",
    "content_id": "content_1_2_3",
    "completed": false,
    "completed_at": null
  }
]
```

---

## 4. 課題提出データ (Submissions)

### 4.1 山田 太郎の提出物（返却済み）

```json
{
  "id": "submission_001",
  "user_id": "student_001",
  "content_id": "content_1_1_3",
  "submission_type": "code",
  "content": "function helloGAS() {\n  const sheet = SpreadsheetApp.getActiveSheet();\n  \n  // A1セルに「Hello, GAS!」と入力\n  sheet.getRange('A1').setValue('Hello, GAS!');\n  \n  // B1セルに現在の日時を入力\n  sheet.getRange('B1').setValue(new Date());\n  \n  // C1セルにA1とB1の値を結合して表示\n  const a1 = sheet.getRange('A1').getValue();\n  const b1 = sheet.getRange('B1').getValue();\n  sheet.getRange('C1').setValue(a1 + ' - ' + b1);\n}",
  "feedback": "素晴らしい実装です！要件を全て満たしています。\n\n【良い点】\n- コメントが適切に記載されている\n- コードが読みやすく整理されている\n- getRange()を正しく使用できている\n\n【改善提案】\n- エラーハンドリングを追加すると更に良いでしょう",
  "feedback_at": "2024-01-18T10:15:00Z",
  "created_at": "2024-01-17T16:30:00Z"
}
```

### 4.2 田中 花子の提出物（提出済み・未レビュー）

```json
{
  "id": "submission_002",
  "user_id": "student_002",
  "content_id": "content_1_1_3",
  "submission_type": "url",
  "content": "https://script.google.com/home/projects/GHI789/edit",
  "feedback": null,
  "feedback_at": null,
  "created_at": "2024-01-18T13:45:00Z"
}
```

---

## 5. お知らせデータ (Announcements)

```json
{
  "id": "announce_001",
  "title": "GAS学習支援プラットフォームへようこそ",
  "content": "この度はGAS学習支援プラットフォームにご登録いただきありがとうございます。\n\n本プラットフォームでは、Google Apps Script（GAS）の基礎から応用まで、実践的なスキルを学ぶことができます。\n\n各週のコンテンツを順番に進めていただき、課題を提出してください。講師陣が丁寧にフィードバックいたします。",
  "published_at": "2024-01-10T09:00:00Z",
  "created_at": "2024-01-10T09:00:00Z"
}
```

```json
{
  "id": "announce_002",
  "title": "メンテナンスのお知らせ",
  "content": "【重要】システムメンテナンスのお知らせ\n\n日時: 2024年1月28日（日）02:00 - 06:00\n内容: サーバーメンテナンス\n\nメンテナンス中は、プラットフォームへのアクセスができなくなります。\nご不便をおかけしますが、ご理解とご協力をお願いいたします。",
  "published_at": "2024-01-22T15:00:00Z",
  "created_at": "2024-01-22T15:00:00Z"
}
```

---

## 6. モックデータ使用ガイドライン

### 6.1 データバリエーション

**進捗状況**:
- 山田 太郎: 100%完了（全コンテンツ完了）
- 田中 花子: 50%完了（Week 1のみ完了）

**課題提出**:
- 山田 太郎: フィードバック済み
- 田中 花子: 提出済み・未レビュー

**承認状態**:
- 承認済みユーザー: 2名
- 未承認ユーザー: 1名

### 6.2 テストシナリオ例

**受講生の学習フロー**:
1. 未承認ユーザーでログイン → 承認待ち画面表示
2. 講師が承認 → 通知受信
3. コンテンツ閲覧 → 動画視聴、テキスト読解
4. 課題提出 → 講師に通知
5. フィードバック受信 → 通知受信

**講師の管理フロー**:
1. ダッシュボードで統計確認
2. 未承認受講生一覧 → 承認処理
3. 提出課題一覧 → フィードバック記入
4. 進捗確認 → 個別受講生の詳細確認

### 6.3 データ整合性チェック

**必須項目**:
- [ ] ユーザーIDの重複がないこと
- [ ] フェーズ・週・コンテンツの order_index が正しく設定されていること
- [ ] 進捗データの content_id が実在するコンテンツを参照していること
- [ ] 提出データの content_id が実在する exercise を参照していること
- [ ] 日時フォーマットが ISO 8601 形式であること
- [ ] ContentType が `video | text | exercise` のいずれかであること

---

## 改訂履歴

| 日付 | 内容 |
|:--|:--|
| 2024年1月 | 初版作成 |
| 2024年1月（MVP版） | データベース設計書に準拠、データ量を最小化 |
