"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";
import {
	getCurrentUser,
	getStoredUserProgress,
	getWeeksByPhase,
	mockContents,
	mockPhases,
} from "@/lib/mock";
import type { UserResponse } from "@/types";
import { PhaseSection } from "../_components";

export default function ContentsPage() {
	const router = useRouter();
	const [user, setUser] = useState<UserResponse | null>(null);

	useEffect(() => {
		const currentUser = getCurrentUser();
		if (!currentUser) {
			router.push("/login");
			return;
		}

		if (!currentUser.approved) {
			router.push("/pending-approval");
			return;
		}

		setUser(currentUser);
	}, [router]);

	if (!user) {
		return null;
	}

	// ユーザーの進捗データを取得
	const userProgress = getStoredUserProgress(user.id);

	// 全体の進捗統計
	const totalContents = mockContents.length;
	const completedContents = userProgress.filter((p) => p.completed).length;
	const progressRate =
		totalContents > 0
			? Math.round((completedContents / totalContents) * 100)
			: 0;

	return (
		<div className="container py-4 px-4 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
			<div className="space-y-6">
				{/* ヘッダー */}
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h1 className="text-2xl font-bold sm:text-3xl">学習コンテンツ</h1>
						<p className="text-muted-foreground mt-1 text-sm sm:text-base">
							Phase → Week → Contentの順に学習を進めましょう
						</p>
					</div>
					<Button
						variant="outline"
						onClick={() => router.push("/student/dashboard")}
						className="w-full sm:w-auto"
					>
						ダッシュボードに戻る
					</Button>
				</div>

				{/* 進捗サマリー */}
				<div className="bg-primary/10 rounded-lg p-4 sm:p-6">
					<div className="grid grid-cols-3 gap-4">
						<div className="text-center">
							<p className="text-sm text-muted-foreground mb-1">全体進捗</p>
							<p className="text-3xl font-bold text-primary">{progressRate}%</p>
						</div>
						<div className="text-center">
							<p className="text-sm text-muted-foreground mb-1">完了</p>
							<p className="text-3xl font-bold text-success">
								{completedContents}
							</p>
						</div>
						<div className="text-center">
							<p className="text-sm text-muted-foreground mb-1">残り</p>
							<p className="text-3xl font-bold text-muted-foreground">
								{totalContents - completedContents}
							</p>
						</div>
					</div>
				</div>

				{/* Phase リスト */}
				<div className="space-y-4">
					{mockPhases
						.sort((a, b) => a.orderIndex - b.orderIndex)
						.map((phase, index) => {
							const weeks = getWeeksByPhase(phase.id);

							// 最初のPhaseをデフォルトで開く
							const defaultOpen = index === 0;

							return (
								<PhaseSection
									key={phase.id}
									phase={phase}
									weeks={weeks}
									allContents={mockContents}
									userProgress={userProgress}
									defaultOpen={defaultOpen}
								/>
							);
						})}
				</div>

				{/* 補足情報 */}
				<div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
					<div className="flex items-start gap-3">
						<svg
							className="w-5 h-5 text-primary shrink-0 mt-0.5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<div className="text-sm">
							<p className="font-medium text-foreground mb-1">学習のヒント</p>
							<ul className="text-primary space-y-1 list-disc list-inside">
								<li>各Phaseは順番に学習することをお勧めします</li>
								<li>動画を見た後、テキストで復習し、演習で定着させましょう</li>
								<li>演習課題は必ず提出してフィードバックを受けましょう</li>
								<li>わからないことがあれば、お気軽に質問してください</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
