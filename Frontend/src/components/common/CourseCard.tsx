import { ChevronRight, User } from "lucide-react";

interface CourseCardProps {
	thumbnail: string;
	title: string;
	instructor: string;
	instructorLink?: string;
	price: string;
	category: string;
	link?: string;
	className?: string;
}

const CourseCard = ({
	thumbnail,
	title,
	instructor,
	instructorLink,
	price,
	category,
	link,
	className = "",
}: CourseCardProps) => {
	return (
		<a
			href={link}
			className={`
        group relative bg-white rounded-xl border border-slate-200/60 p-6 shadow-sm hover:shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 ease-in-out overflow-hidden
        ${className}
      `}
		>
			{/* Thumbnail */}
			<div className="relative mb-6">
				<div className="aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl overflow-hidden group-hover:scale-105 transition-transform duration-300">
					<img
						src={thumbnail}
						alt={title}
						className="w-full h-full object-cover"
					/>
				</div>
				{/* Category Badge */}
				<div className="absolute top-3 left-3">
					<span className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
						{category}
					</span>
				</div>
			</div>

			{/* Content */}
			<div>
				<h3 className="font-bold text-slate-900 text-lg leading-tight line-clamp-2 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
					{title}
				</h3>

				{/* Instructor */}
				<div className="flex items-center mb-4">
					<div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
						<User className="w-4 h-4 text-white" />
					</div>
					{instructorLink ? (
						<a
							href={instructorLink}
							className="text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors duration-200"
						>
							{instructor}
						</a>
					) : (
						<span className="text-sm font-medium text-slate-700">
							{instructor}
						</span>
					)}
				</div>

				{/* Price */}
				<div className="flex items-center justify-between">
					<span className="text-2xl font-bold text-slate-900">{price}</span>
					<ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-500 transition-colors duration-200" />
				</div>
			</div>
		</a>
	);
};

export default CourseCard;
