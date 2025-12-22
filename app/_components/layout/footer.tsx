import Link from "next/link";

export function Footer() {
	const currentYear = new Date().getFullYear();

	return (
		<footer className="border-t border-border bg-gray-800 px-4">
			<div className="container py-8">
				<div className="grid gap-8 md:grid-cols-3">
					{/* About */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold">GAS学習支援について</h3>
						<p className="text-sm text-muted-foreground">
							Google Apps
							Scriptを学ぶための総合的な学習支援プラットフォームです。
						</p>
					</div>

					{/* Links */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold">リンク</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/about"
									className="transition-colors hover:text-foreground"
								>
									サービスについて
								</Link>
							</li>
							<li>
								<Link
									href="/terms"
									className="transition-colors hover:text-foreground"
								>
									利用規約
								</Link>
							</li>
							<li>
								<Link
									href="/privacy"
									className="transition-colors hover:text-foreground"
								>
									プライバシーポリシー
								</Link>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div className="space-y-3">
						<h3 className="text-sm font-semibold">お問い合わせ</h3>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li>
								<Link
									href="/contact"
									className="transition-colors hover:text-foreground"
								>
									お問い合わせフォーム
								</Link>
							</li>
							<li>
								<Link
									href="/faq"
									className="transition-colors hover:text-foreground"
								>
									よくある質問
								</Link>
							</li>
						</ul>
					</div>
				</div>

				<div className="mt-8 border-t border-border pt-8 text-center text-sm text-muted-foreground">
					<p>&copy; {currentYear} GAS学習支援. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
