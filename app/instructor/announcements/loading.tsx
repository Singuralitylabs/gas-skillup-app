import { Skeleton, SkeletonCard, SkeletonStats } from "@/components/ui";

export default function InstructorAnnouncementsLoading() {
	return (
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="space-y-6">
				{/* ヘッダー */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2">
						<Skeleton className="h-8 w-40" />
						<Skeleton className="h-4 w-56" />
					</div>
					<Skeleton className="h-10 w-36" />
				</div>

				{/* 統計 */}
				<SkeletonStats count={3} />

				{/* お知らせリスト */}
				<div className="space-y-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<SkeletonCard key={i} />
					))}
				</div>
			</div>
		</div>
	);
}
