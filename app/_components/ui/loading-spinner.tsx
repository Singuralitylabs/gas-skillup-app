import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface LoadingSpinnerProps extends HTMLAttributes<HTMLDivElement> {
	size?: "sm" | "md" | "lg" | "xl";
	variant?: "default" | "primary" | "secondary";
	text?: string;
}

/**
 * LoadingSpinner コンポーネント
 *
 * データ読み込み中の表示に使用する回転アニメーション付きスピナー
 *
 * @example
 * ```tsx
 * <LoadingSpinner />
 * <LoadingSpinner size="lg" text="読み込み中..." />
 * <LoadingSpinner variant="primary" />
 * ```
 */
export function LoadingSpinner({
	size = "md",
	variant = "default",
	text,
	className,
	...props
}: LoadingSpinnerProps) {
	const sizeStyles = {
		sm: "w-4 h-4 border-2",
		md: "w-8 h-8 border-2",
		lg: "w-12 h-12 border-3",
		xl: "w-16 h-16 border-4",
	};

	const variantStyles = {
		default:
			"border-gray-200 border-t-gray-600 dark:border-gray-700 dark:border-t-gray-300",
		primary:
			"border-blue-200 border-t-blue-600 dark:border-blue-900 dark:border-t-blue-400",
		secondary:
			"border-purple-200 border-t-purple-600 dark:border-purple-900 dark:border-t-purple-400",
	};

	const textSizeStyles = {
		sm: "text-xs",
		md: "text-sm",
		lg: "text-base",
		xl: "text-lg",
	};

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center gap-3",
				className,
			)}
			role="status"
			aria-live="polite"
			aria-busy="true"
			{...props}
		>
			<div
				className={cn(
					"animate-spin rounded-full",
					sizeStyles[size],
					variantStyles[variant],
				)}
				aria-hidden="true"
			/>
			{text && (
				<p className={cn("text-muted-foreground", textSizeStyles[size])}>
					{text}
				</p>
			)}
			<span className="sr-only">読み込み中...</span>
		</div>
	);
}

/**
 * FullPageLoadingSpinner コンポーネント
 *
 * ページ全体のローディング表示に使用
 *
 * @example
 * ```tsx
 * <FullPageLoadingSpinner />
 * <FullPageLoadingSpinner text="データを取得しています..." />
 * ```
 */
export function FullPageLoadingSpinner({
	text = "読み込み中...",
	...props
}: Omit<LoadingSpinnerProps, "size">) {
	return (
		<div className="flex min-h-screen items-center justify-center">
			<LoadingSpinner size="lg" text={text} {...props} />
		</div>
	);
}

/**
 * InlineLoadingSpinner コンポーネント
 *
 * インラインで使用する小さなスピナー（ボタン内など）
 *
 * @example
 * ```tsx
 * <Button disabled>
 *   <InlineLoadingSpinner />
 *   送信中...
 * </Button>
 * ```
 */
export function InlineLoadingSpinner({
	className,
	...props
}: Omit<LoadingSpinnerProps, "size" | "text">) {
	return (
		<LoadingSpinner
			size="sm"
			className={cn("inline-flex", className)}
			{...props}
		/>
	);
}
