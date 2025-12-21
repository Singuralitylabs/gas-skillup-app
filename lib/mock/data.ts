/**
 * モックデータ生成関数
 * Sprint 1 で使用するモックデータを生成します
 */

import type {
	AnnouncementResponse,
	ContentResponse,
	ContentType,
	PhaseResponse,
	SubmissionResponse,
	SubmissionType,
	UserProgressResponse,
	UserResponse,
	WeekResponse,
} from "@/types";

// ============================================
// ユーザーデータ
// ============================================

export const mockUsers: UserResponse[] = [
	{
		id: "user-1",
		email: "student1@example.com",
		name: "山田 太郎",
		role: "student",
		approved: true,
		createdAt: "2024-01-15T10:00:00Z",
	},
	{
		id: "user-2",
		email: "student2@example.com",
		name: "佐藤 花子",
		role: "student",
		approved: true,
		createdAt: "2024-01-16T11:30:00Z",
	},
	{
		id: "user-3",
		email: "student3@example.com",
		name: "鈴木 一郎",
		role: "student",
		approved: false,
		createdAt: "2024-01-20T09:00:00Z",
	},
	{
		id: "user-4",
		email: "instructor@example.com",
		name: "講師 太郎",
		role: "instructor",
		approved: true,
		createdAt: "2024-01-01T08:00:00Z",
	},
];

// ============================================
// Phaseデータ
// ============================================

export const mockPhases: PhaseResponse[] = [
	{
		id: "phase-1",
		title: "Phase 1: GAS基礎",
		description: "Google Apps Scriptの基礎を学びます",
		orderIndex: 1,
		createdAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "phase-2",
		title: "Phase 2: スプレッドシート操作",
		description: "Spreadsheet Serviceを使った操作方法を学びます",
		orderIndex: 2,
		createdAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "phase-3",
		title: "Phase 3: GmailとGoogleドライブ",
		description: "Gmail ServiceとDrive Serviceを学びます",
		orderIndex: 3,
		createdAt: "2024-01-01T00:00:00Z",
	},
];

// ============================================
// Weekデータ
// ============================================

export const mockWeeks: WeekResponse[] = [
	// Phase 1
	{
		id: "week-1-1",
		phaseId: "phase-1",
		title: "Week 1: GAS入門",
		description: "GASの概要と開発環境の構築",
		orderIndex: 1,
		createdAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "week-1-2",
		phaseId: "phase-1",
		title: "Week 2: JavaScript基礎",
		description: "GASで使用するJavaScriptの基本文法",
		orderIndex: 2,
		createdAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "week-1-3",
		phaseId: "phase-1",
		title: "Week 3: GAS基本操作",
		description: "ログ出力、変数、関数の基本",
		orderIndex: 3,
		createdAt: "2024-01-01T00:00:00Z",
	},
	// Phase 2
	{
		id: "week-2-1",
		phaseId: "phase-2",
		title: "Week 4: スプレッドシート基礎",
		description: "スプレッドシートの読み書き基本操作",
		orderIndex: 1,
		createdAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "week-2-2",
		phaseId: "phase-2",
		title: "Week 5: セル操作と範囲指定",
		description: "セルの操作と範囲指定の方法",
		orderIndex: 2,
		createdAt: "2024-01-01T00:00:00Z",
	},
];

// ============================================
// Contentデータ
// ============================================

