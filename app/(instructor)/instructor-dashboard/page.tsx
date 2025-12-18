import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui";

export default function InstructorDashboardPage() {
	return (
		<div className="space-y-8">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">運営ダッシュボード</h1>
				<p className="text-muted-foreground">受講生の状況を確認</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader>
						<CardDescription>総受講生数</CardDescription>
						<CardTitle className="text-3xl">45人</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>アクティブ受講生</CardDescription>
						<CardTitle className="text-3xl">38人</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>未確認課題</CardDescription>
						<CardTitle className="text-3xl">12件</CardTitle>
					</CardHeader>
				</Card>
				<Card>
					<CardHeader>
						<CardDescription>平均進捗率</CardDescription>
						<CardTitle className="text-3xl">65%</CardTitle>
					</CardHeader>
				</Card>
			</div>

			{/* Recent Submissions */}
			<Card>
				<CardHeader>
					<CardTitle>最近の課題提出</CardTitle>
					<CardDescription>確認が必要な課題一覧</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{[
							{
								student: "山田 太郎",
								content: "Phase 2 - Week 3 課題",
								date: "2024-01-15",
								status: "pending",
							},
							{
								student: "田中 花子",
								content: "Phase 1 - Week 5 課題",
								date: "2024-01-15",
								status: "pending",
							},
							{
								student: "鈴木 一郎",
								content: "Phase 2 - Week 2 課題",
								date: "2024-01-14",
								status: "reviewed",
							},
						].map((submission, index) => (
							<div
								key={index}
								className="flex items-center justify-between rounded-lg border border-border p-4"
							>
								<div className="space-y-1">
									<p className="text-sm font-medium">{submission.student}</p>
									<p className="text-sm text-muted-foreground">
										{submission.content}
									</p>
								</div>
								<div className="flex items-center gap-4">
									<span className="text-sm text-muted-foreground">
										{submission.date}
									</span>
									<Badge
										variant={
											submission.status === "pending" ? "warning" : "success"
										}
									>
										{submission.status === "pending" ? "未確認" : "確認済み"}
									</Badge>
								</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
