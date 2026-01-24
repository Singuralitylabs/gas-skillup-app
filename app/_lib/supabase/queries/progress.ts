import { createClient } from "../server";
import type { UserProgress } from "@/types/database.types";

/**
 * ユーザーIDで進捗を取得
 */
export async function getProgressByUserId(
	userId: string,
): Promise<UserProgress[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("user_progress")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching progress:", error);
		return [];
	}

	return data;
}

/**
 * ユーザーとコンテンツで進捗を取得
 */
export async function getProgressByUserAndContent(
	userId: string,
	contentId: string,
): Promise<UserProgress | null> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("user_progress")
		.select("*")
		.eq("user_id", userId)
		.eq("content_id", contentId)
		.single();

	if (error) {
		// not found は正常ケース
		if (error.code === "PGRST116") {
			return null;
		}
		console.error("Error fetching progress:", error);
		return null;
	}

	return data;
}

/**
 * ユーザーの完了済みコンテンツIDを取得
 */
export async function getCompletedContentIds(userId: string): Promise<string[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("user_progress")
		.select("content_id")
		.eq("user_id", userId)
		.eq("completed", true);

	if (error) {
		console.error("Error fetching completed contents:", error);
		return [];
	}

	return data.map((item) => item.content_id);
}

/**
 * ユーザーの進捗率を計算
 */
export async function calculateProgressRate(userId: string): Promise<number> {
	const supabase = await createClient();

	// 総コンテンツ数を取得
	const { count: totalContents } = await supabase
		.from("contents")
		.select("*", { count: "exact", head: true });

	if (!totalContents || totalContents === 0) {
		return 0;
	}

	// 完了コンテンツ数を取得
	const { count: completedContents } = await supabase
		.from("user_progress")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("completed", true);

	return Math.round(((completedContents ?? 0) / totalContents) * 100);
}

/**
 * 複数ユーザーの進捗率を一括計算
 */
export async function calculateProgressRates(
	userIds: string[],
): Promise<Map<string, number>> {
	const supabase = await createClient();

	// 総コンテンツ数を取得
	const { count: totalContents } = await supabase
		.from("contents")
		.select("*", { count: "exact", head: true });

	if (!totalContents || totalContents === 0) {
		return new Map(userIds.map((id) => [id, 0]));
	}

	// 各ユーザーの完了数を取得
	const { data: progressData, error } = await supabase
		.from("user_progress")
		.select("user_id")
		.in("user_id", userIds)
		.eq("completed", true);

	if (error) {
		console.error("Error fetching progress:", error);
		return new Map(userIds.map((id) => [id, 0]));
	}

	// ユーザーごとの完了数をカウント
	const completedCounts = new Map<string, number>();
	for (const item of progressData) {
		const count = completedCounts.get(item.user_id) ?? 0;
		completedCounts.set(item.user_id, count + 1);
	}

	// 進捗率を計算
	const progressRates = new Map<string, number>();
	for (const userId of userIds) {
		const completed = completedCounts.get(userId) ?? 0;
		progressRates.set(userId, Math.round((completed / totalContents) * 100));
	}

	return progressRates;
}

/**
 * 全体の進捗統計を取得
 */
export async function getOverallProgressStats(): Promise<{
	averageProgress: number;
	totalCompletions: number;
	activeUsers: number;
}> {
	const supabase = await createClient();

	// 承認済み受講生を取得
	const { data: students } = await supabase
		.from("profiles")
		.select("id")
		.eq("role", "student")
		.eq("approved", true);

	if (!students || students.length === 0) {
		return { averageProgress: 0, totalCompletions: 0, activeUsers: 0 };
	}

	const studentIds = students.map((s) => s.id);

	// 総コンテンツ数
	const { count: totalContents } = await supabase
		.from("contents")
		.select("*", { count: "exact", head: true });

	if (!totalContents) {
		return { averageProgress: 0, totalCompletions: 0, activeUsers: 0 };
	}

	// 完了記録を取得
	const { data: progressData } = await supabase
		.from("user_progress")
		.select("user_id")
		.in("user_id", studentIds)
		.eq("completed", true);

	const totalCompletions = progressData?.length ?? 0;

	// アクティブユーザー数（1つ以上完了している）
	const activeUserIds = new Set(progressData?.map((p) => p.user_id) ?? []);

	// 平均進捗率を計算
	const progressRates = await calculateProgressRates(studentIds);
	const totalProgress = Array.from(progressRates.values()).reduce(
		(sum, rate) => sum + rate,
		0,
	);
	const averageProgress =
		studentIds.length > 0 ? Math.round(totalProgress / studentIds.length) : 0;

	return {
		averageProgress,
		totalCompletions,
		activeUsers: activeUserIds.size,
	};
}
