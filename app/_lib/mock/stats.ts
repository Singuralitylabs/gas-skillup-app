/**
 * ダッシュボード用統計計算関数
 * モックデータを使用した統計値の算出
 */

import type {
	SubmissionResponse,
	UserProgressResponse,
	UserResponse,
} from "@/types";
import {
	mockAnnouncements,
	mockContents,
	mockSubmissions,
	mockUserProgress,
	mockUsers,
} from "./data";

/**
 * ダッシュボード統計情報の型定義
 */
export interface DashboardStats {
	// 受講生統計
	totalStudents: number;
	approvedStudents: number;
	pendingStudents: number;
	activeStudents: number;

	// 課題統計
	totalSubmissions: number;
	pendingSubmissions: number;
	reviewedSubmissions: number;

	// 進捗統計
	averageProgress: number;
	totalContents: number;
	totalCompletedContents: number;

	// お知らせ統計
	totalAnnouncements: number;
}

/**
 * 進捗分布データの型定義
 */
export interface ProgressDistribution {
	range: string;
	count: number;
	percentage: number;
}

/**
 * 課題提出推移データの型定義
 */
export interface SubmissionTrend {
	date: string;
	submissions: number;
	reviewed: number;
}

/**
 * ダッシュボード統計を取得
 */
export function getDashboardStats(): DashboardStats {
	const students = mockUsers.filter((user) => user.role === "student");
	const approvedStudents = students.filter((user) => user.approved);
	const pendingStudents = students.filter((user) => !user.approved);

	// アクティブ受講生（7日以内に進捗更新があったユーザー）
	const sevenDaysAgo = new Date();
	sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
	const activeStudentIds = new Set(
		mockUserProgress
			.filter(
				(progress) =>
					progress.completedAt && new Date(progress.completedAt) > sevenDaysAgo,
			)
			.map((progress) => progress.userId),
	);

	// 課題統計
	const pendingSubmissions = mockSubmissions.filter(
		(submission) => submission.feedback === null,
	);
	const reviewedSubmissions = mockSubmissions.filter(
		(submission) => submission.feedback !== null,
	);

	// 進捗統計
	const totalContents = mockContents.length;
	const completedProgressList = mockUserProgress.filter(
		(progress) => progress.completed,
	);
	const totalStudentProgress = approvedStudents.length * totalContents;
	const averageProgress =
		totalStudentProgress > 0
			? Math.round((completedProgressList.length / totalStudentProgress) * 100)
			: 0;

	return {
		totalStudents: students.length,
		approvedStudents: approvedStudents.length,
		pendingStudents: pendingStudents.length,
		activeStudents: activeStudentIds.size,
		totalSubmissions: mockSubmissions.length,
		pendingSubmissions: pendingSubmissions.length,
		reviewedSubmissions: reviewedSubmissions.length,
		averageProgress,
		totalContents,
		totalCompletedContents: completedProgressList.length,
		totalAnnouncements: mockAnnouncements.length,
	};
}

/**
 * 進捗分布を取得
 */
export function getProgressDistribution(): ProgressDistribution[] {
	const students = mockUsers.filter(
		(user) => user.role === "student" && user.approved,
	);
	const totalContents = mockContents.length;

	const distribution = {
		"0-20%": 0,
		"21-40%": 0,
		"41-60%": 0,
		"61-80%": 0,
		"81-100%": 0,
	};

	students.forEach((student) => {
		const completedCount = mockUserProgress.filter(
			(progress) => progress.userId === student.id && progress.completed,
		).length;
		const progressRate =
			totalContents > 0 ? (completedCount / totalContents) * 100 : 0;

		if (progressRate <= 20) distribution["0-20%"]++;
		else if (progressRate <= 40) distribution["21-40%"]++;
		else if (progressRate <= 60) distribution["41-60%"]++;
		else if (progressRate <= 80) distribution["61-80%"]++;
		else distribution["81-100%"]++;
	});

	return Object.entries(distribution).map(([range, count]) => ({
		range,
		count,
		percentage:
			students.length > 0 ? Math.round((count / students.length) * 100) : 0,
	}));
}

/**
 * 課題提出推移を取得（過去7日間）
 */
export function getSubmissionTrend(): SubmissionTrend[] {
	const trend: SubmissionTrend[] = [];
	const today = new Date();

	for (let i = 6; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);
		const dateStr = date.toISOString().split("T")[0];

		const submissions = mockSubmissions.filter((submission) => {
			const submissionDate = submission.createdAt.split("T")[0];
			return submissionDate === dateStr;
		});

		const reviewed = submissions.filter(
			(submission) => submission.feedback !== null,
		);

		trend.push({
			date: dateStr,
			submissions: submissions.length,
			reviewed: reviewed.length,
		});
	}

	return trend;
}

/**
 * 未確認課題一覧を取得（最新5件）
 */
export function getRecentPendingSubmissions(limit = 5): Array<
	SubmissionResponse & {
		userName: string;
		contentTitle: string;
	}
> {
	const pendingSubmissions = mockSubmissions
		.filter((submission) => submission.feedback === null)
		.sort(
			(a, b) =>
				new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
		)
		.slice(0, limit);

	return pendingSubmissions.map((submission) => {
		const user = mockUsers.find((u) => u.id === submission.userId);
		const content = mockContents.find((c) => c.id === submission.contentId);

		return {
			...submission,
			userName: user?.name || "不明なユーザー",
			contentTitle: content?.title || "不明なコンテンツ",
		};
	});
}

/**
 * 受講生別進捗率を取得
 */
export function getStudentProgressRates(): Array<{
	userId: string;
	userName: string;
	progressRate: number;
	completedCount: number;
	totalCount: number;
}> {
	const students = mockUsers.filter(
		(user) => user.role === "student" && user.approved,
	);
	const totalContents = mockContents.length;

	return students
		.map((student) => {
			const completedCount = mockUserProgress.filter(
				(progress) => progress.userId === student.id && progress.completed,
			).length;
			const progressRate =
				totalContents > 0
					? Math.round((completedCount / totalContents) * 100)
					: 0;

			return {
				userId: student.id,
				userName: student.name ?? "Unknown",
				progressRate,
				completedCount,
				totalCount: totalContents,
			};
		})
		.sort((a, b) => b.progressRate - a.progressRate);
}
