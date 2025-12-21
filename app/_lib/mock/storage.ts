/**
 * ローカルストレージでの状態管理
 * Sprint 1 で使用する一時的な状態管理
 */

"use client";

import type {
	SubmissionResponse,
	UserProgressResponse,
	UserResponse,
} from "@/types";

// ============================================
// ストレージキー定数
// ============================================

const STORAGE_KEYS = {
	CURRENT_USER: "gas_app_current_user",
	USER_PROGRESS: "gas_app_user_progress",
	SUBMISSIONS: "gas_app_submissions",
} as const;

// ============================================
// ユーザー認証管理
// ============================================

/**
 * 現在のユーザーを設定（ログイン処理）
 */
export function setCurrentUser(user: UserResponse): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

/**
 * 現在のユーザーを取得
 */
export function getCurrentUser(): UserResponse | null {
	if (typeof window === "undefined") return null;

	const userJson = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
	if (!userJson) return null;

	try {
		return JSON.parse(userJson) as UserResponse;
	} catch {
		return null;
	}
}

/**
 * ログアウト処理
 */
export function logout(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

/**
 * ログイン状態の確認
 */
export function isAuthenticated(): boolean {
	return getCurrentUser() !== null;
}

// ============================================
// 進捗管理
// ============================================

/**
 * 進捗データを全て取得
 */
function getAllProgress(): UserProgressResponse[] {
	if (typeof window === "undefined") return [];

	const progressJson = localStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
	if (!progressJson) return [];

	try {
		return JSON.parse(progressJson) as UserProgressResponse[];
	} catch {
		return [];
	}
}

/**
 * 進捗データを保存
 */
function saveAllProgress(progress: UserProgressResponse[]): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
}

/**
 * ユーザーの進捗データを取得
 */
export function getUserProgress(userId: string): UserProgressResponse[] {
	return getAllProgress().filter((p) => p.userId === userId);
}

/**
 * 特定のコンテンツの進捗を取得
 */
export function getContentProgress(
	userId: string,
	contentId: string,
): UserProgressResponse | undefined {
	return getAllProgress().find(
		(p) => p.userId === userId && p.contentId === contentId,
	);
}

/**
 * 進捗を更新または作成
 */
export function updateProgress(
	userId: string,
	contentId: string,
	completed: boolean,
): UserProgressResponse {
	const allProgress = getAllProgress();
	const existingIndex = allProgress.findIndex(
		(p) => p.userId === userId && p.contentId === contentId,
	);

	const now = new Date().toISOString();
	const progress: UserProgressResponse = {
		id:
			existingIndex >= 0 ? allProgress[existingIndex].id : crypto.randomUUID(),
		userId,
		contentId,
		completed,
		completedAt: completed ? now : null,
	};

	if (existingIndex >= 0) {
		allProgress[existingIndex] = progress;
	} else {
		allProgress.push(progress);
	}

	saveAllProgress(allProgress);
	return progress;
}

// ============================================
// 課題提出管理
// ============================================

/**
 * 課題提出データを全て取得
 */
function getAllSubmissions(): SubmissionResponse[] {
	if (typeof window === "undefined") return [];

	const submissionsJson = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
	if (!submissionsJson) return [];

	try {
		return JSON.parse(submissionsJson) as SubmissionResponse[];
	} catch {
		return [];
	}
}

/**
 * 課題提出データを保存
 */
function saveAllSubmissions(submissions: SubmissionResponse[]): void {
	if (typeof window === "undefined") return;
	localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
}

/**
 * ユーザーの課題提出データを取得
 */
export function getUserSubmissions(userId: string): SubmissionResponse[] {
	return getAllSubmissions().filter((s) => s.userId === userId);
}

/**
 * 特定のコンテンツの提出データを取得
 */
export function getContentSubmissions(
	userId: string,
	contentId: string,
): SubmissionResponse[] {
	return getAllSubmissions().filter(
		(s) => s.userId === userId && s.contentId === contentId,
	);
}

/**
 * 課題を提出
 */
export function createSubmission(
	userId: string,
	contentId: string,
	submissionType: "code" | "url",
	content: string,
): SubmissionResponse {
	const allSubmissions = getAllSubmissions();

	const submission: SubmissionResponse = {
		id: crypto.randomUUID(),
		userId,
		contentId,
		submissionType,
		content,
		feedback: null,
		feedbackAt: null,
		createdAt: new Date().toISOString(),
	};

	allSubmissions.push(submission);
	saveAllSubmissions(allSubmissions);

	return submission;
}

// ============================================
// データ初期化（開発用）
// ============================================

/**
 * ローカルストレージをクリア
 */
export function clearStorage(): void {
	if (typeof window === "undefined") return;
	localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
	localStorage.removeItem(STORAGE_KEYS.USER_PROGRESS);
	localStorage.removeItem(STORAGE_KEYS.SUBMISSIONS);
}

/**
 * モックデータでローカルストレージを初期化
 */
export function initializeStorage(
	initialProgress: UserProgressResponse[] = [],
	initialSubmissions: SubmissionResponse[] = [],
): void {
	if (typeof window === "undefined") return;

	if (initialProgress.length > 0) {
		saveAllProgress(initialProgress);
	}

	if (initialSubmissions.length > 0) {
		saveAllSubmissions(initialSubmissions);
	}
}
