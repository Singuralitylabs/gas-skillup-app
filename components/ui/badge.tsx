import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
	variant?: "default" | "secondary" | "success" | "warning" | "destructive";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
	const variants = {
		default: "bg-primary text-primary-foreground hover:bg-primary/80",
		secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
		success: "bg-success text-success-foreground hover:bg-success/80",
		warning: "bg-warning text-warning-foreground hover:bg-warning/80",
		destructive:
			"bg-destructive text-destructive-foreground hover:bg-destructive/80",
	};

	return (
		<div
			className={cn(
				"inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
				variants[variant],
				className,
			)}
			{...props}
		/>
	);
}

export { Badge };
