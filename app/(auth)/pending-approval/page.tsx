"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import { getCurrentUser, logout } from "@/lib/mock";

export default function PendingApprovalPage() {
	const router = useRouter();
	const [userName, setUserName] = useState("");

	useEffect(() => {
		const user = getCurrentUser();
		if (!user) {
			router.push("/login");
			return;
		}

		if (user.approved) {
			router.push("/student-dashboard");
			return;
		}

		setUserName(user.name);
	}, [router]);

	const handleLogout = () => {
		logout();
		router.push("/login");
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
			<Card className="max-w-md w-full">
				<CardHeader className="text-center space-y-2">
					<div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
						<svg
							className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</div>
					<CardTitle className="text-2xl">承認待ち</CardTitle>
					<CardDescription>
						{userName}さん、ご登録ありがとうございます
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="text-center space-y-3">
						<p className="text-sm text-muted-foreground">
							現在、運営による承認待ちの状態です。
						</p>
						<p className="text-sm text-muted-foreground">
							承認が完了次第、ご登録のメールアドレスに通知いたします。
						</p>
						<p className="text-sm text-muted-foreground">
							通常、1〜2営業日以内に承認いたします。
						</p>
					</div>

					<div className="border-t pt-4">
						<p className="text-sm font-medium mb-2">承認されると:</p>
						<ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
							<li>学習コンテンツへのアクセス</li>
							<li>課題の提出</li>
							<li>進捗の記録</li>
							<li>質問やサポートの利用</li>
						</ul>
					</div>

					<Button
						onClick={handleLogout}
						variant="outline"
						className="w-full mt-6"
					>
						ログアウト
					</Button>
				</CardContent>
			</Card>
		</div>
	);
}
