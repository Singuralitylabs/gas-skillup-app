import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
	/**
	 * スケルトンのアニメーション効果
	 */
	animate?: boolean;
	/**
	 * シマーエフェクトを使用（より滑らかなアニメーション）
	 */
	shimmer?: boolean;
}

/**
 * Skeleton コンポーネント
 *
 * コンテンツ読み込み中のプレースホルダー表示
 *
 * @example
 * ```tsx
 * <Skeleton className="h-4 w-full" />
 * <Skeleton className="h-12 w-12 rounded-full" />
 * <Skeleton shimmer className="h-4 w-full" />
 * ```
 */
export function Skeleton({
	animate = true,
	shimmer = false,
	className,
	...props
}: SkeletonProps) {
	return (
		<div
			className={cn(
				"rounded-md",
				shimmer ? "shimmer" : "bg-muted",
				animate && !shimmer && "animate-pulse",
				className,
			)}
			aria-hidden="true"
			{...props}
		/>
	);
}

/**
 * SkeletonText コンポーネント
 *
 * テキスト行のスケルトン
 */
export function SkeletonText({
	lines = 1,
	className,
}: {
	lines?: number;
	className?: string;
}) {
	return (
		<div className={cn("space-y-2", className)}>
			{Array.from({ length: lines }).map((_, i) => (
				<Skeleton
					key={i}
					className={cn("h-4", i === lines - 1 && lines > 1 && "w-3/4")}
				/>
			))}
		</div>
	);
}

/**
 * SkeletonCard コンポーネント
 *
 * カード型コンテンツのスケルトン
 */
export function SkeletonCard({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"rounded-lg border bg-card p-4 sm:p-6 space-y-4",
				className,
			)}
		>
			<div className="flex items-center justify-between">
				<Skeleton className="h-6 w-1/3" />
				<Skeleton className="h-6 w-20" />
			</div>
			<SkeletonText lines={2} />
			<div className="flex gap-2">
				<Skeleton className="h-8 w-24" />
				<Skeleton className="h-8 w-24" />
			</div>
		</div>
	);
}

/**
 * SkeletonListItem コンポーネント
 *
 * リストアイテムのスケルトン
 */
export function SkeletonListItem({ className }: { className?: string }) {
	return (
		<div
			className={cn(
				"flex items-center gap-4 rounded-lg border bg-card p-4",
				className,
			)}
		>
			<Skeleton className="h-10 w-10 rounded-full shrink-0" />
			<div className="flex-1 space-y-2">
				<Skeleton className="h-4 w-1/2" />
				<Skeleton className="h-3 w-1/3" />
			</div>
			<Skeleton className="h-8 w-20" />
		</div>
	);
}

/**
 * SkeletonStats コンポーネント
 *
 * 統計カードのスケルトン
 */
export function SkeletonStats({
	count = 3,
	className,
}: {
	count?: number;
	className?: string;
}) {
	return (
		<div
			className={cn("grid gap-4", className)}
			style={{
				gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))`,
			}}
		>
			{Array.from({ length: count }).map((_, i) => (
				<div
					key={i}
					className="rounded-lg border bg-card p-4 sm:p-6 text-center space-y-2"
				>
					<Skeleton className="h-4 w-20 mx-auto" />
					<Skeleton className="h-8 w-16 mx-auto" />
				</div>
			))}
		</div>
	);
}

/**
 * SkeletonTable コンポーネント
 *
 * テーブルのスケルトン
 */
export function SkeletonTable({
	rows = 5,
	columns = 4,
	className,
}: {
	rows?: number;
	columns?: number;
	className?: string;
}) {
	return (
		<div className={cn("rounded-lg border overflow-hidden", className)}>
			{/* ヘッダー */}
			<div className="bg-muted/50 p-4 flex gap-4">
				{Array.from({ length: columns }).map((_, i) => (
					<Skeleton key={i} className="h-4 flex-1" />
				))}
			</div>
			{/* 行 */}
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<div key={rowIndex} className="p-4 flex gap-4 border-t">
					{Array.from({ length: columns }).map((_, colIndex) => (
						<Skeleton key={colIndex} className="h-4 flex-1" />
					))}
				</div>
			))}
		</div>
	);
}

/**
 * SkeletonPhaseSection コンポーネント
 *
 * Phase/アコーディオンセクションのスケルトン
 */
export function SkeletonPhaseSection({ className }: { className?: string }) {
	return (
		<div className={cn("rounded-lg border bg-card", className)}>
			<div className="p-4 sm:p-6 flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Skeleton className="h-10 w-10 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-5 w-48" />
						<Skeleton className="h-3 w-32" />
					</div>
				</div>
				<Skeleton className="h-6 w-6" />
			</div>
		</div>
	);
}

/**
 * PageSkeleton コンポーネント
 *
 * 汎用的なページローディングスケルトン
 */
export function PageSkeleton({
	title = true,
	stats = false,
	cards = 3,
	className,
}: {
	title?: boolean;
	stats?: boolean;
	cards?: number;
	className?: string;
}) {
	return (
		<div
			className={cn(
				"container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8",
				className,
			)}
		>
			<div className="space-y-6">
				{/* タイトル */}
				{title && (
					<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
						<div className="space-y-2">
							<Skeleton className="h-8 w-48" />
							<Skeleton className="h-4 w-64" />
						</div>
						<Skeleton className="h-10 w-32" />
					</div>
				)}

				{/* 統計 */}
				{stats && <SkeletonStats count={3} />}

				{/* カード一覧 */}
				<div className="space-y-4">
					{Array.from({ length: cards }).map((_, i) => (
						<SkeletonCard key={i} />
					))}
				</div>
			</div>
		</div>
	);
}
