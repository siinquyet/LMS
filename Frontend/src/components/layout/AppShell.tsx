import Footer from "./Footer";
import Header from "./Header";

import type { ReactNode } from "react";

interface AppShellProps {
	children: ReactNode;
}

const AppShell = ({ children }: AppShellProps) => {
	return (
		<div className="min-h-screen flex flex-col bg-surface">
			<Header />
			<main className="flex-1 w-full">{children}</main>
			<Footer />
		</div>
	);
};

export default AppShell;
