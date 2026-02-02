import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// 画像最適化設定
	images: {
		// 外部画像ドメインの許可（必要に応じて追加）
		remotePatterns: [
			{
				protocol: "https",
				hostname: "*.supabase.co",
			},
			{
				protocol: "https",
				hostname: "lh3.googleusercontent.com", // Google OAuth プロフィール画像
			},
		],
		// 画像フォーマットの最適化
		formats: ["image/avif", "image/webp"],
		// デバイスサイズ
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		// 画像サイズ
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},

	// 実験的機能
	experimental: {
		// パッケージの最適化（トレースファイルサイズ削減）
		optimizePackageImports: [
			"recharts",
			"react-markdown",
			"@supabase/supabase-js",
			"@uiw/react-md-editor",
		],
	},

	// 本番ビルドの最適化
	poweredByHeader: false, // X-Powered-By ヘッダーを削除（セキュリティ）

	// コンパイラ設定
	compiler: {
		// console.log を本番環境で削除
		removeConsole:
			process.env.NODE_ENV === "production"
				? {
						exclude: ["error", "warn"],
					}
				: false,
	},
};

export default nextConfig;
