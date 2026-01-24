/**
 * カスタム型定義（MVP版）
 * アプリケーション全体で使用する型定義をここに配置
 */

import type { Database } from "./database.types";

// ============================================
// Enum Types (Supabaseスキーマと同期)
// ============================================

export type UserRole = Database["public"]["Enums"]["user_role"];
export type ContentType = Database["public"]["Enums"]["content_type"];
export type SubmissionType = Database["public"]["Enums"]["submission_type"];

// ============================================
// Database Table Types (snake_case - Supabaseから取得)
// ============================================

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type Phase = Database["public"]["Tables"]["phases"]["Row"];
export type PhaseInsert = Database["public"]["Tables"]["phases"]["Insert"];
export type PhaseUpdate = Database["public"]["Tables"]["phases"]["Update"];

export type Week = Database["public"]["Tables"]["weeks"]["Row"];
export type WeekInsert = Database["public"]["Tables"]["weeks"]["Insert"];
export type WeekUpdate = Database["public"]["Tables"]["weeks"]["Update"];

export type Content = Database["public"]["Tables"]["contents"]["Row"];
export type ContentInsert = Database["public"]["Tables"]["contents"]["Insert"];
export type ContentUpdate = Database["public"]["Tables"]["contents"]["Update"];

export type UserProgress = Database["public"]["Tables"]["user_progress"]["Row"];
export type UserProgressInsert =
	Database["public"]["Tables"]["user_progress"]["Insert"];
export type UserProgressUpdate =
	Database["public"]["Tables"]["user_progress"]["Update"];

export type Submission = Database["public"]["Tables"]["submissions"]["Row"];
export type SubmissionInsert =
	Database["public"]["Tables"]["submissions"]["Insert"];
export type SubmissionUpdate =
	Database["public"]["Tables"]["submissions"]["Update"];

export type Announcement = Database["public"]["Tables"]["announcements"]["Row"];
export type AnnouncementInsert =
	Database["public"]["Tables"]["announcements"]["Insert"];
export type AnnouncementUpdate =
	Database["public"]["Tables"]["announcements"]["Update"];

// ============================================
// API Response Types (camelCase - フロントエンド用)
// ============================================

/**
 * APIレスポンス用ユーザー型
 * Database型のsnake_caseをcamelCaseに変換
 */
export type UserResponse = {
	id: string;
	email: string;
	name: string | null;
	role: UserRole;
	approved: boolean;
	createdAt: string;
};

/**
 * APIレスポンス用Phase型
 */
export type PhaseResponse = {
	id: string;
	title: string;
	description: string | null;
	orderIndex: number;
	createdAt: string;
};

/**
 * APIレスポンス用Week型
 */
export type WeekResponse = {
	id: string;
	phaseId: string;
	title: string;
	description: string | null;
	orderIndex: number;
	createdAt: string;
};

/**
 * APIレスポンス用Content型
 */
export type ContentResponse = {
	id: string;
	weekId: string;
	type: ContentType;
	title: string;
	content: string | null;
	orderIndex: number;
	createdAt: string;
};

/**
 * APIレスポンス用UserProgress型
 */
export type UserProgressResponse = {
	id: string;
	userId: string;
	contentId: string;
	completed: boolean;
	completedAt: string | null;
};

/**
 * APIレスポンス用Submission型
 */
export type SubmissionResponse = {
	id: string;
	userId: string;
	contentId: string;
	submissionType: SubmissionType;
	content: string;
	feedback: string | null;
	feedbackAt: string | null;
	createdAt: string;
};

/**
 * APIレスポンス用Announcement型
 */
export type AnnouncementResponse = {
	id: string;
	title: string;
	content: string;
	publishedAt: string | null;
	createdAt: string;
};

// ============================================
// Extended Types (リレーション含む - MVP最小限)
// ============================================

/**
 * Week with Phase
 */
export type WeekWithPhase = WeekResponse & {
	phase: PhaseResponse;
};

/**
 * Content with Week and Phase
 */
export type ContentWithRelations = ContentResponse & {
	week: WeekWithPhase;
};

