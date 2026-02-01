"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";

export type ActionResult<T = void> = {
	success: boolean;
	error?: string;
	data?: T;
};

/**
 * お知らせを作成する（講師用）
 */
export async function createAnnouncement(
	title: string,
	content: string,
	publishNow: boolean = false,
): Promise<ActionResult<{ id: string }>> {
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

	// お知らせを作成
	const { data, error } = await supabase
		.from("announcements")
		.insert({
			title: title,
			content: content,
			published_at: publishNow ? new Date().toISOString() : null,
		})
		.select("id")
		.single();

	if (error) {
		console.error("Error creating announcement:", error);
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

	// お知らせが存在するか確認
	const { data: announcement } = await supabase
		.from("announcements")
		.select("id")
		.eq("id", id)
		.single();

	if (!announcement) {
		return { success: false, error: "お知らせが見つかりません" };
	}

	// お知らせを更新
	const { error } = await supabase
		.from("announcements")
		.update({
			title: title,
			content: content,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id);

	if (error) {
		console.error("Error updating announcement:", error);
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

	// お知らせを公開
	const { error } = await supabase
		.from("announcements")
		.update({
			published_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.eq("id", id);

	if (error) {
		console.error("Error publishing announcement:", error);
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

	// お知らせを非公開
	const { error } = await supabase
		.from("announcements")
		.update({
			published_at: null,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id);

	if (error) {
		console.error("Error unpublishing announcement:", error);
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

	// お知らせを削除
	const { error } = await supabase.from("announcements").delete().eq("id", id);

	if (error) {
		console.error("Error deleting announcement:", error);
		return { success: false, error: "お知らせの削除に失敗しました" };
	}

	revalidatePath("/instructor/announcements");
	revalidatePath("/student/dashboard");
	revalidatePath("/student/announcements");

	return { success: true };
}
