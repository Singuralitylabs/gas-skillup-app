/**
 * Database型定義
 *
 * ⚠️ このファイルはSupabase CLIで自動生成されます
 * 手動で編集しないでください
 *
 * 生成コマンド:
 * npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.types.ts
 *
 * または
 * npx supabase gen types typescript --local > types/database.types.ts
 *
 * カスタム型定義は types/index.ts に配置してください
 */

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export interface Database {
	public: {
		Tables: {
			users: {
				Row: {
					id: string;
					email: string;
					name: string;
					role: string;
					approved: boolean;
					created_at: string;
				};
				Insert: {
					id: string;
					email: string;
					name: string;
					role?: string;
					approved?: boolean;
					created_at?: string;
				};
				Update: {
					id?: string;
					email?: string;
					name?: string;
					role?: string;
					approved?: boolean;
					created_at?: string;
				};
			};
			phases: {
				Row: {
					id: string;
					title: string;
					description: string | null;
					order_index: number;
					created_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					description?: string | null;
					order_index: number;
					created_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					description?: string | null;
					order_index?: number;
					created_at?: string;
				};
			};
			weeks: {
				Row: {
					id: string;
					phase_id: string;
					title: string;
					description: string | null;
					order_index: number;
					created_at: string;
				};
				Insert: {
					id?: string;
					phase_id: string;
					title: string;
					description?: string | null;
					order_index: number;
					created_at?: string;
				};
				Update: {
					id?: string;
					phase_id?: string;
					title?: string;
					description?: string | null;
					order_index?: number;
					created_at?: string;
				};
			};
			contents: {
				Row: {
					id: string;
					week_id: string;
					type: string;
					title: string;
					content: string;
					order_index: number;
					created_at: string;
				};
				Insert: {
					id?: string;
					week_id: string;
					type: string;
					title: string;
					content: string;
					order_index: number;
					created_at?: string;
				};
				Update: {
					id?: string;
					week_id?: string;
					type?: string;
					title?: string;
					content?: string;
					order_index?: number;
					created_at?: string;
				};
			};
			user_progress: {
				Row: {
					id: string;
					user_id: string;
					content_id: string;
					completed: boolean;
					completed_at: string | null;
				};
				Insert: {
					id?: string;
					user_id: string;
					content_id: string;
					completed?: boolean;
					completed_at?: string | null;
				};
				Update: {
					id?: string;
					user_id?: string;
					content_id?: string;
					completed?: boolean;
					completed_at?: string | null;
				};
			};
			submissions: {
				Row: {
					id: string;
					user_id: string;
					content_id: string;
					submission_type: string;
					content: string;
					feedback: string | null;
					feedback_at: string | null;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					content_id: string;
					submission_type: string;
					content: string;
					feedback?: string | null;
					feedback_at?: string | null;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					content_id?: string;
					submission_type?: string;
					content?: string;
					feedback?: string | null;
					feedback_at?: string | null;
					created_at?: string;
				};
			};
			announcements: {
				Row: {
					id: string;
					title: string;
					content: string;
					published_at: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					title: string;
					content: string;
					published_at?: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					title?: string;
					content?: string;
					published_at?: string;
					created_at?: string;
				};
			};
		};
	};
}
