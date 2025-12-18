/**
 * カスタム型定義
 * アプリケーション全体で使用する型定義をここに配置
 */

import type { Database } from "./database.types";

// ============================================
// Enum Types
// ============================================

export type UserRole = "student" | "instructor" | "admin";
export type ContentType = "video" | "text" | "exercise";
export type SubmissionType = "code" | "url";

// ============================================
// Database Table Types (Supabaseから取得)
// ============================================

export type User = Database["public"]["Tables"]["users"]["Row"];
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"];
export type UserUpdate = Database["public"]["Tables"]["users"]["Update"];

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
// Extended Types (リレーション含む)
// ============================================

/**
 * Week with Phase
 * Week情報にPhase情報を含める
 */
export type WeekWithPhase = Week & {
	phase: Phase;
};

/**
 * Content with Week and Phase
 * Content情報にWeekとPhase情報を含める
 */
export type ContentWithRelations = Content & {
	week: Week & {
		phase: Phase;
	};
};

/**
 * User Progress with Content
 * 進捗情報にContent情報を含める
 */
export type UserProgressWithContent = UserProgress & {
	content: ContentWithRelations;
};

/**
 * Submission with User and Content
 * 提出情報にUserとContent情報を含める
 */
export type SubmissionWithRelations = Submission & {
	user: User;
	content: Content;
};

// ============================================
// View Models (UI表示用)
// ============================================

/**
 * 進捗サマリー
 */
export type ProgressSummary = {
	total_contents: number;
	completed_contents: number;
	completion_rate: number; // 0-100
	phases: {
		phase_id: string;
		phase_title: string;
		total: number;
		completed: number;
	}[];
};

/**
 * ダッシュボード統計
 */
export type DashboardStats = {
	total_students: number;
	approved_students: number;
	pending_approvals: number;
	total_submissions: number;
	unreviewed_submissions: number;
	average_completion_rate: number;
};

// ============================================
// API Request/Response Types
// ============================================

export type CreateSubmissionRequest = {
	content_id: string;
	submission_type: SubmissionType;
	content: string;
};

export type CreateSubmissionResponse = {
	success: boolean;
	submission: Submission;
};

export type UpdateProgressRequest = {
	content_id: string;
	completed: boolean;
};

export type UpdateProgressResponse = {
	success: boolean;
	progress: UserProgress;
};

export type ApproveUserRequest = {
	user_id: string;
	approved: boolean;
};

export type ApproveUserResponse = {
	success: boolean;
	user: User;
};

export type CreateFeedbackRequest = {
	submission_id: string;
	feedback: string;
};

export type CreateFeedbackResponse = {
	success: boolean;
	submission: Submission;
};
