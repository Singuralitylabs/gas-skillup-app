import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Database } from "@/app/_types/database.types";

export async function GET(request: Request) {
	const { searchParams, origin } = new URL(request.url);
	const code = searchParams.get("code");

	if (code) {
		const cookieStore = await cookies();

		const supabase = createServerClient<Database>(
			process.env.NEXT_PUBLIC_SUPABASE_URL!,
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
			{
				cookies: {
					getAll() {
						return cookieStore.getAll();
					},
					setAll(cookiesToSet) {
						try {
							for (const { name, value, options } of cookiesToSet) {
								cookieStore.set(name, value, options);
							}
						} catch {
							// Server Component からの呼び出し時は無視
						}
					},
				},
			},
		);

		const { error } = await supabase.auth.exchangeCodeForSession(code);

		if (!error) {
			// 認証成功時、ユーザーのプロフィールを確認
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (user) {
				// プロフィールの承認状態を確認
				const { data: profile } = await supabase
					.from("profiles")
					.select("approved, role")
					.eq("id", user.id)
					.single();

				if (profile) {
					if (!profile.approved) {
						// 未承認の場合は承認待ちページへ
						return NextResponse.redirect(new URL("/pending-approval", origin));
					}
					// 承認済みの場合はロールに応じてリダイレクト
					const redirectPath =
						profile.role === "instructor"
							? "/instructor/dashboard"
							: "/student/dashboard";
					return NextResponse.redirect(new URL(redirectPath, origin));
				}
			}

			// プロフィールがまだ作成されていない場合（トリガーのタイミング）
			// 承認待ちページへリダイレクト
			return NextResponse.redirect(new URL("/pending-approval", origin));
		}
	}

	// エラー時はログインページへリダイレクト
	return NextResponse.redirect(new URL("/login?error=auth_failed", origin));
}
