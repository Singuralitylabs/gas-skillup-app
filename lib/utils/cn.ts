import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind CSSのクラス名を結合するユーティリティ
 *
 * clsxとtailwind-mergeを組み合わせて、条件付きクラス名と
 * Tailwindクラスの衝突を適切に処理します
 *
 * @example
 * cn("px-2 py-1", "px-4") // => "py-1 px-4"
 * cn("bg-red-500", condition && "bg-blue-500") // => "bg-blue-500" (conditionがtrueの場合)
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
