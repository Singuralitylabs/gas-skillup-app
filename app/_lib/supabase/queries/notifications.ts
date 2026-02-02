import type { Notification } from "@/types/database.types";
import { createClient } from "../server";

/**
 * ユーザーの通知一覧を取得
 */
export async function getNotificationsByUserId(
	userId: string,
): Promise<Notification[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("notifications")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching notifications:", error);
		return [];
	}

	return data;
}

/**
 * 未読通知を取得
 */
export async function getUnreadNotifications(
	userId: string,
): Promise<Notification[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("notifications")
		.select("*")
		.eq("user_id", userId)
		.eq("is_read", false)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching unread notifications:", error);
		return [];
	}

	return data;
}

/**
 * 未読通知の件数を取得
 */
export async function getUnreadNotificationCount(
	userId: string,
): Promise<number> {
	const supabase = await createClient();
	const { count, error } = await supabase
		.from("notifications")
		.select("*", { count: "exact", head: true })
		.eq("user_id", userId)
		.eq("is_read", false);

	if (error) {
		console.error("Error fetching unread notification count:", error);
		return 0;
	}

	return count ?? 0;
}

/**
 * 最新の通知を取得
 */
export async function getLatestNotifications(
	userId: string,
	limit = 5,
): Promise<Notification[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("notifications")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		console.error("Error fetching latest notifications:", error);
		return [];
	}

	return data;
}

/**
 * IDで通知を取得
 */
export async function getNotificationById(
	id: string,
): Promise<Notification | null> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("notifications")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching notification:", error);
		return null;
	}

	return data;
}
