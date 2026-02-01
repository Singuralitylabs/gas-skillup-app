import Link from "next/link";
import { redirect } from "next/navigation";
import { getPublishedAnnouncements } from "@/app/_lib/supabase/queries/announcements";
import { getCurrentProfile } from "@/app/_lib/supabase/queries/profiles";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	EmptyAnnouncements,
} from "@/components/ui";
import { formatDate } from "@/lib/utils/format";

export default async function StudentAnnouncementsPage() {
	// 認証・承認チェック
	const profile = await getCurrentProfile();

	if (!profile) {
		redirect("/login");
	}

	if (!profile.approved) {
		redirect("/pending-approval");
	}

	// 公開済みお知らせを取得
	const announcements = await getPublishedAnnouncements();

	return (
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="max-w-4xl mx-auto space-y-6">
				{/* Header */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold">お知らせ</h1>
						<p className="text-sm sm:text-base text-muted-foreground mt-1">
							講師からのお知らせ一覧
						</p>
					</div>
					<Button variant="outline" asChild className="w-full sm:w-auto">
						<Link href="/student/dashboard">ダッシュボードに戻る</Link>
					</Button>
				</div>

				{/* Announcement List */}
				{announcements.length === 0 ? (
					<Card>
						<CardContent className="py-12">
							<EmptyAnnouncements />
						</CardContent>
					</Card>
				) : (
					<div className="space-y-4">
						{announcements.map((announcement) => (
							<Card key={announcement.id}>
								<CardHeader className="pb-3">
									<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
										<CardTitle className="text-base font-semibold leading-tight flex-1">
											{announcement.title}
										</CardTitle>
										<span className="text-xs text-muted-foreground sm:whitespace-nowrap">
											{formatDate(announcement.published_at!)}
										</span>
									</div>
								</CardHeader>
								<CardContent>
									<p className="text-sm text-muted-foreground whitespace-pre-wrap">
										{announcement.content}
									</p>
								</CardContent>
							</Card>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
