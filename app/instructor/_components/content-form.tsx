"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea } from "@/app/_components/ui";
import { getWeeksByPhase, mockPhases, mockWeeks } from "@/app/_lib/mock";
import type { ContentResponse, ContentType } from "@/types";

export interface ContentFormProps {
	content?: ContentResponse;
	defaultWeekId?: string;
	onSave: (data: Partial<ContentResponse> & { weekId: string }) => void;
	onCancel: () => void;
}

export function ContentForm({
	content,
	defaultWeekId,
	onSave,
	onCancel,
}: ContentFormProps) {
	const [weekId, setWeekId] = useState(content?.weekId || defaultWeekId || "");
	const [type, setType] = useState<ContentType>(content?.type || "video");
	const [title, setTitle] = useState(content?.title || "");
	const [contentText, setContentText] = useState(content?.content || "");
	const [orderIndex, setOrderIndex] = useState(
		content?.orderIndex?.toString() || "1",
	);

	// Get week's phase for better UX
	const selectedWeek = mockWeeks.find((w) => w.id === weekId);
	const selectedPhase = mockPhases.find((p) => p.id === selectedWeek?.phaseId);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!weekId) {
			alert("Weekを選択してください");
			return;
		}

		if (!title.trim()) {
			alert("タイトルを入力してください");
			return;
		}

		if (!contentText.trim()) {
			alert("コンテンツ内容を入力してください");
			return;
		}

		const orderNum = Number.parseInt(orderIndex, 10);
		if (Number.isNaN(orderNum) || orderNum < 1) {
			alert("表示順序は1以上の数値を入力してください");
			return;
		}

		// Validate URL for video type
		if (type === "video" && !contentText.includes("youtube.com")) {
			if (
				!confirm(
					"動画コンテンツですが、YouTube URLではないようです。このまま保存しますか?",
				)
			) {
				return;
			}
		}

		onSave({
			weekId,
			type,
			title: title.trim(),
			content: contentText.trim(),
			orderIndex: orderNum,
		});
	};

	const getContentPlaceholder = (): string => {
		switch (type) {
			case "video":
				return "YouTube URL を入力してください\n例: https://www.youtube.com/watch?v=xxx";
			case "text":
				return "Markdown形式でテキスト教材を入力してください\n\n# 見出し\n## サブ見出し\n\n本文...\n\n```javascript\nコード例\n```";
			case "exercise":
				return "演習課題の説明を入力してください\n\n## 課題内容\n...\n\n## ヒント\n...\n\n## 提出方法\n...";
			default:
				return "";
		}
	};

	const getContentLabel = (): string => {
		switch (type) {
			case "video":
				return "YouTube URL";
			case "text":
				return "教材内容（Markdown）";
			case "exercise":
				return "課題説明";
			default:
				return "コンテンツ内容";
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="weekId" className="block text-sm font-medium mb-1">
					所属Week <span className="text-destructive">*</span>
				</label>
				<Select
					id="weekId"
					value={weekId}
					onChange={(e) => setWeekId(e.target.value)}
					required
				>
					<option value="">選択してください</option>
					{mockPhases
						.sort((a, b) => a.orderIndex - b.orderIndex)
						.map((phase) => {
							const weeks = getWeeksByPhase(phase.id).sort(
								(a, b) => a.orderIndex - b.orderIndex,
							);
							return (
								<optgroup key={phase.id} label={phase.title}>
									{weeks.map((week) => (
										<option key={week.id} value={week.id}>
											　{week.title}
										</option>
									))}
								</optgroup>
							);
						})}
				</Select>
				{selectedPhase && selectedWeek && (
					<p className="text-xs text-muted-foreground mt-1">
						{selectedPhase.title} &gt; {selectedWeek.title}
					</p>
				)}
			</div>

			<div>
				<label htmlFor="type" className="block text-sm font-medium mb-1">
					コンテンツタイプ <span className="text-destructive">*</span>
				</label>
				<Select
					id="type"
					value={type}
					onChange={(e) => setType(e.target.value as ContentType)}
					required
				>
					<option value="video">動画（YouTube）</option>
					<option value="text">テキスト教材</option>
					<option value="exercise">演習課題</option>
				</Select>
			</div>

			<div>
				<label htmlFor="title" className="block text-sm font-medium mb-1">
					タイトル <span className="text-destructive">*</span>
				</label>
				<Input
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="例: GASとは？概要説明"
					required
				/>
			</div>

			<div>
				<label htmlFor="content" className="block text-sm font-medium mb-1">
					{getContentLabel()} <span className="text-destructive">*</span>
				</label>
				<Textarea
					id="content"
					value={contentText}
					onChange={(e) => setContentText(e.target.value)}
					placeholder={getContentPlaceholder()}
					rows={type === "video" ? 3 : 12}
					required
				/>
				{type !== "video" && (
					<p className="text-xs text-muted-foreground mt-1">
						Markdown記法が使用できます
					</p>
				)}
			</div>

			<div>
				<label htmlFor="orderIndex" className="block text-sm font-medium mb-1">
					表示順序 <span className="text-destructive">*</span>
				</label>
				<Input
					id="orderIndex"
					type="number"
					min="1"
					value={orderIndex}
					onChange={(e) => setOrderIndex(e.target.value)}
					required
				/>
				<p className="text-xs text-muted-foreground mt-1">
					Week内での順序（小さい数字ほど上に表示）
				</p>
			</div>

			<div className="flex justify-end gap-2 pt-4">
				<Button type="button" variant="secondary" onClick={onCancel}>
					キャンセル
				</Button>
				<Button type="submit">保存</Button>
			</div>
		</form>
	);
}
