import { redirect } from "next/navigation";
import { getContentById } from "@/app/_lib/supabase/queries/contents";
import { getCurrentProfile } from "@/app/_lib/supabase/queries/profiles";
import { NewSubmissionForm } from "../_components";

interface NewSubmissionPageProps {
	searchParams: Promise<{
		contentId?: string;
	}>;
}

export default async function NewSubmissionPage({
	searchParams,
}: NewSubmissionPageProps) {
	const { contentId } = await searchParams;

	// 認証・承認チェック
	const profile = await getCurrentProfile();

	if (!profile) {
		redirect("/login");
	}

	if (!profile.approved) {
		redirect("/pending-approval");
	}

	// contentIdが指定されていない場合
	if (!contentId) {
		redirect("/student/contents");
	}

	// コンテンツを取得
	const content = await getContentById(contentId);

	if (!content) {
		redirect("/student/contents");
	}

	// 演習タイプのコンテンツのみ提出可能
	if (content.type !== "exercise") {
		redirect(`/student/contents/${contentId}`);
	}

	return <NewSubmissionForm content={content} />;
}
