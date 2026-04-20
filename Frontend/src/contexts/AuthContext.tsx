import {
	type ReactNode,
	createContext,
	useContext,
	useEffect,
	useState,
} from "react";

export interface User {
	id: number;
	ten_dang_nhap: string;
	email: string;
	ho: string;
	ten: string;
	vai_tro: string;
	anh_dai_dien?: string;
}

export type UserRole = 'hoc_vien' | 'giang_vien' | 'admin';

interface AuthContextType {
	user: User | null;
	login: (username: string, password: string) => Promise<boolean>;
	logout: () => void;
	isLoading: boolean;
	isStudent: boolean;
	isTeacher: boolean;
	isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Array<User & { password: string }> = [
	{
		id: 1,
		ten_dang_nhap: "user",
		email: "user@example.com",
		ho: "Nguyen",
		ten: "User",
		vai_tro: "hoc_vien",
		anh_dai_dien: "",
		password: "user",
	},
	{
		id: 2,
		ten_dang_nhap: "admin",
		email: "admin@example.com",
		ho: "Tran",
		ten: "Admin",
		vai_tro: "admin",
		anh_dai_dien: "",
		password: "admin",
	},
	{
		id: 3,
		ten_dang_nhap: "teacher",
		email: "teacher@example.com",
		ho: "Le",
		ten: "Teacher",
		vai_tro: "giang_vien",
		anh_dai_dien: "",
		password: "teacher",
	},
];

const STORAGE_KEY = "lms_auth_user";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		if (stored) {
			try {
				setUser(JSON.parse(stored));
			} catch {
				localStorage.removeItem(STORAGE_KEY);
			}
		}
		setIsLoading(false);
	}, []);

	const login = async (
		username: string,
		password: string,
	): Promise<boolean> => {
		const foundUser = MOCK_USERS.find(
			(u) =>
				(u.ten_dang_nhap === username || u.email === username) &&
				u.password === password,
		);

		if (foundUser) {
			const { password: _, ...userWithoutPassword } = foundUser;
			setUser(userWithoutPassword);
			localStorage.setItem(STORAGE_KEY, JSON.stringify(userWithoutPassword));
			return true;
		}

		return false;
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem(STORAGE_KEY);
	};

	const isStudent = user?.vai_tro === 'hoc_vien';
	const isTeacher = user?.vai_tro === 'giang_vien';
	const isAdmin = user?.vai_tro === 'admin';

	return (
		<AuthContext.Provider value={{ user, login, logout, isLoading, isStudent, isTeacher, isAdmin }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
