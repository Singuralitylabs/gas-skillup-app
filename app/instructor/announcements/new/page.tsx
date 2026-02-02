import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/app/_lib/supabase/queries/profiles";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { AnnouncementForm } from "../_components";

export default async function NewAnnouncementPage() {
	// 認証・権限チェック
	const profile = await getCurrentProfile();

	if (!profile) {
		redirect("/login");
	}

	if (profile.role !== "instructor") {
		redirect("/student/dashboard");
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">お知らせ作成</h1>
					<p className="text-muted-foreground">新しいお知らせを作成します</p>
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
					<AnnouncementForm mode="create" />
				</CardContent>
			</Card>
		</div>
	);
}
