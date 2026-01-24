"use client";

import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github.css";

interface MarkdownRendererProps {
	content: string;
	className?: string;
}

export function MarkdownRenderer({
	content,
	className = "",
}: MarkdownRendererProps) {
	return (
		<div className={`prose prose-sm max-w-none dark:prose-invert ${className}`}>
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[rehypeSanitize, rehypeHighlight]}
			>
				{content}
			</ReactMarkdown>
		</div>
	);
}
