/**
 * バリデーションユーティリティ
 *
 * 入力値の検証とサニタイズを行う
 */

/**
 * バリデーション結果の型
 */
export type ValidationResult<T> =
	| { success: true; data: T }
	| { success: false; error: string };

/**
 * 文字列の長さを検証
 */
export function validateLength(
	value: string,
	min: number,
	max: number,
	fieldName: string,
): ValidationResult<string> {
	const trimmed = value.trim();

	if (trimmed.length < min) {
		return {
			success: false,
			error: `${fieldName}は${min}文字以上で入力してください`,
		};
	}

	if (trimmed.length > max) {
		return {
			success: false,
			error: `${fieldName}は${max}文字以内で入力してください`,
		};
	}

	return { success: true, data: trimmed };
}

/**
 * 必須フィールドの検証
 */
export function validateRequired(
	value: unknown,
	fieldName: string,
): ValidationResult<string> {
	if (value === null || value === undefined) {
		return { success: false, error: `${fieldName}は必須です` };
	}

	if (typeof value === "string") {
		const trimmed = value.trim();
		if (trimmed.length === 0) {
			return { success: false, error: `${fieldName}は必須です` };
		}
		return { success: true, data: trimmed };
	}

	return { success: false, error: `${fieldName}の形式が不正です` };
}

/**
 * UUIDの形式を検証
 */
export function validateUUID(
	value: string,
	fieldName: string,
): ValidationResult<string> {
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

	if (!uuidRegex.test(value)) {
		return { success: false, error: `${fieldName}の形式が不正です` };
	}

	return { success: true, data: value };
}

/**
 * URLの形式を検証
 */
export function validateURL(
	value: string,
	fieldName: string,
	options?: { allowedHosts?: string[] },
): ValidationResult<string> {
	try {
		const url = new URL(value);

		// HTTPSのみ許可
		if (url.protocol !== "https:") {
			return {
				success: false,
				error: `${fieldName}はHTTPSのURLを指定してください`,
			};
		}

		// 許可されたホストの検証
		if (options?.allowedHosts && options.allowedHosts.length > 0) {
			const isAllowed = options.allowedHosts.some(
				(host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
			);
			if (!isAllowed) {
				return {
					success: false,
					error: `${fieldName}は許可されていないURLです`,
				};
			}
		}

		return { success: true, data: value };
	} catch {
		return { success: false, error: `${fieldName}のURL形式が不正です` };
	}
}

/**
 * YouTube URLの検証
 */
export function validateYouTubeURL(
	value: string,
	fieldName: string,
): ValidationResult<string> {
	const youtubeRegex =
		/^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+(&.*)?$/i;

	if (!youtubeRegex.test(value)) {
		return {
			success: false,
			error: `${fieldName}は有効なYouTube URLを指定してください`,
		};
	}

	return { success: true, data: value };
}

/**
 * メールアドレスの形式を検証
 */
export function validateEmail(
	value: string,
	fieldName: string,
): ValidationResult<string> {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

	if (!emailRegex.test(value)) {
		return {
			success: false,
			error: `${fieldName}のメールアドレス形式が不正です`,
		};
	}

	return { success: true, data: value.toLowerCase() };
}

/**
 * 列挙型の値を検証
 */
export function validateEnum<T extends string>(
	value: string,
	allowedValues: readonly T[],
	fieldName: string,
): ValidationResult<T> {
	if (!allowedValues.includes(value as T)) {
		return {
			success: false,
			error: `${fieldName}の値が不正です`,
		};
	}

	return { success: true, data: value as T };
}

/**
 * 数値の範囲を検証
 */
export function validateNumberRange(
	value: number,
	min: number,
	max: number,
	fieldName: string,
): ValidationResult<number> {
	if (Number.isNaN(value)) {
		return { success: false, error: `${fieldName}は数値で入力してください` };
	}

	if (value < min || value > max) {
		return {
			success: false,
			error: `${fieldName}は${min}から${max}の範囲で入力してください`,
		};
	}

	return { success: true, data: value };
}

/**
 * 配列の長さを検証
 */
export function validateArrayLength<T>(
	value: T[],
	min: number,
	max: number,
	fieldName: string,
): ValidationResult<T[]> {
	if (value.length < min) {
		return {
			success: false,
			error: `${fieldName}は${min}個以上必要です`,
		};
	}

	if (value.length > max) {
		return {
			success: false,
			error: `${fieldName}は${max}個以内にしてください`,
		};
	}

	return { success: true, data: value };
}

/**
 * 複数のバリデーション結果を組み合わせる
 */
export function combineValidations<T extends Record<string, unknown>>(
	validations: { [K in keyof T]: ValidationResult<T[K]> },
): ValidationResult<T> {
	const errors: string[] = [];
	const data: Partial<T> = {};

	for (const [key, result] of Object.entries(validations)) {
		if (result.success) {
			(data as Record<string, unknown>)[key] = result.data;
		} else {
			errors.push(result.error);
		}
	}

	if (errors.length > 0) {
		return { success: false, error: errors.join("、") };
	}

	return { success: true, data: data as T };
}

/**
 * バリデーションルールビルダー
 */
export class Validator<T> {
	private rules: Array<(value: T) => ValidationResult<T>> = [];

	required(fieldName: string): this {
		this.rules.push((value) => {
			if (value === null || value === undefined || value === "") {
				return { success: false, error: `${fieldName}は必須です` };
			}
			return { success: true, data: value };
		});
		return this;
	}

	custom(fn: (value: T) => ValidationResult<T>): this {
		this.rules.push(fn);
		return this;
	}

	validate(value: T): ValidationResult<T> {
		for (const rule of this.rules) {
			const result = rule(value);
			if (!result.success) {
				return result;
			}
		}
		return { success: true, data: value };
	}
}
