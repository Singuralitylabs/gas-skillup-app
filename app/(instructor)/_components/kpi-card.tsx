import type { ReactNode } from "react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui";

export interface KpiCardProps {
	title: string;
	value: string | number;
	description?: string;
	icon?: ReactNode;
	trend?: {
		value: number;
		isPositive: boolean;
	};
}

export function KpiCard({
	title,
	value,
	description,
	icon,
	trend,
}: KpiCardProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardDescription>{title}</CardDescription>
					{icon && <div className="text-muted-foreground">{icon}</div>}
				</div>
				<CardTitle className="text-3xl">{value}</CardTitle>
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
				{trend && (
					<div className="mt-2 flex items-center gap-1 text-sm">
						<span
							className={trend.isPositive ? "text-green-600" : "text-red-600"}
						>
							{trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
						</span>
						<span className="text-muted-foreground">前週比</span>
					</div>
				)}
			</CardHeader>
		</Card>
	);
}
