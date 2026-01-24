"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { SubmissionWithDetails } from "@/app/_lib/supabase/queries/submissions";
import { Badge, Input, Select } from "@/components/ui";
import { formatDate } from "@/lib/utils/format";

type FeedbackFilter = "all" | "pending" | "reviewed";
type SortKey = "createdAt" | "student" | "content";
type SortOrder = "asc" | "desc";

type Props = {
	submissions: SubmissionWithDetails[];
	stats: {
		total: number;
		pending: number;
		reviewed: number;
	};
};

export function SubmissionsList({ submissions, stats }: Props) {
	const [searchQuery, setSearchQuery] = useState("");
	const [feedbackFilter, setFeedbackFilter] = useState<FeedbackFilter>("all");
	const [sortKey, setSortKey] = useState<SortKey>("createdAt");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

	// フィルタリングとソート
	const filteredAndSortedSubmissions = useMemo(() => {
		let filtered = submissions;

		// 検索フィルター
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(submission) =>
					(submission.user.name?.toLowerCase().includes(query) ?? false) ||
					submission.user.email.toLowerCase().includes(query) ||
					submission.contentInfo.title.toLowerCase().includes(query),
			);
		}

		// フィードバック状態フィルター
		if (feedbackFilter === "pending") {
			filtered = filtered.filter((submission) => !submission.feedback);
		} else if (feedbackFilter === "reviewed") {
			filtered = filtered.filter((submission) => submission.feedback);
		}

		// ソート
		const sorted = [...filtered].sort((a, b) => {
			let comparison = 0;

			switch (sortKey) {
				case "createdAt":
					comparison =
						new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
					break;
				case "student":
					comparison = (a.user.name ?? "").localeCompare(
						b.user.name ?? "",
						"ja",
					);
					break;
				case "content":
					comparison = a.contentInfo.title.localeCompare(
						b.contentInfo.title,
						"ja",
					);
					break;
			}

			return sortOrder === "asc" ? comparison : -comparison;
		});

		return sorted;
	}, [submissions, searchQuery, feedbackFilter, sortKey, sortOrder]);

	const handleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortKey(key);
			setSortOrder("desc");
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div>
				<h1 className="text-3xl font-bold">課題管理</h1>
				<p className="text-muted-foreground">
					提出された課題の確認とフィードバック
				</p>
			</div>

			{/* Filters */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex-1 max-w-md">
					<Input
						type="search"
						placeholder="受講生名またはコンテンツ名で検索..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex gap-2">
					<Select
						value={feedbackFilter}
						onChange={(e) =>
							setFeedbackFilter(e.target.value as FeedbackFilter)
						}
					>
						<option value="all">すべて</option>
						<option value="pending">未確認</option>
						<option value="reviewed">フィードバック済み</option>
					</Select>
				</div>
			</div>

			{/* Stats */}
			<div className="grid gap-4 sm:grid-cols-3">
				<div className="rounded-lg border border-border p-4">
					<p className="text-sm text-muted-foreground">総提出数</p>
					<p className="text-2xl font-bold">{stats.total}件</p>
				</div>
				<div className="rounded-lg border border-border p-4">
					<p className="text-sm text-muted-foreground">未確認</p>
					<p className="text-2xl font-bold text-warning">{stats.pending}件</p>
				</div>
				<div className="rounded-lg border border-border p-4">
					<p className="text-sm text-muted-foreground">フィードバック済み</p>
					<p className="text-2xl font-bold text-success">{stats.reviewed}件</p>
				</div>
			</div>

			{/* Submissions Table */}
			<div className="rounded-lg border border-border">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-border bg-muted/50">
							<tr>
								<th className="p-4 text-left text-sm font-medium">
									<button
										type="button"
										onClick={() => handleSort("student")}
										className="hover:underline"
									>
										受講生名{" "}
										{sortKey === "student" && (sortOrder === "asc" ? "↑" : "↓")}
									</button>
								</th>
								<th className="p-4 text-left text-sm font-medium">
									<button
										type="button"
										onClick={() => handleSort("content")}
										className="hover:underline"
									>
										課題名{" "}
										{sortKey === "content" && (sortOrder === "asc" ? "↑" : "↓")}
									</button>
								</th>
								<th className="p-4 text-left text-sm font-medium">
									提出タイプ
								</th>
								<th className="p-4 text-left text-sm font-medium">
									<button
										type="button"
										onClick={() => handleSort("createdAt")}
										className="hover:underline"
									>
										提出日{" "}
										{sortKey === "createdAt" &&
											(sortOrder === "asc" ? "↑" : "↓")}
									</button>
								</th>
								<th className="p-4 text-left text-sm font-medium">状態</th>
								<th className="p-4 text-right text-sm font-medium">操作</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{filteredAndSortedSubmissions.length > 0 ? (
								filteredAndSortedSubmissions.map((submission) => (
									<tr
										key={submission.id}
										className="transition-colors hover:bg-muted/50"
									>
										<td className="p-4">
											<p className="font-medium">
												{submission.user.name || "未設定"}
											</p>
											<p className="text-xs text-muted-foreground">
												{submission.user.email}
											</p>
										</td>
										<td className="p-4">
											<p className="text-sm">{submission.contentInfo.title}</p>
										</td>
										<td className="p-4">
											<Badge variant="secondary" className="text-xs">
												{submission.submission_type === "code"
													? "コード"
													: "URL"}
											</Badge>
										</td>
										<td className="p-4">
											<p className="text-sm text-muted-foreground">
												{formatDate(submission.created_at)}
											</p>
										</td>
										<td className="p-4">
											<Badge
												variant={submission.feedback ? "success" : "warning"}
											>
												{submission.feedback ? "完了" : "未確認"}
											</Badge>
										</td>
										<td className="p-4 text-right">
											<Link
												href={`/instructor/submissions/${submission.id}`}
												className="text-sm font-medium text-primary hover:underline"
											>
												{submission.feedback ? "詳細を表示" : "確認する"}
											</Link>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={6}
										className="p-8 text-center text-muted-foreground"
									>
										該当する課題提出が見つかりません
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
