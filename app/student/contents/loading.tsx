import { Skeleton, SkeletonPhaseSection, SkeletonStats } from "@/components/ui";

export default function ContentsLoading() {
	return (
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="space-y-6">
				{/* ヘッダー */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div className="space-y-2">
						<Skeleton className="h-8 w-48" />
						<Skeleton className="h-4 w-72" />
					</div>
					<Skeleton className="h-10 w-44" />
				</div>

				{/* 進捗サマリー */}
				<div className="bg-primary/10 rounded-lg p-4 sm:p-6">
					<SkeletonStats count={3} className="bg-transparent border-0" />
				</div>

				{/* Phase リスト */}
				<div className="space-y-4">
					<SkeletonPhaseSection />
					<SkeletonPhaseSection />
					<SkeletonPhaseSection />
				</div>

				{/* 補足情報 */}
				<div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<Skeleton className="w-5 h-5 rounded-full shrink-0" />
						<div className="space-y-2 flex-1">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-3 w-full" />
							<Skeleton className="h-3 w-4/5" />
							<Skeleton className="h-3 w-3/4" />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
