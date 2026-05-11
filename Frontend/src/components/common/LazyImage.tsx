import { useEffect, useRef, useState } from "react";

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
	src: string;
	alt: string;
	placeholder?: React.ReactNode;
}

export const LazyImage: React.FC<LazyImageProps> = ({
	src,
	alt,
	placeholder,
	className = "",
	...props
}) => {
	const [isLoaded, setIsLoaded] = useState(false);
	const [isInView, setIsInView] = useState(false);
	const imgRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsInView(true);
					observer.disconnect();
				}
			},
			{ rootMargin: "100px" },
		);

		if (imgRef.current) {
			observer.observe(imgRef.current);
		}

		return () => observer.disconnect();
	}, []);

	return (
		<div ref={imgRef} className={`relative ${className}`}>
			{!isLoaded && (
				<div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
					{placeholder || (
						<div className="w-8 h-8 border-2 border-gray-300 border-t-gray-400 rounded-full animate-spin" />
					)}
				</div>
			)}
			{isInView && (
				<img
					src={src}
					alt={alt}
					className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
					onLoad={() => setIsLoaded(true)}
					loading="lazy"
					{...props}
				/>
			)}
		</div>
	);
};
