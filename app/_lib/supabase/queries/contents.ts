import { createClient } from "../server";
import type { Phase, Week, Content } from "@/types/database.types";

// ============================================
// Phase クエリ
// ============================================

/**
 * 全Phaseを取得
 */
export async function getAllPhases(): Promise<Phase[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("phases")
		.select("*")
		.order("order_index", { ascending: true });

	if (error) {
		console.error("Error fetching phases:", error);
		return [];
	}

	return data;
}

/**
 * IDでPhaseを取得
 */
export async function getPhaseById(id: string): Promise<Phase | null> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("phases")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching phase:", error);
		return null;
	}

	return data;
}

// ============================================
// Week クエリ
// ============================================

/**
 * 全Weekを取得
 */
export async function getAllWeeks(): Promise<Week[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("weeks")
		.select("*")
		.order("order_index", { ascending: true });

	if (error) {
		console.error("Error fetching weeks:", error);
		return [];
	}

	return data;
}

/**
 * PhaseIDでWeekを取得
 */
export async function getWeeksByPhaseId(phaseId: string): Promise<Week[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("weeks")
		.select("*")
		.eq("phase_id", phaseId)
		.order("order_index", { ascending: true });

	if (error) {
		console.error("Error fetching weeks:", error);
		return [];
	}

	return data;
}

/**
 * IDでWeekを取得
 */
export async function getWeekById(id: string): Promise<Week | null> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("weeks")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching week:", error);
		return null;
	}

	return data;
}

// ============================================
// Content クエリ
// ============================================

/**
 * 全Contentを取得
 */
export async function getAllContents(): Promise<Content[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("contents")
		.select("*")
		.order("order_index", { ascending: true });

	if (error) {
		console.error("Error fetching contents:", error);
		return [];
	}

	return data;
}

/**
 * WeekIDでContentを取得
 */
export async function getContentsByWeekId(weekId: string): Promise<Content[]> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("contents")
		.select("*")
		.eq("week_id", weekId)
		.order("order_index", { ascending: true });

	if (error) {
		console.error("Error fetching contents:", error);
		return [];
	}

	return data;
}

/**
 * IDでContentを取得
 */
export async function getContentById(id: string): Promise<Content | null> {
	const supabase = await createClient();
	const { data, error } = await supabase
		.from("contents")
		.select("*")
		.eq("id", id)
		.single();

	if (error) {
		console.error("Error fetching content:", error);
		return null;
	}

	return data;
}

// ============================================
// 複合クエリ
// ============================================

/**
 * Phase、Week、Contentを階層構造で取得
 */
export type PhaseWithWeeksAndContents = Phase & {
	weeks: (Week & { contents: Content[] })[];
};

export async function getPhasesWithWeeksAndContents(): Promise<
	PhaseWithWeeksAndContents[]
> {
	const supabase = await createClient();

	const { data: phases, error: phasesError } = await supabase
		.from("phases")
		.select("*")
		.order("order_index", { ascending: true });

	if (phasesError || !phases) {
		console.error("Error fetching phases:", phasesError);
		return [];
	}

	const { data: weeks, error: weeksError } = await supabase
		.from("weeks")
		.select("*")
		.order("order_index", { ascending: true });

	if (weeksError || !weeks) {
		console.error("Error fetching weeks:", weeksError);
		return [];
	}

	const { data: contents, error: contentsError } = await supabase
		.from("contents")
		.select("*")
		.order("order_index", { ascending: true });

	if (contentsError || !contents) {
		console.error("Error fetching contents:", contentsError);
		return [];
	}

	// 階層構造に組み立て
	return phases.map((phase) => ({
		...phase,
		weeks: weeks
			.filter((week) => week.phase_id === phase.id)
			.map((week) => ({
				...week,
				contents: contents.filter((content) => content.week_id === week.id),
			})),
	}));
}

/**
 * コンテンツ統計を取得
 */
export async function getContentStats(): Promise<{
	totalPhases: number;
	totalWeeks: number;
	totalContents: number;
	videoCount: number;
	textCount: number;
	exerciseCount: number;
}> {
	const supabase = await createClient();

	const [phases, weeks, contents, videos, texts, exercises] = await Promise.all(
		[
			supabase.from("phases").select("*", { count: "exact", head: true }),
			supabase.from("weeks").select("*", { count: "exact", head: true }),
			supabase.from("contents").select("*", { count: "exact", head: true }),
			supabase
				.from("contents")
				.select("*", { count: "exact", head: true })
				.eq("type", "video"),
			supabase
				.from("contents")
				.select("*", { count: "exact", head: true })
				.eq("type", "text"),
			supabase
				.from("contents")
				.select("*", { count: "exact", head: true })
				.eq("type", "exercise"),
		],
	);

	return {
		totalPhases: phases.count ?? 0,
		totalWeeks: weeks.count ?? 0,
		totalContents: contents.count ?? 0,
		videoCount: videos.count ?? 0,
		textCount: texts.count ?? 0,
		exerciseCount: exercises.count ?? 0,
	};
}
