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
