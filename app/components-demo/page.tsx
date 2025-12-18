import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Input,
	Progress,
	Select,
	Textarea,
} from "@/components/ui";

export default function ComponentsDemoPage() {
	return (
		<div className="min-h-screen bg-background p-8">
			<div className="mx-auto max-w-6xl space-y-8">
				{/* Header */}
				<div className="space-y-2">
					<h1 className="text-4xl font-bold text-foreground">
						UIコンポーネントデモ
					</h1>
					<p className="text-muted-foreground">
						共通UIコンポーネントの表示確認用ページ
					</p>
				</div>

				{/* Button Section */}
				<Card>
					<CardHeader>
						<CardTitle>Button</CardTitle>
						<CardDescription>
							様々なバリエーションのボタンコンポーネント
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-wrap gap-2">
							<Button variant="default">Default</Button>
							<Button variant="destructive">Destructive</Button>
							<Button variant="outline">Outline</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="link">Link</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button size="sm">Small</Button>
							<Button size="default">Default</Button>
							<Button size="lg">Large</Button>
							<Button size="icon">🚀</Button>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button disabled>Disabled</Button>
						</div>
					</CardContent>
				</Card>

				{/* Badge Section */}
				<Card>
					<CardHeader>
						<CardTitle>Badge</CardTitle>
						<CardDescription>ステータス表示用バッジ</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="flex flex-wrap gap-2">
							<Badge variant="default">Default</Badge>
							<Badge variant="secondary">Secondary</Badge>
							<Badge variant="success">Success</Badge>
							<Badge variant="warning">Warning</Badge>
							<Badge variant="destructive">Destructive</Badge>
						</div>
					</CardContent>
				</Card>

				{/* Input Section */}
				<Card>
					<CardHeader>
						<CardTitle>Input & Textarea</CardTitle>
						<CardDescription>入力フォームコンポーネント</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="input-normal" className="text-sm font-medium">
								通常の入力
							</label>
							<Input
								id="input-normal"
								type="text"
								placeholder="テキストを入力してください"
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="input-error" className="text-sm font-medium">
								エラー状態
							</label>
							<Input
								id="input-error"
								type="text"
								placeholder="エラー状態の入力欄"
								error
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="input-disabled" className="text-sm font-medium">
								無効化
							</label>
							<Input
								id="input-disabled"
								type="text"
								placeholder="無効化された入力欄"
								disabled
							/>
						</div>
						<div className="space-y-2">
							<label htmlFor="textarea-normal" className="text-sm font-medium">
								テキストエリア
							</label>
							<Textarea
								id="textarea-normal"
								placeholder="複数行のテキストを入力してください"
								rows={4}
							/>
						</div>
					</CardContent>
				</Card>

				{/* Select Section */}
				<Card>
					<CardHeader>
						<CardTitle>Select</CardTitle>
						<CardDescription>ドロップダウン選択</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="space-y-2">
							<label htmlFor="select-normal" className="text-sm font-medium">
								フェーズ選択
							</label>
							<Select id="select-normal">
								<option value="">選択してください</option>
								<option value="phase1">Phase 1: 基礎編</option>
								<option value="phase2">Phase 2: 応用編</option>
								<option value="phase3">Phase 3: 実践編</option>
							</Select>
						</div>
						<div className="space-y-2">
							<label htmlFor="select-error" className="text-sm font-medium">
								エラー状態
							</label>
							<Select id="select-error" error>
								<option value="">選択してください</option>
								<option value="option1">オプション1</option>
								<option value="option2">オプション2</option>
							</Select>
						</div>
					</CardContent>
				</Card>

				{/* Progress Section */}
				<Card>
					<CardHeader>
						<CardTitle>Progress</CardTitle>
						<CardDescription>進捗バー</CardDescription>
					</CardHeader>
					<CardContent className="space-y-6">
						<div className="space-y-2">
							<p className="text-sm font-medium">Default (30%)</p>
							<Progress value={30} variant="default" />
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Success (70%)</p>
							<Progress value={70} variant="success" />
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Warning (50%)</p>
							<Progress value={50} variant="warning" />
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">Destructive (20%)</p>
							<Progress value={20} variant="destructive" />
						</div>
						<div className="space-y-2">
							<p className="text-sm font-medium">ラベル表示あり (85%)</p>
							<Progress value={85} variant="success" showLabel />
						</div>
					</CardContent>
				</Card>

				{/* Card Section */}
				<Card>
					<CardHeader>
						<CardTitle>Card</CardTitle>
						<CardDescription>カードコンポーネントの構成例</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-2">
							<Card>
								<CardHeader>
									<CardTitle>カードタイトル</CardTitle>
									<CardDescription>カードの説明文</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-sm">
										カードのコンテンツエリアです。様々な内容を表示できます。
									</p>
								</CardContent>
								<CardFooter>
									<Button className="w-full">アクション</Button>
								</CardFooter>
							</Card>

							<Card>
								<CardHeader>
									<CardTitle>学習コンテンツ</CardTitle>
									<CardDescription>Week 1 - 基礎編</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									<div className="flex items-center justify-between">
										<span className="text-sm">進捗状況</span>
										<Badge variant="success">完了</Badge>
									</div>
									<Progress value={100} variant="success" showLabel />
								</CardContent>
								<CardFooter className="gap-2">
									<Button variant="outline" className="flex-1">
										復習
									</Button>
									<Button className="flex-1">次へ</Button>
								</CardFooter>
							</Card>
						</div>
					</CardContent>
				</Card>

				{/* Color Palette */}
				<Card>
					<CardHeader>
						<CardTitle>カラーパレット</CardTitle>
						<CardDescription>定義されているカラー一覧</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="grid gap-4 md:grid-cols-3">
							<div className="space-y-2">
								<div className="h-20 rounded-md bg-primary" />
								<p className="text-sm font-medium">Primary</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-md bg-secondary" />
								<p className="text-sm font-medium">Secondary</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-md bg-accent" />
								<p className="text-sm font-medium">Accent</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-md bg-success" />
								<p className="text-sm font-medium">Success</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-md bg-warning" />
								<p className="text-sm font-medium">Warning</p>
							</div>
							<div className="space-y-2">
								<div className="h-20 rounded-md bg-destructive" />
								<p className="text-sm font-medium">Destructive</p>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Footer Note */}
				<div className="rounded-lg border border-border bg-muted p-4">
					<p className="text-sm text-muted-foreground">
						💡 <strong>ダークモード確認:</strong>{" "}
						システムのダークモード設定を変更して、カラーテーマの切り替えを確認できます。
					</p>
				</div>
			</div>
		</div>
	);
}
