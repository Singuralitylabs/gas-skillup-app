import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/app/_lib/supabase/middleware";

// 認証不要なパス
const publicPaths = ["/login", "/auth/callback"];

// 承認待ちユーザーがアクセスできるパス
const pendingPaths = ["/pending-approval", "/auth/signout"];

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// 静的ファイルやAPIは除外
	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api") ||
		pathname.includes(".")
	) {
		return NextResponse.next();
	}

	// セッションを更新し、ユーザー情報を取得
	const { supabaseResponse, user, supabase } = await updateSession(request);

	// 公開パスの場合
	if (publicPaths.some((path) => pathname.startsWith(path))) {
		// ログイン済みの場合はリダイレクト
		if (user) {
			// プロフィール情報を取得して適切なページにリダイレクト
			const { data: profile } = await supabase
				.from("profiles")
				.select("approved, role")
				.eq("id", user.id)
				.single();

			if (profile) {
				if (!profile.approved) {
					return NextResponse.redirect(
						new URL("/pending-approval", request.url),
					);
				}
				// 承認済みの場合はロールに応じてリダイレクト
				const redirectPath =
					profile.role === "instructor"
						? "/instructor/dashboard"
						: "/student/dashboard";
				return NextResponse.redirect(new URL(redirectPath, request.url));
			}
		}
		return supabaseResponse;
	}

	// 未認証の場合はログインページへ
	if (!user) {
		const loginUrl = new URL("/login", request.url);
		loginUrl.searchParams.set("redirectTo", pathname);
		return NextResponse.redirect(loginUrl);
	}

	// プロフィール情報を取得
	const { data: profile } = await supabase
		.from("profiles")
		.select("approved, role")
		.eq("id", user.id)
		.single();

	// プロフィールが存在しない場合（初回登録時のレースコンディション対策）
	if (!profile) {
		// 少し待ってからリトライするか、pending-approvalに誘導
		return NextResponse.redirect(new URL("/pending-approval", request.url));
	}

	// 承認待ちパスの場合
	if (pendingPaths.some((path) => pathname.startsWith(path))) {
		// 承認済みの場合はダッシュボードへリダイレクト
		if (profile.approved) {
			const redirectPath =
				profile.role === "instructor"
					? "/instructor/dashboard"
					: "/student/dashboard";
			return NextResponse.redirect(new URL(redirectPath, request.url));
		}
		return supabaseResponse;
	}

	// 未承認ユーザーは承認待ちページへ
	if (!profile.approved) {
		return NextResponse.redirect(new URL("/pending-approval", request.url));
	}

	// ロールベースのアクセス制御
	if (pathname.startsWith("/instructor")) {
		if (profile.role !== "instructor") {
			// 学生が講師ページにアクセスしようとした場合
			return NextResponse.redirect(new URL("/student/dashboard", request.url));
		}
	}

	if (pathname.startsWith("/student")) {
		if (profile.role === "instructor") {
			// 講師が学生ページにアクセスしようとした場合（講師は学生ページも見れる）
			// ここでは許可する（講師は全てのコンテンツを確認できる）
		}
	}

	// ルートパスへのアクセス
	if (pathname === "/") {
		const redirectPath =
			profile.role === "instructor"
				? "/instructor/dashboard"
				: "/student/dashboard";
		return NextResponse.redirect(new URL(redirectPath, request.url));
	}

	return supabaseResponse;
}

export const config = {
	matcher: [
		/*
		 * 以下を除くすべてのリクエストパスにマッチ:
		 * - _next/static (静的ファイル)
		 * - _next/image (画像最適化ファイル)
		 * - favicon.ico (ファビコン)
		 */
		"/((?!_next/static|_next/image|favicon.ico).*)",
	],
};
