import Link from "next/link";
import { Badge } from "@/components/ui";
import type { ContentResponse } from "@/types";

interface ContentCardProps {
	content: ContentResponse;
	isCompleted: boolean;
}

/**
 * コンテンツタイプに応じたアイコンを返す
 */
function getContentIcon(type: string): string {
	switch (type) {
		case "video":
			return "🎥";
		case "text":
			return "📄";
		case "exercise":
			return "✏️";
		default:
			return "📌";
	}
}

/**
 * コンテンツタイプに応じたバッジラベルを返す
 */
function getContentTypeLabel(type: string): string {
	switch (type) {
		case "video":
			return "動画";
		case "text":
			return "テキスト";
		case "exercise":
			return "演習";
		default:
			return "その他";
	}
}

export function ContentCard({ content, isCompleted }: ContentCardProps) {
	return (
		<Link href={`/student/contents/${content.id}`} className="block group">
			<div
				className={`
					flex items-center gap-3 p-4 rounded-lg border transition-all
					hover:border-primary hover:shadow-md
					${isCompleted ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800" : "bg-gray-200 dark:bg-gray-800 border-gray-200 dark:border-gray-800"}
				`}
			>
				{/* 完了チェック */}
				<div className="shrink-0">
					{isCompleted ? (
						<div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
							<svg
								className="w-4 h-4 text-white"
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
						</div>
					) : (
						<div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
					)}
				</div>

				{/* コンテンツ情報 */}
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="text-xl" role="img" aria-label={content.type}>
							{getContentIcon(content.type)}
						</span>
						<h3 className="font-medium text-sm group-hover:text-primary transition-colors truncate text-gray-700">
							{content.title}
						</h3>
					</div>
					<div className="flex items-center gap-2">
						<Badge variant="default" className="text-xs">
							{getContentTypeLabel(content.type)}
						</Badge>
						{isCompleted && (
							<span className="text-xs text-green-600 dark:text-green-400">
								完了済み
							</span>
						)}
					</div>
				</div>

				{/* 矢印アイコン */}
				<div className="shrink-0">
					<svg
						className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
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
				</div>
			</div>
		</Link>
	);
}
