import {
	Badge,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Progress,
} from "@/components/ui";

export default function StudentDashboardPage() {
	return (
		<div className="container py-8">
			<div className="space-y-8">
				{/* Header */}
				<div>
					<h1 className="text-3xl font-bold">ダッシュボード</h1>
					<p className="text-muted-foreground">学習状況を確認しましょう</p>
				</div>

				{/* Stats Grid */}
				<div className="grid gap-4 md:grid-cols-3">
					<Card>
						<CardHeader>
							<CardDescription>総学習時間</CardDescription>
							<CardTitle className="text-3xl">24時間</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader>
							<CardDescription>完了コンテンツ</CardDescription>
							<CardTitle className="text-3xl">12/30</CardTitle>
						</CardHeader>
					</Card>
					<Card>
						<CardHeader>
							<CardDescription>進捗率</CardDescription>
							<CardTitle className="text-3xl">40%</CardTitle>
						</CardHeader>
					</Card>
				</div>

				{/* Phase Progress */}
				<Card>
					<CardHeader>
						<CardTitle>学習フェーズ進捗</CardTitle>
						<CardDescription>各フェーズの進捗状況</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Phase 1: 基礎編</span>
								<Badge variant="success">完了</Badge>
							</div>
							<Progress value={100} variant="success" showLabel />
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Phase 2: 応用編</span>
								<Badge variant="default">学習中</Badge>
							</div>
							<Progress value={60} variant="default" showLabel />
						</div>
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<span className="text-sm font-medium">Phase 3: 実践編</span>
								<Badge variant="secondary">未開始</Badge>
							</div>
							<Progress value={0} variant="secondary" showLabel />
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
