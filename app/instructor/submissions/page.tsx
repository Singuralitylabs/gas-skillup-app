import {
	getSubmissionStats,
	getSubmissionsWithDetails,
} from "@/app/_lib/supabase/queries";
import { SubmissionsList } from "./_components/submissions-list";

export const metadata = {
	title: "課題管理 | GAS学習支援",
	description: "提出された課題の確認とフィードバック",
};

export default async function SubmissionsPage() {
	// データを並列取得
	const [submissions, stats] = await Promise.all([
		getSubmissionsWithDetails(),
		getSubmissionStats(),
	]);

	return <SubmissionsList submissions={submissions} stats={stats} />;
}
