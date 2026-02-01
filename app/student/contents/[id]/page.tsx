"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/app/_lib/supabase/client";
import type {
	Content,
	ContentResponse,
	Phase,
	UserProgress,
	UserResponse,
	Week,
} from "@/app/_types";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import { MarkdownViewer, YouTubePlayer } from "../../_components";

export default function ContentDetailPage() {
	const params = useParams();
	const router = useRouter();
	const contentId = params.id as string;

	const [user, setUser] = useState<UserResponse | null>(null);
	const [content, setContent] = useState<ContentResponse | null>(null);
	const [isCompleted, setIsCompleted] = useState(false);
	const [week, setWeek] = useState<{ id: string; title: string } | null>(null);
	const [phase, setPhase] = useState<{ id: string; title: string } | null>(
		null,
	);
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

			// コンテンツを取得
			const { data: contentData, error: contentError } = await supabase
				.from("contents")
				.select("*")
				.eq("id", contentId)
				.single();

			if (contentError || !contentData) {
				router.push("/student/contents");
				return;
			}

			// ContentResponse型に変換
			const contentResponse: ContentResponse = {
				id: contentData.id,
				weekId: contentData.week_id,
				type: contentData.type,
				title: contentData.title,
				content: contentData.content,
				orderIndex: contentData.order_index,
				createdAt: contentData.created_at,
			};

			setContent(contentResponse);

			// Weekを取得
			const { data: weekData, error: weekError } = await supabase
				.from("weeks")
				.select("*")
				.eq("id", contentData.week_id)
				.single();

			if (!weekError && weekData) {
				setWeek({ id: weekData.id, title: weekData.title });

				// Phaseを取得
				const { data: phaseData, error: phaseError } = await supabase
					.from("phases")
					.select("*")
					.eq("id", weekData.phase_id)
					.single();

				if (!phaseError && phaseData) {
					setPhase({ id: phaseData.id, title: phaseData.title });
				}
			}

			// 進捗状態を取得
			const { data: progressData, error: progressError } = await supabase
				.from("user_progress")
				.select("*")
				.eq("user_id", authUser.id)
				.eq("content_id", contentId)
				.maybeSingle();

			if (!progressError && progressData) {
				setIsCompleted(progressData.completed);
			} else {
				setIsCompleted(false);
			}

			setIsLoading(false);
		}

		loadData();
	}, [contentId, router]);

	const handleToggleComplete = async () => {
		if (!user || !content) return;

		const supabase = createClient();
		const newStatus = !isCompleted;

		// 進捗を更新または作成（upsert）
		const { error } = await supabase.from("user_progress").upsert(
			{
				user_id: user.id,
				content_id: content.id,
				completed: newStatus,
				completed_at: newStatus ? new Date().toISOString() : null,
			},
			{
				onConflict: "user_id,content_id",
			},
		);

		if (error) {
			console.error("Error updating progress:", error);
			return;
		}

		setIsCompleted(newStatus);
	};

	const handleNext = async () => {
		if (!content) return;

		const supabase = createClient();

		// 同じWeek内のコンテンツを取得
		const { data: sameWeekContents } = await supabase
			.from("contents")
			.select("*")
			.eq("week_id", content.weekId)
			.order("order_index", { ascending: true });

		if (!sameWeekContents || sameWeekContents.length === 0) return;

		const currentIndex = sameWeekContents.findIndex((c) => c.id === content.id);

		if (currentIndex < sameWeekContents.length - 1) {
			// 同じWeek内の次のコンテンツへ
			router.push(`/student/contents/${sameWeekContents[currentIndex + 1].id}`);
		} else {
			// 次のWeekの最初のコンテンツへ
			const { data: currentWeek } = await supabase
				.from("weeks")
				.select("*")
				.eq("id", content.weekId)
				.single();

			if (currentWeek) {
				const { data: weeks } = await supabase
					.from("weeks")
					.select("*")
					.eq("phase_id", currentWeek.phase_id)
					.order("order_index", { ascending: true });

				if (weeks) {
					const nextWeek = weeks.find(
						(w) => w.order_index > currentWeek.order_index,
					);

					if (nextWeek) {
						const { data: nextContents } = await supabase
							.from("contents")
							.select("*")
							.eq("week_id", nextWeek.id)
							.order("order_index", { ascending: true })
							.limit(1);

						if (nextContents && nextContents.length > 0) {
							router.push(`/student/contents/${nextContents[0].id}`);
						}
					}
				}
			}
		}
	};

	const handlePrevious = async () => {
		if (!content) return;

		const supabase = createClient();

		// 同じWeek内のコンテンツを取得
		const { data: sameWeekContents } = await supabase
			.from("contents")
			.select("*")
			.eq("week_id", content.weekId)
			.order("order_index", { ascending: true });

		if (!sameWeekContents || sameWeekContents.length === 0) return;

		const currentIndex = sameWeekContents.findIndex((c) => c.id === content.id);

		if (currentIndex > 0) {
			// 同じWeek内の前のコンテンツへ
			router.push(`/student/contents/${sameWeekContents[currentIndex - 1].id}`);
		} else {
			// 前のWeekの最後のコンテンツへ
			const { data: currentWeek } = await supabase
				.from("weeks")
				.select("*")
				.eq("id", content.weekId)
				.single();

			if (currentWeek) {
				const { data: weeks } = await supabase
					.from("weeks")
					.select("*")
					.eq("phase_id", currentWeek.phase_id)
					.order("order_index", { ascending: true });

				if (weeks) {
					const prevWeek = weeks
						.filter((w) => w.order_index < currentWeek.order_index)
						.sort((a, b) => b.order_index - a.order_index)[0];

					if (prevWeek) {
						const { data: prevContents } = await supabase
							.from("contents")
							.select("*")
							.eq("week_id", prevWeek.id)
							.order("order_index", { ascending: true });

						if (prevContents && prevContents.length > 0) {
							const prevContent = prevContents[prevContents.length - 1];
							router.push(`/student/contents/${prevContent.id}`);
						}
					}
				}
			}
		}
	};

	if (isLoading || !user || !content) {
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

	// コンテンツタイプ別のアイコンとラベル
	const getContentIcon = (type: string) => {
		switch (type) {
			case "video":
				return { icon: "🎥", label: "動画" };
			case "text":
				return { icon: "📄", label: "テキスト" };
			case "exercise":
				return { icon: "✏️", label: "演習" };
			default:
				return { icon: "📌", label: "その他" };
		}
	};

	const contentInfo = getContentIcon(content.type);

	return (
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
				{/* パンくずリスト */}
				<nav className="flex items-center gap-2 text-sm text-muted-foreground">
					<Link
						href="/student/contents"
						className="hover:text-foreground transition-colors"
					>
						コンテンツ一覧
					</Link>
					<span>/</span>
					{phase && (
						<>
							<span>{phase.title}</span>
							<span>/</span>
						</>
					)}
					{week && (
						<>
							<span>{week.title}</span>
							<span>/</span>
						</>
					)}
					<span className="text-foreground">{content.title}</span>
				</nav>

				{/* ヘッダー */}
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<span className="text-3xl" role="img" aria-label={content.type}>
							{contentInfo.icon}
						</span>
						<div className="flex-1">
							<div className="flex items-center gap-2 mb-1">
								<Badge variant="default">{contentInfo.label}</Badge>
								{isCompleted && <Badge variant="success">完了済み</Badge>}
							</div>
							<h1 className="text-2xl sm:text-3xl font-bold">
								{content.title}
							</h1>
						</div>
					</div>
				</div>

				{/* コンテンツ本体 */}
				<Card>
					<CardContent className="p-6">
						{content.type === "video" && content.content && (
							<YouTubePlayer url={content.content} />
						)}

						{content.type === "text" && (
							<MarkdownViewer content={content.content ?? ""} />
						)}

						{content.type === "exercise" && (
							<div className="space-y-6">
								<MarkdownViewer content={content.content ?? ""} />

								<div className="border-t pt-6">
									<h3 className="font-semibold mb-3">課題を提出する</h3>
									<p className="text-sm text-muted-foreground mb-4">
										この演習課題を完了したら、課題提出ページから提出してください。
									</p>
									<Link
										href={`/student/submissions/new?contentId=${content.id}`}
									>
										<Button>課題を提出する</Button>
									</Link>
								</div>
							</div>
						)}
					</CardContent>
				</Card>

				{/* アクションボタン */}
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<Button
						variant="outline"
						onClick={handlePrevious}
						className="w-full sm:w-auto order-2 sm:order-1"
					>
						<svg
							className="w-4 h-4 mr-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						前のコンテンツ
					</Button>

					<Button
						variant={isCompleted ? "outline" : "default"}
						onClick={handleToggleComplete}
						className="w-full sm:w-auto sm:min-w-[200px] order-1 sm:order-2"
					>
						{isCompleted ? (
							<>
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
										d="M5 13l4 4L19 7"
									/>
								</svg>
								完了済み
							</>
						) : (
							<>
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
										d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
									/>
								</svg>
								完了にする
							</>
						)}
					</Button>

					<Button
						variant="outline"
						onClick={handleNext}
						className="w-full sm:w-auto order-3"
					>
						次のコンテンツ
						<svg
							className="w-4 h-4 ml-2"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 5l7 7-7 7"
							/>
						</svg>
					</Button>
				</div>

				{/* ヘルプ情報 */}
				{content.type === "video" && (
					<div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
						<div className="flex items-start gap-3">
							<svg
								className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
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
							<div className="text-sm text-blue-700 dark:text-blue-300">
								<p className="font-medium mb-1">動画学習のヒント</p>
								<ul className="list-disc list-inside space-y-1">
									<li>必要に応じて一時停止しながら学習しましょう</li>
									<li>わからない箇所は繰り返し見直しましょう</li>
									<li>動画を見終わったら「完了にする」ボタンを押しましょう</li>
								</ul>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
