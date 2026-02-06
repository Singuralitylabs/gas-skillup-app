import { expect, test } from "@playwright/test";
import { VIEWPORTS, waitForPageLoad } from "../utils/test-utils";

test.describe("UIコンポーネント表示確認", () => {
	test("ログインページがモバイルでも正しく表示される", async ({ page }) => {
		await page.setViewportSize(VIEWPORTS.mobile);
		await page.goto("/login");
		await waitForPageLoad(page);

		// Googleログインボタンが表示されている
		await expect(
			page.getByRole("button", { name: /Googleでログイン/i }),
		).toBeVisible();

		// カードコンポーネントが正しく表示されている
		await expect(page.locator('[class*="card"]').first()).toBeVisible();
	});

	test("ログインページがタブレットでも正しく表示される", async ({ page }) => {
		await page.setViewportSize(VIEWPORTS.tablet);
		await page.goto("/login");
		await waitForPageLoad(page);

		await expect(
			page.getByRole("button", { name: /Googleでログイン/i }),
		).toBeVisible();
	});

	test("ログインページがデスクトップで正しく表示される", async ({ page }) => {
		await page.setViewportSize(VIEWPORTS.desktop);
		await page.goto("/login");
		await waitForPageLoad(page);

		await expect(
			page.getByRole("button", { name: /Googleでログイン/i }),
		).toBeVisible();
	});
});

test.describe("アクセシビリティ基本確認", () => {
	test("ログインページにフォーカス可能な要素がある", async ({ page }) => {
		await page.goto("/login");
		await waitForPageLoad(page);

		// Tabキーでフォーカスが移動できる
		await page.keyboard.press("Tab");

		// フォーカスされた要素がある
		const focusedElement = page.locator(":focus");
		await expect(focusedElement).toBeVisible();
	});

	test("ボタンがrole=buttonとして認識される", async ({ page }) => {
		await page.goto("/login");
		await waitForPageLoad(page);

		// getByRoleで取得できれば、role=buttonとして認識されている
		const button = page.getByRole("button", { name: /Googleでログイン/i });
		await expect(button).toBeVisible();
		await expect(button).toBeEnabled();
	});
});
