import type React from "react";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import Header from "./Header";

export const AppShell: React.FC<{ children?: React.ReactNode }> = ({
	children,
}) => {
	return (
		<>
			<Header />
			{children || <Outlet />}
			<Footer />
		</>
	);
};

export default AppShell;
