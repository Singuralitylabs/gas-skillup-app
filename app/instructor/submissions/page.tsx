"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Input, Select } from "@/components/ui";
import { mockContents, mockSubmissions, mockUsers } from "@/lib/mock";
import { formatDate } from "@/lib/utils/format";

type FeedbackFilter = "all" | "pending" | "reviewed";
type SortKey = "createdAt" | "student" | "content";
type SortOrder = "asc" | "desc";

export default function SubmissionsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [feedbackFilter, setFeedbackFilter] = useState<FeedbackFilter>("all");
	const [sortKey, setSortKey] = useState<SortKey>("createdAt");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

	// 課題データに受講生名とコンテンツ名を追加
	const submissionsWithDetails = useMemo(() => {
		return mockSubmissions.map((submission) => {
			const user = mockUsers.find((u) => u.id === submission.userId);
			const content = mockContents.find((c) => c.id === submission.contentId);

			return {
				...submission,
				userName: user?.name || "不明なユーザー",
				userEmail: user?.email || "",
				contentTitle: content?.title || "不明なコンテンツ",
				contentType: content?.type || "exercise",
			};
		});
	}, []);

	// フィルタリングとソート
	const filteredAndSortedSubmissions = useMemo(() => {
		let filtered = submissionsWithDetails;

		// 検索フィルター
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(submission) =>
					submission.userName.toLowerCase().includes(query) ||
					submission.userEmail.toLowerCase().includes(query) ||
					submission.contentTitle.toLowerCase().includes(query),
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
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
					break;
				case "student":
					comparison = a.userName.localeCompare(b.userName, "ja");
					break;
				case "content":
					comparison = a.contentTitle.localeCompare(b.contentTitle, "ja");
					break;
			}

			return sortOrder === "asc" ? comparison : -comparison;
		});

		return sorted;
	}, [submissionsWithDetails, searchQuery, feedbackFilter, sortKey, sortOrder]);

	const handleSort = (key: SortKey) => {
		if (sortKey === key) {
			setSortOrder(sortOrder === "asc" ? "desc" : "asc");
		} else {
			setSortKey(key);
			setSortOrder("desc");
		}
	};

	// 統計計算
	const stats = useMemo(() => {
		const total = submissionsWithDetails.length;
		const pending = submissionsWithDetails.filter((s) => !s.feedback).length;
		const reviewed = submissionsWithDetails.filter((s) => s.feedback).length;

		return { total, pending, reviewed };
	}, [submissionsWithDetails]);

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
											<p className="font-medium">{submission.userName}</p>
											<p className="text-xs text-muted-foreground">
												{submission.userEmail}
											</p>
										</td>
										<td className="p-4">
											<p className="text-sm">{submission.contentTitle}</p>
										</td>
										<td className="p-4">
											<Badge variant="secondary" className="text-xs">
												{submission.submissionType === "code"
													? "コード"
													: "URL"}
											</Badge>
										</td>
										<td className="p-4">
											<p className="text-sm text-muted-foreground">
												{formatDate(submission.createdAt)}
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
