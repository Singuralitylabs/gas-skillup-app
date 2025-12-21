"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Breadcrumbs, SubmissionForm } from "@/components/ui";
import { createSubmission, getCurrentUser, mockContents } from "@/lib/mock";
import type { ContentResponse, SubmissionType, UserResponse } from "@/types";

function NewSubmissionForm() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const contentId = searchParams.get("contentId");

	const [user, setUser] = useState<UserResponse | null>(null);
	const [content, setContent] = useState<ContentResponse | null>(null);
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

	const handleSubmit = async (
		submissionType: SubmissionType,
		submissionContent: string,
	) => {
		if (!user || !content) return;

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
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
				{/* パンくずリスト */}
				<Breadcrumbs
					items={[
						{ label: "コンテンツ一覧", href: "/contents" },
						{ label: content.title, href: `/contents/${content.id}` },
						{ label: "課題提出" },
					]}
				/>

				{/* ヘッダー */}
				<div className="space-y-2">
					<h1 className="text-2xl sm:text-3xl font-bold">課題を提出する</h1>
					<p className="text-sm sm:text-base text-muted-foreground">
						コンテンツ: {content.title}
					</p>
				</div>

				{/* 提出フォーム */}
				<SubmissionForm
					onSubmit={handleSubmit}
					isSubmitting={isSubmitting}
					onCancel={() => router.back()}
					contentTitle={content.title}
					error={error}
				/>

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
				<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
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
