"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SidebarItem {
	href: string;
	label: string;
	icon?: string;
}

export interface SidebarProps {
	items: SidebarItem[];
	className?: string;
}

export function Sidebar({ items, className }: SidebarProps) {
	const pathname = usePathname();

	return (
		<aside
			className={cn("w-64 border-r border-border bg-background p-4", className)}
		>
			<nav className="space-y-1">
				{items.map((item) => {
					const isActive = pathname === item.href;

					return (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
								isActive
									? "bg-primary text-primary-foreground"
									: "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
							)}
						>
							{item.icon && <span>{item.icon}</span>}
							<span>{item.label}</span>
						</Link>
					);
				})}
			</nav>
		</aside>
	);
}
