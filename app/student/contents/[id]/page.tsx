"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge, Button, Card, CardContent } from "@/components/ui";
import {
	getCurrentUser,
	getStoredUserProgress,
	mockContents,
	mockPhases,
	mockWeeks,
	updateProgress,
} from "@/lib/mock";
import type { ContentResponse, UserResponse } from "@/types";
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

	useEffect(() => {
		const currentUser = getCurrentUser();
		if (!currentUser) {
			router.push("/login");
			return;
		}

		if (!currentUser.approved) {
			router.push("/pending-approval");
			return;
		}

		setUser(currentUser);

		// コンテンツを取得
		const foundContent = mockContents.find((c) => c.id === contentId);
		if (!foundContent) {
			router.push("/student/contents");
			return;
		}
		setContent(foundContent);

		// Weekを取得
		const foundWeek = mockWeeks.find((w) => w.id === foundContent.weekId);
		if (foundWeek) {
			setWeek({ id: foundWeek.id, title: foundWeek.title });

			// Phaseを取得
			const foundPhase = mockPhases.find((p) => p.id === foundWeek.phaseId);
			if (foundPhase) {
				setPhase({ id: foundPhase.id, title: foundPhase.title });
			}
		}

		// 進捗状態を取得
		const userProgress = getStoredUserProgress(currentUser.id);
		const progress = userProgress.find((p) => p.contentId === contentId);
		setIsCompleted(progress?.completed || false);
	}, [contentId, router]);

	const handleToggleComplete = () => {
		if (!user || !content) return;

		const newStatus = !isCompleted;
		updateProgress(user.id, content.id, newStatus);
		setIsCompleted(newStatus);
	};

	const handleNext = () => {
		if (!content) return;

		// 同じWeek内の次のコンテンツを探す
		const sameWeekContents = mockContents
			.filter((c) => c.weekId === content.weekId)
			.sort((a, b) => a.orderIndex - b.orderIndex);

		const currentIndex = sameWeekContents.findIndex((c) => c.id === content.id);
		if (currentIndex < sameWeekContents.length - 1) {
			router.push(`/student/contents/${sameWeekContents[currentIndex + 1].id}`);
		} else {
			// 次のWeekの最初のコンテンツへ
			const currentWeek = mockWeeks.find((w) => w.id === content.weekId);
			if (currentWeek) {
				const nextWeek = mockWeeks
					.filter((w) => w.phaseId === currentWeek.phaseId)
					.sort((a, b) => a.orderIndex - b.orderIndex)
					.find((w) => w.orderIndex > currentWeek.orderIndex);

				if (nextWeek) {
					const nextContent = mockContents
						.filter((c) => c.weekId === nextWeek.id)
						.sort((a, b) => a.orderIndex - b.orderIndex)[0];

					if (nextContent) {
						router.push(`/student/contents/${nextContent.id}`);
					}
				}
			}
		}
	};

	const handlePrevious = () => {
		if (!content) return;

		// 同じWeek内の前のコンテンツを探す
		const sameWeekContents = mockContents
			.filter((c) => c.weekId === content.weekId)
			.sort((a, b) => a.orderIndex - b.orderIndex);

		const currentIndex = sameWeekContents.findIndex((c) => c.id === content.id);
		if (currentIndex > 0) {
			router.push(`/student/contents/${sameWeekContents[currentIndex - 1].id}`);
		} else {
			// 前のWeekの最後のコンテンツへ
			const currentWeek = mockWeeks.find((w) => w.id === content.weekId);
			if (currentWeek) {
				const prevWeek = mockWeeks
					.filter((w) => w.phaseId === currentWeek.phaseId)
					.sort((a, b) => b.orderIndex - a.orderIndex)
					.find((w) => w.orderIndex < currentWeek.orderIndex);

				if (prevWeek) {
					const prevContents = mockContents
						.filter((c) => c.weekId === prevWeek.id)
						.sort((a, b) => a.orderIndex - b.orderIndex);

					const prevContent = prevContents[prevContents.length - 1];
					if (prevContent) {
						router.push(`/student/contents/${prevContent.id}`);
					}
				}
			}
		}
	};

	if (!user || !content) {
		return null;
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
						{content.type === "video" && (
							<YouTubePlayer url={content.content} />
						)}

						{content.type === "text" && (
							<MarkdownViewer content={content.content} />
						)}

						{content.type === "exercise" && (
							<div className="space-y-6">
								<MarkdownViewer content={content.content} />

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
