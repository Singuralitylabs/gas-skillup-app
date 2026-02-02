import Link from "next/link";
import { redirect } from "next/navigation";
import { getAllContents } from "@/app/_lib/supabase/queries/contents";
import { getCurrentProfile } from "@/app/_lib/supabase/queries/profiles";
import { getSubmissionsByUserId } from "@/app/_lib/supabase/queries/submissions";
import { Button, EmptySubmissions } from "@/components/ui";
import { SubmissionCard } from "../_components/submission-card";

export default async function SubmissionsPage() {
	// 認証・承認チェック
	const profile = await getCurrentProfile();

	if (!profile) {
		redirect("/login");
	}

	if (!profile.approved) {
		redirect("/pending-approval");
	}

	// 提出履歴を取得（新しい順）
	const submissions = await getSubmissionsByUserId(profile.id);

	// コンテンツ情報を取得
	const contents = await getAllContents();
	const contentMap = new Map(contents.map((c) => [c.id, c]));

	// フィードバック済み/未レビューの数を計算
	const reviewedCount = submissions.filter((s) => s.feedback !== null).length;
	const unreviewedCount = submissions.length - reviewedCount;

	return (
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* ヘッダー */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold">課題提出履歴</h1>
						<p className="text-sm sm:text-base text-muted-foreground mt-1">
							提出した課題とフィードバックを確認できます
						</p>
					</div>
					<Button variant="outline" asChild className="w-full sm:w-auto">
						<Link href="/student/dashboard">ダッシュボードに戻る</Link>
					</Button>
				</div>

				{/* 統計サマリー */}
				{submissions.length > 0 && (
					<div className="bg-primary/10 rounded-lg p-6">
						<div className="grid grid-cols-3 gap-4 text-center">
							<div>
								<p className="text-sm text-muted-foreground mb-1">総提出数</p>
								<p className="text-3xl font-bold text-foreground">
									{submissions.length}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground mb-1">
									レビュー済み
								</p>
								<p className="text-3xl font-bold text-foreground">
									{reviewedCount}
								</p>
							</div>
							<div>
								<p className="text-sm text-muted-foreground mb-1">未レビュー</p>
								<p className="text-3xl font-bold text-foreground">
									{unreviewedCount}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* 提出履歴リスト */}
				{submissions.length === 0 ? (
					<EmptySubmissions />
				) : (
					<div className="space-y-4">
						{submissions.map((submission) => {
							const content = contentMap.get(submission.content_id);
							if (!content) return null;

							return (
								<SubmissionCard
									key={submission.id}
									submission={submission}
									content={content}
								/>
							);
						})}
					</div>
				)}

				{/* ヘルプ情報 */}
				{submissions.length > 0 && (
					<div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
						<div className="flex items-start gap-3">
							<svg
								className="w-5 h-5 text-primary shrink-0 mt-0.5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>Information</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
							<div className="text-sm text-primary">
								<p className="font-medium mb-1">フィードバックについて</p>
								<ul className="list-disc list-inside space-y-1">
									<li>提出後、講師がレビューしてフィードバックを返します</li>
									<li>フィードバックがある場合、カードに表示されます</li>
									<li>不明点があれば、講師に質問してください</li>
								</ul>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
