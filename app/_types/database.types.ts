/**
 * Database型定義
 *
 * ⚠️ このファイルはSupabase MCPで自動生成されます
 * 手動で編集しないでください
 *
 * 生成コマンド（MCP経由）:
 * mcp__supabase__generate_typescript_types
 */

export type Json =
	| string
	| number
	| boolean
	| null
	| { [key: string]: Json | undefined }
	| Json[];

export type Database = {
	__InternalSupabase: {
		PostgrestVersion: "14.1";
	};
	public: {
		Tables: {
			announcements: {
				Row: {
					content: string;
					created_at: string;
					id: string;
					published_at: string | null;
					title: string;
					updated_at: string;
				};
				Insert: {
					content: string;
					created_at?: string;
					id?: string;
					published_at?: string | null;
					title: string;
					updated_at?: string;
				};
				Update: {
					content?: string;
					created_at?: string;
					id?: string;
					published_at?: string | null;
					title?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			contents: {
				Row: {
					content: string | null;
					created_at: string;
					id: string;
					order_index: number;
					title: string;
					type: Database["public"]["Enums"]["content_type"];
					updated_at: string;
					week_id: string;
				};
				Insert: {
					content?: string | null;
					created_at?: string;
					id?: string;
					order_index?: number;
					title: string;
					type: Database["public"]["Enums"]["content_type"];
					updated_at?: string;
					week_id: string;
				};
				Update: {
					content?: string | null;
					created_at?: string;
					id?: string;
					order_index?: number;
					title?: string;
					type?: Database["public"]["Enums"]["content_type"];
					updated_at?: string;
					week_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "contents_week_id_fkey";
						columns: ["week_id"];
						isOneToOne: false;
						referencedRelation: "weeks";
						referencedColumns: ["id"];
					},
				];
			};
			notifications: {
				Row: {
					content: string;
					created_at: string | null;
					id: string;
					is_read: boolean | null;
					read_at: string | null;
					related_id: string | null;
					title: string;
					type: Database["public"]["Enums"]["notification_type"];
					updated_at: string | null;
					user_id: string;
				};
				Insert: {
					content: string;
					created_at?: string | null;
					id?: string;
					is_read?: boolean | null;
					read_at?: string | null;
					related_id?: string | null;
					title: string;
					type: Database["public"]["Enums"]["notification_type"];
					updated_at?: string | null;
					user_id: string;
				};
				Update: {
					content?: string;
					created_at?: string | null;
					id?: string;
					is_read?: boolean | null;
					read_at?: string | null;
					related_id?: string | null;
					title?: string;
					type?: Database["public"]["Enums"]["notification_type"];
					updated_at?: string | null;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "notifications_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			phases: {
				Row: {
					created_at: string;
					description: string | null;
					id: string;
					order_index: number;
					title: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					id?: string;
					order_index?: number;
					title: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: string;
					order_index?: number;
					title?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					approved: boolean;
					created_at: string;
					email: string;
					id: string;
					name: string | null;
					role: Database["public"]["Enums"]["user_role"];
					updated_at: string;
				};
				Insert: {
					approved?: boolean;
					created_at?: string;
					email: string;
					id: string;
					name?: string | null;
					role?: Database["public"]["Enums"]["user_role"];
					updated_at?: string;
				};
				Update: {
					approved?: boolean;
					created_at?: string;
					email?: string;
					id?: string;
					name?: string | null;
					role?: Database["public"]["Enums"]["user_role"];
					updated_at?: string;
				};
				Relationships: [];
			};
			submissions: {
				Row: {
					content: string;
					content_id: string;
					created_at: string;
					feedback: string | null;
					feedback_at: string | null;
					id: string;
					submission_type: Database["public"]["Enums"]["submission_type"];
					updated_at: string;
					user_id: string;
				};
				Insert: {
					content: string;
					content_id: string;
					created_at?: string;
					feedback?: string | null;
					feedback_at?: string | null;
					id?: string;
					submission_type: Database["public"]["Enums"]["submission_type"];
					updated_at?: string;
					user_id: string;
				};
				Update: {
					content?: string;
					content_id?: string;
					created_at?: string;
					feedback?: string | null;
					feedback_at?: string | null;
					id?: string;
					submission_type?: Database["public"]["Enums"]["submission_type"];
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "submissions_content_id_fkey";
						columns: ["content_id"];
						isOneToOne: false;
						referencedRelation: "contents";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "submissions_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			user_progress: {
				Row: {
					completed: boolean;
					completed_at: string | null;
					content_id: string;
					created_at: string;
					id: string;
					updated_at: string;
					user_id: string;
				};
				Insert: {
					completed?: boolean;
					completed_at?: string | null;
					content_id: string;
					created_at?: string;
					id?: string;
					updated_at?: string;
					user_id: string;
				};
				Update: {
					completed?: boolean;
					completed_at?: string | null;
					content_id?: string;
					created_at?: string;
					id?: string;
					updated_at?: string;
					user_id?: string;
				};
				Relationships: [
					{
						foreignKeyName: "user_progress_content_id_fkey";
						columns: ["content_id"];
						isOneToOne: false;
						referencedRelation: "contents";
						referencedColumns: ["id"];
					},
					{
						foreignKeyName: "user_progress_user_id_fkey";
						columns: ["user_id"];
						isOneToOne: false;
						referencedRelation: "profiles";
						referencedColumns: ["id"];
					},
				];
			};
			weeks: {
				Row: {
					created_at: string;
					description: string | null;
					id: string;
					order_index: number;
					phase_id: string;
					title: string;
					updated_at: string;
				};
				Insert: {
					created_at?: string;
					description?: string | null;
					id?: string;
					order_index?: number;
					phase_id: string;
					title: string;
					updated_at?: string;
				};
				Update: {
					created_at?: string;
					description?: string | null;
					id?: string;
					order_index?: number;
					phase_id?: string;
					title?: string;
					updated_at?: string;
				};
				Relationships: [
					{
						foreignKeyName: "weeks_phase_id_fkey";
						columns: ["phase_id"];
						isOneToOne: false;
						referencedRelation: "phases";
						referencedColumns: ["id"];
					},
				];
			};
		};
		Views: {
			[_ in never]: never;
		};
		Functions: {
			is_approved: { Args: Record<string, never>; Returns: boolean };
			is_instructor: { Args: Record<string, never>; Returns: boolean };
		};
		Enums: {
			content_type: "video" | "text" | "exercise";
			notification_type: "feedback" | "announcement" | "approval";
			submission_type: "code" | "url";
			user_role: "student" | "instructor";
		};
		CompositeTypes: {
			[_ in never]: never;
		};
	};
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
	keyof Database,
	"public"
>];

export type Tables<
	DefaultSchemaTableNameOrOptions extends
		| keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
				DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
			DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
			Row: infer R;
		}
		? R
		: never
	: DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
				DefaultSchema["Views"])
		? (DefaultSchema["Tables"] &
				DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
				Row: infer R;
			}
			? R
			: never
		: never;

export type TablesInsert<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Insert: infer I;
		}
		? I
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Insert: infer I;
			}
			? I
			: never
		: never;

