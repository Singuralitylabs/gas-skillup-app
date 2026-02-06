import type { Page } from "@playwright/test";

/**
 * テスト用定数
 */
export const TEST_URLS = {
	// 認証関連
	login: "/login",
	pendingApproval: "/pending-approval",

	// 受講生向け
	studentDashboard: "/student/dashboard",
	studentContents: "/student/contents",
	studentSubmissions: "/student/submissions",
	studentAnnouncements: "/student/announcements",

	// 運営向け
	instructorDashboard: "/instructor/dashboard",
	instructorStudents: "/instructor/students",
	instructorSubmissions: "/instructor/submissions",
	instructorContents: "/instructor/contents",
	instructorApprovals: "/instructor/approvals",
	instructorAnnouncements: "/instructor/announcements",
} as const;

/**
 * ページが完全に読み込まれるまで待機
 */
export async function waitForPageLoad(page: Page): Promise<void> {
	await page.waitForLoadState("networkidle");
}

/**
 * 特定のテキストが表示されるまで待機
 */
export async function waitForText(page: Page, text: string): Promise<void> {
	await page.getByText(text).waitFor({ state: "visible" });
}

/**
 * ナビゲーションリンクをクリックして遷移
 */
export async function navigateViaLink(
	page: Page,
	linkText: string,
): Promise<void> {
	await page.getByRole("link", { name: linkText }).click();
	await waitForPageLoad(page);
}

/**
 * ボタンをクリック
 */
export async function clickButton(
	page: Page,
	buttonText: string,
): Promise<void> {
	await page.getByRole("button", { name: buttonText }).click();
}

/**
 * フォーム入力
 */
export async function fillInput(
	page: Page,
	label: string,
	value: string,
): Promise<void> {
	await page.getByLabel(label).fill(value);
}

/**
 * スクリーンショットを撮影（デバッグ用）
 */
export async function takeDebugScreenshot(
	page: Page,
	name: string,
): Promise<void> {
	await page.screenshot({ path: `tests/screenshots/${name}.png` });
}

/**
 * 現在のURLパスを取得
 */
export function getCurrentPath(page: Page): string {
	const url = new URL(page.url());
	return url.pathname;
}

/**
 * レスポンシブテスト用のビューポートサイズ
 */
export const VIEWPORTS = {
	mobile: { width: 375, height: 667 },
	tablet: { width: 768, height: 1024 },
	desktop: { width: 1280, height: 720 },
} as const;

/**
 * ビューポートを設定
 */
export async function setViewport(
	page: Page,
	viewport: keyof typeof VIEWPORTS,
): Promise<void> {
	await page.setViewportSize(VIEWPORTS[viewport]);
}
