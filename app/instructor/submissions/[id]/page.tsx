"use client";

import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useState } from "react";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Textarea,
} from "@/components/ui";
import { mockContents, mockSubmissions, mockUsers } from "@/lib/mock";
import { formatDate } from "@/lib/utils/format";

interface SubmissionDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default function SubmissionDetailPage({
	params,
}: SubmissionDetailPageProps) {
	const { id } = use(params);
	const router = useRouter();

	// 課題提出データを取得
	const submission = mockSubmissions.find((s) => s.id === id);

	if (!submission) {
		notFound();
	}

	const user = mockUsers.find((u) => u.id === submission.userId);
	const content = mockContents.find((c) => c.id === submission.contentId);

	// フィードバック入力状態
	const [feedback, setFeedback] = useState(submission.feedback || "");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmitFeedback = async () => {
		if (!feedback.trim()) {
			alert("フィードバックを入力してください");
			return;
		}

		setIsSubmitting(true);

		// TODO: 実際のAPI呼び出しに置き換える
		await new Promise((resolve) => setTimeout(resolve, 500));

		// モックデータを更新（実際はAPIで更新）
		const submissionIndex = mockSubmissions.findIndex((s) => s.id === id);
		if (submissionIndex !== -1) {
			mockSubmissions[submissionIndex].feedback = feedback;
			mockSubmissions[submissionIndex].feedbackAt = new Date().toISOString();
		}

		setIsSubmitting(false);
		alert("フィードバックを送信しました");
		router.push("/instructor/submissions");
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">課題詳細</h1>
					<p className="text-muted-foreground">
						提出内容の確認とフィードバック
					</p>
				</div>
				<Link
					href="/instructor/submissions"
					className="text-sm text-primary hover:underline"
				>
					← 一覧に戻る
				</Link>
			</div>

			{/* Submission Info */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader>
						<p className="text-sm text-muted-foreground">受講生</p>
					</CardHeader>
					<CardContent>
						<p className="font-medium">{user?.name || "不明なユーザー"}</p>
						<p className="text-xs text-muted-foreground">{user?.email}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<p className="text-sm text-muted-foreground">課題名</p>
					</CardHeader>
					<CardContent>
						<p className="text-sm">{content?.title || "不明なコンテンツ"}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<p className="text-sm text-muted-foreground">提出日</p>
					</CardHeader>
					<CardContent>
						<p className="text-sm">{formatDate(submission.createdAt)}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<p className="text-sm text-muted-foreground">状態</p>
					</CardHeader>
					<CardContent>
						<Badge variant={submission.feedback ? "success" : "warning"}>
							{submission.feedback ? "フィードバック済み" : "未確認"}
						</Badge>
					</CardContent>
				</Card>
			</div>

			{/* Submission Content */}
			<Card>
				<CardHeader>
					<CardTitle>提出内容</CardTitle>
					<div className="flex items-center gap-2">
						<Badge variant="secondary">
							{submission.submissionType === "code" ? "コード" : "URL"}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					{submission.submissionType === "code" ? (
						<pre className="rounded-lg bg-muted p-4 overflow-x-auto">
							<code className="text-sm">{submission.content}</code>
						</pre>
					) : (
						<div className="space-y-2">
							<p className="text-sm text-muted-foreground">提出URL:</p>
							<a
								href={submission.content}
								target="_blank"
								rel="noopener noreferrer"
								className="text-sm text-primary hover:underline break-all"
							>
								{submission.content}
							</a>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Feedback Section */}
			<Card>
				<CardHeader>
					<CardTitle>
						{submission.feedback ? "フィードバック" : "フィードバックを入力"}
					</CardTitle>
					{submission.feedbackAt && (
						<p className="text-sm text-muted-foreground">
							送信日: {formatDate(submission.feedbackAt)}
						</p>
					)}
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<Textarea
							value={feedback}
							onChange={(e) => setFeedback(e.target.value)}
							placeholder="課題に対するフィードバックを入力してください..."
							rows={8}
							className="w-full"
							disabled={isSubmitting}
						/>
						<div className="flex justify-end gap-2">
							<Button
								variant="secondary"
								onClick={() => router.push("/instructor/submissions")}
								disabled={isSubmitting}
							>
								キャンセル
							</Button>
							<Button onClick={handleSubmitFeedback} disabled={isSubmitting}>
								{isSubmitting
									? "送信中..."
									: submission.feedback
										? "フィードバックを更新"
										: "フィードバックを送信"}
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Course Content Reference */}
			{content && (
				<Card>
					<CardHeader>
						<CardTitle>課題内容（参考）</CardTitle>
					</CardHeader>
					<CardContent>
						{content.type === "video" ? (
							<div className="whitespace-pre-wrap text-sm text-muted-foreground">
								{content.content}
							</div>
						) : (
							<MarkdownRenderer content={content.content} />
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
