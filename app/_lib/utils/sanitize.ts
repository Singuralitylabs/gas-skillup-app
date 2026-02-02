/**
 * サニタイズユーティリティ
 *
 * XSS対策とデータクリーニングを行う
 */

/**
 * HTMLエンティティをエスケープ
 *
 * XSS対策の基本的なエスケープ処理
 */
export function escapeHtml(str: string): string {
	const htmlEscapes: Record<string, string> = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		'"': "&quot;",
		"'": "&#x27;",
		"/": "&#x2F;",
		"`": "&#x60;",
		"=": "&#x3D;",
	};

	return str.replace(/[&<>"'`=/]/g, (char) => htmlEscapes[char]);
}

/**
 * URLのサニタイズ
 *
 * javascript: や data: などの危険なスキームを除去
 */
export function sanitizeUrl(url: string): string {
	const trimmed = url.trim();

	// 空文字の場合はそのまま返す
	if (!trimmed) {
		return "";
	}

	// 危険なスキームのチェック
	const dangerousSchemes = [
		"javascript:",
		"data:",
		"vbscript:",
		"file:",
		"about:",
	];

	const lowerUrl = trimmed.toLowerCase();
	for (const scheme of dangerousSchemes) {
		if (lowerUrl.startsWith(scheme)) {
			return "";
		}
	}

	// 相対URLまたは安全なスキームのみ許可
	const safeSchemes = ["http:", "https:", "mailto:", "tel:"];
	const hasScheme = /^[a-z][a-z0-9+.-]*:/i.test(trimmed);

	if (hasScheme) {
		const isSafe = safeSchemes.some((scheme) => lowerUrl.startsWith(scheme));
		if (!isSafe) {
			return "";
		}
	}

	return trimmed;
}

/**
 * 文字列から制御文字を除去
 */
export function removeControlCharacters(str: string): string {
	// 制御文字（U+0000-U+001F, U+007F-U+009F）を除去
	// ただし、タブ(0x09)、改行(0x0A)、キャリッジリターン(0x0D)は許可
	return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");
}

/**
 * 文字列のトリムと正規化
 */
export function normalizeString(str: string): string {
	return removeControlCharacters(str).trim().replace(/\s+/g, " "); // 連続する空白を単一スペースに
}

/**
 * テキストコンテンツのサニタイズ
 *
 * 一般的なテキスト入力に使用
 */
export function sanitizeText(text: string): string {
	return normalizeString(text);
}

/**
 * マークダウンコンテンツのサニタイズ
 *
 * マークダウン形式のテキストに使用
 * HTMLタグは許可するが、危険なスクリプトは除去
 */
export function sanitizeMarkdown(markdown: string): string {
	let sanitized = removeControlCharacters(markdown);

	// scriptタグを除去
	sanitized = sanitized.replace(
		/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		"",
	);

	// onerror, onclick などのイベントハンドラを除去
	sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, "");
	sanitized = sanitized.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, "");

	// javascript: URLを除去
	sanitized = sanitized.replace(/javascript:/gi, "");

	// data: URLを除去（画像以外）
	sanitized = sanitized.replace(/data:(?!image\/)/gi, "");

	return sanitized.trim();
}

/**
 * ファイル名のサニタイズ
 */
export function sanitizeFilename(filename: string): string {
	// パストラバーサル対策
	let sanitized = filename.replace(/\.\./g, "");

	// 危険な文字を除去
	sanitized = sanitized.replace(/[<>:"/\\|?*\x00-\x1F]/g, "");

	// 先頭と末尾のドットとスペースを除去
	sanitized = sanitized.replace(/^[.\s]+|[.\s]+$/g, "");

	// 空文字になった場合はデフォルト名を返す
	if (!sanitized) {
		return "unnamed";
	}

	return sanitized;
}

/**
 * SQLインジェクション対策のエスケープ
 *
 * 注意: Supabaseのパラメータ化クエリを使用している場合は不要
 * 直接SQLを構築する場合のみ使用
 */
export function escapeSql(str: string): string {
	return str
		.replace(/'/g, "''")
		.replace(/\\/g, "\\\\")
		.replace(/\x00/g, "\\0")
		.replace(/\n/g, "\\n")
		.replace(/\r/g, "\\r")
		.replace(/\x1a/g, "\\Z");
}

/**
 * JSONサニタイズ
 *
 * JSON文字列として安全にシリアライズ
 */
export function sanitizeForJson(str: string): string {
	return str
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/\n/g, "\\n")
		.replace(/\r/g, "\\r")
		.replace(/\t/g, "\\t");
}

/**
 * ログ出力用のサニタイズ
 *
 * ログインジェクション対策
 */
export function sanitizeForLog(str: string): string {
	return removeControlCharacters(str)
		.replace(/\n/g, "\\n")
		.replace(/\r/g, "\\r")
		.substring(0, 1000); // 長すぎる文字列を切り詰め
}

/**
 * 入力値を安全な形式に変換するユーティリティ
 */
export const sanitize = {
	text: sanitizeText,
	markdown: sanitizeMarkdown,
	url: sanitizeUrl,
	filename: sanitizeFilename,
	html: escapeHtml,
	sql: escapeSql,
	json: sanitizeForJson,
	log: sanitizeForLog,
} as const;
