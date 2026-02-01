"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";
import type { SubmissionType } from "@/types/database.types";

export type ActionResult<T = void> = {
	success: boolean;
	error?: string;
	data?: T;
};

/**
 * 課題を提出する
 */
export async function createSubmission(
	contentId: string,
	submissionType: SubmissionType,
	content: string,
): Promise<ActionResult<{ id: string }>> {
	const supabase = await createClient();

	// 現在のユーザーを確認
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "認証されていません" };
	}

	// ユーザーのプロフィールを確認（承認済みかどうか）
	const { data: profile } = await supabase
		.from("profiles")
		.select("approved, role")
		.eq("id", user.id)
		.single();

	if (!profile?.approved) {
		return { success: false, error: "アカウントが承認されていません" };
	}

	// コンテンツが存在するか確認
	const { data: contentData } = await supabase
		.from("contents")
		.select("id, type")
		.eq("id", contentId)
		.single();

	if (!contentData) {
		return { success: false, error: "コンテンツが見つかりません" };
	}

	// 演習タイプのコンテンツのみ提出可能
	if (contentData.type !== "exercise") {
		return { success: false, error: "このコンテンツには課題提出できません" };
	}

	// 課題を提出
	const { data, error } = await supabase
		.from("submissions")
		.insert({
			user_id: user.id,
			content_id: contentId,
			submission_type: submissionType,
			content: content,
		})
		.select("id")
		.single();

	if (error) {
		console.error("Error creating submission:", error);
		return { success: false, error: "課題の提出に失敗しました" };
	}

	// 関連するページのキャッシュを更新
	revalidatePath("/student/submissions");
	revalidatePath("/instructor/submissions");

	return { success: true, data: { id: data.id } };
}

/**
 * フィードバックを送信する（講師用）
 */
export async function addFeedback(
	submissionId: string,
	feedback: string,
): Promise<ActionResult> {
	const supabase = await createClient();

	// 現在のユーザーが講師かどうか確認
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "認証されていません" };
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (profile?.role !== "instructor") {
		return { success: false, error: "権限がありません" };
	}

	// 提出物が存在するか確認
	const { data: submission } = await supabase
		.from("submissions")
		.select("id")
		.eq("id", submissionId)
		.single();

	if (!submission) {
		return { success: false, error: "提出物が見つかりません" };
	}

	// フィードバックを更新
	const { error } = await supabase
		.from("submissions")
		.update({
			feedback: feedback,
			feedback_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.eq("id", submissionId);

	if (error) {
		console.error("Error adding feedback:", error);
		return { success: false, error: "フィードバックの送信に失敗しました" };
	}

	// 関連するページのキャッシュを更新
	revalidatePath("/student/submissions");
	revalidatePath("/instructor/submissions");
	revalidatePath(`/instructor/submissions/${submissionId}`);

	return { success: true };
}

/**
 * 提出物を削除する（講師用）
 */
export async function deleteSubmission(
	submissionId: string,
): Promise<ActionResult> {
	const supabase = await createClient();

	// 現在のユーザーが講師かどうか確認
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "認証されていません" };
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (profile?.role !== "instructor") {
		return { success: false, error: "権限がありません" };
	}

	// 提出物を削除
	const { error } = await supabase
		.from("submissions")
		.delete()
		.eq("id", submissionId);

	if (error) {
		console.error("Error deleting submission:", error);
		return { success: false, error: "提出物の削除に失敗しました" };
	}

	// 関連するページのキャッシュを更新
	revalidatePath("/student/submissions");
	revalidatePath("/instructor/submissions");

	return { success: true };
}
