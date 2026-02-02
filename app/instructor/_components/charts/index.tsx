"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui";

// チャートコンポーネントのローディング表示
function ChartSkeleton() {
	return (
		<div className="rounded-lg border bg-card">
			<div className="p-6 space-y-2">
				<Skeleton className="h-6 w-32" />
				<Skeleton className="h-4 w-48" />
			</div>
			<div className="p-6 pt-0">
				<Skeleton className="h-[300px] w-full" />
			</div>
		</div>
	);
}

// 動的インポートでRechartsを遅延読み込み
export const SubmissionTrendChart = dynamic(
	() =>
		import("./submission-trend-chart").then((mod) => mod.SubmissionTrendChart),
	{
		ssr: false,
		loading: () => <ChartSkeleton />,
	},
);

export const ProgressDistributionChart = dynamic(
	() =>
		import("./progress-distribution-chart").then(
			(mod) => mod.ProgressDistributionChart,
		),
	{
		ssr: false,
		loading: () => <ChartSkeleton />,
	},
);
