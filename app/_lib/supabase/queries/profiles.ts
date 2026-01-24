import type { Profile } from "@/types/database.types";
import { createClient } from "../server";

/**
 * 全ユーザーを取得
 */
export async function getAllProfiles(): Promise<Profile[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching profiles:", error);
		return [];
	}

	return data;
}

/**
 * 受講生一覧を取得
 */
export async function getStudents(): Promise<Profile[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("role", "student")
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching students:", error);
		return [];
	}

	return data;
}

/**
 * 承認済み受講生を取得
 */
export async function getApprovedStudents(): Promise<Profile[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("role", "student")
		.eq("approved", true)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching approved students:", error);
		return [];
	}

	return data;
}

/**
 * 未承認ユーザーを取得
 */
export async function getPendingUsers(): Promise<Profile[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("role", "student")
		.eq("approved", false)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching pending users:", error);
		return [];
	}

	return data;
}

/**
 * IDでユーザーを取得
 */
export async function getProfileById(id: string): Promise<Profile | null> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching profile:", error);
		return null;
	}

	return data;
}

/**
 * 現在のユーザーのプロフィールを取得
 */
export async function getCurrentProfile(): Promise<Profile | null> {
	const supabase = await createClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	return getProfileById(user.id);
}

/**
 * ユーザー統計を取得
 */
export async function getProfileStats(): Promise<{
	total: number;
	approved: number;
	pending: number;
}> {
	const supabase = await createClient();

	const [totalResult, approvedResult, pendingResult] = await Promise.all([
		supabase
			.from("profiles")
			.select("*", { count: "exact", head: true })
			.eq("role", "student"),
		supabase
			.from("profiles")
			.select("*", { count: "exact", head: true })
			.eq("role", "student")
			.eq("approved", true),
		supabase
			.from("profiles")
			.select("*", { count: "exact", head: true })
			.eq("role", "student")
			.eq("approved", false),
	]);

	return {
		total: totalResult.count ?? 0,
		approved: approvedResult.count ?? 0,
		pending: pendingResult.count ?? 0,
	};
}
