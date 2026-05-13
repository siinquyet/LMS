import { useCallback, useEffect, useRef, useState } from "react";
import { sendHeartbeat, type HeartbeatResponse } from "../api";

export interface UseHeartbeatOptions {
	lessonId: number | null;
	enabled?: boolean;
	throttleMs?: number;
	onComplete?: (data: HeartbeatResponse) => void;
	onError?: (error: Error) => void;
}

export interface UseHeartbeatReturn {
	sendHeartbeat: (currentTime: number, duration: number) => void;
	isSending: boolean;
	lastResponse: HeartbeatResponse | null;
	isCompleted: boolean;
	isLocked: boolean;
}

export function useHeartbeat({
	lessonId,
	enabled = true,
	throttleMs = 5000,
	onComplete,
	onError,
}: UseHeartbeatOptions): UseHeartbeatReturn {
	const [isSending, setIsSending] = useState(false);
	const [lastResponse, setLastResponse] = useState<HeartbeatResponse | null>(null);
	const [isCompleted, setIsCompleted] = useState(false);
	const [isLocked, setIsLocked] = useState(false);

	const lastSentTimeRef = useRef<number>(0);
	const throttleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pendingRef = useRef<{ currentTime: number; duration: number } | null>(null);
	const completedTriggeredRef = useRef<Set<number>>(new Set());

	useEffect(() => {
		setLastResponse(null);
		setIsCompleted(false);
		setIsLocked(false);
		completedTriggeredRef.current.clear();
	}, [lessonId]);

	useEffect(() => {
		return () => {
			if (throttleTimerRef.current) {
				clearTimeout(throttleTimerRef.current);
			}
		};
	}, []);

	const handleResponse = useCallback(
		(data: HeartbeatResponse) => {
			setLastResponse(data);
			setIsCompleted(data.completed);
			setIsLocked(data.locked_progress === true);

			if (data.just_completed && lessonId && !completedTriggeredRef.current.has(lessonId)) {
				completedTriggeredRef.current.add(lessonId);
				onComplete?.(data);

				if (typeof window !== "undefined") {
					window.dispatchEvent(
						new CustomEvent("lesson:completed", {
							detail: { lessonId, data },
						}),
					);
				}
			}
		},
		[lessonId, onComplete],
	);

	const sendHeartbeatRequest = useCallback(
		(currentTime: number, duration: number) => {
			if (!lessonId || !enabled) return;
			if (isCompleted && isLocked) return;

			const now = Date.now();
			if (now - lastSentTimeRef.current < throttleMs) {
				pendingRef.current = { currentTime, duration };

				if (throttleTimerRef.current) return;
				throttleTimerRef.current = setTimeout(() => {
					throttleTimerRef.current = null;
					if (pendingRef.current) {
						const { currentTime: ct, duration: dur } = pendingRef.current;
						pendingRef.current = null;
						sendHeartbeatRequest(ct, dur);
					}
				}, throttleMs);

				return;
			}

			lastSentTimeRef.current = now;
			setIsSending(true);

			sendHeartbeat(lessonId, currentTime, duration)
				.then(handleResponse)
				.catch((err) => {
					window.dispatchEvent(new CustomEvent("app:error", { detail: { source: "useHeartbeat", message: "Cập nhật tiến độ thất bại", status: 0 } }));
					onError?.(err);
				})
				.finally(() => {
					setIsSending(false);
				});
		},
		[lessonId, enabled, isCompleted, isLocked, throttleMs, handleResponse, onError],
	);

	return {
		sendHeartbeat: sendHeartbeatRequest,
		isSending,
		lastResponse,
		isCompleted,
		isLocked,
	};
}

export interface UseVideoProgressOptions {
	lessonId: number | null;
	enabled?: boolean;
	onComplete?: (data: HeartbeatResponse) => void;
	onProgress?: (watchedRatio: number, response: HeartbeatResponse) => void;
}

export function useVideoProgress({
	lessonId,
	enabled = true,
	onComplete,
	onProgress,
}: UseVideoProgressOptions) {
	const heartbeat = useHeartbeat({
		lessonId,
		enabled,
		throttleMs: 5000,
		onComplete,
	});

	const [watchedRatio, setWatchedRatio] = useState(0);

	useEffect(() => {
		if (heartbeat.lastResponse) {
			setWatchedRatio(heartbeat.lastResponse.watched_ratio);
			onProgress?.(heartbeat.lastResponse.watched_ratio, heartbeat.lastResponse);
		}
	}, [heartbeat.lastResponse, onProgress]);

	const handleTimeUpdate = useCallback(
		(currentTime: number, duration: number) => {
			if (!enabled || !lessonId) return;
			heartbeat.sendHeartbeat(currentTime, duration);
		},
		[enabled, lessonId, heartbeat],
	);

	const handlePlay = useCallback(() => {
		if (!enabled || !lessonId) return;
		heartbeat.sendHeartbeat(0, 0);
	}, [enabled, lessonId, heartbeat]);

	const handlePause = useCallback(
		(currentTime: number, duration: number) => {
			if (!enabled || !lessonId) return;
			heartbeat.sendHeartbeat(currentTime, duration);
		},
		[enabled, lessonId, heartbeat],
	);

	const handleEnded = useCallback(
		(currentTime: number, duration: number) => {
			if (!enabled || !lessonId) return;
			heartbeat.sendHeartbeat(currentTime, duration);
		},
		[enabled, lessonId, heartbeat],
	);

	return {
		sendHeartbeat: heartbeat.sendHeartbeat,
		isSending: heartbeat.isSending,
		isCompleted: heartbeat.isCompleted,
		isLocked: heartbeat.isLocked,
		watchedRatio,
		lastResponse: heartbeat.lastResponse,
		handleTimeUpdate,
		handlePlay,
		handlePause,
		handleEnded,
	};
}

export default useHeartbeat;