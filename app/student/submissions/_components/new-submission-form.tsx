"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSubmission } from "@/app/_actions/submissions";
import { Breadcrumbs, SubmissionForm, useToast } from "@/components/ui";
import type { Content, SubmissionType } from "@/types/database.types";

interface NewSubmissionFormProps {
	content: Content;
}

export function NewSubmissionForm({ content }: NewSubmissionFormProps) {
	const router = useRouter();
	const toast = useToast();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (
		submissionType: SubmissionType,
		submissionContent: string,
	) => {
		setIsSubmitting(true);

		try {
			const result = await createSubmission(
				content.id,
				submissionType,
				submissionContent,
			);

			if (!result.success) {
				toast.error("提出エラー", result.error || "提出に失敗しました");
				setIsSubmitting(false);
				return;
			}

			toast.success("提出完了", "課題を提出しました");
			// 提出履歴ページにリダイレクト
			router.push("/student/submissions");
		} catch {
			toast.error("エラー", "提出に失敗しました。もう一度お試しください。");
			setIsSubmitting(false);
		}
	};

	return (
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="max-w-3xl mx-auto space-y-4 sm:space-y-6">
				{/* パンくずリスト */}
				<Breadcrumbs
					items={[
						{ label: "コンテンツ一覧", href: "/student/contents" },
						{ label: content.title, href: `/student/contents/${content.id}` },
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
				/>

				{/* 注意事項 */}
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
