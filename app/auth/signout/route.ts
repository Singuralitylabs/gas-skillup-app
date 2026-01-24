import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { Database } from "@/app/_types/database.types";

export async function POST(request: Request) {
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

	await supabase.auth.signOut();

	const { origin } = new URL(request.url);
	return NextResponse.redirect(new URL("/login", origin), {
		status: 302,
	});
}
