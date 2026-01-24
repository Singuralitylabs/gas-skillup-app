// プロフィール関連
export {
	getAllProfiles,
	getStudents,
	getApprovedStudents,
	getPendingUsers,
	getProfileById,
	getCurrentProfile,
	getProfileStats,
} from "./profiles";

// コンテンツ関連
export {
	getAllPhases,
	getPhaseById,
	getAllWeeks,
	getWeeksByPhaseId,
	getWeekById,
	getAllContents,
	getContentsByWeekId,
	getContentById,
	getPhasesWithWeeksAndContents,
	getContentStats,
	type PhaseWithWeeksAndContents,
} from "./contents";

// 進捗関連
export {
	getProgressByUserId,
	getProgressByUserAndContent,
	getCompletedContentIds,
	calculateProgressRate,
	calculateProgressRates,
	getOverallProgressStats,
} from "./progress";

// 提出物関連
export {
	getAllSubmissions,
	getSubmissionsByUserId,
	getSubmissionsByContentId,
	getSubmissionById,
	getPendingSubmissions,
	getSubmissionWithDetails,
	getSubmissionsWithDetails,
	getSubmissionStats,
	type SubmissionWithDetails,
} from "./submissions";

// お知らせ関連
export {
	getAllAnnouncements,
	getPublishedAnnouncements,
	getLatestAnnouncements,
	getAnnouncementById,
	getAnnouncementStats,
} from "./announcements";

// ダッシュボード関連
export {
	getDashboardStats,
	getProgressDistribution,
	getSubmissionTrend,
	getRecentPendingSubmissions,
	type DashboardStats,
	type ProgressDistribution,
	type SubmissionTrend,
	type PendingSubmissionWithDetails,
} from "./dashboard";
