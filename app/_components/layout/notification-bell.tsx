"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
	markAllNotificationsAsRead,
	markNotificationAsRead,
} from "@/app/_actions/notifications";
import type { Notification } from "@/types/database.types";

interface NotificationBellProps {
	notifications: Notification[];
	unreadCount: number;
}

export function NotificationBell({
	notifications,
	unreadCount,
}: NotificationBellProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [localUnreadCount, setLocalUnreadCount] = useState(unreadCount);
	const [localNotifications, setLocalNotifications] = useState(notifications);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Close dropdown when clicking outside
	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Update local state when props change
	useEffect(() => {
		setLocalUnreadCount(unreadCount);
		setLocalNotifications(notifications);
	}, [unreadCount, notifications]);

	const handleNotificationClick = async (notificationId: string) => {
		const notification = localNotifications.find(
			(n) => n.id === notificationId,
		);
		if (notification && !notification.is_read) {
			setLocalUnreadCount((prev) => Math.max(0, prev - 1));
			setLocalNotifications((prev) =>
				prev.map((n) =>
					n.id === notificationId ? { ...n, is_read: true } : n,
				),
			);
			await markNotificationAsRead(notificationId);
		}
		setIsOpen(false);
	};

	const handleMarkAllAsRead = async () => {
		setLocalUnreadCount(0);
		setLocalNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
		await markAllNotificationsAsRead();
	};

	const formatTimeAgo = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffMs = now.getTime() - date.getTime();
		const diffMins = Math.floor(diffMs / 60000);
		const diffHours = Math.floor(diffMs / 3600000);
		const diffDays = Math.floor(diffMs / 86400000);

		if (diffMins < 1) return "たった今";
		if (diffMins < 60) return `${diffMins}分前`;
		if (diffHours < 24) return `${diffHours}時間前`;
		if (diffDays < 7) return `${diffDays}日前`;
		return date.toLocaleDateString("ja-JP");
	};

	return (
		<div className="relative" ref={dropdownRef}>
			{/* Bell Button */}
			<button
				type="button"
				onClick={() => setIsOpen(!isOpen)}
				className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
				aria-label="通知"
			>
				<svg
					className="w-5 h-5"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<title>通知</title>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
					/>
				</svg>
				{/* Badge */}
				{localUnreadCount > 0 && (
					<span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
						{localUnreadCount > 9 ? "9+" : localUnreadCount}
					</span>
				)}
			</button>

			{/* Dropdown */}
			{isOpen && (
				<div className="absolute right-0 mt-2 w-80 rounded-lg border border-border bg-background shadow-lg z-50">
					{/* Header */}
					<div className="flex items-center justify-between border-b border-border px-4 py-3">
						<h3 className="font-semibold text-foreground">通知</h3>
						{localUnreadCount > 0 && (
							<button
								type="button"
								onClick={handleMarkAllAsRead}
								className="text-xs text-primary hover:underline"
							>
								すべて既読にする
							</button>
						)}
					</div>

					{/* Notification List */}
					<div className="max-h-96 overflow-y-auto">
						{localNotifications.length === 0 ? (
							<div className="px-4 py-8 text-center text-sm text-muted-foreground">
								通知はありません
							</div>
						) : (
							<ul className="divide-y divide-border">
								{localNotifications.map((notification) => (
									<li key={notification.id}>
										<Link
											href={
												notification.related_id
													? `/student/submissions`
													: "/student/notifications"
											}
											onClick={() => handleNotificationClick(notification.id)}
											className={`block px-4 py-3 hover:bg-muted/50 transition-colors ${
												!notification.is_read ? "bg-primary/5" : ""
											}`}
										>
											<div className="flex items-start gap-3">
												{/* Icon */}
												<div
													className={`shrink-0 mt-0.5 ${
														notification.type === "feedback"
															? "text-primary"
															: notification.type === "announcement"
																? "text-blue-500"
																: "text-green-500"
													}`}
												>
													{notification.type === "feedback" && (
														<svg
															className="w-5 h-5"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<title>フィードバック</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
															/>
														</svg>
													)}
													{notification.type === "announcement" && (
														<svg
															className="w-5 h-5"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<title>お知らせ</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
															/>
														</svg>
													)}
													{notification.type === "approval" && (
														<svg
															className="w-5 h-5"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
														>
															<title>承認</title>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth={2}
																d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
															/>
														</svg>
													)}
												</div>
												{/* Content */}
												<div className="flex-1 min-w-0">
													<p
														className={`text-sm ${
															!notification.is_read
																? "font-medium text-foreground"
																: "text-muted-foreground"
														}`}
													>
														{notification.title}
													</p>
													<p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
														{notification.content}
													</p>
													<p className="text-xs text-muted-foreground mt-1">
														{formatTimeAgo(notification.created_at ?? "")}
													</p>
												</div>
												{/* Unread indicator */}
												{!notification.is_read && (
													<div className="shrink-0">
														<span className="block h-2 w-2 rounded-full bg-primary" />
													</div>
												)}
											</div>
										</Link>
									</li>
								))}
							</ul>
						)}
					</div>

					{/* Footer */}
					{localNotifications.length > 0 && (
						<div className="border-t border-border px-4 py-2">
							<Link
								href="/student/notifications"
								onClick={() => setIsOpen(false)}
								className="block text-center text-sm text-primary hover:underline"
							>
								すべての通知を見る
							</Link>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
