import Link from "next/link";
import {
	Badge,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import type { Content, Submission } from "@/types/database.types";

interface SubmissionCardProps {
	submission: Submission;
	content: Content;
}

/**
 * 提出履歴カードコンポーネント
 */
export function SubmissionCard({ submission, content }: SubmissionCardProps) {
	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("ja-JP", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	const hasFeedback = submission.feedback !== null;

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
					<div className="flex-1 min-w-0">
						<CardTitle className="text-lg mb-2">
							<Link
								href={`/student/contents/${content.id}`}
								className="hover:text-blue-600 transition-colors wrap-break-word"
							>
								{content.title}
							</Link>
						</CardTitle>
						<div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 text-sm text-muted-foreground">
							<span>提出日時: {formatDate(submission.created_at)}</span>
							<span className="hidden sm:inline">•</span>
							<span>
								タイプ:{" "}
								{submission.submission_type === "code" ? "コード" : "URL"}
							</span>
						</div>
					</div>
					<Badge
						variant={hasFeedback ? "success" : "default"}
						className="self-start"
					>
						{hasFeedback ? "フィードバック済み" : "未レビュー"}
					</Badge>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* 提出内容 */}
				<div className="space-y-2">
					<h3 className="text-sm font-semibold">提出内容</h3>
					{submission.submission_type === "code" ? (
						<pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto">
							<code className="text-sm font-mono">{submission.content}</code>
						</pre>
					) : (
						<div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
							<a
								href={submission.content}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-blue-600 dark:text-blue-400 hover:underline break-all"
							>
								{submission.content}
								<svg
									className="w-3 h-3 inline ml-1"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<title>External link</title>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
									/>
								</svg>
							</a>
						</div>
					)}
				</div>

				{/* フィードバック */}
				{hasFeedback && (
					<div className="space-y-2">
						<h3 className="text-sm font-semibold">フィードバック</h3>
						<div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
							<p className="text-sm whitespace-pre-wrap">
								{submission.feedback}
							</p>
							{submission.feedback_at && (
								<p className="text-xs text-muted-foreground mt-2">
									{formatDate(submission.feedback_at)}
								</p>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
