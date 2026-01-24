import { createClient } from "../server";

/**
 * ダッシュボード統計情報の型定義
 */
export interface DashboardStats {
	// 受講生統計
	totalStudents: number;
	approvedStudents: number;
	pendingStudents: number;
	activeStudents: number;

	// 課題統計
	totalSubmissions: number;
	pendingSubmissions: number;
	reviewedSubmissions: number;

	// 進捗統計
	averageProgress: number;
	totalContents: number;
	totalCompletedContents: number;

	// お知らせ統計
	totalAnnouncements: number;
}

/**
 * 進捗分布データの型定義
 */
export interface ProgressDistribution {
	range: string;
	count: number;
	percentage: number;
}

/**
 * 課題提出推移データの型定義
 */
export interface SubmissionTrend {
	date: string;
	submissions: number;
	reviewed: number;
}

/**
 * 未確認課題（詳細情報付き）の型定義
 */
export interface PendingSubmissionWithDetails {
	id: string;
	userName: string;
	contentTitle: string;
	createdAt: string;
}

/**
 * ダッシュボード統計を取得
 */
export async function getDashboardStats(): Promise<DashboardStats> {
	const supabase = await createClient();

	// 各統計を並列取得
	const [
		studentStats,
		submissionStats,
		progressStats,
		contentStats,
		announcementStats,
	] = await Promise.all([
		// 受講生統計
		getStudentStats(supabase),
		// 課題統計
		getSubmissionCounts(supabase),
		// 進捗統計
		getProgressStats(supabase),
		// コンテンツ数
		supabase.from("contents").select("*", { count: "exact", head: true }),
		// お知らせ数
		supabase.from("announcements").select("*", { count: "exact", head: true }),
	]);

	return {
		totalStudents: studentStats.total,
		approvedStudents: studentStats.approved,
		pendingStudents: studentStats.pending,
		activeStudents: studentStats.active,
		totalSubmissions: submissionStats.total,
		pendingSubmissions: submissionStats.pending,
		reviewedSubmissions: submissionStats.reviewed,
		averageProgress: progressStats.averageProgress,
		totalContents: contentStats.count ?? 0,
		totalCompletedContents: progressStats.totalCompleted,
		totalAnnouncements: announcementStats.count ?? 0,
	};
}

// biome-ignore lint/suspicious/noExplicitAny: Supabase client type
async function getStudentStats(supabase: any) {
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

	const [total, approved, pending, activeProgress] = await Promise.all([
		supabase
			.from("profiles")
			.select("*", { count: "exact", head: true })
			.eq("role", "student"),
		supabase
			.from("profiles")
			.select("*", { count: "exact", head: true })
			.eq("role", "student")
			.eq("approved", true),
		supabase
			.from("profiles")
			.select("*", { count: "exact", head: true })
			.eq("role", "student")
			.eq("approved", false),
		supabase
			.from("user_progress")
			.select("user_id")
			.eq("completed", true)
			.gte("completed_at", sevenDaysAgo.toISOString()),
	]);

	// アクティブユーザー数（重複除去）
	const activeUserIds = new Set(
		activeProgress.data?.map((p: { user_id: string }) => p.user_id) ?? [],
	);

	return {
		total: total.count ?? 0,
		approved: approved.count ?? 0,
		pending: pending.count ?? 0,
		active: activeUserIds.size,
	};
}

// biome-ignore lint/suspicious/noExplicitAny: Supabase client type
async function getSubmissionCounts(supabase: any) {
	const [total, pending, reviewed] = await Promise.all([
		supabase.from("submissions").select("*", { count: "exact", head: true }),
		supabase
			.from("submissions")
			.select("*", { count: "exact", head: true })
			.is("feedback", null),
		supabase
			.from("submissions")
			.select("*", { count: "exact", head: true })
			.not("feedback", "is", null),
	]);

	return {
		total: total.count ?? 0,
		pending: pending.count ?? 0,
		reviewed: reviewed.count ?? 0,
	};
}

// biome-ignore lint/suspicious/noExplicitAny: Supabase client type
async function getProgressStats(supabase: any) {
	// 承認済み受講生を取得
	const { data: students } = await supabase
		.from("profiles")
		.select("id")
		.eq("role", "student")
		.eq("approved", true);

	if (!students || students.length === 0) {
		return { averageProgress: 0, totalCompleted: 0 };
	}

	const studentIds = students.map((s: { id: string }) => s.id);

	// 総コンテンツ数
	const { count: totalContents } = await supabase
		.from("contents")
		.select("*", { count: "exact", head: true });

	if (!totalContents) {
		return { averageProgress: 0, totalCompleted: 0 };
	}

	// 完了数を取得
	const { count: totalCompleted } = await supabase
		.from("user_progress")
		.select("*", { count: "exact", head: true })
		.in("user_id", studentIds)
		.eq("completed", true);

	// 平均進捗率を計算
	const totalStudentProgress = students.length * totalContents;
	const averageProgress =
		totalStudentProgress > 0
			? Math.round(((totalCompleted ?? 0) / totalStudentProgress) * 100)
			: 0;

	return {
		averageProgress,
		totalCompleted: totalCompleted ?? 0,
	};
}

