import { expect, test } from "@playwright/test";
import { TEST_URLS, waitForPageLoad } from "../utils/test-utils";

test.describe("ログインページ", () => {
	test("ログインページが正しく表示される", async ({ page }) => {
		await page.goto(TEST_URLS.login);
		await waitForPageLoad(page);

		// タイトルが表示されている
		await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible();

		// 説明文が表示されている
		await expect(page.getByText("GAS学習支援プラットフォーム")).toBeVisible();

		// Googleログインボタンが表示されている
		await expect(
			page.getByRole("button", { name: /Googleでログイン/i }),
		).toBeVisible();

		// 承認に関する注意書きが表示されている
		await expect(page.getByText(/講師による承認が必要です/)).toBeVisible();
	});

	test("Googleログインボタンがクリック可能", async ({ page }) => {
		await page.goto(TEST_URLS.login);
		await waitForPageLoad(page);

		const googleButton = page.getByRole("button", {
			name: /Googleでログイン/i,
		});
		await expect(googleButton).toBeEnabled();
	});
});

test.describe("認証リダイレクト", () => {
	test("未認証で受講生ダッシュボードにアクセスするとリダイレクトされる", async ({
		page,
	}) => {
		await page.goto(TEST_URLS.studentDashboard);
		await waitForPageLoad(page);

		// ログインページまたは認証が必要なことを示すページにリダイレクト
		const url = page.url();
		expect(
			url.includes("/login") ||
				url.includes("/pending-approval") ||
				url.includes("/auth"),
		).toBeTruthy();
	});

	test("未認証で運営ダッシュボードにアクセスするとリダイレクトされる", async ({
		page,
	}) => {
		await page.goto(TEST_URLS.instructorDashboard);
		await waitForPageLoad(page);

		// ログインページまたは認証が必要なことを示すページにリダイレクト
		const url = page.url();
		expect(
			url.includes("/login") ||
				url.includes("/pending-approval") ||
				url.includes("/auth"),
		).toBeTruthy();
	});
});
