import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from "react";

/**
 * VideoPlayer - Chỉ hỗ trợ video dạng upload (local)
 *
 * Video URL phải là đường dẫn đến file video đã upload lên server,
 * ví dụ: /uploads/videos/ten-file.mp4
 *
 * Vite dev server proxy /uploads -> backend, nên dùng URL tương đối là đủ.
 */
interface VideoPlayerProps {
	/** Đường dẫn file video upload (ví dụ: /uploads/videos/abc.mp4) */
	videoUrl: string;
	onProgress?: (percent: number) => void;
	onComplete?: () => void;
	onPlay?: () => void;
	onPause?: () => void;
	onVideoRef?: (videoEl: HTMLVideoElement | null) => void;
}

export const VideoPlayer = forwardRef<HTMLVideoElement, VideoPlayerProps>(({
	videoUrl,
	onProgress,
	onComplete,
	onPlay,
	onPause,
	onVideoRef,
}, ref) => {
	const videoElementRef = useRef<HTMLVideoElement>(null);
	const maxProgressRef = useRef(0);
	const completedRef = useRef(false);
	const [error, setError] = useState<string | null>(null);

	useImperativeHandle(ref, () => videoElementRef.current!, []);

	useEffect(() => {
		if (onVideoRef) {
			onVideoRef(videoElementRef.current);
		}
	}, [onVideoRef]);

	useEffect(() => {
		if (!videoUrl) return;

		setError(null);
		maxProgressRef.current = 0;
		completedRef.current = false;
		if (videoElementRef.current) {
			videoElementRef.current.load();
		}
	}, [videoUrl]);

	const handleError = () => {
		setError("Không thể tải video. Vui lòng kiểm tra đường dẫn hoặc thử lại sau.");
	};

	const handleTimeUpdate = () => {
		if (!videoElementRef.current) return;

		const { currentTime, duration } = videoElementRef.current;
		if (duration > 0) {
			const percent = (currentTime / duration) * 100;
			onProgress?.(percent);

			if (percent > maxProgressRef.current) {
				maxProgressRef.current = percent;
			}

			if (maxProgressRef.current >= 90 && !completedRef.current) {
				completedRef.current = true;
				onComplete?.();
			}
		}
	};

	const handlePlay = () => onPlay?.();
	const handlePause = () => onPause?.();

	// Video URL được Vite proxy /uploads -> backend, nên dùng trực tiếp
	// Nếu URL là URL tuyệt đối (https://...), giữ nguyên
	const fullUrl = videoUrl;

	if (error) {
		return (
			<div className="relative w-full h-full flex items-center justify-center bg-gray-900 text-gray-300 rounded-lg">
				<div className="text-center p-6">
					<svg className="w-12 h-12 mx-auto mb-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
					</svg>
					<p className="text-sm">{error}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="relative w-full h-full">
			<video
				ref={videoElementRef}
				className="w-full h-full"
				controls
				crossOrigin="anonymous"
				onError={handleError}
				onTimeUpdate={handleTimeUpdate}
				onPlay={handlePlay}
				onPause={handlePause}
			>
				<source src={fullUrl} type="video/mp4" />
				<track kind="captions" />
				Trình duyệt không hỗ trợ video.
			</video>
		</div>
	);
});

export default VideoPlayer;
