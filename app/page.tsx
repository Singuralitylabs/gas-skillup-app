import { redirect } from "next/navigation";

/**
 * トップページ - 認証状態に応じてリダイレクト
 *
 * 認証機能実装後のフロー:
 * - 未認証 → /login
 * - 未承認 → /pending-approval
 * - 承認済み・受講生 → /student/dashboard
 * - 承認済み・運営 → /instructor/dashboard
 *
 * TODO: Supabase Auth実装後、認証状態に応じたリダイレクトロジックを追加
 */
export default function Home() {
	// TODO: 認証状態の確認
	// const session = await getSession();
	// if (!session) {
	//   redirect("/login");
	// }
	// const user = await getUser(session.user.id);
	// if (!user.approved) {
	//   redirect("/pending-approval");
	// }
	// if (user.role === "instructor") {
	//   redirect("/instructor/dashboard");
	// }

	// 暫定: 認証機能実装まで受講生ダッシュボードにリダイレクト
	redirect("/student/dashboard");
}
