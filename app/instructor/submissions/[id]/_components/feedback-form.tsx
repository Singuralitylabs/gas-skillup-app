"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addFeedback } from "@/app/_actions/submissions";
import { Button, Textarea, useToast } from "@/components/ui";

interface FeedbackFormProps {
	submissionId: string;
	existingFeedback: string | null;
}

export function FeedbackForm({
	submissionId,
	existingFeedback,
}: FeedbackFormProps) {
	const router = useRouter();
	const toast = useToast();
	const [feedback, setFeedback] = useState(existingFeedback || "");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmitFeedback = async () => {
		if (!feedback.trim()) {
			toast.warning("入力エラー", "フィードバックを入力してください");
			return;
		}

		setIsSubmitting(true);

		try {
			const result = await addFeedback(submissionId, feedback);

			if (!result.success) {
				toast.error(
					"エラー",
					result.error || "フィードバックの送信に失敗しました",
				);
				setIsSubmitting(false);
				return;
			}

			toast.success("送信完了", "フィードバックを送信しました");
			router.push("/instructor/submissions");
			router.refresh();
		} catch {
			toast.error("エラー", "フィードバックの送信に失敗しました");
			setIsSubmitting(false);
		}
	};

	return (
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
						: existingFeedback
							? "フィードバックを更新"
							: "フィードバックを送信"}
				</Button>
			</div>
		</div>
	);
}
