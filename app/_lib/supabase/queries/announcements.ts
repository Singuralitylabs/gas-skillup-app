import { createClient } from "../server";
import type { Announcement } from "@/types/database.types";

/**
 * 全お知らせを取得
 */
export async function getAllAnnouncements(): Promise<Announcement[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("announcements")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching announcements:", error);
		return [];
	}

	return data;
}

/**
 * 公開済みお知らせを取得
 */
export async function getPublishedAnnouncements(): Promise<Announcement[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("announcements")
		.select("*")
		.not("published_at", "is", null)
		.lte("published_at", new Date().toISOString())
		.order("published_at", { ascending: false });

	if (error) {
		console.error("Error fetching published announcements:", error);
		return [];
	}

	return data;
}

/**
 * 最新のお知らせを取得
 */
export async function getLatestAnnouncements(
	limit = 5,
): Promise<Announcement[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("announcements")
		.select("*")
		.not("published_at", "is", null)
		.lte("published_at", new Date().toISOString())
		.order("published_at", { ascending: false })
		.limit(limit);

	if (error) {
		console.error("Error fetching latest announcements:", error);
		return [];
	}

	return data;
}

/**
 * IDでお知らせを取得
 */
export async function getAnnouncementById(
	id: string,
): Promise<Announcement | null> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("announcements")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching announcement:", error);
		return null;
	}

	return data;
}

/**
 * お知らせ統計を取得
 */
export async function getAnnouncementStats(): Promise<{
	total: number;
	published: number;
	draft: number;
}> {
	const supabase = await createClient();

	const [total, published, draft] = await Promise.all([
		supabase.from("announcements").select("*", { count: "exact", head: true }),
		supabase
			.from("announcements")
			.select("*", { count: "exact", head: true })
			.not("published_at", "is", null),
		supabase
			.from("announcements")
			.select("*", { count: "exact", head: true })
			.is("published_at", null),
	]);

	return {
		total: total.count ?? 0,
		published: published.count ?? 0,
		draft: draft.count ?? 0,
	};
}
