"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import {
	initializeStorage,
	mockSubmissions,
	mockUserProgress,
	mockUsers,
	setCurrentUser,
} from "@/lib/mock";

export default function LoginPage() {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState("");

	/**
	 * Google OAuth認証（モック実装）
	 * Sprint 1: 実際のGoogle OAuthではなくモック認証
	 * Sprint 3: Supabase AuthのGoogle OAuth統合に置き換え予定
	 */
	const handleGoogleLogin = async () => {
		setError("");
		setIsLoading(true);

		try {
			// モック認証: デフォルトで承認済み受講生1としてログイン
			// 実際のGoogle OAuth実装時は、Supabase Auth経由でGoogle認証を行う
			const user = mockUsers.find((u) => u.id === "user-1");

			if (!user) {
				setError("認証に失敗しました");
				setIsLoading(false);
				return;
			}

			// ローカルストレージを初期化（モックデータをセット）
			initializeStorage(mockUserProgress, mockSubmissions);

			// ユーザーをログイン状態に設定
			setCurrentUser(user);

			// わずかな遅延を追加して認証プロセスをシミュレート
			await new Promise((resolve) => setTimeout(resolve, 800));

			// ロールに応じてリダイレクト
			if (user.role === "instructor") {
				router.push("/instructor-dashboard");
			} else if (user.approved) {
				router.push("/student-dashboard");
			} else {
				router.push("/pending-approval");
			}
		} catch {
			setError("認証中にエラーが発生しました");
			setIsLoading(false);
		}
	};

	/**
	 * デモ用: 特定のユーザーとしてログイン
	 */
	const handleDemoLogin = async (userId: string) => {
		setError("");
		setIsLoading(true);

		const user = mockUsers.find((u) => u.id === userId);

		if (!user) {
			setError("ユーザーが見つかりません");
			setIsLoading(false);
			return;
		}

		// ローカルストレージを初期化
		initializeStorage(mockUserProgress, mockSubmissions);
		setCurrentUser(user);

		await new Promise((resolve) => setTimeout(resolve, 500));

		// ロールに応じてリダイレクト
		if (user.role === "instructor") {
			router.push("/instructor-dashboard");
		} else if (user.approved) {
			router.push("/student-dashboard");
		} else {
			router.push("/pending-approval");
		}
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="space-y-1">
					<CardTitle className="text-2xl text-center">ログイン</CardTitle>
					<CardDescription className="text-center">
						GAS学習支援プラットフォーム
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					{error && (
						<div className="text-sm text-red-600 text-center bg-red-50 dark:bg-red-950 p-3 rounded-md">
							{error}
						</div>
					)}

					{/* Google ログインボタン */}
					<Button
						onClick={handleGoogleLogin}
						className="w-full"
						size="lg"
						disabled={isLoading}
					>
						<svg
							className="w-5 h-5 mr-3"
							viewBox="0 0 24 24"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
								fill="#4285F4"
							/>
							<path
								d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
								fill="#34A853"
							/>
							<path
								d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
								fill="#FBBC05"
							/>
							<path
								d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
								fill="#EA4335"
							/>
						</svg>
						{isLoading ? "認証中..." : "Googleでログイン"}
					</Button>

					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">
								または
							</span>
						</div>
					</div>

					<p className="text-xs text-center text-muted-foreground">
						※ Sprint 1 モック実装: 実際のGoogle OAuth認証はSprint 3で実装予定
					</p>
				</CardContent>
			</Card>

			{/* デモ用: 異なるユーザーロールでログイン */}
			<Card>
				<CardHeader>
					<CardTitle className="text-lg">デモ用ログイン</CardTitle>
					<CardDescription>
						開発用: 異なるユーザーロールでログインできます
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => handleDemoLogin("user-1")}
						className="w-full justify-start"
						disabled={isLoading}
					>
						<span className="font-medium">承認済み受講生1:</span>
						<span className="ml-2 text-muted-foreground">
							student1@example.com
						</span>
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => handleDemoLogin("user-2")}
						className="w-full justify-start"
						disabled={isLoading}
					>
						<span className="font-medium">承認済み受講生2:</span>
						<span className="ml-2 text-muted-foreground">
							student2@example.com
						</span>
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => handleDemoLogin("user-3")}
						className="w-full justify-start"
						disabled={isLoading}
					>
						<span className="font-medium">未承認受講生:</span>
						<span className="ml-2 text-muted-foreground">
							student3@example.com
						</span>
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => handleDemoLogin("user-4")}
						className="w-full justify-start"
						disabled={isLoading}
					>
						<span className="font-medium">講師:</span>
						<span className="ml-2 text-muted-foreground">
							instructor@example.com
						</span>
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
