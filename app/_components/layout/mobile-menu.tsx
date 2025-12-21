"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

export interface MobileMenuProps {
	/** ユーザーロール */
	userRole?: "student" | "instructor" | "admin";
	/** ユーザー名 */
	userName?: string;
	/** ナビゲーション項目 */
	navItems: Array<{ href: string; label: string }>;
}

/**
 * MobileMenu コンポーネント
 *
 * レスポンシブ対応のモバイルナビゲーションメニュー
 * md未満のブレークポイントで表示されるハンバーガーメニュー
 *
 * @example
 * ```tsx
 * <MobileMenu
 *   userRole="student"
 *   userName="山田太郎"
 *   navItems={[
 *     { href: "/dashboard", label: "ダッシュボード" },
 *     { href: "/contents", label: "学習コンテンツ" }
 *   ]}
 * />
 * ```
 */
export function MobileMenu({ userName, navItems }: MobileMenuProps) {
	const [isOpen, setIsOpen] = useState(false);

	// Escキーで閉じる
	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === "Escape" && isOpen) {
				setIsOpen(false);
			}
		};

		document.addEventListener("keydown", handleEscape);
		return () => document.removeEventListener("keydown", handleEscape);
	}, [isOpen]);

	// メニューが開いているときはbodyのスクロールを無効化
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}

		return () => {
			document.body.style.overflow = "";
		};
	}, [isOpen]);

	return (
		<>
			{/* ハンバーガーメニューボタン（md未満でのみ表示） */}
			<button
				type="button"
				onClick={() => setIsOpen(true)}
				className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
				aria-label="メニューを開く"
			>
				<svg
					className="w-6 h-6"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>メニュー</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>

			{/* オーバーレイ背景 */}
			{isOpen && (
				<div
					className="fixed inset-0 bg-black/50 z-50 md:hidden"
					onClick={() => setIsOpen(false)}
					onKeyDown={(e) => {
						if (e.key === "Enter" || e.key === " ") {
							setIsOpen(false);
						}
					}}
					role="button"
					tabIndex={0}
					aria-label="メニューを閉じる"
				/>
			)}

			{/* スライドアウトメニュー */}
			<div
				className={`fixed top-0 right-0 bottom-0 w-64 bg-background border-l border-border z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
					isOpen ? "translate-x-0" : "translate-x-full"
				}`}
			>
				<div className="flex flex-col h-full">
					{/* ヘッダー */}
					<div className="flex items-center justify-between p-4 border-b border-border">
						<span className="font-semibold">メニュー</span>
						<button
							type="button"
							onClick={() => setIsOpen(false)}
							className="p-2 text-muted-foreground hover:text-foreground transition-colors"
							aria-label="メニューを閉じる"
						>
							<svg
								className="w-5 h-5"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<title>閉じる</title>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* ユーザー情報 */}
					{userName && (
						<div className="p-4 border-b border-border">
							<p className="text-sm text-muted-foreground">ログイン中</p>
							<p className="font-medium">{userName}</p>
						</div>
					)}

					{/* ナビゲーションリンク */}
					<nav className="flex-1 overflow-y-auto">
						<ul className="p-2 space-y-1">
							{navItems.map((item) => (
								<li key={item.href}>
									<Link
										href={item.href}
										onClick={() => setIsOpen(false)}
										className="flex items-center px-4 py-3 text-sm font-medium rounded-lg text-foreground hover:bg-muted transition-colors"
									>
										{item.label}
									</Link>
								</li>
							))}
						</ul>
					</nav>

					{/* フッター */}
					<div className="p-4 border-t border-border">
						{userName ? (
							<Button
								variant="outline"
								className="w-full"
								onClick={() => setIsOpen(false)}
							>
								ログアウト
							</Button>
						) : (
							<Button className="w-full" onClick={() => setIsOpen(false)}>
								ログイン
							</Button>
						)}
					</div>
				</div>
			</div>
		</>
	);
}
