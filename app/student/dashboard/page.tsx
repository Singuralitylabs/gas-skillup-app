"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/app/_lib/supabase/client";
import type {
	Announcement,
	AnnouncementResponse,
	Content,
	Phase,
	Profile,
	UserProgress,
	UserResponse,
	Week,
} from "@/app/_types";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	EmptyAnnouncements,
	Progress,
} from "@/components/ui";
import { AnnouncementCard, ProgressCard } from "../_components";

export default function StudentDashboardPage() {
	const router = useRouter();
	const [user, setUser] = useState<UserResponse | null>(null);
	const [progressRate, setProgressRate] = useState(0);
	const [completedContents, setCompletedContents] = useState(0);
	const [totalContents, setTotalContents] = useState(0);
	const [announcements, setAnnouncements] = useState<AnnouncementResponse[]>(
		[],
	);
	const [phaseProgress, setPhaseProgress] = useState<
		{ phaseId: string; title: string; completed: number; total: number }[]
	>([]);
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
				announcementsResult,
			] = await Promise.all([
				supabase
					.from("phases")
					.select("*")
					.order("order_index", { ascending: true }),
				supabase
					.from("weeks")
					.select("*")
					.order("order_index", { ascending: true }),
				supabase
					.from("contents")
					.select("*")
					.order("order_index", { ascending: true }),
				supabase
					.from("user_progress")
					.select("*")
					.eq("user_id", authUser.id)
					.eq("completed", true),
				supabase
					.from("announcements")
					.select("*")
					.not("published_at", "is", null)
					.lte("published_at", new Date().toISOString())
					.order("published_at", { ascending: false })
					.limit(3),
			]);

			const phases = (phasesResult.data as Phase[]) ?? [];
			const weeks = (weeksResult.data as Week[]) ?? [];
			const contents = (contentsResult.data as Content[]) ?? [];
			const userProgress = (progressResult.data as UserProgress[]) ?? [];
			const announcementsData =
				(announcementsResult.data as Announcement[]) ?? [];

			// 進捗率を計算
			const total = contents.length;
			const completed = userProgress.length;
			const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

			setTotalContents(total);
			setCompletedContents(completed);
			setProgressRate(rate);

			// お知らせを変換
			const announcementsResponse: AnnouncementResponse[] =
				announcementsData.map((announcement) => ({
					id: announcement.id,
					title: announcement.title,
					content: announcement.content,
					publishedAt: announcement.published_at,
					createdAt: announcement.created_at,
				}));
			setAnnouncements(announcementsResponse);

			// Phase 別進捗を計算
			const phaseProgressData = phases.map((phase) => {
				const phaseWeeks = weeks.filter((week) => week.phase_id === phase.id);
				const phaseContents = phaseWeeks.flatMap((week) =>
					contents.filter((content) => content.week_id === week.id),
				);
				const completedInPhase = phaseContents.filter((content) =>
					userProgress.some((p) => p.content_id === content.id),
				).length;

				return {
					phaseId: phase.id,
					title: phase.title,
					completed: completedInPhase,
					total: phaseContents.length,
				};
			});

			setPhaseProgress(phaseProgressData);
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

	return (
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="space-y-6 sm:space-y-8">
				{/* Header */}
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold">ダッシュボード</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						ようこそ、{user.name ?? "ユーザー"}さん
					</p>
				</div>

				{/* Progress Summary */}
				<div className="grid gap-6 md:grid-cols-2">
					<ProgressCard
						totalContents={totalContents}
						completedContents={completedContents}
						progressRate={progressRate}
					/>

					{/* Quick Actions */}
					<Card>
						<CardHeader>
							<CardTitle>クイックアクション</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<Link href="/student/contents" className="block">
								<Button
									variant="default"
									className="w-full justify-start"
									size="lg"
								>
									<svg
										className="w-5 h-5 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
										/>
									</svg>
									コンテンツを学習する
								</Button>
							</Link>
							<Link href="/student/submissions" className="block">
								<Button
									variant="outline"
									className="w-full justify-start"
									size="lg"
								>
									<svg
										className="w-5 h-5 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
										/>
									</svg>
									課題の提出状況を見る
								</Button>
							</Link>
							<Link href="/student/announcements" className="block">
								<Button
									variant="outline"
									className="w-full justify-start"
									size="lg"
								>
									<svg
										className="w-5 h-5 mr-2"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
										/>
									</svg>
									お知らせを見る
								</Button>
							</Link>
						</CardContent>
					</Card>
				</div>

				{/* Phase Progress */}
				<Card>
					<CardHeader>
						<CardTitle>学習フェーズ進捗</CardTitle>
						<CardDescription>各フェーズの進捗状況</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						{phaseProgress.map((phase) => {
							const rate =
								phase.total > 0
									? Math.round((phase.completed / phase.total) * 100)
									: 0;
							const status =
								rate === 100
									? "completed"
									: rate > 0
										? "in_progress"
										: "not_started";

							return (
								<div key={phase.phaseId} className="space-y-2">
									<div className="flex items-center justify-between">
										<span className="text-sm font-medium">{phase.title}</span>
										<Badge
											variant={
												status === "completed"
													? "success"
													: status === "in_progress"
														? "default"
														: "secondary"
											}
										>
											{status === "completed"
												? "完了"
												: status === "in_progress"
													? "学習中"
													: "未開始"}
										</Badge>
									</div>
									<Progress value={rate} className="h-2" />
									<p className="text-xs text-muted-foreground">
										{phase.completed} / {phase.total} コンテンツ完了
									</p>
								</div>
							);
						})}
					</CardContent>
				</Card>

				{/* Latest Announcements */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<h2 className="text-2xl font-bold">最新のお知らせ</h2>
						<Link href="/student/announcements">
							<Button variant="ghost" size="sm">
								すべて見る
							</Button>
						</Link>
					</div>
					<div className="space-y-4">
						{announcements.length === 0 ? (
							<EmptyAnnouncements />
						) : (
							announcements.map((announcement) => (
								<AnnouncementCard
									key={announcement.id}
									announcement={announcement}
								/>
							))
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
