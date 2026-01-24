"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea } from "@/app/_components/ui";
import type { Phase, Week } from "@/types/database.types";

export interface WeekFormProps {
	week?: Week;
	phases?: Phase[];
	defaultPhaseId?: string;
	onSave: (data: {
		phase_id: string;
		title: string;
		description?: string;
		order_index: number;
	}) => void;
	onCancel: () => void;
}

export function WeekForm({
	week,
	phases = [],
	defaultPhaseId,
	onSave,
	onCancel,
}: WeekFormProps) {
	const [phaseId, setPhaseId] = useState(
		week?.phase_id || defaultPhaseId || "",
	);
	const [title, setTitle] = useState(week?.title || "");
	const [description, setDescription] = useState(week?.description || "");
	const [orderIndex, setOrderIndex] = useState(
		week?.order_index?.toString() || "1",
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!phaseId) {
			alert("Phaseを選択してください");
			return;
		}

		if (!title.trim()) {
			alert("タイトルを入力してください");
			return;
		}

		const orderNum = Number.parseInt(orderIndex, 10);
		if (Number.isNaN(orderNum) || orderNum < 1) {
			alert("表示順序は1以上の数値を入力してください");
			return;
		}

		onSave({
			phase_id: phaseId,
			title: title.trim(),
			description: description.trim() || undefined,
			order_index: orderNum,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="phaseId" className="block text-sm font-medium mb-1">
					所属Phase <span className="text-destructive">*</span>
				</label>
				<Select
					id="phaseId"
					value={phaseId}
					onChange={(e) => setPhaseId(e.target.value)}
					required
				>
					<option value="">選択してください</option>
					{phases
						.sort((a, b) => a.order_index - b.order_index)
						.map((phase) => (
							<option key={phase.id} value={phase.id}>
								{phase.title}
							</option>
						))}
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
					placeholder="例: Week 1: GAS入門"
					required
				/>
			</div>

			<div>
				<label htmlFor="description" className="block text-sm font-medium mb-1">
					説明
				</label>
				<Textarea
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder="Weekの説明を入力してください"
					rows={3}
				/>
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
					Phase内での順序（小さい数字ほど上に表示）
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
