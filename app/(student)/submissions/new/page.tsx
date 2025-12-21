"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import { createSubmission, getCurrentUser, mockContents } from "@/lib/mock";
import type { ContentResponse, SubmissionType, UserResponse } from "@/types";

function NewSubmissionForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const contentId = searchParams.get("contentId");

	const [user, setUser] = useState<UserResponse | null>(null);
	const [content, setContent] = useState<ContentResponse | null>(null);
	const [submissionType, setSubmissionType] = useState<SubmissionType>("code");
	const [submissionContent, setSubmissionContent] = useState("");
	const [error, setError] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

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

		// contentIdが指定されていない場合
		if (!contentId) {
			router.push("/contents");
			return;
		}

		// コンテンツを取得
		const foundContent = mockContents.find((c) => c.id === contentId);
		if (!foundContent) {
			router.push("/contents");
			return;
		}

		// 演習タイプのコンテンツのみ提出可能
		if (foundContent.type !== "exercise") {
			router.push(`/contents/${contentId}`);
			return;
		}

		setContent(foundContent);
	}, [contentId, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!user || !content) return;

		// バリデーション
		if (!submissionContent.trim()) {
			setError("提出内容を入力してください");
			return;
		}

		if (submissionType === "url") {
			// URLの簡易バリデーション
			try {
				new URL(submissionContent);
			} catch {
				setError("有効なURLを入力してください");
				return;
			}
		}

		setError("");
		setIsSubmitting(true);

		try {
			// 課題を提出
			createSubmission(user.id, content.id, submissionType, submissionContent);

			// 少し待ってから遷移（UX向上）
			await new Promise((resolve) => setTimeout(resolve, 500));

			// 提出履歴ページにリダイレクト
			router.push("/submissions");
		} catch {
			setError("提出に失敗しました。もう一度お試しください。");
			setIsSubmitting(false);
		}
	};

	if (!user || !content) {
		return null;
	}

	return (
		<div className="container py-8">
			<div className="max-w-3xl mx-auto space-y-6">
				{/* パンくずリスト */}
				<nav className="flex items-center gap-2 text-sm text-muted-foreground">
					<Link
						href="/contents"
						className="hover:text-foreground transition-colors"
					>
						コンテンツ一覧
					</Link>
					<span>/</span>
					<Link
						href={`/contents/${content.id}`}
						className="hover:text-foreground transition-colors"
					>
						{content.title}
					</Link>
					<span>/</span>
					<span className="text-foreground">課題提出</span>
				</nav>

				{/* ヘッダー */}
				<div className="space-y-2">
					<h1 className="text-3xl font-bold">課題を提出する</h1>
					<p className="text-muted-foreground">コンテンツ: {content.title}</p>
				</div>

				{/* 提出フォーム */}
				<Card>
					<CardHeader>
						<CardTitle>提出内容</CardTitle>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit} className="space-y-6">
							{/* 提出タイプ選択 */}
							<div className="space-y-3">
								<label className="text-sm font-medium">提出タイプ</label>
								<div className="flex gap-6">
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="radio"
											name="submissionType"
											value="code"
											checked={submissionType === "code"}
											onChange={(e) =>
												setSubmissionType(e.target.value as SubmissionType)
											}
											className="w-4 h-4"
										/>
										<span>コード</span>
									</label>
									<label className="flex items-center gap-2 cursor-pointer">
										<input
											type="radio"
											name="submissionType"
											value="url"
											checked={submissionType === "url"}
											onChange={(e) =>
												setSubmissionType(e.target.value as SubmissionType)
											}
											className="w-4 h-4"
										/>
										<span>URL</span>
									</label>
								</div>
							</div>

							{/* 提出内容入力 */}
							<div className="space-y-3">
								<label htmlFor="content" className="text-sm font-medium block">
									{submissionType === "code"
										? "コードを入力してください"
										: "URLを入力してください"}
								</label>
								{submissionType === "code" ? (
									<textarea
										id="content"
										value={submissionContent}
										onChange={(e) => setSubmissionContent(e.target.value)}
										placeholder="ここにコードを入力してください"
										rows={12}
										className="w-full px-4 py-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								) : (
									<input
										type="url"
										id="content"
										value={submissionContent}
										onChange={(e) => setSubmissionContent(e.target.value)}
										placeholder="https://example.com/your-work"
										className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
										required
									/>
								)}
								<p className="text-xs text-muted-foreground">
									{submissionType === "code"
										? "作成したコードを貼り付けてください。提出後は編集できません。"
										: "デプロイしたアプリケーションやGitHubリポジトリのURLを入力してください。"}
								</p>
							</div>

							{/* エラーメッセージ */}
							{error && (
								<div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
									<p className="text-sm text-red-600 dark:text-red-400">
										{error}
									</p>
								</div>
							)}

							{/* アクションボタン */}
							<div className="flex items-center gap-4">
								<Button
									type="submit"
									disabled={isSubmitting}
									className="min-w-[120px]"
								>
									{isSubmitting ? "提出中..." : "提出する"}
								</Button>
								<Button
									type="button"
									variant="outline"
									onClick={() => router.back()}
									disabled={isSubmitting}
								>
									キャンセル
								</Button>
							</div>
						</form>
					</CardContent>
				</Card>

				{/* 注意事項 */}
				<div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<svg
							className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5"
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
						<div className="text-sm text-blue-700 dark:text-blue-300">
							<p className="font-medium mb-1">提出前の確認</p>
							<ul className="list-disc list-inside space-y-1">
								<li>提出内容が課題の要件を満たしているか確認してください</li>
								<li>コードの場合、動作確認を行ってから提出してください</li>
								<li>URLの場合、リンクが正しく動作するか確認してください</li>
								<li>提出後は編集できませんのでご注意ください</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default function NewSubmissionPage() {
	return (
		<Suspense
			fallback={
				<div className="container py-8">
					<div className="max-w-3xl mx-auto">
						<p className="text-center text-muted-foreground">読み込み中...</p>
					</div>
				</div>
			}
		>
			<NewSubmissionForm />
		</Suspense>
	);
}
