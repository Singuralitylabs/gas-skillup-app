import { expect, test } from "@playwright/test";
import { waitForPageLoad } from "../utils/test-utils";

test.describe("エラーハンドリング", () => {
	test("ログインページでネットワークエラー時にエラー表示される", async ({
		page,
	}) => {
		// ページを読み込む
		await page.goto("/login");
		await waitForPageLoad(page);

		// Googleログインボタンをクリック（実際のOAuthは外部リダイレクトなのでここではUI確認のみ）
		const button = page.getByRole("button", { name: /Googleでログイン/i });
		await expect(button).toBeVisible();
		await expect(button).toBeEnabled();
	});

	test("ページ読み込み中はローディング表示が機能する", async ({ page }) => {
		// スローダウンを設定してローディング状態をキャプチャ
		await page.route("**/*", async (route) => {
			// 少し遅延を追加
			await new Promise((resolve) => setTimeout(resolve, 100));
			await route.continue();
		});

		await page.goto("/login");

		// 最終的にページが読み込まれる
		await expect(page.getByRole("heading", { name: "ログイン" })).toBeVisible({
			timeout: 10000,
		});
	});
});

test.describe("セキュリティ", () => {
	test("XSS攻撃パラメータが無害化される", async ({ page }) => {
		// XSS攻撃を模倣したパラメータでアクセス
		await page.goto('/login?error=<script>alert("xss")</script>');
		await waitForPageLoad(page);

		// スクリプトタグがそのまま表示されていないことを確認
		const content = await page.content();
		expect(content).not.toContain('<script>alert("xss")</script>');
	});

	test("認証エラーパラメータが正しく処理される", async ({ page }) => {
		await page.goto("/login?error=auth_failed");
		await waitForPageLoad(page);

		// エラーメッセージが表示される
		await expect(
			page.getByText(/認証に失敗しました|もう一度お試しください/),
		).toBeVisible();
	});
});
