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
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
					<CardTitle className="text-base font-semibold leading-tight flex-1">
						{announcement.title}
					</CardTitle>
					<span className="text-xs text-muted-foreground sm:whitespace-nowrap">
						{announcement.publishedAt ? formatDate(announcement.publishedAt) : "未公開"}
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
