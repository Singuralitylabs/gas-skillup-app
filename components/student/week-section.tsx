import { useState } from "react";
import { Progress } from "@/components/ui";
import type {
	ContentResponse,
	UserProgressResponse,
	WeekResponse,
} from "@/types";
import { ContentCard } from "./content-card";

interface WeekSectionProps {
	week: WeekResponse;
	contents: ContentResponse[];
	userProgress: UserProgressResponse[];
	defaultOpen?: boolean;
}

export function WeekSection({
	week,
	contents,
	userProgress,
	defaultOpen = false,
}: WeekSectionProps) {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	// 進捗計算
	const totalContents = contents.length;
	const completedContents = contents.filter((content) =>
		userProgress.some((p) => p.contentId === content.id && p.completed),
	).length;
	const progressRate =
		totalContents > 0
			? Math.round((completedContents / totalContents) * 100)
			: 0;

	return (
		<div className="border rounded-lg overflow-hidden">
			{/* Week ヘッダー */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="w-full p-4 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors flex items-center justify-between"
			>
				<div className="flex items-center gap-3 flex-1 min-w-0">
					<svg
						className={`w-5 h-5 shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`}
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
					<div className="text-left flex-1 min-w-0">
						<h3 className="font-semibold text-base truncate text-gray-700">
							{week.title}
						</h3>
						{week.description && (
							<p className="text-sm text-gray-600 truncate">
								{week.description}
							</p>
						)}
					</div>
				</div>
				<div className="flex items-center gap-3 shrink-0 ml-4">
					<span className="text-sm font-medium text-gray-600">
						{completedContents}/{totalContents}
					</span>
					<div className="w-24 hidden sm:block">
						<Progress value={progressRate} className="h-2" />
					</div>
				</div>
			</button>

			{/* Week コンテンツリスト */}
			{isOpen && (
				<div className="p-4 space-y-2 bg-background">
					{contents.length === 0 ? (
						<p className="text-sm text-gray-600 text-center py-4">
							コンテンツがありません
						</p>
					) : (
						contents.map((content) => {
							const isCompleted = userProgress.some(
								(p) => p.contentId === content.id && p.completed,
							);
							return (
								<ContentCard
									key={content.id}
									content={content}
									isCompleted={isCompleted}
								/>
							);
						})
					)}
				</div>
			)}
		</div>
	);
}
