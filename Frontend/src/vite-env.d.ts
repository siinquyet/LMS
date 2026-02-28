/// <reference types="vite/client" />

declare module "*.svg" {
	import type * as React from "react";
	const Ref: React.FC<React.SVGProps<SVGSVGElement>>;
	export default Ref;
}
