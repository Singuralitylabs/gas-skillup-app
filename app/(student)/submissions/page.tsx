"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, EmptySubmissions } from "@/components/ui";
import {
	getCurrentUser,
	getStoredUserSubmissions,
	mockContents,
} from "@/lib/mock";
import type {
	ContentResponse,
	SubmissionResponse,
	UserResponse,
} from "@/types";
import { SubmissionCard } from "../_components";

export default function SubmissionsPage() {
	const router = useRouter();
	const [user, setUser] = useState<UserResponse | null>(null);
	const [submissions, setSubmissions] = useState<SubmissionResponse[]>([]);
	const [contentMap, setContentMap] = useState<Map<string, ContentResponse>>(
		new Map(),
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

		// 提出履歴を取得（新しい順）
		const userSubmissions = getStoredUserSubmissions(currentUser.id).sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		);
		setSubmissions(userSubmissions);

		// コンテンツ情報のマップを作成
		const map = new Map<string, ContentResponse>();
		for (const submission of userSubmissions) {
			const content = mockContents.find((c) => c.id === submission.contentId);
			if (content) {
				map.set(content.id, content);
			}
		}
		setContentMap(map);
	}, [router]);

	if (!user) {
		return null;
	}

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
					<Button
						variant="outline"
						onClick={() => router.push("/student-dashboard")}
						className="w-full sm:w-auto"
					>
						ダッシュボードに戻る
					</Button>
				</div>

				{/* 統計サマリー */}
				{submissions.length > 0 && (
					<div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg p-6">
						<div className="grid grid-cols-3 gap-4 text-center">
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
									総提出数
								</p>
								<p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
									{submissions.length}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
									レビュー済み
								</p>
								<p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
									{reviewedCount}
								</p>
							</div>
							<div>
								<p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
									未レビュー
								</p>
								<p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
									{unreviewedCount}
								</p>
							</div>
						</div>
					</div>
				)}

				{/* 提出履歴リスト */}
				{submissions.length === 0 ? (
					<EmptySubmissions onSubmitClick={() => router.push("/contents")} />
				) : (
					<div className="space-y-4">
						{submissions.map((submission) => {
							const content = contentMap.get(submission.contentId);
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
