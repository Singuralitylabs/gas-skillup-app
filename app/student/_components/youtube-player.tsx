interface YouTubePlayerProps {
	url: string;
}

/**
 * YouTube動画を埋め込むコンポーネント
 */
export function YouTubePlayer({ url }: YouTubePlayerProps) {
	// YouTube URLからビデオIDを抽出
	const getVideoId = (videoUrl: string): string | null => {
		const patterns = [
			/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
			/youtube\.com\/embed\/([^&\n?#]+)/,
		];

		for (const pattern of patterns) {
			const match = videoUrl.match(pattern);
			if (match?.[1]) {
				return match[1];
			}
		}

		return null;
	};

	const videoId = getVideoId(url);

	if (!videoId) {
		return (
			<div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4">
				<p className="text-sm text-red-600 dark:text-red-400">
					YouTube URLの形式が正しくありません
				</p>
			</div>
		);
	}

	const embedUrl = `https://www.youtube.com/embed/${videoId}`;

	return (
		<div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
			<iframe
				className="absolute top-0 left-0 w-full h-full rounded-lg"
				src={embedUrl}
				title="YouTube video player"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowFullScreen
			/>
		</div>
	);
}
