import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./button";

export interface EmptyStateProps {
	icon?: ReactNode;
	title: string;
	description?: string;
	action?: {
		label: string;
		onClick?: () => void;
		href?: string;
		variant?: ButtonProps["variant"];
	};
	className?: string;
}

/**
 * EmptyState コンポーネント
 *
 * データが空の場合に表示するプレースホルダー
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon={<FileIcon />}
 *   title="コンテンツがありません"
 *   description="まだコンテンツが登録されていません"
 *   action={{
 *     label: "コンテンツを追加",
 *     onClick: () => router.push('/contents/new')
 *   }}
 * />
 * ```
 */
export function EmptyState({
	icon,
	title,
	description,
	action,
	className,
}: EmptyStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-12 text-center",
				className,
			)}
		>
			{/* Icon */}
			{icon && (
				<div className="mb-4 text-gray-400 dark:text-gray-600">{icon}</div>
			)}

			{/* Title */}
			<h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
				{title}
			</h3>

			{/* Description */}
			{description && (
				<p className="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">
					{description}
				</p>
			)}

			{/* Action Button */}
			{action && (
				<Button
					variant={action.variant || "default"}
					onClick={action.onClick}
					{...(action.href && { asChild: true })}
				>
					{action.href ? (
						<a href={action.href}>{action.label}</a>
					) : (
						action.label
					)}
				</Button>
			)}
		</div>
	);
}

/**
 * NoDataIcon コンポーネント
 *
 * EmptyState で使用するデフォルトアイコン
 */
export function NoDataIcon({ className }: { className?: string }) {
	return (
		<svg
			className={cn("w-16 h-16", className)}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>データなし</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
			/>
		</svg>
	);
}

/**
 * NoSearchResultsIcon コンポーネント
 *
 * 検索結果がない場合のアイコン
 */
export function NoSearchResultsIcon({ className }: { className?: string }) {
	return (
		<svg
			className={cn("w-16 h-16", className)}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>検索結果なし</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
			/>
		</svg>
	);
}

/**
 * NoContentIcon コンポーネント
 *
 * コンテンツがない場合のアイコン
 */
export function NoContentIcon({ className }: { className?: string }) {
	return (
		<svg
			className={cn("w-16 h-16", className)}
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>コンテンツなし</title>
			<path
				strokeLinecap="round"
				strokeLinejoin="round"
				strokeWidth={1.5}
				d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
			/>
		</svg>
	);
}

/**
 * EmptySubmissions - 課題提出がない場合の表示
 */
export function EmptySubmissions({
	onSubmitClick,
}: {
	onSubmitClick?: () => void;
}) {
	return (
		<EmptyState
			icon={<NoContentIcon />}
			title="提出済みの課題がありません"
			description="まだ課題を提出していません。コンテンツページから演習課題に取り組んでみましょう。"
			action={
				onSubmitClick
					? {
							label: "コンテンツを見る",
							onClick: onSubmitClick,
							variant: "default",
						}
					: undefined
			}
		/>
	);
}

/**
 * EmptyAnnouncements - お知らせがない場合の表示
 */
export function EmptyAnnouncements() {
	return (
		<EmptyState
			icon={<NoDataIcon />}
			title="お知らせはありません"
			description="現在、新しいお知らせはありません。"
		/>
	);
}

/**
 * EmptyContents - コンテンツがない場合の表示
 */
export function EmptyContents() {
	return (
		<EmptyState
			icon={<NoContentIcon />}
			title="コンテンツがありません"
			description="学習コンテンツがまだ公開されていません。しばらくお待ちください。"
		/>
	);
}
