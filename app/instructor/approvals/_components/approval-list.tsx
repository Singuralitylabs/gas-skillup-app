"use client";

import { useState, useTransition } from "react";
import { Badge, Button, Input } from "@/components/ui";
import { formatDate } from "@/lib/utils/format";
import type { Profile } from "@/types/database.types";
import { approveUser, approveUsers, rejectUser } from "../actions";

type Props = {
	pendingUsers: Profile[];
};

export function ApprovalList({ pendingUsers }: Props) {
	const [isPending, startTransition] = useTransition();
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
	const [processingUserId, setProcessingUserId] = useState<string | null>(null);

	// 検索フィルター
	const filteredUsers = pendingUsers.filter((user) => {
		if (!searchQuery) return true;
		const query = searchQuery.toLowerCase();
		return (
			(user.name?.toLowerCase().includes(query) ?? false) ||
			user.email.toLowerCase().includes(query)
		);
	});

	// 全選択/解除
	const handleSelectAll = () => {
		if (selectedUsers.length === filteredUsers.length) {
			setSelectedUsers([]);
		} else {
			setSelectedUsers(filteredUsers.map((u) => u.id));
		}
	};

	// 個別選択
	const handleSelectUser = (userId: string) => {
		setSelectedUsers((prev) =>
			prev.includes(userId)
				? prev.filter((id) => id !== userId)
				: [...prev, userId],
		);
	};

	// 個別承認
	const handleApprove = (userId: string) => {
		setProcessingUserId(userId);
		startTransition(async () => {
			const result = await approveUser(userId);
			if (!result.success) {
				alert(`エラー: ${result.error}`);
			}
			setProcessingUserId(null);
			setSelectedUsers((prev) => prev.filter((id) => id !== userId));
		});
	};

	// 個別却下
	const handleReject = (userId: string) => {
		if (!confirm("このユーザーの登録を却下しますか？この操作は取り消せません。")) {
			return;
		}
		setProcessingUserId(userId);
		startTransition(async () => {
			const result = await rejectUser(userId);
			if (!result.success) {
				alert(`エラー: ${result.error}`);
			}
			setProcessingUserId(null);
			setSelectedUsers((prev) => prev.filter((id) => id !== userId));
		});
	};

	// 一括承認
	const handleBulkApprove = () => {
		if (selectedUsers.length === 0) return;
		if (!confirm(`${selectedUsers.length}件のユーザーを承認しますか？`)) {
			return;
		}
		startTransition(async () => {
			const result = await approveUsers(selectedUsers);
			if (!result.success) {
				alert(`エラー: ${result.error}`);
			}
			setSelectedUsers([]);
		});
	};

	if (pendingUsers.length === 0) {
		return (
			<div className="rounded-lg border border-border p-8 text-center">
				<p className="text-muted-foreground">承認待ちのユーザーはいません</p>
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Search and Actions */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex-1 max-w-md">
					<Input
						type="search"
						placeholder="名前またはメールアドレスで検索..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>
				{selectedUsers.length > 0 && (
					<div className="flex items-center gap-2">
						<span className="text-sm text-muted-foreground">
							{selectedUsers.length}件選択中
						</span>
						<Button
							onClick={handleBulkApprove}
							disabled={isPending}
							size="sm"
						>
							一括承認
						</Button>
					</div>
				)}
			</div>

			{/* Users Table */}
			<div className="rounded-lg border border-border">
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="border-b border-border bg-muted/50">
							<tr>
								<th className="p-4 text-left">
									<input
										type="checkbox"
										checked={
											selectedUsers.length === filteredUsers.length &&
											filteredUsers.length > 0
										}
										onChange={handleSelectAll}
										className="h-4 w-4 rounded border-border"
									/>
								</th>
								<th className="p-4 text-left text-sm font-medium">ユーザー名</th>
								<th className="p-4 text-left text-sm font-medium">
									メールアドレス
								</th>
								<th className="p-4 text-left text-sm font-medium">登録日時</th>
								<th className="p-4 text-left text-sm font-medium">ステータス</th>
								<th className="p-4 text-right text-sm font-medium">操作</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-border">
							{filteredUsers.length > 0 ? (
								filteredUsers.map((user) => (
									<tr
										key={user.id}
										className="transition-colors hover:bg-muted/50"
									>
										<td className="p-4">
											<input
												type="checkbox"
												checked={selectedUsers.includes(user.id)}
												onChange={() => handleSelectUser(user.id)}
												className="h-4 w-4 rounded border-border"
											/>
										</td>
										<td className="p-4">
											<p className="font-medium">{user.name || "未設定"}</p>
										</td>
										<td className="p-4">
											<p className="text-sm text-muted-foreground">
												{user.email}
											</p>
										</td>
										<td className="p-4">
											<p className="text-sm text-muted-foreground">
												{formatDate(user.created_at)}
											</p>
										</td>
										<td className="p-4">
											<Badge variant="warning">承認待ち</Badge>
										</td>
										<td className="p-4">
											<div className="flex items-center justify-end gap-2">
												<Button
													variant="outline"
													size="sm"
													onClick={() => handleApprove(user.id)}
													disabled={isPending && processingUserId === user.id}
												>
													{isPending && processingUserId === user.id
														? "処理中..."
														: "承認"}
												</Button>
												<Button
													variant="destructive"
													size="sm"
													onClick={() => handleReject(user.id)}
													disabled={isPending && processingUserId === user.id}
												>
													却下
												</Button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td
										colSpan={6}
										className="p-8 text-center text-muted-foreground"
									>
										該当するユーザーが見つかりません
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
