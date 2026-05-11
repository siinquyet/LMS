import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
	onError?: (error: Error, info: React.ErrorInfo) => void;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo): void {
		console.error("ErrorBoundary caught an error:", error, info);
		this.props.onError?.(error, info);
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: null });
	};

	render(): ReactNode {
		if (this.state.hasError) {
			if (this.props.fallback) {
				return this.props.fallback;
			}

			return (
				<div className="min-h-screen bg-[#F8F6F3] flex items-center justify-center p-4">
					<div className="bg-white border-[3px] border-[#1C293C] shadow-[8px_8px_0_#1C293C] p-8 max-w-md text-center">
						<div className="w-16 h-16 mx-auto mb-4 bg-red-100 border-[3px] border-[#1C293C] flex items-center justify-center">
							<AlertTriangle className="w-8 h-8 text-red-500" />
						</div>
						<h1 className="font-['Inter', sans-serif] text-xl font-bold text-[#1C293C] mb-2">
							Đã xảy ra lỗi
						</h1>
						<p className="text-[#6B7280] mb-4">
							{this.state.error?.message || "Có lỗi không mong muốn xảy ra"}
						</p>
						<div className="flex gap-3 justify-center">
							<Button
								variant="outline"
								onClick={() => window.location.href = "/"}
							>
								Quay về trang chủ
							</Button>
							<Button
								variant="primary"
								onClick={this.handleRetry}
							>
								<RefreshCw className="w-4 h-4 mr-2" />
								Thử lại
							</Button>
						</div>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;