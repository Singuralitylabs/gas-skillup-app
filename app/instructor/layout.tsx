import type { ReactNode } from "react";
import { Footer, Header, Sidebar, type SidebarItem } from "@/components/layout";

const instructorSidebarItems: SidebarItem[] = [
	{ href: "/instructor/dashboard", label: "ダッシュボード", icon: "📊" },
	{ href: "/instructor/students", label: "受講生管理", icon: "👥" },
	{ href: "/instructor/contents", label: "コンテンツ管理", icon: "📚" },
	{ href: "/instructor/submissions", label: "課題確認", icon: "📝" },
	{ href: "/instructor/announcements", label: "お知らせ管理", icon: "📢" },
];

export default function InstructorLayout({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header userRole="instructor" userName="佐藤 花子" />
			<div className="flex flex-1">
				<Sidebar items={instructorSidebarItems} />
				<main className="flex-1 p-6">{children}</main>
			</div>
			<Footer />
		</div>
	);
}
