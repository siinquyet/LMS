export function formatSeconds(seconds: number | null | undefined): string {
	if (seconds == null || isNaN(seconds)) return "00:00";
	if (seconds < 0) return "00:00";

	const hours = Math.floor(seconds / 3600);
	const mins = Math.floor((seconds % 3600) / 60);
	const secs = seconds % 60;

	const pad = (n: number) => n.toString().padStart(2, "0");

	if (hours > 0) {
		return `${pad(hours)}:${pad(mins)}:${pad(secs)}`;
	}
	return `${pad(mins)}:${pad(secs)}`;
}

export function parseTimestamp(str: string | number): number {
	if (typeof str === "number") return Math.floor(str);
	const s = str.trim();
	if (/^\d+$/.test(s)) return parseInt(s, 10);

	const parts = s.split(":").map(Number);
	if (parts.length === 2) {
		return parts[0] * 60 + parts[1];
	}
	if (parts.length === 3) {
		return parts[0] * 3600 + parts[1] * 60 + parts[2];
	}
	return 0;
}

export function formatFileSize(bytes: number): string {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

export function getFileIcon(mimeType: string): string {
	if (mimeType.includes("pdf")) return "pdf";
	if (mimeType.includes("word") || mimeType.includes("document")) return "doc";
	if (mimeType.includes("sheet") || mimeType.includes("excel")) return "xls";
	if (mimeType.includes("presentation") || mimeType.includes("powerpoint")) return "ppt";
	if (mimeType.includes("image")) return "image";
	if (mimeType.includes("video")) return "video";
	if (mimeType.includes("zip") || mimeType.includes("rar") || mimeType.includes("archive")) return "archive";
	if (mimeType.includes("text/plain")) return "text";
	return "file";
}