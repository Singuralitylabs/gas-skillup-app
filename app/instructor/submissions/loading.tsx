import { Skeleton, SkeletonStats, SkeletonTable } from "@/components/ui";

export default function InstructorSubmissionsLoading() {
	return (
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="space-y-6">
				{/* ヘッダー */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2">
						<Skeleton className="h-8 w-32" />
						<Skeleton className="h-4 w-56" />
					</div>
				</div>

				{/* 統計 */}
				<SkeletonStats count={4} />

				{/* フィルター */}
				<div className="flex gap-4">
					<Skeleton className="h-10 w-40" />
					<Skeleton className="h-10 w-40" />
					<Skeleton className="h-10 flex-1 max-w-xs" />
				</div>

				{/* テーブル */}
				<SkeletonTable rows={8} columns={5} />
			</div>
		</div>
	);
}
