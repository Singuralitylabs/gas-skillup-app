/**
 * フォーマットユーティリティ
 * 日付、文字列、数値などのフォーマット関数
 */

/**
 * 日付を "YYYY年MM月DD日" 形式でフォーマット
 */
export function formatDate(date: string | Date): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

/**
 * 日付を "YYYY/MM/DD" 形式でフォーマット
 */
export function formatDateShort(date: string | Date): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString("ja-JP", {
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
	});
}

/**
 * 日付を "MM月DD日 HH:mm" 形式でフォーマット
 */
export function formatDateTime(date: string | Date): string {
	const d = typeof date === "string" ? new Date(date) : date;
	return d.toLocaleDateString("ja-JP", {
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
}

/**
 * 相対時間を表示（例: "2時間前", "3日前"）
 */
export function formatRelativeTime(date: string | Date): string {
	const d = typeof date === "string" ? new Date(date) : date;
	const now = new Date();
	const diff = now.getTime() - d.getTime();

	const seconds = Math.floor(diff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const weeks = Math.floor(days / 7);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	if (seconds < 60) return "たった今";
	if (minutes < 60) return `${minutes}分前`;
	if (hours < 24) return `${hours}時間前`;
	if (days < 7) return `${days}日前`;
	if (weeks < 4) return `${weeks}週間前`;
	if (months < 12) return `${months}ヶ月前`;
	return `${years}年前`;
}

/**
 * 進捗率をパーセンテージでフォーマット
 */
export function formatProgress(completed: number, total: number): string {
	if (total === 0) return "0%";
	const percentage = Math.round((completed / total) * 100);
	return `${percentage}%`;
}

/**
 * 進捗率を数値で取得
 */
export function calculateProgress(completed: number, total: number): number {
	if (total === 0) return 0;
	return Math.round((completed / total) * 100);
}

/**
 * テキストを指定文字数で切り詰める
 */
export function truncate(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return `${text.slice(0, maxLength)}...`;
}

/**
 * ユーザーロールを日本語で表示
 */
export function formatRole(role: string): string {
	const roleMap: Record<string, string> = {
		student: "受講生",
		instructor: "講師",
		admin: "管理者",
	};
	return roleMap[role] || role;
}

/**
 * コンテンツタイプを日本語で表示
 */
export function formatContentType(type: string): string {
	const typeMap: Record<string, string> = {
		video: "動画教材",
		text: "テキスト教材",
		exercise: "演習課題",
	};
	return typeMap[type] || type;
}

/**
 * 提出タイプを日本語で表示
 */
export function formatSubmissionType(type: string): string {
	const typeMap: Record<string, string> = {
		code: "コード",
		url: "URL",
	};
	return typeMap[type] || type;
}
