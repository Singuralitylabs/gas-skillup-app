"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
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

export interface ProgressDistributionChartProps {
	data: Array<{
		range: string;
		count: number;
		percentage: number;
	}>;
}

export function ProgressDistributionChart({
	data,
}: ProgressDistributionChartProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>進捗率分布</CardTitle>
				<CardDescription>受講生の学習進捗状況</CardDescription>
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={300}>
					<BarChart data={data}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="range"
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
							tickFormatter={(value) => `${value}人`}
						/>
						<Tooltip
							content={({ active, payload }) => {
								if (active && payload && payload.length) {
									return (
										<div className="rounded-lg border bg-background p-2 shadow-sm">
											<div className="grid grid-cols-2 gap-2">
												<div className="flex flex-col">
													<span className="text-[0.70rem] uppercase text-muted-foreground">
														進捗率
													</span>
													<span className="font-bold text-muted-foreground">
														{payload[0].payload.range}
													</span>
												</div>
												<div className="flex flex-col">
													<span className="text-[0.70rem] uppercase text-muted-foreground">
														受講生数
													</span>
													<span className="font-bold">
														{payload[0].value}人
													</span>
												</div>
											</div>
										</div>
									);
								}
								return null;
							}}
						/>
						<Bar
							dataKey="count"
							fill="currentColor"
							radius={[4, 4, 0, 0]}
							className="fill-primary"
						/>
					</BarChart>
				</ResponsiveContainer>
			</CardContent>
		</Card>
	);
}
