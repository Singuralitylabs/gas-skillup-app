"use client";

import { ErrorDisplay } from "@/components/ui";

export default function ContentsError({
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
			title="コンテンツの取得に失敗しました"
			description="学習コンテンツの読み込み中にエラーが発生しました。ネットワーク接続を確認してもう一度お試しください。"
		/>
	);
}
