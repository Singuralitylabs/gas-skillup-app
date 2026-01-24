/**
 * モックデータモジュール
 * Sprint 1 で使用するモックデータと状態管理のエクスポート
 */

// モックデータ
export {
	calculateProgressRate,
	getApprovedUsers,
	getContentsByWeek,
	getLatestAnnouncements,
	getPendingUsers,
	getProgressByContent,
	getUserProgress,
	getUserSubmissions,
	getWeeksByPhase,
	mockAnnouncements,
	mockContents,
	mockPhases,
	mockSubmissions,
	mockUserProgress,
	mockUsers,
	mockWeeks,
} from "./data";
export type {
	DashboardStats,
	ProgressDistribution,
	SubmissionTrend,
} from "./stats";

// 統計計算関数
export {
	getDashboardStats,
	getProgressDistribution,
	getRecentPendingSubmissions,
	getStudentProgressRates,
	getSubmissionTrend,
} from "./stats";
// ローカルストレージ管理
export {
	clearStorage,
	createSubmission,
	getContentProgress,
	getContentSubmissions,
	getCurrentUser,
	getUserProgress as getStoredUserProgress,
	getUserSubmissions as getStoredUserSubmissions,
	initializeStorage,
	isAuthenticated,
	logout,
	setCurrentUser,
	updateProgress,
} from "./storage";
