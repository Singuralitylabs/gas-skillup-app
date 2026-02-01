"use client";

import { ErrorDisplay } from "@/components/ui";

export default function GlobalError({
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
			title="予期しないエラーが発生しました"
			description="アプリケーションでエラーが発生しました。もう一度お試しください。"
			fullPage
		/>
	);
}
