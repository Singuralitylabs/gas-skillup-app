import { type ReactNode, Suspense } from "react";
import { getCurrentProfile } from "@/app/_lib/supabase/queries/profiles";
import { Footer, Header, NotificationBellWrapper } from "@/components/layout";

export default async function StudentLayout({
	children,
}: {
	children: ReactNode;
}) {
	const profile = await getCurrentProfile();

	return (
		<div className="flex min-h-screen flex-col">
			<Header
				userRole="student"
				userName={profile?.name ?? "ゲスト"}
				notificationSlot={
					profile ? (
						<Suspense fallback={<NotificationBellSkeleton />}>
							<NotificationBellWrapper userId={profile.id} />
						</Suspense>
					) : null
				}
			/>
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}

function NotificationBellSkeleton() {
	return (
		<div className="p-2">
			<div className="w-5 h-5 rounded-full bg-muted animate-pulse" />
		</div>
	);
}
