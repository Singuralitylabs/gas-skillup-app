"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";

export type ActionResult = {
	success: boolean;
	error?: string;
};

/**
 * ユーザーを承認する
 */
export async function approveUser(userId: string): Promise<ActionResult> {
	const supabase = await createClient();

	// 現在のユーザーが講師かどうか確認
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "認証されていません" };
	}

	const { data: currentProfile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (currentProfile?.role !== "instructor") {
		return { success: false, error: "権限がありません" };
	}

	// ユーザーを承認
	const { error } = await supabase
		.from("profiles")
		.update({ approved: true, updated_at: new Date().toISOString() })
		.eq("id", userId);

	if (error) {
		return { success: false, error: error.message };
	}

	revalidatePath("/instructor/approvals");
	revalidatePath("/instructor/students");
	return { success: true };
}

/**
 * ユーザーの承認を却下（削除）する
 */
export async function rejectUser(userId: string): Promise<ActionResult> {
	const supabase = await createClient();

	// 現在のユーザーが講師かどうか確認
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "認証されていません" };
	}

	const { data: currentProfile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (currentProfile?.role !== "instructor") {
		return { success: false, error: "権限がありません" };
	}

	// ユーザーを削除（profilesから削除するとauth.usersからも削除される場合がある）
	// ここでは承認却下として、profilesのみ削除
	const { error } = await supabase.from("profiles").delete().eq("id", userId);

	if (error) {
		return { success: false, error: error.message };
	}

	revalidatePath("/instructor/approvals");
	revalidatePath("/instructor/students");
	return { success: true };
}

/**
 * 複数ユーザーを一括承認する
 */
export async function approveUsers(userIds: string[]): Promise<ActionResult> {
	const supabase = await createClient();

	// 現在のユーザーが講師かどうか確認
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "認証されていません" };
	}

	const { data: currentProfile } = await supabase
		.from("profiles")
		.select("role")
		.eq("id", user.id)
		.single();

	if (currentProfile?.role !== "instructor") {
		return { success: false, error: "権限がありません" };
	}

	// 一括承認
	const { error } = await supabase
		.from("profiles")
		.update({ approved: true, updated_at: new Date().toISOString() })
		.in("id", userIds);

	if (error) {
		return { success: false, error: error.message };
	}

	revalidatePath("/instructor/approvals");
	revalidatePath("/instructor/students");
	return { success: true };
}