export type TablesUpdate<
	DefaultSchemaTableNameOrOptions extends
		| keyof DefaultSchema["Tables"]
		| { schema: keyof DatabaseWithoutInternals },
	TableName extends DefaultSchemaTableNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
		: never = never,
> = DefaultSchemaTableNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
			Update: infer U;
		}
		? U
		: never
	: DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
		? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
				Update: infer U;
			}
			? U
			: never
		: never;

export type Enums<
	DefaultSchemaEnumNameOrOptions extends
		| keyof DefaultSchema["Enums"]
		| { schema: keyof DatabaseWithoutInternals },
	EnumName extends DefaultSchemaEnumNameOrOptions extends {
		schema: keyof DatabaseWithoutInternals;
	}
		? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
		: never = never,
> = DefaultSchemaEnumNameOrOptions extends {
	schema: keyof DatabaseWithoutInternals;
}
	? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
	: DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
		? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
		: never;

// 便利な型エイリアス
export type Profile = Tables<"profiles">;
export type Phase = Tables<"phases">;
export type Week = Tables<"weeks">;
export type Content = Tables<"contents">;
export type UserProgress = Tables<"user_progress">;
export type Submission = Tables<"submissions">;
export type Announcement = Tables<"announcements">;
export type Notification = Tables<"notifications">;

export type UserRole = Enums<"user_role">;
export type ContentType = Enums<"content_type">;
export type SubmissionType = Enums<"submission_type">;
export type NotificationType = Enums<"notification_type">;
