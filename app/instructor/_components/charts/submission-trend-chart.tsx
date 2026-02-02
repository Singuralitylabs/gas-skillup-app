"use client";

import {
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui";

export interface SubmissionTrendChartProps {
	data: Array<{
		date: string;
		submissions: number;
		reviewed: number;
	}>;
}

export function SubmissionTrendChart({ data }: SubmissionTrendChartProps) {
	// 日付を表示用にフォーマット
	const formattedData = data.map((item) => ({
		...item,
		displayDate: new Date(item.date).toLocaleDateString("ja-JP", {
			month: "numeric",
			day: "numeric",
		}),
	}));

	return (
		<Card>
			<CardHeader>
				<CardTitle>課題提出推移</CardTitle>
				<CardDescription>過去7日間の提出・レビュー状況</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<LineChart data={formattedData}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="displayDate"
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
						/>
						<YAxis
							stroke="#888888"
							fontSize={12}
							tickLine={false}
							axisLine={false}
							tickFormatter={(value) => `${value}件`}
						/>
						<Tooltip
							content={({ active, payload }) => {
								if (active && payload && payload.length) {
									return (
										<div className="rounded-lg border bg-background p-2 shadow-sm">
											<div className="grid gap-2">
												<div className="flex flex-col">
													<span className="text-xs uppercase text-muted-foreground">
														日付
													</span>
													<span className="font-bold text-muted-foreground">
														{payload[0].payload.displayDate}
													</span>
												</div>
												<div className="flex flex-col">
													<span className="text-xs uppercase text-muted-foreground">
														提出数
													</span>
													<span className="font-bold text-primary">
														{payload[0].value}件
													</span>
												</div>
												<div className="flex flex-col">
													<span className="text-xs uppercase text-muted-foreground">
														レビュー済み
													</span>
													<span className="font-bold text-success">
														{payload[1]?.value || 0}件
													</span>
												</div>
											</div>
										</div>
									);
								}
								return null;
							}}
						/>
						<Line
							type="monotone"
							dataKey="submissions"
							stroke="currentColor"
							strokeWidth={2}
							className="stroke-primary"
							dot={{ fill: "currentColor", className: "fill-primary" }}
						/>
						<Line
							type="monotone"
							dataKey="reviewed"
							stroke="currentColor"
							strokeWidth={2}
							className="stroke-success"
							dot={{ fill: "currentColor", className: "fill-success" }}
						/>
					</LineChart>
				</ResponsiveContainer>
				<div className="mt-4 flex items-center justify-center gap-6 text-sm">
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-primary" />
						<span className="text-muted-foreground">提出数</span>
					</div>
					<div className="flex items-center gap-2">
						<div className="h-3 w-3 rounded-full bg-success" />
						<span className="text-muted-foreground">レビュー済み</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
