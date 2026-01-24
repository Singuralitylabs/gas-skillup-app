"use client";

import { useState } from "react";
import { Button, Input, Textarea } from "@/app/_components/ui";
import type { Phase } from "@/types/database.types";

export interface PhaseFormProps {
	phase?: Phase;
	onSave: (data: { title: string; description?: string; order_index: number }) => void;
	onCancel: () => void;
}

export function PhaseForm({ phase, onSave, onCancel }: PhaseFormProps) {
	const [title, setTitle] = useState(phase?.title || "");
	const [description, setDescription] = useState(phase?.description || "");
	const [orderIndex, setOrderIndex] = useState(
		phase?.order_index?.toString() || "1",
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

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
			title: title.trim(),
			description: description.trim() || undefined,
			order_index: orderNum,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div>
				<label htmlFor="title" className="block text-sm font-medium mb-1">
					タイトル <span className="text-destructive">*</span>
				</label>
				<Input
					id="title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="例: Phase 1: GAS基礎"
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
					placeholder="Phaseの説明を入力してください"
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
					小さい数字ほど上に表示されます
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
