"use client";

import { ErrorDisplay } from "@/components/ui";

export default function InstructorError({
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
			title="データの取得に失敗しました"
			description="管理データの読み込み中にエラーが発生しました。もう一度お試しください。"
		/>
	);
}
