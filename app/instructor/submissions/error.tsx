"use client";

import { ErrorDisplay } from "@/components/ui";

export default function InstructorSubmissionsError({
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
			title="課題一覧の取得に失敗しました"
			description="提出された課題の読み込み中にエラーが発生しました。もう一度お試しください。"
		/>
	);
}
