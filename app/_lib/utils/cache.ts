/**
 * キャッシュユーティリティ
 *
 * サーバーサイドでのデータフェッチングキャッシュを管理
 */

// NOTE: unstable_cache は将来の Next.js で変更/削除の可能性あり。
// 安定APIが提供されたら置き換えを検討すること。
import { unstable_cache } from "next/cache";

/**
 * キャッシュタグ定義
 */
export const CacheTags = {
	// ユーザー関連
	USERS: "users",
	USER_PROFILE: (id: string) => `user-${id}`,

	// コンテンツ関連
	CONTENTS: "contents",
	PHASES: "phases",
	WEEKS: "weeks",
	CONTENT_DETAIL: (id: string) => `content-${id}`,

	// 進捗関連
	PROGRESS: "progress",
	USER_PROGRESS: (userId: string) => `progress-${userId}`,

	// 課題関連
	SUBMISSIONS: "submissions",
	SUBMISSION_DETAIL: (id: string) => `submission-${id}`,

	// お知らせ関連
	ANNOUNCEMENTS: "announcements",

	// 通知関連
	NOTIFICATIONS: "notifications",
	USER_NOTIFICATIONS: (userId: string) => `notifications-${userId}`,

	// ダッシュボード
	DASHBOARD_STATS: "dashboard-stats",
} as const;

/**
 * 再検証時間の定義（秒）
 */
export const RevalidateTime = {
	// 頻繁に更新されるデータ
	REALTIME: 0, // キャッシュしない
	SHORT: 30, // 30秒
	MEDIUM: 60, // 1分

	// 比較的安定したデータ
	LONG: 300, // 5分
	VERY_LONG: 3600, // 1時間

	// ほぼ変わらないデータ
	STATIC: 86400, // 24時間
} as const;

/**
 * キャッシュ付きデータフェッチ関数を作成
 *
 * @example
 * ```ts
 * const getCachedUser = createCachedFetch(
 *   async (id: string) => await getUser(id),
 *   ['user'],
 *   { revalidate: RevalidateTime.MEDIUM }
 * );
 * ```
 */
export function createCachedFetch<TArgs extends unknown[], TResult>(
	fetchFn: (...args: TArgs) => Promise<TResult>,
	keyParts: string[],
	options: {
		revalidate?: number;
		tags?: string[];
	} = {},
) {
	const { revalidate = RevalidateTime.MEDIUM, tags = [] } = options;

	return unstable_cache(fetchFn, keyParts, {
		revalidate,
		tags: [...keyParts, ...tags],
	});
}

/**
 * メモリ内キャッシュ（クライアントサイド用）
 */
class MemoryCache<T> {
	private cache = new Map<string, { value: T; expiry: number }>();

	get(key: string): T | undefined {
		const item = this.cache.get(key);
		if (!item) return undefined;

		if (Date.now() > item.expiry) {
			this.cache.delete(key);
			return undefined;
		}

		return item.value;
	}

	set(key: string, value: T, ttlMs: number): void {
		this.cache.set(key, {
			value,
			expiry: Date.now() + ttlMs,
		});
	}

	delete(key: string): void {
		this.cache.delete(key);
	}

	clear(): void {
		this.cache.clear();
	}

	// 期限切れエントリをクリーンアップ
	cleanup(): void {
		const now = Date.now();
		for (const [key, item] of this.cache.entries()) {
			if (now > item.expiry) {
				this.cache.delete(key);
			}
		}
	}
}

// シングルトンインスタンス
export const memoryCache = new MemoryCache<unknown>();

/**
 * デバウンス関数
 *
 * 連続した呼び出しを制限
 */
export function debounce<T extends (...args: unknown[]) => void>(
	fn: T,
	delay: number,
): (...args: Parameters<T>) => void {
	let timeoutId: ReturnType<typeof setTimeout>;

	return (...args: Parameters<T>) => {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(() => fn(...args), delay);
	};
}

/**
 * スロットル関数
 *
 * 一定間隔での呼び出しを保証
 */
export function throttle<T extends (...args: unknown[]) => void>(
	fn: T,
	limit: number,
): (...args: Parameters<T>) => void {
	let inThrottle = false;

	return (...args: Parameters<T>) => {
		if (!inThrottle) {
			fn(...args);
			inThrottle = true;
			setTimeout(() => {
				inThrottle = false;
			}, limit);
		}
	};
}
