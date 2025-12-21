import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	Progress,
} from "@/components/ui";

interface ProgressCardProps {
	totalContents: number;
	completedContents: number;
	progressRate: number;
}

export function ProgressCard({
	totalContents,
	completedContents,
	progressRate,
}: ProgressCardProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>学習進捗</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<div className="flex items-center justify-between text-sm">
						<span className="text-muted-foreground">完了率</span>
						<span className="font-semibold text-lg">{progressRate}%</span>
					</div>
					<Progress value={progressRate} className="h-3" />
				</div>

				<div className="grid grid-cols-2 gap-4 pt-2">
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">完了</p>
						<p className="text-2xl font-bold text-green-600 dark:text-green-400">
							{completedContents}
						</p>
					</div>
					<div className="space-y-1">
						<p className="text-xs text-muted-foreground">残り</p>
						<p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
							{totalContents - completedContents}
						</p>
					</div>
				</div>

				<div className="pt-2 border-t">
					<p className="text-xs text-muted-foreground">
						全{totalContents}コンテンツ中 {completedContents}コンテンツ完了
					</p>
				</div>
			</CardContent>
		</Card>
	);
}
