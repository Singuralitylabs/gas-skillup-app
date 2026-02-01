import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentProfile } from "@/app/_lib/supabase/queries/profiles";
import { getSubmissionWithDetails } from "@/app/_lib/supabase/queries/submissions";
import { MarkdownRenderer } from "@/components/markdown-renderer";
import {
	Badge,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import { formatDate } from "@/lib/utils/format";
import { FeedbackForm } from "./_components";

interface SubmissionDetailPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function SubmissionDetailPage({
	params,
}: SubmissionDetailPageProps) {
	const { id } = await params;

	// 認証・権限チェック
	const profile = await getCurrentProfile();

	if (!profile) {
		redirect("/login");
	}

	if (profile.role !== "instructor") {
		redirect("/student/dashboard");
	}

	// 課題提出データを取得
	const submission = await getSubmissionWithDetails(id);

	if (!submission) {
		notFound();
	}

	const { user, contentInfo: content } = submission;

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
						<p className="font-medium">{user.name || "不明なユーザー"}</p>
						<p className="text-xs text-muted-foreground">{user.email}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<p className="text-sm text-muted-foreground">課題名</p>
					</CardHeader>
					<CardContent>
						<p className="text-sm">{content.title}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<p className="text-sm text-muted-foreground">提出日</p>
					</CardHeader>
					<CardContent>
						<p className="text-sm">{formatDate(submission.created_at)}</p>
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
							{submission.submission_type === "code" ? "コード" : "URL"}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					{submission.submission_type === "code" ? (
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
					{submission.feedback_at && (
						<p className="text-sm text-muted-foreground">
							送信日: {formatDate(submission.feedback_at)}
						</p>
					)}
				</CardHeader>
				<CardContent>
					<FeedbackForm
						submissionId={submission.id}
						existingFeedback={submission.feedback}
					/>
				</CardContent>
			</Card>

			{/* Course Content Reference */}
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
						<MarkdownRenderer content={content.content ?? ""} />
					)}
				</CardContent>
			</Card>
		</div>
	);
}