/**
 * Submission with User
 */
export type SubmissionWithUser = SubmissionResponse & {
	user: UserResponse;
};

// ============================================
// View Models (UI表示用 - MVP最小限)
// ============================================

/**
 * 進捗サマリー
 */
export type ProgressSummary = {
	totalContents: number;
	completedContents: number;
	completionRate: number; // 0-100
};

/**
 * ダッシュボード統計（講師用）
 */
export type DashboardStats = {
	totalStudents: number;
	approvedStudents: number;
	pendingApprovals: number;
	totalSubmissions: number;
	unreviewedSubmissions: number;
};

// ============================================
// Common API Types
// ============================================

/**
 * セッション情報
 */
export type Session = {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
};

/**
 * ページネーション情報
 */
export type Pagination = {
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};

/**
 * 共通エラーレスポンス
 */
export type ErrorResponse = {
	error: {
		code: string;
		message: string;
		details?: Record<string, unknown>;
	};
};

// ============================================
// 認証 (Authentication) API Types
// ============================================

/**
 * Google ログインリクエスト
 */
export type GoogleLoginRequest = {
	idToken: string;
};

/**
 * Google ログインレスポンス
 */
export type GoogleLoginResponse = {
	user: UserResponse;
	session: Session;
};

/**
 * 新規登録リクエスト
 */
export type RegisterRequest = {
	idToken: string;
	name: string;
};

/**
 * 新規登録レスポンス
 */
export type RegisterResponse = {
	user: UserResponse;
	message: string;
};

/**
 * セッション更新リクエスト
 */
export type RefreshTokenRequest = {
	refreshToken: string;
};

/**
 * セッション更新レスポンス
 */
export type RefreshTokenResponse = {
	accessToken: string;
	expiresIn: number;
};

// ============================================
// ユーザー管理 (Users) API Types
// ============================================

/**
 * ユーザー情報更新リクエスト
 */
export type UpdateUserRequest = {
	name: string;
};

/**
 * 受講生一覧取得パラメータ
 */
export type GetStudentsParams = {
	page?: number;
	limit?: number;
	search?: string;
	isApproved?: boolean;
	sortBy?: "name" | "email" | "createdAt";
	order?: "asc" | "desc";
};

/**
 * 受講生一覧レスポンス
 */
export type GetStudentsResponse = {
	students: UserResponse[];
	pagination: Pagination;
};

/**
 * 未承認受講生一覧パラメータ
 */
export type GetPendingStudentsParams = {
	page?: number;
	limit?: number;
};

/**
 * 未承認受講生一覧レスポンス
 */
export type GetPendingStudentsResponse = {
	students: UserResponse[];
	pagination: Pagination;
};

// ============================================
// 進捗管理 (Progress) API Types
// ============================================

/**
 * 進捗更新リクエスト
 */
export type UpdateProgressRequest = {
	contentId: string;
	completed: boolean;
};

/**
 * 進捗更新レスポンス
 */
export type UpdateProgressResponse = {
	success: boolean;
	progress: UserProgressResponse;
};

// ============================================
// 課題提出 (Submissions) API Types
// ============================================

/**
 * 課題提出リクエスト
 */
export type CreateSubmissionRequest = {
	contentId: string;
	submissionType: SubmissionType;
	content: string;
};

/**
 * 課題提出レスポンス
 */
export type CreateSubmissionResponse = {
	success: boolean;
	submission: SubmissionResponse;
};

/**
 * フィードバック作成リクエスト
 */
export type CreateFeedbackRequest = {
	submissionId: string;
	feedback: string;
};

/**
 * フィードバック作成レスポンス
 */
export type CreateFeedbackResponse = {
	success: boolean;
	submission: SubmissionResponse;
};

// ============================================
// 後方互換性のためのエイリアス（徐々に廃止予定）
// ============================================

/** @deprecated Use Profile instead */
export type User = Profile;
/** @deprecated Use ProfileInsert instead */
export type UserInsert = ProfileInsert;
/** @deprecated Use ProfileUpdate instead */
export type UserUpdate = ProfileUpdate;
