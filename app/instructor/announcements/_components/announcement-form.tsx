"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	createAnnouncement,
	updateAnnouncement,
} from "@/app/_actions/announcements";
import { Button, Input, Textarea, useToast } from "@/components/ui";
import type { Announcement } from "@/types/database.types";

interface AnnouncementFormProps {
	announcement?: Announcement;
	mode: "create" | "edit";
}

export function AnnouncementForm({
	announcement,
	mode,
}: AnnouncementFormProps) {
	const router = useRouter();
	const toast = useToast();
	const [title, setTitle] = useState(announcement?.title ?? "");
	const [content, setContent] = useState(announcement?.content ?? "");
	const [publishNow, setPublishNow] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			if (mode === "create") {
				const result = await createAnnouncement(title, content, publishNow);
				if (!result.success) {
					toast.error("エラー", result.error ?? "お知らせの作成に失敗しました");
					return;
				}
				toast.success("作成完了", "お知らせを作成しました");
			} else if (announcement) {
				const result = await updateAnnouncement(
					announcement.id,
					title,
					content,
				);
				if (!result.success) {
					toast.error("エラー", result.error ?? "お知らせの更新に失敗しました");
					return;
				}
				toast.success("更新完了", "お知らせを更新しました");
			}

			router.push("/instructor/announcements");
			router.refresh();
		} catch {
			toast.error("エラー", "予期しないエラーが発生しました");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-2">
				<label htmlFor="title" className="text-sm font-medium">
					タイトル <span className="text-destructive">*</span>
				</label>
				<Input
					id="title"
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="お知らせのタイトルを入力"
					required
					disabled={isSubmitting}
				/>
			</div>

			<div className="space-y-2">
				<label htmlFor="content" className="text-sm font-medium">
					内容 <span className="text-destructive">*</span>
				</label>
				<Textarea
					id="content"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					placeholder="お知らせの内容を入力"
					rows={10}
					required
					disabled={isSubmitting}
				/>
			</div>

			{mode === "create" && (
				<div className="flex items-center gap-2">
					<input
						type="checkbox"
						id="publishNow"
						checked={publishNow}
						onChange={(e) => setPublishNow(e.target.checked)}
						disabled={isSubmitting}
						className="h-4 w-4 rounded border-gray-300"
					/>
					<label htmlFor="publishNow" className="text-sm">
						すぐに公開する
					</label>
				</div>
			)}

			<div className="flex gap-3">
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting
						? "保存中..."
						: mode === "create"
							? "作成する"
							: "更新する"}
				</Button>
				<Button
					type="button"
					variant="outline"
					onClick={() => router.back()}
					disabled={isSubmitting}
				>
					キャンセル
				</Button>
			</div>
		</form>
	);
}
