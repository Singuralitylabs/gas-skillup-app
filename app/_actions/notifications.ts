"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/app/_lib/supabase/server";
import type { NotificationType } from "@/types/database.types";
import { sanitize } from "@/utils/sanitize";
import { validateEnum, validateLength, validateUUID } from "@/utils/validation";

export type ActionResult<T = void> = {
	success: boolean;
	error?: string;
	data?: T;
};

/**
 * 通知タイプの許可値
 */
const NOTIFICATION_TYPES = ["announcement", "feedback", "approval"] as const;

/**
 * 通知を作成する（内部用）
 */
export async function createNotification(
	userId: string,
	type: NotificationType,
	title: string,
	content: string,
	relatedId?: string,
): Promise<ActionResult<{ id: string }>> {
	// ユーザーIDのバリデーション
	const userIdValidation = validateUUID(userId, "ユーザーID");
	if (!userIdValidation.success) {
		return { success: false, error: userIdValidation.error };
	}

	// 通知タイプのバリデーション
	const typeValidation = validateEnum(type, NOTIFICATION_TYPES, "通知タイプ");
	if (!typeValidation.success) {
		return { success: false, error: typeValidation.error };
	}

	// タイトルのバリデーション
	const titleValidation = validateLength(title, 1, 200, "タイトル");
	if (!titleValidation.success) {
		return { success: false, error: titleValidation.error };
	}

	// 内容のバリデーション
	const contentValidation = validateLength(content, 1, 5000, "内容");
	if (!contentValidation.success) {
		return { success: false, error: contentValidation.error };
	}

	// 関連IDのバリデーション（存在する場合）
	if (relatedId) {
		const relatedIdValidation = validateUUID(relatedId, "関連ID");
		if (!relatedIdValidation.success) {
			return { success: false, error: relatedIdValidation.error };
		}
	}

	// サニタイズ
	const sanitizedTitle = sanitize.text(titleValidation.data);
	const sanitizedContent = sanitize.text(contentValidation.data);

	const supabase = await createClient();

	const { data, error } = await supabase
		.from("notifications")
		.insert({
			user_id: userIdValidation.data,
			type: typeValidation.data,
			title: sanitizedTitle,
			content: sanitizedContent,
			related_id: relatedId ?? null,
		})
		.select("id")
		.single();

	if (error) {
		console.error("Error creating notification:", sanitize.log(error.message));
		return { success: false, error: "通知の作成に失敗しました" };
	}

	return { success: true, data: { id: data.id } };
}

/**
 * 通知を既読にする
 */
export async function markNotificationAsRead(
	notificationId: string,
): Promise<ActionResult> {
	// 通知IDのバリデーション
	const idValidation = validateUUID(notificationId, "通知ID");
	if (!idValidation.success) {
		return { success: false, error: idValidation.error };
	}

	const supabase = await createClient();

	// 現在のユーザーを確認
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "認証されていません" };
	}

	// 通知が存在し、ユーザーのものかを確認
	const { data: notification } = await supabase
		.from("notifications")
		.select("id, user_id")
		.eq("id", idValidation.data)
		.single();

	if (!notification) {
		return { success: false, error: "通知が見つかりません" };
	}

	if (notification.user_id !== user.id) {
		return { success: false, error: "権限がありません" };
	}

	// 通知を既読に更新
	const { error } = await supabase
		.from("notifications")
		.update({
			is_read: true,
			read_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.eq("id", idValidation.data);

	if (error) {
		console.error(
			"Error marking notification as read:",
			sanitize.log(error.message),
		);
		return { success: false, error: "通知の更新に失敗しました" };
	}

	revalidatePath("/student/notifications");
	revalidatePath("/student/dashboard");

	return { success: true };
}

/**
 * すべての通知を既読にする
 */
export async function markAllNotificationsAsRead(): Promise<ActionResult> {
	const supabase = await createClient();

	// 現在のユーザーを確認
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "認証されていません" };
	}

	// ユーザーの未読通知をすべて既読に更新
	const { error } = await supabase
		.from("notifications")
		.update({
			is_read: true,
			read_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		.eq("user_id", user.id)
		.eq("is_read", false);

	if (error) {
		console.error(
			"Error marking all notifications as read:",
			sanitize.log(error.message),
		);
		return { success: false, error: "通知の更新に失敗しました" };
	}

	revalidatePath("/student/notifications");
	revalidatePath("/student/dashboard");

	return { success: true };
}

/**
 * 通知を削除する
 */
export async function deleteNotification(
	notificationId: string,
): Promise<ActionResult> {
	// 通知IDのバリデーション
	const idValidation = validateUUID(notificationId, "通知ID");
	if (!idValidation.success) {
		return { success: false, error: idValidation.error };
	}

	const supabase = await createClient();

	// 現在のユーザーを確認
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return { success: false, error: "認証されていません" };
	}

	// 通知が存在し、ユーザーのものかを確認
	const { data: notification } = await supabase
		.from("notifications")
		.select("id, user_id")
		.eq("id", idValidation.data)
		.single();

	if (!notification) {
		return { success: false, error: "通知が見つかりません" };
	}

	if (notification.user_id !== user.id) {
		return { success: false, error: "権限がありません" };
	}

	// 通知を削除
	const { error } = await supabase
		.from("notifications")
		.delete()
		.eq("id", idValidation.data);

	if (error) {
		console.error("Error deleting notification:", sanitize.log(error.message));
		return { success: false, error: "通知の削除に失敗しました" };
	}

	revalidatePath("/student/notifications");
	revalidatePath("/student/dashboard");

	return { success: true };
}
