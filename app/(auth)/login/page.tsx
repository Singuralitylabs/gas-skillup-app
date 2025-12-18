import {
	Button,
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
	Input,
} from "@/components/ui";

export default function LoginPage() {
	return (
		<Card>
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl text-center">ログイン</CardTitle>
				<CardDescription className="text-center">
					GAS学習支援プラットフォーム
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="email" className="text-sm font-medium">
						メールアドレス
					</label>
					<Input
						id="email"
						type="email"
						placeholder="example@email.com"
						required
					/>
				</div>
				<div className="space-y-2">
					<label htmlFor="password" className="text-sm font-medium">
						パスワード
					</label>
					<Input id="password" type="password" required />
				</div>
				<Button className="w-full">ログイン</Button>
				<div className="text-center text-sm text-muted-foreground">
					<a href="#" className="underline hover:text-foreground">
						パスワードを忘れた方
					</a>
				</div>
			</CardContent>
		</Card>
	);
}
