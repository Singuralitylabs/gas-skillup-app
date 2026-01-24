"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github.css";

interface MarkdownViewerProps {
	content: string;
}

/**
 * Markdownコンテンツを表示するコンポーネント
 * react-markdownを使用した本格的なMarkdownレンダリング
 * - GitHub Flavored Markdown (GFM)対応
 * - コードシンタックスハイライト
 * - XSS対策のサニタイズ
 */
export function MarkdownViewer({ content }: MarkdownViewerProps) {
	return (
		<div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeSanitize, rehypeHighlight]}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