/**
 * 進捗分布を取得
 */
export async function getProgressDistribution(): Promise<
	ProgressDistribution[]
> {
	const supabase = await createClient();

	// 承認済み受講生を取得
	const { data: students } = await supabase
		.from("profiles")
		.select("id")
		.eq("role", "student")
		.eq("approved", true);

	if (!students || students.length === 0) {
		return [
			{ range: "0-20%", count: 0, percentage: 0 },
			{ range: "21-40%", count: 0, percentage: 0 },
			{ range: "41-60%", count: 0, percentage: 0 },
			{ range: "61-80%", count: 0, percentage: 0 },
			{ range: "81-100%", count: 0, percentage: 0 },
		];
	}

	// 総コンテンツ数
	const { count: totalContents } = await supabase
		.from("contents")
		.select("*", { count: "exact", head: true });

	if (!totalContents) {
		return [
			{ range: "0-20%", count: 0, percentage: 0 },
			{ range: "21-40%", count: 0, percentage: 0 },
			{ range: "41-60%", count: 0, percentage: 0 },
			{ range: "61-80%", count: 0, percentage: 0 },
			{ range: "81-100%", count: 0, percentage: 0 },
		];
	}

	// 各ユーザーの完了数を取得
	const studentIds = students.map((s) => s.id);
	const { data: progressData } = await supabase
		.from("user_progress")
		.select("user_id")
		.in("user_id", studentIds)
		.eq("completed", true);

	// ユーザーごとの完了数をカウント
	const completedCounts = new Map<string, number>();
	for (const item of progressData ?? []) {
		const count = completedCounts.get(item.user_id) ?? 0;
		completedCounts.set(item.user_id, count + 1);
	}

	// 進捗分布を計算
	const distribution = {
		"0-20%": 0,
		"21-40%": 0,
		"41-60%": 0,
		"61-80%": 0,
		"81-100%": 0,
	};

	for (const student of students) {
		const completedCount = completedCounts.get(student.id) ?? 0;
		const progressRate = (completedCount / totalContents) * 100;

		if (progressRate <= 20) distribution["0-20%"]++;
		else if (progressRate <= 40) distribution["21-40%"]++;
		else if (progressRate <= 60) distribution["41-60%"]++;
		else if (progressRate <= 80) distribution["61-80%"]++;
		else distribution["81-100%"]++;
	}

	return Object.entries(distribution).map(([range, count]) => ({
		range,
		count,
		percentage:
			students.length > 0 ? Math.round((count / students.length) * 100) : 0,
	}));
}

/**
 * 課題提出推移を取得（過去7日間）
 */
export async function getSubmissionTrend(): Promise<SubmissionTrend[]> {
	const supabase = await createClient();
	const trend: SubmissionTrend[] = [];
	const today = new Date();

	// 過去7日分のデータを取得
	const sevenDaysAgo = new Date(today);
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
	sevenDaysAgo.setHours(0, 0, 0, 0);

	const { data: submissions } = await supabase
		.from("submissions")
		.select("created_at, feedback")
		.gte("created_at", sevenDaysAgo.toISOString());

	// 日付ごとに集計
	for (let i = 6; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		const dateStr = date.toISOString().split("T")[0];

		const daySubmissions =
			submissions?.filter((s) => s.created_at.split("T")[0] === dateStr) ?? [];

		const reviewed = daySubmissions.filter((s) => s.feedback !== null);

		trend.push({
			date: dateStr,
			submissions: daySubmissions.length,
			reviewed: reviewed.length,
		});
	}

	return trend;
}

/**
 * 未確認課題一覧を取得（最新n件）
 */
export async function getRecentPendingSubmissions(
	limit = 5,
): Promise<PendingSubmissionWithDetails[]> {
	const supabase = await createClient();

	// 未確認課題を取得
	const { data: submissions, error } = await supabase
		.from("submissions")
		.select("id, user_id, content_id, created_at")
		.is("feedback", null)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error || !submissions || submissions.length === 0) {
		return [];
	}

	// ユーザーとコンテンツ情報を取得
	const userIds = [...new Set(submissions.map((s) => s.user_id))];
	const contentIds = [...new Set(submissions.map((s) => s.content_id))];

	const [usersResult, contentsResult] = await Promise.all([
		supabase.from("profiles").select("id, name").in("id", userIds),
		supabase.from("contents").select("id, title").in("id", contentIds),
	]);

	const usersMap = new Map(
		usersResult.data?.map((u) => [u.id, u.name ?? "不明"]) ?? [],
	);
	const contentsMap = new Map(
		contentsResult.data?.map((c) => [c.id, c.title]) ?? [],
	);

	return submissions.map((submission) => ({
		id: submission.id,
		userName: usersMap.get(submission.user_id) ?? "不明なユーザー",
		contentTitle: contentsMap.get(submission.content_id) ?? "不明なコンテンツ",
		createdAt: submission.created_at,
	}));
}
