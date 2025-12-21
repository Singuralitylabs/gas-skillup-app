"use client";

import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
	value?: number;
	max?: number;
	variant?: "default" | "success" | "warning" | "destructive";
	showLabel?: boolean;
}

function Progress({
	className,
	value = 0,
	max = 100,
	variant = "default",
	showLabel = false,
	...props
}: ProgressProps) {
	const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

	const variants = {
		default: "bg-primary",
		success: "bg-success",
		warning: "bg-warning",
		destructive: "bg-destructive",
	};

	return (
		<div className="w-full">
			<div
				className={cn(
					"relative h-4 w-full overflow-hidden rounded-full bg-secondary",
					className,
				)}
				{...props}
			>
				<div
					className={cn(
						"h-full transition-all duration-300 ease-in-out",
						variants[variant],
					)}
					style={{ width: `${percentage}%` }}
				/>
			</div>
			{showLabel && (
				<div className="mt-1 text-right text-xs text-muted-foreground">
					{Math.round(percentage)}%
				</div>
			)}
		</div>
	);
}

export { Progress };
