import AppRouter from "./AppRouter";
import { ErrorBoundary } from "./components/common";

function App() {
	return (
		<ErrorBoundary>
			<AppRouter />
		</ErrorBoundary>
	);
}

export default App;
