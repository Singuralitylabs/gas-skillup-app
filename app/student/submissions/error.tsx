"use client";

import { ErrorDisplay } from "@/components/ui";

export default function SubmissionsError({
	error,
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<ErrorDisplay
			error={error}
			reset={reset}
			title="提出履歴の取得に失敗しました"
			description="提出履歴の読み込み中にエラーが発生しました。もう一度お試しください。"
		/>
	);
}
