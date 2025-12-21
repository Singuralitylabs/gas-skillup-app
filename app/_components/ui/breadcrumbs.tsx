import Link from "next/link";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
	/** 表示ラベル */
	label: string;
	/** リンク先URL（最後の項目以外は必須） */
	href?: string;
}

export interface BreadcrumbsProps {
	/** パンくずリストのアイテム */
	items: BreadcrumbItem[];
	/** カスタムスタイル */
	className?: string;
	/** セパレーター文字（デフォルト: /） */
	separator?: string;
}

/**
 * Breadcrumbs コンポーネント
 *
 * ページ階層を示すパンくずリストコンポーネント
 *
 * @example
 * ```tsx
 * <Breadcrumbs
 *   items={[
 *     { label: "ホーム", href: "/" },
 *     { label: "コンテンツ", href: "/contents" },
 *     { label: "詳細" }
 *   ]}
 * />
 * ```
 */
export function Breadcrumbs({
	items,
	className,
	separator = "/",
}: BreadcrumbsProps) {
	if (items.length === 0) return null;

	return (
		<nav
			aria-label="パンくずリスト"
			className={cn("flex items-center gap-2 text-sm", className)}
		>
			{items.map((item, index) => {
				const isLast = index === items.length - 1;

				return (
					<div
						key={`${item.label}-${index}`}
						className="flex items-center gap-2"
					>
						{isLast || !item.href ? (
							<span className="text-foreground font-medium">{item.label}</span>
						) : (
							<Link
								href={item.href}
								className="text-muted-foreground hover:text-foreground transition-colors"
							>
								{item.label}
							</Link>
						)}

						{!isLast && (
							<span className="text-muted-foreground" aria-hidden="true">
								{separator}
							</span>
						)}
					</div>
				);
			})}
		</nav>
	);
}

/**
 * BreadcrumbSeparator コンポーネント
 *
 * パンくずリスト用のカスタムセパレーター
 * アイコンやカスタム要素を使用する場合に使用
 *
 * @example
 * ```tsx
 * <BreadcrumbSeparator>
 *   <ChevronRight className="w-4 h-4" />
 * </BreadcrumbSeparator>
 * ```
 */
export function BreadcrumbSeparator({
	children,
	className,
}: {
	children?: React.ReactNode;
	className?: string;
}) {
	return (
		<span className={cn("text-muted-foreground", className)} aria-hidden="true">
			{children ?? "/"}
		</span>
	);
}
