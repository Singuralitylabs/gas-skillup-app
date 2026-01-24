"use client";

import { useState } from "react";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/app/_components/ui";
import type { Content, Phase, Week } from "@/types/database.types";
import { ContentForm } from "../../_components/content-form";
import { PhaseForm } from "../../_components/phase-form";
import { WeekForm } from "../../_components/week-form";

type PhaseWithWeeksAndContents = Phase & {
	weeks: (Week & {
		contents: Content[];
	})[];
};

type Props = {
	phases: PhaseWithWeeksAndContents[];
};

export function ContentsList({ phases }: Props) {
	const [expandedPhases, setExpandedPhases] = useState<Set<string>>(new Set());
	const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
	const [editingItem, setEditingItem] = useState<{
		type: "phase" | "week" | "content";
		mode: "create" | "edit";
		item?: Phase | Week | Content;
		parentId?: string;
	} | null>(null);

	const togglePhase = (phaseId: string) => {
		const newExpanded = new Set(expandedPhases);
		if (newExpanded.has(phaseId)) {
			newExpanded.delete(phaseId);
		} else {
			newExpanded.add(phaseId);
		}
		setExpandedPhases(newExpanded);
	};

	const toggleWeek = (weekId: string) => {
		const newExpanded = new Set(expandedWeeks);
		if (newExpanded.has(weekId)) {
			newExpanded.delete(weekId);
		} else {
			newExpanded.add(weekId);
		}
		setExpandedWeeks(newExpanded);
	};

	const handleEdit = (
		type: "phase" | "week" | "content",
		item: Phase | Week | Content,
	) => {
		setEditingItem({ type, mode: "edit", item });
	};

	const handleCreate = (
		type: "phase" | "week" | "content",
		parentId?: string,
	) => {
		setEditingItem({ type, mode: "create", parentId });
	};

	const handleDelete = (type: "phase" | "week" | "content", id: string) => {
		if (
			confirm(
				`この${type === "phase" ? "Phase" : type === "week" ? "Week" : "コンテンツ"}を削除しますか？`,
			)
		) {
			// TODO: 実際の削除処理（Server Actionを実装）
			alert("削除機能は後で実装します");
		}
	};

	const getContentTypeLabel = (type: string): string => {
		switch (type) {
			case "video":
				return "動画";
			case "text":
				return "テキスト";
			case "exercise":
				return "演習";
			default:
				return type;
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">コンテンツ管理</h1>
					<p className="text-muted-foreground">Phase、Week、コンテンツの管理</p>
				</div>
				<Button onClick={() => handleCreate("phase")}>新規Phase作成</Button>
			</div>

			{/* Content Hierarchy */}
			<div className="space-y-4">
				{phases
					.sort((a, b) => a.order_index - b.order_index)
					.map((phase) => {
						const weeks = phase.weeks.sort(
							(a, b) => a.order_index - b.order_index,
						);
						const isExpanded = expandedPhases.has(phase.id);

						return (
							<Card key={phase.id}>
								<CardHeader>
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-3">
											<button
												type="button"
												onClick={() => togglePhase(phase.id)}
												className="text-2xl hover:opacity-70"
												aria-label={isExpanded ? "閉じる" : "開く"}
											>
												{isExpanded ? "▼" : "▶"}
											</button>
											<div>
												<CardTitle>{phase.title}</CardTitle>
												{phase.description && (
													<p className="text-sm text-muted-foreground mt-1">
														{phase.description}
													</p>
												)}
											</div>
										</div>
										<div className="flex items-center gap-2">
											<Badge variant="secondary">
												{weeks.length} Week{weeks.length !== 1 ? "s" : ""}
											</Badge>
											<Button
												variant="secondary"
												size="sm"
												onClick={() => handleEdit("phase", phase)}
											>
												編集
											</Button>
											<Button
												variant="destructive"
												size="sm"
												onClick={() => handleDelete("phase", phase.id)}
											>
												削除
											</Button>
										</div>
									</div>
								</CardHeader>

								{isExpanded && (
									<CardContent>
										<div className="space-y-3">
											<div className="flex justify-end">
												<Button
													size="sm"
													onClick={() => handleCreate("week", phase.id)}
												>
													Week追加
												</Button>
											</div>

											{weeks.length === 0 ? (
												<p className="text-sm text-muted-foreground text-center py-4">
													Weekがありません
												</p>
											) : (
												weeks.map((week) => {
													const contents = week.contents.sort(
														(a, b) => a.order_index - b.order_index,
													);
													const isWeekExpanded = expandedWeeks.has(week.id);

													return (
														<div
															key={week.id}
															className="border rounded-lg p-4 ml-8"
														>
															<div className="flex items-center justify-between mb-2">
																<div className="flex items-center gap-2">
																	<button
																		type="button"
																		onClick={() => toggleWeek(week.id)}
																		className="text-xl hover:opacity-70"
																		aria-label={
																			isWeekExpanded ? "閉じる" : "開く"
																		}
																	>
																		{isWeekExpanded ? "▼" : "▶"}
																	</button>
																	<div>
																		<h4 className="font-semibold">
																			{week.title}
																		</h4>
																		{week.description && (
																			<p className="text-xs text-muted-foreground">
																				{week.description}
																			</p>
																		)}
																	</div>
																</div>
																<div className="flex items-center gap-2">
																	<Badge variant="secondary">
																		{contents.length} コンテンツ
																	</Badge>
																	<Button
																		variant="secondary"
																		size="sm"
																		onClick={() => handleEdit("week", week)}
																	>
																		編集
																	</Button>
																	<Button
																		variant="destructive"
																		size="sm"
																		onClick={() =>
																			handleDelete("week", week.id)
																		}
																	>
																		削除
																	</Button>
																</div>
															</div>

															{isWeekExpanded && (
																<div className="space-y-2 mt-3">
																	<div className="flex justify-end">
																		<Button
																			size="sm"
																			onClick={() =>
																				handleCreate("content", week.id)
																			}
																		>
																			コンテンツ追加
																		</Button>
																	</div>

																	{contents.length === 0 ? (
																		<p className="text-xs text-muted-foreground text-center py-3">
																			コンテンツがありません
																		</p>
																	) : (
																		<div className="space-y-2 ml-6">
																			{contents.map((content) => (
																				<div
																					key={content.id}
																					className="flex items-center justify-between border rounded p-2 bg-muted/30"
																				>
																					<div className="flex items-center gap-3">
																						<Badge variant="secondary">
																							{getContentTypeLabel(
																								content.type,
																							)}
																						</Badge>
																						<span className="text-sm">
																							{content.title}
																						</span>
																					</div>
																					<div className="flex items-center gap-2">
																						<Button
																							variant="secondary"
																							size="sm"
																							onClick={() =>
																								handleEdit("content", content)
																							}
																						>
																							編集
																						</Button>
																						<Button
																							variant="destructive"
																							size="sm"
																							onClick={() =>
																								handleDelete(
																									"content",
																									content.id,
																								)
																							}
																						>
																							削除
																						</Button>
																					</div>
																				</div>
																			))}
																		</div>
																	)}
																</div>
															)}
														</div>
													);
												})
											)}
										</div>
									</CardContent>
								)}
							</Card>
						);
					})}
			</div>

			{/* Edit/Create Modal */}
			{editingItem && (
				<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
					<Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
						<CardHeader>
							<CardTitle>
								{editingItem.mode === "create" ? "新規作成" : "編集"} -{" "}
								{editingItem.type === "phase"
									? "Phase"
									: editingItem.type === "week"
										? "Week"
										: "コンテンツ"}
							</CardTitle>
						</CardHeader>
						<CardContent>
							{editingItem.type === "phase" && (
								<PhaseForm
									phase={editingItem.item as Phase | undefined}
									onSave={(data) => {
										// TODO: Server Actionで保存
										alert(
											`Phase ${editingItem.mode === "create" ? "作成" : "更新"}: ${data.title}\n\n実際の保存処理は後で実装します`,
										);
										setEditingItem(null);
									}}
									onCancel={() => setEditingItem(null)}
								/>
							)}
							{editingItem.type === "week" && (
								<WeekForm
									week={editingItem.item as Week | undefined}
									phases={phases}
									defaultPhaseId={editingItem.parentId}
									onSave={(data) => {
										// TODO: Server Actionで保存
										alert(
											`Week ${editingItem.mode === "create" ? "作成" : "更新"}: ${data.title}\n\n実際の保存処理は後で実装します`,
										);
										setEditingItem(null);
									}}
									onCancel={() => setEditingItem(null)}
								/>
							)}
							{editingItem.type === "content" && (
								<ContentForm
									content={editingItem.item as Content | undefined}
									phases={phases}
									defaultWeekId={editingItem.parentId}
									onSave={(data) => {
										// TODO: Server Actionで保存
										alert(
											`コンテンツ ${editingItem.mode === "create" ? "作成" : "更新"}: ${data.title}\n\n実際の保存処理は後で実装します`,
										);
										setEditingItem(null);
									}}
									onCancel={() => setEditingItem(null)}
								/>
							)}
						</CardContent>
					</Card>
				</div>
			)}
		</div>
	);
}
