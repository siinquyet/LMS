import { X } from "lucide-react";
import type React from "react";
import { useEffect, useRef } from "react";

export interface ModalProps {
	open: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	size?: "sm" | "md" | "lg" | "xl";
	className?: string;
}

export const Modal: React.FC<ModalProps> = ({
	open,
	onClose,
	title,
	children,
	footer,
	size = "md",
	className = "",
}) => {
	const modalRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const handleEsc = (e: KeyboardEvent) => {
			if (e.key === "Escape") onClose();
		};
		if (open) {
			document.addEventListener("keydown", handleEsc);
			document.body.style.overflow = "hidden";
		}
		return () => {
			document.removeEventListener("keydown", handleEsc);
			document.body.style.overflow = "";
		};
	}, [open, onClose]);

	useEffect(() => {
		if (open && modalRef.current) {
			modalRef.current.focus();
		}
	}, [open]);

	const sizeStyles = {
		sm: "max-w-sm",
		md: "max-w-lg",
		lg: "max-w-2xl",
		xl: "max-w-4xl",
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") onClose();
				}}
				role="button"
				tabIndex={0}
				aria-label="Close modal"
			/>
			<div
				ref={modalRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby={title ? "modal-title" : undefined}
				tabIndex={-1}
				className={`
          relative bg-white
          border-[3px] border-[#1C293C]
          shadow-[8px_8px_0_#1C293C]
          w-full ${sizeStyles[size]} mx-4
          max-h-[90vh] overflow-auto
          ${className}
        `}
			>
				{title && (
					<div className="flex items-center justify-between px-6 py-4 border-b-[3px] border-dashed border-[#1C293C]">
						<h3
							className="text-[21px] font-bold text-[#1C293C]"
							id="modal-title"
						>
							{title}
						</h3>
						<button
							type="button"
							onClick={onClose}
							className="p-1 text-[#1C293C] hover:text-[#DC2626] transition-colors"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
				)}
				<div className="px-6 py-4">{children}</div>
				{footer && (
					<div className="px-6 py-4 border-t-[3px] border-dashed border-[#1C293C] flex justify-end gap-3">
						{footer}
					</div>
				)}
			</div>
		</div>
	);
};

export default Modal;
