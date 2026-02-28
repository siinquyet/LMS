import "./index.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { MyCoursesProvider } from "./contexts/MyCoursesContext";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
	<React.StrictMode>
		<AuthProvider>
			<CartProvider>
				<MyCoursesProvider>
					<App />
				</MyCoursesProvider>
			</CartProvider>
		</AuthProvider>
	</React.StrictMode>,
);
