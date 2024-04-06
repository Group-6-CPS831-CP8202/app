import * as React from "react";
import {
	createFileRoute,
	getRouteApi,
	useNavigate,
} from "@tanstack/react-router";
import { z } from "zod";

import { useAuth } from "../auth";

export const Route = createFileRoute("/register")({
	validateSearch: z.object({
		redirect: z.string().catch("/"),
	}),
	component: RegisterComponent,
});

const routeApi = getRouteApi("/register");

function RegisterComponent() {
	const auth = useAuth();
	const navigate = useNavigate();

	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");
	const [error, setError] = React.useState("");

	const search = routeApi.useSearch();

	const handleRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		// Client-side validation
		if (!username || !password || !confirmPassword) {
			setError("All fields are required");
			setIsSubmitting(false);
			return;
		}
		if (password !== confirmPassword) {
			setError("Passwords do not match");
			setIsSubmitting(false);
			return;
		}

		try {
			await auth.register(username, password);
			// login after successful registration
			await auth.login(username, password);
			navigate({ to: search.redirect });
		} catch (error) {
			console.error("Registration failed:", error);
			setError("That username is already taken.");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="p-2">
			{error && <p className="text-red-500">{error}</p>}
			<form className="mt-4" onSubmit={handleRegistration}>
				<div className="flex flex-col gap-4">
					<div className="flex flex-col">
						<label htmlFor="username-input" className="text-sm font-medium">
							Username
						</label>
						<input
							id="username-input"
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="border border-gray-300 rounded-md p-2"
							required
						/>
					</div>
					<div className="flex flex-col">
						<label htmlFor="password-input" className="text-sm font-medium">
							Password
						</label>
						<input
							id="password-input"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="border border-gray-300 rounded-md p-2"
							required
						/>
					</div>
					<div className="flex flex-col">
						<label
							htmlFor="confirm-password-input"
							className="text-sm font-medium"
						>
							Confirm Password
						</label>
						<input
							id="confirm-password-input"
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="border border-gray-300 rounded-md p-2"
							required
						/>
					</div>
				</div>
				<button
					type="submit"
					className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md mt-4"
					disabled={isSubmitting}
				>
					{isSubmitting ? "Loading..." : "Register"}
				</button>
			</form>
		</div>
	);
}
