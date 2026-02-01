import { Skeleton, SkeletonCard } from "@/components/ui";

export default function AnnouncementsLoading() {
	return (
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* ヘッダー */}
				<div className="space-y-2">
					<Skeleton className="h-8 w-32" />
					<Skeleton className="h-4 w-48" />
				</div>

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
