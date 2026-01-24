"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import { createClient } from "@/app/_lib/supabase/client";
import type {
	Content,
	Phase,
	UserProgress,
	Week,
} from "@/app/_types";
import type {
	ContentResponse,
	PhaseResponse,
	UserProgressResponse,
	UserResponse,
	WeekResponse,
} from "@/app/_types";
import { PhaseSection } from "../_components";

export default function ContentsPage() {
	const router = useRouter();
	const [user, setUser] = useState<UserResponse | null>(null);
	const [phases, setPhases] = useState<PhaseResponse[]>([]);
	const [weeks, setWeeks] = useState<WeekResponse[]>([]);
	const [contents, setContents] = useState<ContentResponse[]>([]);
	const [userProgress, setUserProgress] = useState<UserProgressResponse[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadData() {
			const supabase = createClient();

			// 現在のユーザーを取得
			const {
				data: { user: authUser },
				error: authError,
			} = await supabase.auth.getUser();

			if (authError || !authUser) {
				router.push("/login");
				return;
			}

			// プロフィール情報を取得
			const { data: profile, error: profileError } = await supabase
				.from("profiles")
				.select("*")
				.eq("id", authUser.id)
				.single();

			if (profileError || !profile) {
				router.push("/login");
				return;
			}

			if (!profile.approved) {
				router.push("/pending-approval");
				return;
			}

			// UserResponse型に変換
			const userResponse: UserResponse = {
				id: profile.id,
				email: profile.email,
				name: profile.name,
				role: profile.role,
				approved: profile.approved,
				createdAt: profile.created_at,
			};

			setUser(userResponse);

			// データを並列取得
			const [
				phasesResult,
				weeksResult,
				contentsResult,
				progressResult,
			] = await Promise.all([
				supabase.from("phases").select("*").order("order_index", { ascending: true }),
				supabase.from("weeks").select("*").order("order_index", { ascending: true }),
				supabase.from("contents").select("*").order("order_index", { ascending: true }),
				supabase
					.from("user_progress")
					.select("*")
					.eq("user_id", authUser.id),
			]);

			const phasesData = (phasesResult.data as Phase[]) ?? [];
			const weeksData = (weeksResult.data as Week[]) ?? [];
			const contentsData = (contentsResult.data as Content[]) ?? [];
			const progressData = (progressResult.data as UserProgress[]) ?? [];

			// PhaseResponse型に変換
			const phasesResponse: PhaseResponse[] = phasesData.map((phase) => ({
				id: phase.id,
				title: phase.title,
				description: phase.description,
				orderIndex: phase.order_index,
				createdAt: phase.created_at,
			}));

			// WeekResponse型に変換
			const weeksResponse: WeekResponse[] = weeksData.map((week) => ({
				id: week.id,
				phaseId: week.phase_id,
				title: week.title,
				description: week.description,
				orderIndex: week.order_index,
				createdAt: week.created_at,
			}));

			// ContentResponse型に変換
			const contentsResponse: ContentResponse[] = contentsData.map((content) => ({
				id: content.id,
				weekId: content.week_id,
				type: content.type,
				title: content.title,
				content: content.content,
				orderIndex: content.order_index,
				createdAt: content.created_at,
			}));

			// UserProgressResponse型に変換
			const progressResponse: UserProgressResponse[] = progressData.map(
				(progress) => ({
					id: progress.id,
					userId: progress.user_id,
					contentId: progress.content_id,
					completed: progress.completed,
					completedAt: progress.completed_at,
				}),
			);

			setPhases(phasesResponse);
			setWeeks(weeksResponse);
			setContents(contentsResponse);
			setUserProgress(progressResponse);
			setIsLoading(false);
		}

		loadData();
	}, [router]);

	if (isLoading || !user) {
		return (
			<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
				<div className="flex items-center justify-center min-h-[400px]">
					<div className="text-center">
						<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
						<p className="text-muted-foreground">読み込み中...</p>
					</div>
				</div>
			</div>
		);
	}

	// 全体の進捗統計
	const totalContents = contents.length;
	const completedContents = userProgress.filter((p) => p.completed).length;
	const progressRate =
		totalContents > 0
			? Math.round((completedContents / totalContents) * 100)
			: 0;

	return (
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="space-y-6">
				{/* ヘッダー */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold sm:text-3xl">学習コンテンツ</h1>
						<p className="text-muted-foreground mt-1 text-sm sm:text-base">
							Phase → Week → Contentの順に学習を進めましょう
						</p>
					</div>
					<Button
						variant="outline"
						onClick={() => router.push("/student/dashboard")}
						className="w-full sm:w-auto"
					>
						ダッシュボードに戻る
					</Button>
				</div>

				{/* 進捗サマリー */}
				<div className="bg-primary/10 rounded-lg p-4 sm:p-6">
					<div className="grid grid-cols-3 gap-4">
						<div className="text-center">
							<p className="text-sm text-muted-foreground mb-1">全体進捗</p>
							<p className="text-3xl font-bold text-primary">{progressRate}%</p>
						</div>
						<div className="text-center">
							<p className="text-sm text-muted-foreground mb-1">完了</p>
							<p className="text-3xl font-bold text-success">
								{completedContents}
							</p>
						</div>
						<div className="text-center">
							<p className="text-sm text-muted-foreground mb-1">残り</p>
							<p className="text-3xl font-bold text-muted-foreground">
								{totalContents - completedContents}
							</p>
						</div>
					</div>
				</div>

				{/* Phase リスト */}
				<div className="space-y-4">
					{phases
						.sort((a, b) => a.orderIndex - b.orderIndex)
						.map((phase, index) => {
							const phaseWeeks = weeks.filter(
								(week) => week.phaseId === phase.id,
							);

							// 最初のPhaseをデフォルトで開く
							const defaultOpen = index === 0;

							return (
								<PhaseSection
									key={phase.id}
									phase={phase}
									weeks={phaseWeeks}
									allContents={contents}
									userProgress={userProgress}
									defaultOpen={defaultOpen}
								/>
							);
						})}
				</div>

				{/* 補足情報 */}
				<div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<svg
							className="w-5 h-5 text-primary shrink-0 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div className="text-sm">
							<p className="font-medium text-foreground mb-1">学習のヒント</p>
							<ul className="text-primary space-y-1 list-disc list-inside">
								<li>各Phaseは順番に学習することをお勧めします</li>
								<li>動画を見た後、テキストで復習し、演習で定着させましょう</li>
								<li>演習課題は必ず提出してフィードバックを受けましょう</li>
								<li>わからないことがあれば、お気軽に質問してください</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
