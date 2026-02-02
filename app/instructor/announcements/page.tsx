import Link from "next/link";
import { redirect } from "next/navigation";
import {
	getAllAnnouncements,
	getAnnouncementStats,
} from "@/app/_lib/supabase/queries/announcements";
import { getCurrentProfile } from "@/app/_lib/supabase/queries/profiles";
import {
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	EmptyAnnouncements,
} from "@/components/ui";
import { AnnouncementListItem } from "./_components";

export default async function InstructorAnnouncementsPage() {
	// 認証・権限チェック
	const profile = await getCurrentProfile();

	if (!profile) {
		redirect("/login");
	}

	if (profile.role !== "instructor") {
		redirect("/student/dashboard");
	}

	// データ取得
	const [announcements, stats] = await Promise.all([
		getAllAnnouncements(),
		getAnnouncementStats(),
	]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h1 className="text-3xl font-bold">お知らせ管理</h1>
					<p className="text-muted-foreground">
						お知らせの作成・編集・公開管理
					</p>
				</div>
				<Button asChild>
					<Link href="/instructor/announcements/new">新規作成</Link>
				</Button>
			</div>

			{/* Stats */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							総数
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold">{stats.total}</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							公開中
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold text-green-600">
							{stats.published}
						</p>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className="pb-2">
						<CardTitle className="text-sm font-medium text-muted-foreground">
							下書き
						</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-2xl font-bold text-muted-foreground">
							{stats.draft}
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Announcement List */}
			{announcements.length === 0 ? (
				<Card>
					<CardContent className="py-12">
						<EmptyAnnouncements />
						<div className="mt-4 text-center">
							<Button asChild>
								<Link href="/instructor/announcements/new">
									最初のお知らせを作成
								</Link>
							</Button>
						</div>
					</CardContent>
				</Card>
			) : (
				<div className="space-y-4">
					{announcements.map((announcement) => (
						<AnnouncementListItem
							key={announcement.id}
							announcement={announcement}
						/>
					))}
				</div>
			)}
		</div>
	);
}
