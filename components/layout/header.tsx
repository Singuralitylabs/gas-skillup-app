import Link from "next/link";
import { Button } from "@/components/ui";

export interface HeaderProps {
	userRole?: "student" | "instructor" | "admin";
	userName?: string;
}

export function Header({ userRole = "student", userName }: HeaderProps) {
	const studentNavItems = [
		{ href: "/student-dashboard", label: "ダッシュボード" },
		{ href: "/contents", label: "学習コンテンツ" },
		{ href: "/progress", label: "進捗確認" },
	];

	const instructorNavItems = [
		{ href: "/instructor-dashboard", label: "ダッシュボード" },
		{ href: "/students", label: "受講生管理" },
		{ href: "/contents-manage", label: "コンテンツ管理" },
		{ href: "/submissions", label: "課題確認" },
	];

	const navItems =
		userRole === "instructor" || userRole === "admin"
			? instructorNavItems
			: studentNavItems;

	return (
		<header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 items-center justify-between">
				{/* Logo */}
				<Link href="/" className="flex items-center space-x-2">
					<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
						<span className="text-lg font-bold">G</span>
					</div>
					<span className="hidden font-bold sm:inline-block">GAS学習支援</span>
				</Link>

				{/* Navigation */}
				<nav className="hidden md:flex md:items-center md:gap-6">
					{navItems.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							{item.label}
						</Link>
					))}
				</nav>

				{/* User Menu */}
				<div className="flex items-center gap-2">
					{userName ? (
						<>
							<span className="hidden text-sm text-muted-foreground sm:inline-block">
								{userName}
							</span>
							<Button variant="ghost" size="sm">
								ログアウト
							</Button>
						</>
					) : (
						<Button size="sm">ログイン</Button>
					)}
				</div>
			</div>
		</header>
	);
}