export const mockContents: ContentResponse[] = [
	// Week 1-1
	{
		id: "content-1-1-1",
		weekId: "week-1-1",
		type: "video",
		title: "GASとは？概要説明",
		content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		orderIndex: 1,
		createdAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "content-1-1-2",
		weekId: "week-1-1",
		type: "text",
		title: "GASの開発環境構築",
		content: `# GAS開発環境の構築

## 概要
Google Apps Script (GAS) の開発環境を構築します。

## 手順
1. Googleアカウントでログイン
2. Googleドライブにアクセス
3. 新規作成 > Apps Script を選択
4. コードエディタが開きます

## 動作確認
\`\`\`javascript
function myFunction() {
  Logger.log('Hello, GAS!');
}
\`\`\`
`,
		orderIndex: 2,
		createdAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "content-1-1-3",
		weekId: "week-1-1",
		type: "exercise",
		title: "演習: 初めてのGASプログラム",
		content: `# 演習課題

## 課題内容
Logger.log() を使って、あなたの名前を出力するプログラムを作成してください。

## ヒント
- Logger.log('文字列') で文字列を出力できます
- 実行ログは「表示」>「ログ」で確認できます

## 提出方法
作成したコードのスクリーンショットまたはコードをコピーして提出してください。
`,
		orderIndex: 3,
		createdAt: "2024-01-01T00:00:00Z",
	},
	// Week 1-2
	{
		id: "content-1-2-1",
		weekId: "week-1-2",
		type: "video",
		title: "JavaScript変数と型",
		content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		orderIndex: 1,
		createdAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "content-1-2-2",
		weekId: "week-1-2",
		type: "text",
		title: "JavaScriptの基本文法",
		content: `# JavaScript基本文法

## 変数の宣言
\`\`\`javascript
let name = '山田太郎';
const age = 25;
var city = '東京'; // 使用非推奨
\`\`\`

## データ型
- String (文字列)
- Number (数値)
- Boolean (真偽値)
- Array (配列)
- Object (オブジェクト)

## 条件分岐
\`\`\`javascript
if (age >= 20) {
  Logger.log('成人です');
} else {
  Logger.log('未成年です');
}
\`\`\`
`,
		orderIndex: 2,
		createdAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "content-1-2-3",
		weekId: "week-1-2",
		type: "exercise",
		title: "演習: 条件分岐プログラム",
		content: `# 演習課題

## 課題内容
年齢を変数に格納し、18歳以上なら「選挙権があります」、未満なら「選挙権がありません」と表示するプログラムを作成してください。

## 提出方法
完成したコードを提出してください。
`,
		orderIndex: 3,
		createdAt: "2024-01-01T00:00:00Z",
	},
	// Week 2-1
	{
		id: "content-2-1-1",
		weekId: "week-2-1",
		type: "video",
		title: "スプレッドシート操作入門",
		content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
		orderIndex: 1,
		createdAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "content-2-1-2",
		weekId: "week-2-1",
		type: "text",
		title: "スプレッドシートの読み書き",
		content: `# スプレッドシート操作

## スプレッドシートの取得
\`\`\`javascript
// アクティブなスプレッドシート
const ss = SpreadsheetApp.getActiveSpreadsheet();
const sheet = ss.getActiveSheet();
\`\`\`

## セルの読み書き
\`\`\`javascript
// 読み取り
const value = sheet.getRange('A1').getValue();

// 書き込み
sheet.getRange('A1').setValue('Hello, GAS!');
\`\`\`
`,
		orderIndex: 2,
		createdAt: "2024-01-01T00:00:00Z",
	},
	{
		id: "content-2-1-3",
		weekId: "week-2-1",
		type: "exercise",
		title: "演習: セルの読み書きプログラム",
		content: `# 演習課題

## 課題内容
A1セルの値を読み取り、B1セルにその値を2倍にして書き込むプログラムを作成してください。

## 提出方法
完成したコードとスプレッドシートのURLを提出してください。
`,
		orderIndex: 3,
		createdAt: "2024-01-01T00:00:00Z",
	},
];

// ============================================
// 進捗データ
// ============================================

export const mockUserProgress: UserProgressResponse[] = [
	// user-1 の進捗
	{
		id: "progress-1-1",
		userId: "user-1",
		contentId: "content-1-1-1",
		completed: true,
		completedAt: "2024-01-16T14:30:00Z",
	},
	{
		id: "progress-1-2",
		userId: "user-1",
		contentId: "content-1-1-2",
		completed: true,
		completedAt: "2024-01-16T15:45:00Z",
	},
	{
		id: "progress-1-3",
		userId: "user-1",
		contentId: "content-1-1-3",
		completed: true,
		completedAt: "2024-01-17T10:00:00Z",
	},
	{
		id: "progress-1-4",
		userId: "user-1",
		contentId: "content-1-2-1",
		completed: true,
		completedAt: "2024-01-18T09:30:00Z",
	},
	{
		id: "progress-1-5",
		userId: "user-1",
		contentId: "content-1-2-2",
		completed: false,
		completedAt: null,
	},
	// user-2 の進捗
	{
		id: "progress-2-1",
		userId: "user-2",
		contentId: "content-1-1-1",
		completed: true,
		completedAt: "2024-01-17T10:00:00Z",
	},
	{
		id: "progress-2-2",
		userId: "user-2",
		contentId: "content-1-1-2",
		completed: true,
		completedAt: "2024-01-17T11:00:00Z",
	},
];

// ============================================
// 課題提出データ
// ============================================

