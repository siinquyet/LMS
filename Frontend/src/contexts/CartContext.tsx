import { createContext, useContext, useState, type ReactNode } from "react";

export interface CartItem {
	id: number;
	title: string;
	thumbnail: string;
	instructor: string;
	price: number;
	originalPrice: number;
}

interface CartContextType {
	items: CartItem[];
	addItem: (item: CartItem) => void;
	removeItem: (id: number) => void;
	clearCart: () => void;
	totalItems: number;
	totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "lms_cart";

export const CartProvider = ({ children }: { children: ReactNode }) => {
	const [items, setItems] = useState<CartItem[]>(() => {
		const stored = localStorage.getItem(STORAGE_KEY);
		return stored ? JSON.parse(stored) : [];
	});

	const saveToStorage = (newItems: CartItem[]) => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newItems));
	};

	const addItem = (item: CartItem) => {
		setItems((prev) => {
			if (prev.some((i) => i.id === item.id)) return prev;
			const newItems = [...prev, item];
			saveToStorage(newItems);
			return newItems;
		});
	};

	const removeItem = (id: number) => {
		setItems((prev) => {
			const newItems = prev.filter((i) => i.id !== id);
			saveToStorage(newItems);
			return newItems;
		});
	};

	const clearCart = () => {
		setItems([]);
		localStorage.removeItem(STORAGE_KEY);
	};

	const totalItems = items.length;
	const totalPrice = items.reduce((sum, item) => sum + item.price, 0);

	return (
		<CartContext.Provider
			value={{ items, addItem, removeItem, clearCart, totalItems, totalPrice }}
		>
			{children}
		</CartContext.Provider>
	);
};

export const useCart = (): CartContextType => {
	const context = useContext(CartContext);
	if (context === undefined) {
		throw new Error("useCart must be used within a CartProvider");
	}
	return context;
};
