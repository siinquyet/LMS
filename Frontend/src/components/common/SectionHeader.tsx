import { ArrowRight } from "lucide-react";

interface SectionHeaderProps {
	title: string;
	subtitle?: string;
	linkHref?: string;
	linkText?: string;
	className?: string;
}

const SectionHeader = ({
	title,
	subtitle,
	linkHref = "#",
	linkText = "Xem tất cả",
	className = "",
}: SectionHeaderProps) => {
	return (
		<div className={`flex items-center justify-between mb-8 ${className}`}>
			<div className="flex flex-col">
				<h2 className="text-2xl md:text-3xl font-bold text-slate-900 leading-tight">
					{title}
				</h2>
				{subtitle && <p className="text-lg text-slate-600 mt-1">{subtitle}</p>}
			</div>
			<a
				href={linkHref}
				className="flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200 group"
			>
				<span>{linkText}</span>
				<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
			</a>
		</div>
	);
};

export default SectionHeader;
