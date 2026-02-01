import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getAnnouncementById } from "@/app/_lib/supabase/queries/announcements";
import { getCurrentProfile } from "@/app/_lib/supabase/queries/profiles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AnnouncementForm } from "../../_components";

interface EditAnnouncementPageProps {
	params: Promise<{
		id: string;
	}>;
}

export default async function EditAnnouncementPage({
	params,
}: EditAnnouncementPageProps) {
	const { id } = await params;

	// 認証・権限チェック
	const profile = await getCurrentProfile();

	if (!profile) {
		redirect("/login");
	}

	if (profile.role !== "instructor") {
		redirect("/student/dashboard");
	}

	// お知らせを取得
	const announcement = await getAnnouncementById(id);

	if (!announcement) {
		notFound();
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">お知らせ編集</h1>
					<p className="text-muted-foreground">お知らせを編集します</p>
				</div>
				<Link
					href="/instructor/announcements"
					className="text-sm text-primary hover:underline"
				>
					← 一覧に戻る
				</Link>
			</div>

			{/* Form */}
			<Card>
				<CardHeader>
					<CardTitle>お知らせ内容</CardTitle>
				</CardHeader>
				<CardContent>
					<AnnouncementForm mode="edit" announcement={announcement} />
				</CardContent>
			</Card>
		</div>
	);
}
