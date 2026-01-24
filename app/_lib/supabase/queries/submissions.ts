import { createClient } from "../server";
import type { Submission, Profile, Content } from "@/types/database.types";

/**
 * 全提出物を取得
 */
export async function getAllSubmissions(): Promise<Submission[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("submissions")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching submissions:", error);
		return [];
	}

	return data;
}

/**
 * ユーザーIDで提出物を取得
 */
export async function getSubmissionsByUserId(
	userId: string,
): Promise<Submission[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("submissions")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching submissions:", error);
		return [];
	}

	return data;
}

/**
 * コンテンツIDで提出物を取得
 */
export async function getSubmissionsByContentId(
	contentId: string,
): Promise<Submission[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("submissions")
		.select("*")
		.eq("content_id", contentId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching submissions:", error);
		return [];
	}

	return data;
}

/**
 * IDで提出物を取得
 */
export async function getSubmissionById(id: string): Promise<Submission | null> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("submissions")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching submission:", error);
		return null;
	}

	return data;
}

/**
 * 未フィードバックの提出物を取得
 */
export async function getPendingSubmissions(): Promise<Submission[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("submissions")
		.select("*")
		.is("feedback", null)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching pending submissions:", error);
		return [];
	}

	return data;
}

/**
 * 提出物詳細（ユーザーとコンテンツ情報付き）を取得
 */
export type SubmissionWithDetails = Submission & {
	user: Profile;
	contentInfo: Content;
};

export async function getSubmissionWithDetails(
	id: string,
): Promise<SubmissionWithDetails | null> {
	const supabase = await createClient();

	const { data: submission, error: submissionError } = await supabase
		.from("submissions")
		.select("*")
		.eq("id", id)
		.single();

	if (submissionError || !submission) {
		console.error("Error fetching submission:", submissionError);
		return null;
	}

	const [userResult, contentResult] = await Promise.all([
		supabase.from("profiles").select("*").eq("id", submission.user_id).single(),
		supabase
			.from("contents")
			.select("*")
			.eq("id", submission.content_id)
			.single(),
	]);

	if (!userResult.data || !contentResult.data) {
		console.error("Error fetching submission details");
		return null;
	}

	return {
		...submission,
		user: userResult.data,
		contentInfo: contentResult.data,
	};
}

/**
 * 提出物一覧（ユーザーとコンテンツ情報付き）を取得
 */
export async function getSubmissionsWithDetails(options?: {
	pendingOnly?: boolean;
	limit?: number;
}): Promise<SubmissionWithDetails[]> {
	const supabase = await createClient();

	let query = supabase.from("submissions").select("*");

	if (options?.pendingOnly) {
		query = query.is("feedback", null);
	}

	query = query.order("created_at", { ascending: false });

	if (options?.limit) {
		query = query.limit(options.limit);
	}

	const { data: submissions, error } = await query;

	if (error || !submissions) {
		console.error("Error fetching submissions:", error);
		return [];
	}

	// ユーザーとコンテンツ情報を取得
	const userIds = [...new Set(submissions.map((s) => s.user_id))];
	const contentIds = [...new Set(submissions.map((s) => s.content_id))];

	const [usersResult, contentsResult] = await Promise.all([
		supabase.from("profiles").select("*").in("id", userIds),
		supabase.from("contents").select("*").in("id", contentIds),
	]);

	const usersMap = new Map(usersResult.data?.map((u) => [u.id, u]) ?? []);
	const contentsMap = new Map(
		contentsResult.data?.map((c) => [c.id, c]) ?? [],
	);

	return submissions
		.map((submission) => {
			const user = usersMap.get(submission.user_id);
			const contentInfo = contentsMap.get(submission.content_id);
			if (!user || !contentInfo) return null;
			return { ...submission, user, contentInfo };
		})
		.filter((s): s is SubmissionWithDetails => s !== null);
}

/**
 * 提出統計を取得
 */
export async function getSubmissionStats(): Promise<{
	total: number;
	pending: number;
	reviewed: number;
	todaySubmissions: number;
}> {
	const supabase = await createClient();

	const today = new Date();
	today.setHours(0, 0, 0, 0);

	const [total, pending, reviewed, todaySubmissions] = await Promise.all([
		supabase.from("submissions").select("*", { count: "exact", head: true }),
		supabase
			.from("submissions")
			.select("*", { count: "exact", head: true })
			.is("feedback", null),
		supabase
			.from("submissions")
			.select("*", { count: "exact", head: true })
			.not("feedback", "is", null),
		supabase
			.from("submissions")
			.select("*", { count: "exact", head: true })
			.gte("created_at", today.toISOString()),
	]);

	return {
		total: total.count ?? 0,
		pending: pending.count ?? 0,
		reviewed: reviewed.count ?? 0,
		todaySubmissions: todaySubmissions.count ?? 0,
	};
}
