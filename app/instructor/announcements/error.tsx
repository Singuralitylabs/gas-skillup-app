"use client";

import { ErrorDisplay } from "@/components/ui";

export default function InstructorAnnouncementsError({
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
			title="お知らせの取得に失敗しました"
			description="お知らせの読み込み中にエラーが発生しました。もう一度お試しください。"
		/>
	);
}
