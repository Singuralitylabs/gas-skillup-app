import Link from "next/link";
import { notFound } from "next/navigation";
import {
	Badge,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import {
	calculateProgressRate,
	getContentsByWeek,
	getProgressByContent,
	getUserSubmissions,
	getWeeksByPhase,
	mockContents,
	mockPhases,
	mockUsers,
} from "@/lib/mock";
import { formatDate } from "@/lib/utils/format";

interface StudentDetailPageProps {
	params: {
		id: string;
	};
}

export default function StudentDetailPage({ params }: StudentDetailPageProps) {
	const { id } = params;

	// 受講生データを取得
	const student = mockUsers.find((user) => user.id === id);

	if (!student || student.role !== "student") {
		notFound();
	}

	// 進捗率と提出課題を取得
	const progressRate = calculateProgressRate(student.id);
	const submissions = getUserSubmissions(student.id);

	// Phase ごとの進捗を計算
	const phaseProgress = mockPhases.map((phase) => {
		const weeks = getWeeksByPhase(phase.id);
		const totalContents = weeks.reduce((acc, week) => {
			return acc + getContentsByWeek(week.id).length;
		}, 0);

		const completedContents = weeks.reduce((acc, week) => {
			const contents = getContentsByWeek(week.id);
			const completed = contents.filter((content) => {
				const progress = getProgressByContent(student.id, content.id);
				return progress?.completed;
			}).length;
			return acc + completed;
		}, 0);

		const phaseProgressRate =
			totalContents > 0
				? Math.round((completedContents / totalContents) * 100)
				: 0;

		return {
			phase,
			weeks: weeks.map((week) => {
				const contents = getContentsByWeek(week.id);
				const weekCompleted = contents.filter((content) => {
					const progress = getProgressByContent(student.id, content.id);
					return progress?.completed;
				}).length;
				const weekProgressRate =
					contents.length > 0
						? Math.round((weekCompleted / contents.length) * 100)
						: 0;

				return {
					week,
					contents: contents.map((content) => ({
						content,
						progress: getProgressByContent(student.id, content.id),
					})),
					completedCount: weekCompleted,
					totalCount: contents.length,
					progressRate: weekProgressRate,
				};
			}),
			completedCount: completedContents,
			totalCount: totalContents,
			progressRate: phaseProgressRate,
		};
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">{student.name}</h1>
					<p className="text-muted-foreground">{student.email}</p>
				</div>
				<Link href="/students" className="text-sm text-primary hover:underline">
					← 一覧に戻る
				</Link>
			</div>

			{/* Student Info */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardHeader>
						<p className="text-sm text-muted-foreground">承認状態</p>
					</CardHeader>
					<CardContent>
						<Badge variant={student.approved ? "success" : "warning"}>
							{student.approved ? "承認済み" : "未承認"}
						</Badge>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<p className="text-sm text-muted-foreground">全体進捗率</p>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{progressRate}%</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<p className="text-sm text-muted-foreground">課題提出数</p>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{submissions.length}件</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader>
						<p className="text-sm text-muted-foreground">登録日</p>
					</CardHeader>
					<CardContent>
						<p className="text-sm">{formatDate(student.createdAt)}</p>
					</CardContent>
				</Card>
			</div>

			{/* Progress Detail */}
			<div className="space-y-4">
				<h2 className="text-2xl font-bold">学習進捗詳細</h2>
				{phaseProgress.map((phaseData) => (
					<Card key={phaseData.phase.id}>
						<CardHeader>
							<div className="flex items-center justify-between">
								<CardTitle>{phaseData.phase.title}</CardTitle>
								<div className="flex items-center gap-2">
									<div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
										<div
											className="h-full bg-primary"
											style={{ width: `${phaseData.progressRate}%` }}
										/>
									</div>
									<span className="text-sm font-medium">
										{phaseData.progressRate}%
									</span>
								</div>
							</div>
							<p className="text-sm text-muted-foreground">
								{phaseData.completedCount} / {phaseData.totalCount}{" "}
								コンテンツ完了
							</p>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{phaseData.weeks.map((weekData) => (
									<div key={weekData.week.id} className="space-y-2">
										<div className="flex items-center justify-between">
											<h4 className="font-medium">{weekData.week.title}</h4>
											<span className="text-sm text-muted-foreground">
												{weekData.completedCount} / {weekData.totalCount} 完了
											</span>
										</div>
										<div className="ml-4 space-y-1">
											{weekData.contents.map(({ content, progress }) => (
												<div
													key={content.id}
													className="flex items-center justify-between text-sm py-1"
												>
													<div className="flex items-center gap-2">
														<span
															className={
																progress?.completed
																	? "text-green-600"
																	: "text-muted-foreground"
															}
														>
															{progress?.completed ? "✓" : "○"}
														</span>
														<span
															className={
																progress?.completed
																	? ""
																	: "text-muted-foreground"
															}
														>
															{content.title}
														</span>
														<Badge variant="secondary" className="text-xs">
															{content.type === "video"
																? "動画"
																: content.type === "text"
																	? "テキスト"
																	: "演習"}
														</Badge>
													</div>
													{progress?.completedAt && (
														<span className="text-xs text-muted-foreground">
															{formatDate(progress.completedAt)}
														</span>
													)}
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				))}
			</div>

			{/* Submissions */}
			<div className="space-y-4">
				<h2 className="text-2xl font-bold">課題提出履歴</h2>
				{submissions.length > 0 ? (
					<div className="space-y-2">
						{submissions.map((submission) => {
							const content = mockContents.find(
								(c) => c.id === submission.contentId,
							);
							return (
								<Card key={submission.id}>
									<CardHeader>
										<div className="flex items-center justify-between">
											<CardTitle className="text-base">
												{content?.title || "不明なコンテンツ"}
											</CardTitle>
											<Badge
												variant={submission.feedback ? "success" : "warning"}
											>
												{submission.feedback ? "フィードバック済み" : "未確認"}
											</Badge>
										</div>
										<p className="text-sm text-muted-foreground">
											提出日: {formatDate(submission.createdAt)}
										</p>
									</CardHeader>
									{submission.feedback && (
										<CardContent>
											<div className="space-y-2">
												<p className="text-sm font-medium">フィードバック:</p>
												<p className="text-sm text-muted-foreground whitespace-pre-wrap">
													{submission.feedback}
												</p>
												<p className="text-xs text-muted-foreground">
													{formatDate(submission.feedbackAt || "")}
												</p>
											</div>
										</CardContent>
									)}
								</Card>
							);
						})}
					</div>
				) : (
					<Card>
						<CardContent className="p-8 text-center text-muted-foreground">
							まだ課題提出がありません
						</CardContent>
					</Card>
				)}
			</div>
		</div>
	);
}
