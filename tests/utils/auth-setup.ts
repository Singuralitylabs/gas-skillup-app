import type { Page } from "@playwright/test";

/**
 * 認証セットアップユーティリティ
 *
 * Note: Google OAuth認証を使用しているため、実際の認証フローのE2Eテストは
 * CIでは困難。本ファイルは将来的なテスト用認証のセットアップに使用。
 */

/**
 * 認証状態のストレージファイルパス
 */
export const STORAGE_STATE_PATH = "tests/.auth/user.json";
export const INSTRUCTOR_STORAGE_STATE_PATH = "tests/.auth/instructor.json";

/**
 * ログインページが表示されているか確認
 */
export async function assertOnLoginPage(page: Page): Promise<boolean> {
	const url = new URL(page.url());
	return (
		url.pathname === "/login" ||
		(await page.getByRole("button", { name: /Google/i }).isVisible())
	);
}

/**
 * 承認待ちページが表示されているか確認
 */
export async function assertOnPendingApprovalPage(
	page: Page,
): Promise<boolean> {
	const url = new URL(page.url());
	return (
		url.pathname === "/pending-approval" ||
		(await page.getByText(/承認待ち|pending/i).isVisible())
	);
}

/**
 * 未認証ユーザーがリダイレクトされることを確認
 */
export async function expectRedirectToLogin(page: Page): Promise<void> {
	await page.waitForURL(/\/login/);
}

/**
 * テストユーザー情報（モック用）
 */
export const TEST_USERS = {
	student: {
		id: "test-student-id",
		email: "student@example.com",
		name: "テスト受講生",
		role: "student" as const,
		approved: true,
	},
	instructor: {
		id: "test-instructor-id",
		email: "instructor@example.com",
		name: "テスト講師",
		role: "instructor" as const,
		approved: true,
	},
	pendingStudent: {
		id: "test-pending-id",
		email: "pending@example.com",
		name: "承認待ち受講生",
		role: "student" as const,
		approved: false,
	},
} as const;
