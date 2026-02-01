"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { addFeedback } from "@/app/_actions/submissions";
import { Button, Textarea } from "@/components/ui";

interface FeedbackFormProps {
	submissionId: string;
	existingFeedback: string | null;
}

export function FeedbackForm({
	submissionId,
	existingFeedback,
}: FeedbackFormProps) {
	const router = useRouter();
	const [feedback, setFeedback] = useState(existingFeedback || "");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleSubmitFeedback = async () => {
		if (!feedback.trim()) {
			setError("フィードバックを入力してください");
			return;
		}

		setError("");
		setIsSubmitting(true);

		try {
			const result = await addFeedback(submissionId, feedback);

			if (!result.success) {
				setError(result.error || "フィードバックの送信に失敗しました");
				setIsSubmitting(false);
				return;
			}

			router.push("/instructor/submissions");
			router.refresh();
		} catch {
			setError("フィードバックの送信に失敗しました");
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-4">
			{error && (
				<div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-lg p-3 text-sm">
					{error}
				</div>
			)}
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
