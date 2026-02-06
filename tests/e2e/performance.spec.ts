import { expect, test } from "@playwright/test";
import { waitForPageLoad } from "../utils/test-utils";

test.describe("パフォーマンス基本確認", () => {
	test("ログインページが3秒以内に読み込まれる", async ({ page }) => {
		const startTime = Date.now();
		await page.goto("/login");
		await waitForPageLoad(page);
		const loadTime = Date.now() - startTime;

		// 3秒以内に読み込み完了
		expect(loadTime).toBeLessThan(3000);
	});

	test("ログインページのCore Web Vitals - LCP要素が存在する", async ({
		page,
	}) => {
		await page.goto("/login");
		await waitForPageLoad(page);

		// メインコンテンツ（カード）が表示される
		const card = page.locator('[class*="card"]').first();
		await expect(card).toBeVisible();
	});

	test("ログインページに重要な要素が表示される", async ({ page }) => {
		await page.goto("/login");

		// 重要な要素が5秒以内に表示される
		await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible({
			timeout: 5000,
		});
		await expect(
			page.getByRole("button", { name: /Googleでログイン/i }),
		).toBeVisible({ timeout: 5000 });
	});
});

test.describe("レスポンシブ対応確認", () => {
	const viewports = [
		{ name: "iPhone SE", width: 375, height: 667 },
		{ name: "iPad", width: 768, height: 1024 },
		{ name: "Desktop", width: 1280, height: 720 },
		{ name: "Wide Desktop", width: 1920, height: 1080 },
	];

	for (const viewport of viewports) {
		test(`${viewport.name} (${viewport.width}x${viewport.height}) でログインページが正しく表示される`, async ({
			page,
		}) => {
			await page.setViewportSize({
				width: viewport.width,
				height: viewport.height,
			});
			await page.goto("/login");
			await waitForPageLoad(page);

			// ログインボタンが表示・クリック可能
			const button = page.getByRole("button", { name: /Googleでログイン/i });
			await expect(button).toBeVisible();
			await expect(button).toBeEnabled();

			// ボタンがビューポート内に収まっている
			const boundingBox = await button.boundingBox();
			expect(boundingBox).not.toBeNull();
			if (boundingBox) {
				expect(boundingBox.x).toBeGreaterThanOrEqual(0);
				expect(boundingBox.x + boundingBox.width).toBeLessThanOrEqual(
					viewport.width,
				);
			}
		});
	}
});
