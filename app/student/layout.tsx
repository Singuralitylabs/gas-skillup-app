import type { ReactNode } from "react";
import { Footer, Header } from "@/components/layout";

export default function StudentLayout({ children }: { children: ReactNode }) {
	return (
		<div className="flex min-h-screen flex-col">
			<Header userRole="student" userName="山田 太郎" />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
