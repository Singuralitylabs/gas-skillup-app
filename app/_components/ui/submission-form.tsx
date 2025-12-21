"use client";

import { useState } from "react";
import type { SubmissionType } from "@/types";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";

export interface SubmissionFormProps {
	/** 提出処理のコールバック */
	onSubmit: (type: SubmissionType, content: string) => Promise<void> | void;
	/** 送信中フラグ（親コンポーネントで管理する場合） */
	isSubmitting?: boolean;
	/** キャンセル時のコールバック */
	onCancel?: () => void;
	/** コンテンツタイトル（表示用） */
	contentTitle?: string;
	/** エラーメッセージ（親コンポーネントで管理する場合） */
	error?: string;
	/** 初期の提出タイプ */
	defaultType?: SubmissionType;
	/** カスタムスタイル */
	className?: string;
}

/**
 * SubmissionForm コンポーネント
 *
 * 課題提出用の再利用可能なフォームコンポーネント
 *
 * @example
 * ```tsx
 * <SubmissionForm
 *   onSubmit={async (type, content) => {
 *     await createSubmission(userId, contentId, type, content);
 *     router.push('/submissions');
 *   }}
 *   onCancel={() => router.back()}
 *   contentTitle="React基礎"
 * />
 * ```
 */
export function SubmissionForm({
	onSubmit,
	isSubmitting = false,
	onCancel,
	contentTitle,
	error: externalError,
	defaultType = "code",
	className,
}: SubmissionFormProps) {
	const [submissionType, setSubmissionType] =
		useState<SubmissionType>(defaultType);
	const [submissionContent, setSubmissionContent] = useState("");
	const [internalError, setInternalError] = useState("");

	// 外部からエラーが渡されていればそれを使用、なければ内部エラーを使用
	const error = externalError ?? internalError;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// バリデーション
		if (!submissionContent.trim()) {
			setInternalError("提出内容を入力してください");
			return;
		}

		if (submissionType === "url") {
			// URLの簡易バリデーション
			try {
				new URL(submissionContent);
			} catch {
				setInternalError("有効なURLを入力してください");
				return;
			}
		}

		setInternalError("");

		try {
			await onSubmit(submissionType, submissionContent);
		} catch (err) {
			if (!externalError) {
				setInternalError(
					err instanceof Error ? err.message : "提出に失敗しました",
				);
			}
		}
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>
					{contentTitle ? `${contentTitle} - 提出内容` : "提出内容"}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form onSubmit={handleSubmit} className="space-y-6">
					{/* 提出タイプ選択 */}
					<div className="space-y-3">
						<label className="text-sm font-medium">提出タイプ</label>
						<div className="flex gap-6">
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="radio"
									name="submissionType"
									value="code"
									checked={submissionType === "code"}
									onChange={(e) =>
										setSubmissionType(e.target.value as SubmissionType)
									}
									disabled={isSubmitting}
									className="w-4 h-4"
								/>
								<span>コード</span>
							</label>
							<label className="flex items-center gap-2 cursor-pointer">
								<input
									type="radio"
									name="submissionType"
									value="url"
									checked={submissionType === "url"}
									onChange={(e) =>
										setSubmissionType(e.target.value as SubmissionType)
									}
									disabled={isSubmitting}
									className="w-4 h-4"
								/>
								<span>URL</span>
							</label>
						</div>
					</div>

					{/* 提出内容入力 */}
					<div className="space-y-3">
						<label htmlFor="content" className="text-sm font-medium block">
							{submissionType === "code"
								? "コードを入力してください"
								: "URLを入力してください"}
						</label>
						{submissionType === "code" ? (
							<textarea
								id="content"
								value={submissionContent}
								onChange={(e) => setSubmissionContent(e.target.value)}
								placeholder="ここにコードを入力してください"
								rows={12}
								disabled={isSubmitting}
								className="w-full px-4 py-3 border rounded-lg font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
								required
							/>
						) : (
							<input
								type="url"
								id="content"
								value={submissionContent}
								onChange={(e) => setSubmissionContent(e.target.value)}
								placeholder="https://example.com/your-work"
								disabled={isSubmitting}
								className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
								required
							/>
						)}
						<p className="text-xs text-muted-foreground">
							{submissionType === "code"
								? "作成したコードを貼り付けてください。提出後は編集できません。"
								: "デプロイしたアプリケーションやGitHubリポジトリのURLを入力してください。"}
						</p>
					</div>

					{/* エラーメッセージ */}
					{error && (
						<div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
							<p className="text-sm text-red-600 dark:text-red-400">{error}</p>
						</div>
					)}

					{/* アクションボタン */}
					<div className="flex items-center gap-4">
						<Button
							type="submit"
							disabled={isSubmitting}
							className="min-w-[120px]"
						>
							{isSubmitting ? "提出中..." : "提出する"}
						</Button>
						{onCancel && (
							<Button
								type="button"
								variant="outline"
								onClick={onCancel}
								disabled={isSubmitting}
							>
								キャンセル
							</Button>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
