"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";
import type { SubmissionType } from "@/types/database.types";
import { sanitize } from "@/utils/sanitize";
import { validateEnum, validateLength, validateUUID } from "@/utils/validation";
import { createNotification } from "./notifications";

export type ActionResult<T = void> = {
	success: boolean;
	error?: string;
	data?: T;
};

/**
 * 認証済みユーザーの確認（承認済み受講生）
 */
async function verifyApprovedStudent(): Promise<{
	success: boolean;
	error?: string;
	userId?: string;
}> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "認証されていません" };
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("approved, role")
		.eq("id", user.id)
		.single();

	if (!profile?.approved) {
		return { success: false, error: "アカウントが承認されていません" };
	}

	return { success: true, userId: user.id };
}

/**
 * 講師権限の確認
 */
async function verifyInstructor(): Promise<{
	success: boolean;
	error?: string;
	userId?: string;
}> {
	const supabase = await createClient();

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

	return { success: true, userId: user.id };
}

/**
 * 提出タイプの許可値
 */
const SUBMISSION_TYPES = ["code", "url"] as const;

/**
 * 課題を提出する
 */
export async function createSubmission(
	contentId: string,
	submissionType: SubmissionType,
	content: string,
): Promise<ActionResult<{ id: string }>> {
	// 認証・承認確認
	const auth = await verifyApprovedStudent();
	if (!auth.success) {
		return { success: false, error: auth.error };
	}

	// コンテンツIDのバリデーション
	const contentIdValidation = validateUUID(contentId, "コンテンツID");
	if (!contentIdValidation.success) {
		return { success: false, error: contentIdValidation.error };
	}

	// 提出タイプのバリデーション
	const typeValidation = validateEnum(
		submissionType,
		SUBMISSION_TYPES,
		"提出タイプ",
	);
	if (!typeValidation.success) {
		return { success: false, error: typeValidation.error };
	}

	// 提出内容のバリデーション
	const contentValidation = validateLength(content, 1, 50000, "提出内容");
	if (!contentValidation.success) {
		return { success: false, error: contentValidation.error };
	}

	// サニタイズ
	const sanitizedContent =
		submissionType === "url"
			? sanitize.url(contentValidation.data)
			: sanitize.text(contentValidation.data);

	// URLの場合、空になったら不正なURLとして拒否
	if (submissionType === "url" && !sanitizedContent) {
		return { success: false, error: "有効なURLを入力してください" };
	}

	const supabase = await createClient();

	// コンテンツが存在するか確認
	const { data: contentData } = await supabase
		.from("contents")
		.select("id, type")
		.eq("id", contentIdValidation.data)
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
			user_id: auth.userId as string,
			content_id: contentIdValidation.data,
			submission_type: typeValidation.data,
			content: sanitizedContent,
		})
		.select("id")
		.single();

	if (error) {
		console.error("Error creating submission:", sanitize.log(error.message));
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
	// 権限確認
	const auth = await verifyInstructor();
	if (!auth.success) {
		return { success: false, error: auth.error };
	}

	// 提出物IDのバリデーション
	const idValidation = validateUUID(submissionId, "提出物ID");
	if (!idValidation.success) {
		return { success: false, error: idValidation.error };
	}

	// フィードバック内容のバリデーション
	const feedbackValidation = validateLength(
		feedback,
		1,
		10000,
		"フィードバック",
	);
	if (!feedbackValidation.success) {
		return { success: false, error: feedbackValidation.error };
	}

	// サニタイズ
	const sanitizedFeedback = sanitize.markdown(feedbackValidation.data);

	const supabase = await createClient();

	// 提出物が存在するか確認（通知用にuser_idとcontent_idも取得）
	const { data: submission } = await supabase
		.from("submissions")
		.select("id, user_id, content_id")
		.eq("id", idValidation.data)
		.single();

	if (!submission) {
		return { success: false, error: "提出物が見つかりません" };
	}

	// コンテンツ情報を取得（通知メッセージ用）
	const { data: content } = await supabase
		.from("contents")
		.select("title")
		.eq("id", submission.content_id)
		.single();

	// フィードバックを更新
	const { error } = await supabase
		.from("submissions")
		.update({
			feedback: sanitizedFeedback,
			feedback_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.eq("id", idValidation.data);

	if (error) {
		console.error("Error adding feedback:", sanitize.log(error.message));
		return { success: false, error: "フィードバックの送信に失敗しました" };
	}

	// 受講生に通知を作成
	const contentTitle = content?.title ?? "課題";
	await createNotification(
		submission.user_id,
		"feedback",
		"フィードバックが届きました",
		`「${sanitize.text(contentTitle)}」の課題にフィードバックが送信されました。`,
		idValidation.data,
	);

	// 関連するページのキャッシュを更新
	revalidatePath("/student/submissions");
	revalidatePath("/student/notifications");
	revalidatePath("/instructor/submissions");
	revalidatePath(`/instructor/submissions/${idValidation.data}`);

	return { success: true };
}

/**
 * 提出物を削除する（講師用）
 */
export async function deleteSubmission(
	submissionId: string,
): Promise<ActionResult> {
	// 権限確認
	const auth = await verifyInstructor();
	if (!auth.success) {
		return { success: false, error: auth.error };
	}

	// 提出物IDのバリデーション
	const idValidation = validateUUID(submissionId, "提出物ID");
	if (!idValidation.success) {
		return { success: false, error: idValidation.error };
	}

	const supabase = await createClient();

	// 提出物を削除
	const { error } = await supabase
		.from("submissions")
		.delete()
		.eq("id", idValidation.data);

	if (error) {
		console.error("Error deleting submission:", sanitize.log(error.message));
		return { success: false, error: "提出物の削除に失敗しました" };
	}

	// 関連するページのキャッシュを更新
	revalidatePath("/student/submissions");
	revalidatePath("/instructor/submissions");

	return { success: true };
}
