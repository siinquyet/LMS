import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import type React from "react";
import { createContext, useCallback, useContext, useState } from "react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
}

interface ToastContextType {
	toasts: Toast[];
	addToast: (type: ToastType, message: string) => void;
	removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
	const context = useContext(ToastContext);
	if (!context) {
		throw new Error("useToast must be used within ToastProvider");
	}
	return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<Toast[]>([]);

	const addToast = useCallback((type: ToastType, message: string) => {
		const id = Date.now().toString();
		setToasts((prev) => [...prev, { id, type, message }]);
		setTimeout(() => {
			setToasts((prev) => prev.filter((t) => t.id !== id));
		}, 4000);
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={{ toasts, addToast, removeToast }}>
			{children}
			<ToastContainer toasts={toasts} onRemove={removeToast} />
		</ToastContext.Provider>
	);
};

const ToastContainer: React.FC<{
	toasts: Toast[];
	onRemove: (id: string) => void;
}> = ({ toasts, onRemove }) => {
	const icons = {
		success: <CheckCircle className="w-5 h-5 text-[#16A34A]" />,
		error: <AlertCircle className="w-5 h-5 text-[#DC2626]" />,
		warning: <AlertTriangle className="w-5 h-5 text-[#D97706]" />,
		info: <Info className="w-5 h-5 text-[#432DD7]" />,
	};

	const styles = {
		success: "bg-[#ECFDF5] border-[#16A34A]",
		error: "bg-[#FEF2F2] border-[#DC2626]",
		warning: "bg-[#FFFBEB] border-[#D97706]",
		info: "bg-[#E8F6FC] border-[#432DD7]",
	};

	if (toasts.length === 0) return null;

	return (
		<div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
			{toasts.map((toast) => (
				<div
					key={toast.id}
					className={`
            flex items-center gap-3 p-4
            border-[3px] border-r-[12px]
            shadow-[6px_6px_0_#1C293C]
            ${styles[toast.type]}
          `}
				>
					{icons[toast.type]}
					<span className="text-[15px] font-semibold text-[#1C293C] flex-1">
						{toast.message}
					</span>
					<button
						type="button"
						onClick={() => onRemove(toast.id)}
						className="text-[#1C293C] hover:text-[#DC2626]"
					>
						<X className="w-4 h-4" />
					</button>
				</div>
			))}
		</div>
	);
};

export const Toast: React.FC<{ type: ToastType; message: string }> = ({
	type,
	message,
}) => {
	const { addToast } = useToast();
	return <>{message}</>;
};

export default ToastProvider;
