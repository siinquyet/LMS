import { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "./Button";

interface Props {
	children: ReactNode;
	componentName?: string;
}

interface State {
	hasError: boolean;
	error: Error | null;
}

export class LocalErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error };
	}

	componentDidCatch(error: Error, info: React.ErrorInfo): void {
		const { componentName = "Component" } = this.props;
		window.dispatchEvent(
			new CustomEvent("app:error", {
				detail: {
					source: componentName,
					message: error.message,
					status: 0,
				},
			}),
		);
		console.error(`[${componentName}] ErrorBoundary caught:`, error, info);
	}

	handleRetry = () => {
		this.setState({ hasError: false, error: null });
	};

	render(): ReactNode {
		if (this.state.hasError) {
			return (
				<div className="min-h-[50vh] flex items-center justify-center p-4">
					<div className="bg-white border-[3px] border-[#1C293C] shadow-[8px_8px_0_#1C293C] p-6 max-w-md text-center">
						<div className="w-12 h-12 mx-auto mb-3 bg-red-100 border-[3px] border-[#1C293C] flex items-center justify-center">
							<AlertTriangle className="w-6 h-6 text-red-500" />
						</div>
						<h2 className="font-['Inter', sans-serif] text-lg font-bold text-[#1C293C] mb-2">
							Lỗi tại {this.props.componentName || "Component"}
						</h2>
						<p className="text-[#6B7280] text-sm mb-4">
							{this.state.error?.message || "Có lỗi không mong muốn xảy ra"}
						</p>
						<div className="flex gap-3 justify-center">
							<Button
								variant="outline"
								size="sm"
								onClick={() => window.location.href = "/"}
							>
								Quay về trang chủ
							</Button>
							<Button
								variant="primary"
								size="sm"
								onClick={this.handleRetry}
							>
								<RefreshCw className="w-4 h-4 mr-1" />
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

export default LocalErrorBoundary;