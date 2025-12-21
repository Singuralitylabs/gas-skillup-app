import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { formatDate } from "@/lib/utils";
import type { AnnouncementResponse } from "@/types";

interface AnnouncementCardProps {
	announcement: AnnouncementResponse;
}

export function AnnouncementCard({ announcement }: AnnouncementCardProps) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-2">
					<CardTitle className="text-base font-semibold leading-tight">
						{announcement.title}
					</CardTitle>
					<span className="text-xs text-muted-foreground whitespace-nowrap">
						{formatDate(announcement.publishedAt)}
					</span>
				</div>
			</CardHeader>
			<CardContent>
				<p className="text-sm text-muted-foreground whitespace-pre-wrap">
					{announcement.content}
				</p>
			</CardContent>
		</Card>
	);
}
