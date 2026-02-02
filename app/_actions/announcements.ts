"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";
import { sanitize } from "@/utils/sanitize";
import { validateLength, validateUUID } from "@/utils/validation";

export type ActionResult<T = void> = {
	success: boolean;
	error?: string;
	data?: T;
};

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
 * お知らせを作成する（講師用）
 */
export async function createAnnouncement(
	title: string,
	content: string,
	publishNow: boolean = false,
): Promise<ActionResult<{ id: string }>> {
	// 権限確認
	const auth = await verifyInstructor();
	if (!auth.success) {
		return { success: false, error: auth.error };
	}

	// バリデーション
	const titleValidation = validateLength(title, 1, 200, "タイトル");
	if (!titleValidation.success) {
		return { success: false, error: titleValidation.error };
	}

	const contentValidation = validateLength(content, 1, 10000, "内容");
	if (!contentValidation.success) {
		return { success: false, error: contentValidation.error };
	}

	// サニタイズ
	const sanitizedTitle = sanitize.text(titleValidation.data);
	const sanitizedContent = sanitize.markdown(contentValidation.data);

	const supabase = await createClient();

	// お知らせを作成
	const { data, error } = await supabase
		.from("announcements")
		.insert({
			title: sanitizedTitle,
			content: sanitizedContent,
			published_at: publishNow ? new Date().toISOString() : null,
		})
		.select("id")
		.single();

	if (error) {
		console.error("Error creating announcement:", sanitize.log(error.message));
		return { success: false, error: "お知らせの作成に失敗しました" };
	}

	revalidatePath("/instructor/announcements");
	revalidatePath("/student/dashboard");
	revalidatePath("/student/announcements");

	return { success: true, data: { id: data.id } };
}

/**
 * お知らせを更新する（講師用）
 */
export async function updateAnnouncement(
	id: string,
	title: string,
	content: string,
): Promise<ActionResult> {
	// 権限確認
	const auth = await verifyInstructor();
	if (!auth.success) {
		return { success: false, error: auth.error };
	}

	// IDのバリデーション
	const idValidation = validateUUID(id, "お知らせID");
	if (!idValidation.success) {
		return { success: false, error: idValidation.error };
	}

	// バリデーション
	const titleValidation = validateLength(title, 1, 200, "タイトル");
	if (!titleValidation.success) {
		return { success: false, error: titleValidation.error };
	}

	const contentValidation = validateLength(content, 1, 10000, "内容");
	if (!contentValidation.success) {
		return { success: false, error: contentValidation.error };
	}

	// サニタイズ
	const sanitizedTitle = sanitize.text(titleValidation.data);
	const sanitizedContent = sanitize.markdown(contentValidation.data);

	const supabase = await createClient();

	// お知らせが存在するか確認
	const { data: announcement } = await supabase
		.from("announcements")
		.select("id")
		.eq("id", idValidation.data)
		.single();

	if (!announcement) {
		return { success: false, error: "お知らせが見つかりません" };
	}

	// お知らせを更新
	const { error } = await supabase
		.from("announcements")
		.update({
			title: sanitizedTitle,
			content: sanitizedContent,
			updated_at: new Date().toISOString(),
		})
		.eq("id", idValidation.data);

	if (error) {
		console.error("Error updating announcement:", sanitize.log(error.message));
		return { success: false, error: "お知らせの更新に失敗しました" };
	}

	revalidatePath("/instructor/announcements");
	revalidatePath("/student/dashboard");
	revalidatePath("/student/announcements");

	return { success: true };
}

/**
 * お知らせを公開する（講師用）
 */
export async function publishAnnouncement(id: string): Promise<ActionResult> {
	// 権限確認
	const auth = await verifyInstructor();
	if (!auth.success) {
		return { success: false, error: auth.error };
	}

	// IDのバリデーション
	const idValidation = validateUUID(id, "お知らせID");
	if (!idValidation.success) {
		return { success: false, error: idValidation.error };
	}

	const supabase = await createClient();

	// お知らせを公開
	const { error } = await supabase
		.from("announcements")
		.update({
			published_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.eq("id", idValidation.data);

	if (error) {
		console.error(
			"Error publishing announcement:",
			sanitize.log(error.message),
		);
		return { success: false, error: "お知らせの公開に失敗しました" };
	}

	revalidatePath("/instructor/announcements");
	revalidatePath("/student/dashboard");
	revalidatePath("/student/announcements");

	return { success: true };
}

/**
 * お知らせを非公開にする（講師用）
 */
export async function unpublishAnnouncement(id: string): Promise<ActionResult> {
	// 権限確認
	const auth = await verifyInstructor();
	if (!auth.success) {
		return { success: false, error: auth.error };
	}

	// IDのバリデーション
	const idValidation = validateUUID(id, "お知らせID");
	if (!idValidation.success) {
		return { success: false, error: idValidation.error };
	}

	const supabase = await createClient();

	// お知らせを非公開
	const { error } = await supabase
		.from("announcements")
		.update({
			published_at: null,
			updated_at: new Date().toISOString(),
		})
		.eq("id", idValidation.data);

	if (error) {
		console.error(
			"Error unpublishing announcement:",
			sanitize.log(error.message),
		);
		return { success: false, error: "お知らせの非公開に失敗しました" };
	}

	revalidatePath("/instructor/announcements");
	revalidatePath("/student/dashboard");
	revalidatePath("/student/announcements");

	return { success: true };
}

/**
 * お知らせを削除する（講師用）
 */
export async function deleteAnnouncement(id: string): Promise<ActionResult> {
	// 権限確認
	const auth = await verifyInstructor();
	if (!auth.success) {
		return { success: false, error: auth.error };
	}

	// IDのバリデーション
	const idValidation = validateUUID(id, "お知らせID");
	if (!idValidation.success) {
		return { success: false, error: idValidation.error };
	}

	const supabase = await createClient();

	// お知らせを削除
	const { error } = await supabase
		.from("announcements")
		.delete()
		.eq("id", idValidation.data);

	if (error) {
		console.error("Error deleting announcement:", sanitize.log(error.message));
		return { success: false, error: "お知らせの削除に失敗しました" };
	}

	revalidatePath("/instructor/announcements");
	revalidatePath("/student/dashboard");
	revalidatePath("/student/announcements");

	return { success: true };
}
