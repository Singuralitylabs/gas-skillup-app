import { Badge } from "@/components/ui";
import {
	getDashboardStats,
	getProgressDistribution,
	getRecentPendingSubmissions,
	getSubmissionTrend,
} from "@/app/_lib/supabase/queries";
import { formatDate } from "@/lib/utils/format";
import {
	KpiCard,
	ProgressDistributionChart,
	SubmissionTrendChart,
} from "../_components";

export default async function InstructorDashboardPage() {
	// 統計データを並列取得
	const [stats, progressDistribution, submissionTrend, recentSubmissions] =
		await Promise.all([
			getDashboardStats(),
			getProgressDistribution(),
			getSubmissionTrend(),
			getRecentPendingSubmissions(5),
		]);

	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">運営ダッシュボード</h1>
				<p className="text-muted-foreground">受講生の状況を確認</p>
			</div>

			{/* KPI Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<KpiCard
					title="総受講生数"
					value={`${stats.totalStudents}人`}
					description={`承認済み: ${stats.approvedStudents}人 / 未承認: ${stats.pendingStudents}人`}
				/>
				<KpiCard
					title="アクティブ受講生"
					value={`${stats.activeStudents}人`}
					description="過去7日間に学習した受講生"
				/>
				<KpiCard
					title="未確認課題"
					value={`${stats.pendingSubmissions}件`}
					description={`全提出数: ${stats.totalSubmissions}件`}
				/>
				<KpiCard
					title="平均進捗率"
					value={`${stats.averageProgress}%`}
					description={`完了コンテンツ: ${stats.totalCompletedContents} / ${stats.totalContents}`}
				/>
			</div>

			{/* Charts Grid */}
			<div className="grid gap-4 md:grid-cols-2">
				<ProgressDistributionChart data={progressDistribution} />
				<SubmissionTrendChart data={submissionTrend} />
			</div>

			{/* Recent Pending Submissions */}
			<div className="rounded-lg border border-border">
				<div className="border-b border-border p-6">
					<h2 className="text-xl font-semibold">最近の未確認課題</h2>
					<p className="text-sm text-muted-foreground">確認が必要な課題一覧</p>
				</div>
				<div className="divide-y divide-border">
					{recentSubmissions.length > 0 ? (
						recentSubmissions.map((submission) => (
							<div
								key={submission.id}
								className="flex items-center justify-between p-6 transition-colors hover:bg-muted/50"
							>
								<div className="space-y-1">
									<p className="text-sm font-medium">{submission.userName}</p>
									<p className="text-sm text-muted-foreground">
										{submission.contentTitle}
									</p>
								</div>
								<div className="flex items-center gap-4">
									<span className="text-sm text-muted-foreground">
										{formatDate(submission.createdAt)}
									</span>
									<Badge variant="warning">未確認</Badge>
								</div>
							</div>
						))
					) : (
						<div className="p-6 text-center text-muted-foreground">
							未確認の課題はありません
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
