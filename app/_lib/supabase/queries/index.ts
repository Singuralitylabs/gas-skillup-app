// プロフィール関連

// お知らせ関連
export {
	getAllAnnouncements,
	getAnnouncementById,
	getAnnouncementStats,
	getLatestAnnouncements,
	getPublishedAnnouncements,
} from "./announcements";

// コンテンツ関連
export {
	getAllContents,
	getAllPhases,
	getAllWeeks,
	getContentById,
	getContentStats,
	getContentsByWeekId,
	getPhaseById,
	getPhasesWithWeeksAndContents,
	getWeekById,
	getWeeksByPhaseId,
	type PhaseWithWeeksAndContents,
} from "./contents";
// ダッシュボード関連
export {
	type DashboardStats,
	getDashboardStats,
	getProgressDistribution,
	getRecentPendingSubmissions,
	getSubmissionTrend,
	type PendingSubmissionWithDetails,
	type ProgressDistribution,
	type SubmissionTrend,
} from "./dashboard";
// 通知関連
export {
	getLatestNotifications,
	getNotificationById,
	getNotificationsByUserId,
	getUnreadNotificationCount,
	getUnreadNotifications,
} from "./notifications";
export {
	getAllProfiles,
	getApprovedStudents,
	getCurrentProfile,
	getPendingUsers,
	getProfileById,
	getProfileStats,
	getStudents,
} from "./profiles";
// 進捗関連
export {
	calculateProgressRate,
	calculateProgressRates,
	getCompletedContentIds,
	getOverallProgressStats,
	getProgressByUserAndContent,
	getProgressByUserId,
} from "./progress";
// 提出物関連
export {
	getAllSubmissions,
	getPendingSubmissions,
	getSubmissionById,
	getSubmissionStats,
	getSubmissionsByContentId,
	getSubmissionsByUserId,
	getSubmissionsWithDetails,
	getSubmissionWithDetails,
	type SubmissionWithDetails,
} from "./submissions";
