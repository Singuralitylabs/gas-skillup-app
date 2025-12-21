interface MarkdownViewerProps {
	content: string;
}

/**
 * Markdownコンテンツを表示するコンポーネント
 * Sprint 1: シンプルな実装（改行とコードブロックのみ対応）
 * Sprint 3: react-markdownなどのライブラリで置き換え予定
 */
export function MarkdownViewer({ content }: MarkdownViewerProps) {
	// 簡易的なMarkdown処理
	const processMarkdown = (text: string) => {
		// コードブロックを処理
		const parts = text.split(/(```[\s\S]*?```)/g);

		return parts.map((part, index) => {
			if (part.startsWith("```")) {
				// コードブロック
				const code = part.replace(/```(\w+)?\n?/g, "").replace(/```$/g, "");
				return (
					<pre
						key={index}
						className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4"
					>
						<code className="text-sm font-mono">{code}</code>
					</pre>
				);
			}

			// 通常のテキスト（改行を保持）
			return (
				<div key={index} className="whitespace-pre-wrap">
					{part}
				</div>
			);
		});
	};

	return (
		<div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
			{processMarkdown(content)}
		</div>
	);
}