export const mockSubmissions: SubmissionResponse[] = [
	{
		id: "submission-1",
		userId: "user-1",
		contentId: "content-1-1-3",
		submissionType: "code",
		content: `function myFunction() {
  Logger.log('山田太郎');
}`,
		feedback: "素晴らしい実装です！正しく動作しています。",
		feedbackAt: "2024-01-17T12:00:00Z",
		createdAt: "2024-01-17T10:30:00Z",
	},
	{
		id: "submission-2",
		userId: "user-1",
		contentId: "content-1-2-3",
		submissionType: "code",
		content: `function checkVotingAge() {
  const age = 20;
  if (age >= 18) {
    Logger.log('選挙権があります');
  } else {
    Logger.log('選挙権がありません');
  }
}`,
		feedback: null,
		feedbackAt: null,
		createdAt: "2024-01-18T14:00:00Z",
	},
	{
		id: "submission-3",
		userId: "user-2",
		contentId: "content-1-1-3",
		submissionType: "code",
		content: `function myFunction() {
  Logger.log('佐藤花子');
}`,
		feedback: "完璧です！次の課題に進みましょう。",
		feedbackAt: "2024-01-17T16:00:00Z",
		createdAt: "2024-01-17T14:30:00Z",
	},
];

// ============================================
// お知らせデータ
// ============================================

export const mockAnnouncements: AnnouncementResponse[] = [
	{
		id: "announcement-1",
		title: "GAS学習プログラムへようこそ！",
		content:
			"Google Apps Script学習プログラムへようこそ！このプログラムでは、GASの基礎から応用まで段階的に学習していきます。わからないことがあれば、いつでも質問してください。",
		publishedAt: "2024-01-15T09:00:00Z",
		createdAt: "2024-01-15T08:00:00Z",
	},
	{
		id: "announcement-2",
		title: "Week 2の課題提出期限について",
		content:
			"Week 2の課題提出期限は1月25日（木）23:59までです。期限内に必ず提出してください。提出が遅れる場合は事前にご連絡ください。",
		publishedAt: "2024-01-18T10:00:00Z",
		createdAt: "2024-01-18T09:30:00Z",
	},
	{
		id: "announcement-3",
		title: "オンライン質問会のお知らせ",
		content:
			"1月22日（月）20:00よりオンライン質問会を開催します。ZoomのURLは後日お送りします。わからないことがある方はぜひご参加ください。",
		publishedAt: "2024-01-19T14:00:00Z",
		createdAt: "2024-01-19T13:45:00Z",
	},
];

// ============================================
// ヘルパー関数
// ============================================

/**
 * ユーザーIDに基づいて進捗データを取得
 */
export function getUserProgress(userId: string): UserProgressResponse[] {
	return mockUserProgress.filter((progress) => progress.userId === userId);
}

/**
 * ユーザーIDに基づいて課題提出データを取得
 */
export function getUserSubmissions(userId: string): SubmissionResponse[] {
	return mockSubmissions.filter((submission) => submission.userId === userId);
}

/**
 * コンテンツIDに基づいて進捗を取得
 */
export function getProgressByContent(
	userId: string,
	contentId: string,
): UserProgressResponse | undefined {
	return mockUserProgress.find(
		(progress) =>
			progress.userId === userId && progress.contentId === contentId,
	);
}

/**
 * PhaseIDに基づいてWeekを取得
 */
export function getWeeksByPhase(phaseId: string): WeekResponse[] {
	return mockWeeks.filter((week) => week.phaseId === phaseId);
}

/**
 * WeekIDに基づいてContentを取得
 */
export function getContentsByWeek(weekId: string): ContentResponse[] {
	return mockContents.filter((content) => content.weekId === weekId);
}

/**
 * 進捗率を計算
 */
export function calculateProgressRate(userId: string): number {
	const totalContents = mockContents.length;
	const completedContents = mockUserProgress.filter(
		(progress) => progress.userId === userId && progress.completed,
	).length;

	return totalContents > 0
		? Math.round((completedContents / totalContents) * 100)
		: 0;
}

/**
 * 最新のお知らせを取得
 */
export function getLatestAnnouncements(limit = 5): AnnouncementResponse[] {
	return mockAnnouncements
		.sort(
			(a, b) =>
				new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
		)
		.slice(0, limit);
}

/**
 * 未承認ユーザーを取得
 */
export function getPendingUsers(): UserResponse[] {
	return mockUsers.filter((user) => user.role === "student" && !user.approved);
}

/**
 * 承認済みユーザーを取得
 */
export function getApprovedUsers(): UserResponse[] {
	return mockUsers.filter((user) => user.role === "student" && user.approved);
}
