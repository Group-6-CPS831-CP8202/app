import * as React from "react";

export interface AuthContext {
	isAuthenticated: boolean;
	user: string | null;
	login: (username: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
	register: (username: string, password: string) => Promise<void>;
}

const AuthContext = React.createContext<AuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = React.useState<string | null>(null);
	const isAuthenticated = !!user; // converts user to boolean
	const BASE_URL = import.meta.env.VITE_BACKEND_URL;

	// login function
	const login = async (username: string, password: string) => {
		const response = await fetch(`${BASE_URL}/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify({ username: username, password: password }),
		});

		if (response.ok) {
			setUser(username);
		} else {
			const data = await response.json();
			throw new Error(data.message || "Failed to login");
		}
	};

	// logout function
	const logout = async () => {
		const response = await fetch(`${BASE_URL}/logout`, {
			method: "POST",
			credentials: "include",
		});

		if (response.ok) {
			setUser(null);
		} else {
			throw new Error("Failed to logout");
		}
	};

	// register function
	const register = async (username: string, password: string) => {
		const response = await fetch(`${BASE_URL}/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ username, password }),
		});
		if (response.ok) {
			setUser(username);
		} else {
			const data = await response.json();
			throw new Error(data.message || "Failed to register");
		}
	};

	return (
		<AuthContext.Provider
			value={{ isAuthenticated, user, login, logout, register }}
		>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = React.useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
