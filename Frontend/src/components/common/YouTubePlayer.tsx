import { useEffect, useRef, useState } from "react";

interface YouTubePlayerProps {
	videoUrl: string;
	onProgress?: (percent: number) => void;
	onComplete?: () => void;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
	videoUrl,
	onProgress,
	onComplete,
}) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const playerRef = useRef<any>(null);
	const [isReady, setIsReady] = useState(false);
	const hasCompletedRef = useRef(false);

	const getVideoId = (url: string): string | null => {
		const match = url.match(
			/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/,
		);
		return match ? match[1] : null;
	};

	const videoId = getVideoId(videoUrl);

	useEffect(() => {
		if (!videoId || !containerRef.current) return;

		const loadYouTubeAPI = () => {
			return new Promise<void>((resolve) => {
				if ((window as any).YT) {
					resolve();
					return;
				}
				const tag = document.createElement("script");
				tag.src = "https://www.youtube.com/iframe_api";
				const firstScriptTag = document.getElementsByTagName("script")[0];
				firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
				(window as any).onYouTubeIframeAPIReady = () => resolve();
			});
		};

		loadYouTubeAPI().then(() => {
			if (!containerRef.current) return;

			playerRef.current = new (window as any).YT.Player(containerRef.current, {
				videoId,
				playerVars: {
					autoplay: 0,
					controls: 1,
					rel: 0,
					modestbranding: 1,
				},
				events: {
					onReady: () => setIsReady(true),
					onStateChange: (event: any) => {
						if (event.data === (window as any).YT.PlayerState.PLAYING) {
							startProgressTracking();
						}
					},
				},
			});
		});

		let intervalId: NodeJS.Timeout;
		const startProgressTracking = () => {
			intervalId = setInterval(() => {
				if (!playerRef.current || !playerRef.current.getDuration) return;

				const duration = playerRef.current.getDuration();
				const currentTime = playerRef.current.getCurrentTime();

				if (duration > 0) {
					const percent = (currentTime / duration) * 100;
					onProgress?.(percent);

					if (percent >= 90 && !hasCompletedRef.current) {
						hasCompletedRef.current = true;
						onComplete?.();
					}
				}
			}, 1000);
		};

		return () => {
			if (intervalId) clearInterval(intervalId);
			if (playerRef.current && playerRef.current.destroy) {
				playerRef.current.destroy();
			}
		};
	}, [videoUrl, videoId]);

	if (!videoId) {
		return (
			<div className="w-full aspect-video bg-black flex items-center justify-center">
				<p className="text-white">Invalid video URL</p>
			</div>
		);
	}

	return (
		<div className="relative">
			<div ref={containerRef} className="w-full aspect-video" />
		</div>
	);
};
