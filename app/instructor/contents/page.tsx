import { getPhasesWithWeeksAndContents } from "@/app/_lib/supabase/queries";
import { ContentsList } from "./_components/contents-list";

export const metadata = {
	title: "コンテンツ管理 | GAS学習支援",
	description: "Phase、Week、コンテンツの管理",
};

export default async function ContentsManagementPage() {
	const phases = await getPhasesWithWeeksAndContents();

	return <ContentsList phases={phases} />;
}
