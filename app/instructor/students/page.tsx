"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge, Input, Select } from "@/components/ui";
import { calculateProgressRate, mockUsers } from "@/lib/mock";
import { formatDate } from "@/lib/utils/format";

type SortKey = "name" | "progress" | "createdAt";
type SortOrder = "asc" | "desc";
type ApprovalFilter = "all" | "approved" | "pending";

export default function StudentsPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [approvalFilter, setApprovalFilter] = useState<ApprovalFilter>("all");
	const [sortKey, setSortKey] = useState<SortKey>("createdAt");
	const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

	// 受講生データの取得と進捗率計算
	const studentsWithProgress = useMemo(() => {
		const students = mockUsers.filter((user) => user.role === "student");
		return students.map((student) => ({
			...student,
			progressRate: calculateProgressRate(student.id),
		}));
	}, []);

	// フィルタリングとソート
	const filteredAndSortedStudents = useMemo(() => {
		let filtered = studentsWithProgress;

		// 検索フィルター
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(student) =>
					student.name.toLowerCase().includes(query) ||
					student.email.toLowerCase().includes(query),
			);
		}

		// 承認状態フィルター
		if (approvalFilter === "approved") {
			filtered = filtered.filter((student) => student.approved);
		} else if (approvalFilter === "pending") {
			filtered = filtered.filter((student) => !student.approved);
		}

		// ソート
		const sorted = [...filtered].sort((a, b) => {
			let comparison = 0;

			switch (sortKey) {
				case "name":
					comparison = a.name.localeCompare(b.name, "ja");
					break;
				case "progress":
					comparison = a.progressRate - b.progressRate;
					break;
				case "createdAt":
					comparison =
						new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
					break;
			}

			return sortOrder === "asc" ? comparison : -comparison;
		});

		return sorted;
	}, [studentsWithProgress, searchQuery, approvalFilter, sortKey, sortOrder]);

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
				<h1 className="text-3xl font-bold">受講生管理</h1>
				<p className="text-muted-foreground">全受講生の進捗状況を確認</p>
			</div>

			{/* Filters */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex-1 max-w-md">
					<Input
						type="search"
						placeholder="名前またはメールアドレスで検索..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				<div className="flex gap-2">
					<Select
						value={approvalFilter}
						onChange={(e) =>
							setApprovalFilter(e.target.value as ApprovalFilter)
						}
					>
						<option value="all">すべて</option>
						<option value="approved">承認済み</option>
						<option value="pending">未承認</option>
					</Select>
				</div>
			</div>

			{/* Stats */}
			<div className="grid gap-4 sm:grid-cols-3">
				<div className="rounded-lg border border-border p-4">
					<p className="text-sm text-muted-foreground">総受講生数</p>
					<p className="text-2xl font-bold">{studentsWithProgress.length}人</p>
				</div>
				<div className="rounded-lg border border-border p-4">
					<p className="text-sm text-muted-foreground">承認済み</p>
					<p className="text-2xl font-bold">
						{studentsWithProgress.filter((s) => s.approved).length}人
					</p>
				</div>
				<div className="rounded-lg border border-border p-4">
					<p className="text-sm text-muted-foreground">未承認</p>
					<p className="text-2xl font-bold">
						{studentsWithProgress.filter((s) => !s.approved).length}人
					</p>
				</div>
			</div>

			{/* Students Table */}
			<div className="rounded-lg border border-border">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-border bg-muted/50">
							<tr>
								<th className="p-4 text-left text-sm font-medium">
									<button
										type="button"
										onClick={() => handleSort("name")}
										className="hover:underline"
									>
										受講生名{" "}
										{sortKey === "name" && (sortOrder === "asc" ? "↑" : "↓")}
									</button>
								</th>
								<th className="p-4 text-left text-sm font-medium">
									メールアドレス
								</th>
								<th className="p-4 text-left text-sm font-medium">承認状態</th>
								<th className="p-4 text-left text-sm font-medium">
									<button
										type="button"
										onClick={() => handleSort("progress")}
										className="hover:underline"
									>
										進捗率{" "}
										{sortKey === "progress" &&
											(sortOrder === "asc" ? "↑" : "↓")}
									</button>
								</th>
								<th className="p-4 text-left text-sm font-medium">
									<button
										type="button"
										onClick={() => handleSort("createdAt")}
										className="hover:underline"
									>
										登録日{" "}
										{sortKey === "createdAt" &&
											(sortOrder === "asc" ? "↑" : "↓")}
									</button>
								</th>
								<th className="p-4 text-right text-sm font-medium">操作</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{filteredAndSortedStudents.length > 0 ? (
								filteredAndSortedStudents.map((student) => (
									<tr
										key={student.id}
										className="transition-colors hover:bg-muted/50"
									>
										<td className="p-4">
											<p className="font-medium">{student.name}</p>
										</td>
										<td className="p-4">
											<p className="text-sm text-muted-foreground">
												{student.email}
											</p>
										</td>
										<td className="p-4">
											<Badge variant={student.approved ? "success" : "warning"}>
												{student.approved ? "承認済み" : "未承認"}
											</Badge>
										</td>
										<td className="p-4">
											<div className="flex items-center gap-2">
												<div className="w-full max-w-[100px] h-2 bg-muted rounded-full overflow-hidden">
													<div
														className="h-full bg-primary"
														style={{ width: `${student.progressRate}%` }}
													/>
												</div>
												<span className="text-sm font-medium">
													{student.progressRate}%
												</span>
											</div>
										</td>
										<td className="p-4">
											<p className="text-sm text-muted-foreground">
												{formatDate(student.createdAt)}
											</p>
										</td>
										<td className="p-4 text-right">
											<Link
												href={`/instructor/students/${student.id}`}
												className="text-sm font-medium text-primary hover:underline"
											>
												詳細を表示
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
										該当する受講生が見つかりません
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
