"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
	deleteAnnouncement,
	publishAnnouncement,
	unpublishAnnouncement,
} from "@/app/_actions/announcements";
import {
	Badge,
	Button,
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui";
import { formatDate } from "@/lib/utils/format";
import type { Announcement } from "@/types/database.types";

interface AnnouncementListItemProps {
	announcement: Announcement;
}

export function AnnouncementListItem({
	announcement,
}: AnnouncementListItemProps) {
	const router = useRouter();
	const [isDeleting, setIsDeleting] = useState(false);
	const [isPublishing, setIsPublishing] = useState(false);

	const isPublished = announcement.published_at !== null;

	const handlePublish = async () => {
		setIsPublishing(true);
		try {
			const result = await publishAnnouncement(announcement.id);
			if (result.success) {
				router.refresh();
			}
		} finally {
			setIsPublishing(false);
		}
	};

	const handleUnpublish = async () => {
		setIsPublishing(true);
		try {
			const result = await unpublishAnnouncement(announcement.id);
			if (result.success) {
				router.refresh();
			}
		} finally {
			setIsPublishing(false);
		}
	};

	const handleDelete = async () => {
		if (!confirm("このお知らせを削除してもよろしいですか？")) {
			return;
		}

		setIsDeleting(true);
		try {
			const result = await deleteAnnouncement(announcement.id);
			if (result.success) {
				router.refresh();
			}
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
					<div className="flex-1">
						<div className="flex items-center gap-2 mb-1">
							<CardTitle className="text-base font-semibold leading-tight">
								{announcement.title}
							</CardTitle>
							<Badge variant={isPublished ? "success" : "secondary"}>
								{isPublished ? "公開中" : "下書き"}
							</Badge>
						</div>
						<div className="text-xs text-muted-foreground space-x-3">
							<span>作成: {formatDate(announcement.created_at)}</span>
							{isPublished && (
								<span>公開: {formatDate(announcement.published_at!)}</span>
							)}
						</div>
					</div>
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				<p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
					{announcement.content}
				</p>

				<div className="flex flex-wrap gap-2">
					<Button variant="outline" size="sm" asChild>
						<Link href={`/instructor/announcements/${announcement.id}/edit`}>
							編集
						</Link>
					</Button>

					{isPublished ? (
						<Button
							variant="outline"
							size="sm"
							onClick={handleUnpublish}
							disabled={isPublishing}
						>
							{isPublishing ? "処理中..." : "非公開にする"}
						</Button>
					) : (
						<Button
							variant="default"
							size="sm"
							onClick={handlePublish}
							disabled={isPublishing}
						>
							{isPublishing ? "処理中..." : "公開する"}
						</Button>
					)}

					<Button
						variant="destructive"
						size="sm"
						onClick={handleDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "削除中..." : "削除"}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
