"use client";

import { NotFoundDisplay } from "@/components/ui";

export default function NotFound() {
	return (
		<NotFoundDisplay
			title="ページが見つかりません"
			description="お探しのページは存在しないか、移動した可能性があります。"
			backHref="/"
			backLabel="ホームに戻る"
		/>
	);
}
