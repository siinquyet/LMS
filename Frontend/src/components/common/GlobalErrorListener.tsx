import { useEffect } from "react";
import { useToast } from "./Toast";

interface AppErrorEvent {
	source: string;
	message: string;
	status: number;
}

export const GlobalErrorListener: React.FC = () => {
	const { addToast } = useToast();

	useEffect(() => {
		const handleError = (e: CustomEvent<AppErrorEvent>) => {
			const { source, message } = e.detail;
			addToast("error", `[${source}] ${message}`);
		};

		window.addEventListener("app:error", handleError as EventListener);
		return () => {
			window.removeEventListener("app:error", handleError as EventListener);
		};
	}, [addToast]);

	return null;
};

export default GlobalErrorListener;