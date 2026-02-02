"use client";

import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

// Toast types
export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	type: ToastType;
	title: string;
	description?: string;
	duration?: number;
}

interface ToastContextType {
	toasts: Toast[];
	addToast: (toast: Omit<Toast, "id">) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

// Toast Provider
export function ToastProvider({ children }: { children: ReactNode }) {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((toast: Omit<Toast, "id">) => {
		const id = Math.random().toString(36).substring(2, 9);
		setToasts((prev) => [...prev, { ...toast, id }]);
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast }}>
			{children}
			<ToastContainer />
		</ToastContext.Provider>
	);
}

// Hook to use toast
export function useToast() {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within a ToastProvider");
	}

	const toast = {
		success: (title: string, description?: string) => {
			context.addToast({ type: "success", title, description, duration: 3000 });
		},
		error: (title: string, description?: string) => {
			context.addToast({ type: "error", title, description, duration: 5000 });
		},
		warning: (title: string, description?: string) => {
			context.addToast({ type: "warning", title, description, duration: 4000 });
		},
		info: (title: string, description?: string) => {
			context.addToast({ type: "info", title, description, duration: 3000 });
		},
	};

	return toast;
}

// Toast Container
function ToastContainer() {
	const context = useContext(ToastContext);
	if (!context) return null;

	return (
		<div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
			{context.toasts.map((toast) => (
				<ToastItem
					key={toast.id}
					toast={toast}
					onDismiss={() => context.removeToast(toast.id)}
				/>
			))}
		</div>
	);
}

// Individual Toast Item
function ToastItem({
	toast,
	onDismiss,
}: {
	toast: Toast;
	onDismiss: () => void;
}) {
	const [isVisible, setIsVisible] = useState(false);
	const [isLeaving, setIsLeaving] = useState(false);

	useEffect(() => {
		// Trigger enter animation
		const showTimer = setTimeout(() => setIsVisible(true), 10);

		// Auto dismiss
		const dismissTimer = setTimeout(() => {
			setIsLeaving(true);
			setTimeout(onDismiss, 200);
		}, toast.duration ?? 3000);

		return () => {
			clearTimeout(showTimer);
			clearTimeout(dismissTimer);
		};
	}, [toast.duration, onDismiss]);

	const handleDismiss = () => {
		setIsLeaving(true);
		setTimeout(onDismiss, 200);
	};

	const typeStyles = {
		success: "bg-green-50 border-green-200 text-green-800",
		error: "bg-red-50 border-red-200 text-red-800",
		warning: "bg-yellow-50 border-yellow-200 text-yellow-800",
		info: "bg-blue-50 border-blue-200 text-blue-800",
	};

	const iconColors = {
		success: "text-green-500",
		error: "text-red-500",
		warning: "text-yellow-500",
		info: "text-blue-500",
	};

	return (
		<div
			className={`
				pointer-events-auto w-full rounded-lg border p-4 shadow-lg
				transition-all duration-200 ease-out
				${typeStyles[toast.type]}
				${isVisible && !isLeaving ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
			`}
		>
			<div className="flex items-start gap-3">
				{/* Icon */}
				<div className={`shrink-0 ${iconColors[toast.type]}`}>
					{toast.type === "success" && (
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>成功</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					)}
					{toast.type === "error" && (
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>エラー</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					)}
					{toast.type === "warning" && (
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>警告</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
							/>
						</svg>
					)}
					{toast.type === "info" && (
						<svg
							className="w-5 h-5"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<title>情報</title>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					)}
				</div>

				{/* Content */}
				<div className="flex-1 min-w-0">
					<p className="text-sm font-medium">{toast.title}</p>
					{toast.description && (
						<p className="text-sm opacity-80 mt-1">{toast.description}</p>
					)}
				</div>

				{/* Dismiss button */}
				<button
					type="button"
					onClick={handleDismiss}
					className="shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
				>
					<svg
						className="w-4 h-4 opacity-60"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<title>閉じる</title>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	);
}
