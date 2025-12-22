import { useState } from "react";
import { Badge, Progress } from "@/components/ui";
import type {
	ContentResponse,
	PhaseResponse,
	UserProgressResponse,
	WeekResponse,
} from "@/types";
import { WeekSection } from "./week-section";

interface PhaseSectionProps {
	phase: PhaseResponse;
	weeks: WeekResponse[];
	allContents: ContentResponse[];
	userProgress: UserProgressResponse[];
	defaultOpen?: boolean;
}

export function PhaseSection({
	phase,
	weeks,
	allContents,
	userProgress,
	defaultOpen = false,
}: PhaseSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	// Phase全体の進捗計算
	const phaseContents = allContents.filter((content) =>
		weeks.some((week) => week.id === content.weekId),
	);
	const totalContents = phaseContents.length;
	const completedContents = phaseContents.filter((content) =>
		userProgress.some((p) => p.contentId === content.id && p.completed),
	).length;
	const progressRate =
		totalContents > 0
			? Math.round((completedContents / totalContents) * 100)
			: 0;

	// ステータスの判定
	const status =
		progressRate === 100
			? "completed"
			: progressRate > 0
				? "in_progress"
				: "not_started";

	return (
		<div className="border-2 rounded-lg overflow-hidden">
			{/* Phase ヘッダー */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full p-5 bg-linear-to-r from-blue-200 to-indigo-200 dark:from-blue-950 dark:to-indigo-950 hover:from-blue-300 hover:to-indigo-300 dark:hover:from-blue-900 dark:hover:to-indigo-900 transition-colors"
			>
				<div className="flex items-center gap-4">
					<svg
						className={`w-6 h-6 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
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

					<div className="flex flex-col md:flex-row w-full md:justify-between gap-2">
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-3 mb-2">
								<h2 className="text-xl font-bold text-left text-gray-700">
									{phase.title}
								</h2>
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
							{phase.description && (
								<p className="text-sm text-gray-600 text-left">
									{phase.description}
								</p>
							)}
						</div>

						<div className="flex flex-col md:items-end gap-2 shrink-0">
							<span className="text-sm font-semibold text-gray-600">
								{completedContents}/{totalContents} コンテンツ
							</span>
							<div className="w-full md:w-32">
								<Progress value={progressRate} className="h-3" />
							</div>
							<span className="text-xs text-gray-600">{progressRate}%</span>
						</div>
					</div>
				</div>
			</button>

			{/* Phase の Weeks リスト */}
			{isOpen && (
				<div className="p-4 space-y-3 bg-background">
					{weeks.length === 0 ? (
						<p className="text-sm text-gray-600 text-center py-8">
							まだWeekが追加されていません
						</p>
					) : (
						weeks
							.sort((a, b) => a.orderIndex - b.orderIndex)
							.map((week, index) => {
								const weekContents = allContents
									.filter((content) => content.weekId === week.id)
									.sort((a, b) => a.orderIndex - b.orderIndex);

								// 最初のWeekをデフォルトで開く
								const defaultOpenWeek = index === 0 && isOpen;

								return (
									<WeekSection
										key={week.id}
										week={week}
										contents={weekContents}
										userProgress={userProgress}
										defaultOpen={defaultOpenWeek}
									/>
								);
							})
					)}
				</div>
			)}
		</div>
	);
}
