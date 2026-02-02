import {
	getLatestNotifications,
	getUnreadNotificationCount,
} from "@/app/_lib/supabase/queries/notifications";
import { NotificationBell } from "./notification-bell";

interface NotificationBellWrapperProps {
	userId: string;
}

export async function NotificationBellWrapper({
	userId,
}: NotificationBellWrapperProps) {
	const [notifications, unreadCount] = await Promise.all([
		getLatestNotifications(userId, 10),
		getUnreadNotificationCount(userId),
	]);

	return (
		<NotificationBell notifications={notifications} unreadCount={unreadCount} />
	);
}
