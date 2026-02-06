import { expect, test } from "@playwright/test";
import { TEST_URLS, waitForPageLoad } from "../utils/test-utils";

test.describe("ページナビゲーション", () => {
	test.describe("未認証ユーザーのリダイレクト", () => {
		test("受講生コンテンツページにアクセスするとリダイレクト", async ({
			page,
		}) => {
			await page.goto(TEST_URLS.studentContents);
			await waitForPageLoad(page);

			// ログインページにリダイレクトされる
			expect(page.url()).toMatch(/\/(login|pending-approval|auth)/);
		});

		test("受講生課題提出ページにアクセスするとリダイレクト", async ({
			page,
		}) => {
			await page.goto(TEST_URLS.studentSubmissions);
			await waitForPageLoad(page);

			expect(page.url()).toMatch(/\/(login|pending-approval|auth)/);
		});

		test("受講生お知らせページにアクセスするとリダイレクト", async ({
			page,
		}) => {
			await page.goto(TEST_URLS.studentAnnouncements);
			await waitForPageLoad(page);

			expect(page.url()).toMatch(/\/(login|pending-approval|auth)/);
		});

		test("運営受講生管理ページにアクセスするとリダイレクト", async ({
			page,
		}) => {
			await page.goto(TEST_URLS.instructorStudents);
			await waitForPageLoad(page);

			expect(page.url()).toMatch(/\/(login|pending-approval|auth)/);
		});

		test("運営課題管理ページにアクセスするとリダイレクト", async ({ page }) => {
			await page.goto(TEST_URLS.instructorSubmissions);
			await waitForPageLoad(page);

			expect(page.url()).toMatch(/\/(login|pending-approval|auth)/);
		});

		test("運営コンテンツ管理ページにアクセスするとリダイレクト", async ({
			page,
		}) => {
			await page.goto(TEST_URLS.instructorContents);
			await waitForPageLoad(page);

			expect(page.url()).toMatch(/\/(login|pending-approval|auth)/);
		});

		test("運営承認管理ページにアクセスするとリダイレクト", async ({ page }) => {
			await page.goto(TEST_URLS.instructorApprovals);
			await waitForPageLoad(page);

			expect(page.url()).toMatch(/\/(login|pending-approval|auth)/);
		});
	});

	test.describe("直接URLアクセス", () => {
		test("存在しないページにアクセスすると404", async ({ page }) => {
			await page.goto("/non-existent-page-12345");
			// Next.jsはデフォルトで404ステータスを返さないことがあるので、
			// ページ内容で判断する
			await waitForPageLoad(page);

			const content = await page.content();
			// 404ページまたはリダイレクトされることを確認
			const is404OrRedirect =
				content.includes("404") ||
				content.includes("見つかりません") ||
				content.includes("Not Found") ||
				page.url().includes("/login");
			expect(is404OrRedirect).toBeTruthy();
		});

		test("ログインページは直接アクセス可能", async ({ page }) => {
			await page.goto(TEST_URLS.login);
			await waitForPageLoad(page);

			// ログインページの要素が表示される
			await expect(
				page.getByRole("heading", { name: "ログイン" }),
			).toBeVisible();
		});
	});
});
