"use client";

import { useEffect } from "react";
import { Button } from "./button";

export interface ErrorDisplayProps {
	/**
	 * エラーオブジェクト
	 */
	error: Error & { digest?: string };
	/**
	 * リセットコールバック
	 */
	reset?: () => void;
	/**
	 * タイトル
	 */
	title?: string;
	/**
	 * 説明文
	 */
	description?: string;
	/**
	 * フルページ表示
	 */
	fullPage?: boolean;
}

/**
 * ErrorDisplay コンポーネント
 *
 * エラー発生時の統一されたUI表示
 *
 * @example
 * ```tsx
 * <ErrorDisplay
 *   error={error}
 *   reset={reset}
 *   title="データの取得に失敗しました"
 * />
 * ```
 */
export function ErrorDisplay({
	error,
	reset,
	title = "エラーが発生しました",
	description = "予期しないエラーが発生しました。もう一度お試しください。",
	fullPage = false,
}: ErrorDisplayProps) {
	useEffect(() => {
		// エラーをログに記録（本番環境ではエラー監視サービスに送信）
		console.error("Error caught by ErrorDisplay:", error);
	}, [error]);

	const content = (
		<div className="text-center space-y-4">
			{/* エラーアイコン */}
			<div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
				<svg
					className="w-8 h-8 text-destructive"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>Error</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			</div>

			{/* タイトルと説明 */}
			<div className="space-y-2">
				<h2 className="text-xl font-semibold text-foreground">{title}</h2>
				<p className="text-muted-foreground max-w-md mx-auto">{description}</p>
			</div>

			{/* エラー詳細（開発環境のみ） */}
			{process.env.NODE_ENV === "development" && error.message && (
				<div className="bg-muted rounded-lg p-4 text-left max-w-md mx-auto">
					<p className="text-xs font-mono text-muted-foreground break-all">
						{error.message}
					</p>
					{error.digest && (
						<p className="text-xs font-mono text-muted-foreground mt-2">
							Digest: {error.digest}
						</p>
					)}
				</div>
			)}

			{/* アクションボタン */}
			<div className="flex flex-col sm:flex-row gap-3 justify-center">
				{reset && (
					<Button onClick={reset} variant="default">
						もう一度試す
					</Button>
				)}
				<Button variant="outline" onClick={() => (window.location.href = "/")}>
					ホームに戻る
				</Button>
			</div>
		</div>
	);

	if (fullPage) {
		return (
			<div className="min-h-screen flex items-center justify-center p-4">
				{content}
			</div>
		);
	}

	return (
		<div className="container py-8 px-4 sm:py-12 sm:px-6 lg:py-16 lg:px-8">
			{content}
		</div>
	);
}

/**
 * NotFoundDisplay コンポーネント
 *
 * 404ページ用の統一されたUI表示
 */
export function NotFoundDisplay({
	title = "ページが見つかりません",
	description = "お探しのページは存在しないか、移動した可能性があります。",
	backHref = "/",
	backLabel = "ホームに戻る",
}: {
	title?: string;
	description?: string;
	backHref?: string;
	backLabel?: string;
}) {
	return (
		<div className="min-h-screen flex items-center justify-center p-4">
			<div className="text-center space-y-4">
				{/* 404アイコン */}
				<div className="mx-auto w-24 h-24 rounded-full bg-muted flex items-center justify-center">
					<span className="text-4xl font-bold text-muted-foreground">404</span>
				</div>

				{/* タイトルと説明 */}
				<div className="space-y-2">
					<h1 className="text-2xl font-semibold text-foreground">{title}</h1>
					<p className="text-muted-foreground max-w-md mx-auto">
						{description}
					</p>
				</div>

				{/* アクションボタン */}
				<Button
					variant="default"
					onClick={() => (window.location.href = backHref)}
				>
					{backLabel}
				</Button>
			</div>
		</div>
	);
}
