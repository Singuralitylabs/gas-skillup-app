import { createClient } from "@/app/_lib/supabase/server";
import { ApprovalList } from "./_components/approval-list";

export const metadata = {
	title: "承認管理 | GAS学習支援",
	description: "ユーザーの承認管理",
};

async function getPendingUsers() {
	const supabase = await createClient();

	const { data, error } = await supabase
		.from("profiles")
		.select("*")
		.eq("role", "student")
		.eq("approved", false)
		.order("created_at", { ascending: false });

	if (error) {
		console.error("Error fetching pending users:", error);
		return [];
	}

	return data;
}

async function getApprovalStats() {
	const supabase = await createClient();

	// 承認待ち件数
	const { count: pendingCount } = await supabase
		.from("profiles")
		.select("*", { count: "exact", head: true })
		.eq("role", "student")
		.eq("approved", false);

	// 承認済み件数
	const { count: approvedCount } = await supabase
		.from("profiles")
		.select("*", { count: "exact", head: true })
		.eq("role", "student")
		.eq("approved", true);

	// 今週の承認数（過去7日間）
	const weekAgo = new Date();
	weekAgo.setDate(weekAgo.getDate() - 7);

	const { count: weeklyApproved } = await supabase
		.from("profiles")
		.select("*", { count: "exact", head: true })
		.eq("role", "student")
		.eq("approved", true)
		.gte("updated_at", weekAgo.toISOString());

	return {
		pending: pendingCount ?? 0,
		approved: approvedCount ?? 0,
		weeklyApproved: weeklyApproved ?? 0,
	};
}

export default async function ApprovalsPage() {
	const [pendingUsers, stats] = await Promise.all([
		getPendingUsers(),
		getApprovalStats(),
	]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">承認管理</h1>
				<p className="text-muted-foreground">
					新規登録ユーザーの承認・却下を管理
				</p>
			</div>

			{/* Stats */}
			<div className="grid gap-4 sm:grid-cols-3">
				<div className="rounded-lg border border-border p-4">
					<p className="text-sm text-muted-foreground">承認待ち</p>
					<p className="text-2xl font-bold text-warning">{stats.pending}件</p>
				</div>
				<div className="rounded-lg border border-border p-4">
					<p className="text-sm text-muted-foreground">承認済み（総数）</p>
					<p className="text-2xl font-bold text-success">{stats.approved}人</p>
				</div>
				<div className="rounded-lg border border-border p-4">
					<p className="text-sm text-muted-foreground">今週の承認</p>
					<p className="text-2xl font-bold">{stats.weeklyApproved}件</p>
				</div>
			</div>

			{/* Pending Users List */}
			<ApprovalList pendingUsers={pendingUsers} />
		</div>
	);
}
