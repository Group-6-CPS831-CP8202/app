import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useAuth } from "../auth"; // Ensure this path matches your project structure
import { createFileRoute, getRouteApi } from "@tanstack/react-router";

export const Route = createFileRoute("/login")({
	validateSearch: z.object({
		redirect: z.string().optional().default("/"),
	}),
	component: LoginComponent,
});

const routeApi = getRouteApi("/login");

function LoginComponent() {
	const auth = useAuth();
	const navigate = useNavigate();

	const [isSubmitting, setIsSubmitting] = React.useState(false);
	const [username, setUsername] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [loginError, setLoginError] = React.useState("");

	const search = routeApi.useSearch();

	const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);
		setLoginError(""); // reset login error message on a new submission

		try {
			await auth.login(username, password);
			navigate({ to: search.redirect || "/" });
		} catch (error) {
			// set the error message to be displayed to the user
			setLoginError("Wrong username or password");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="p-2 h-screen flex justify-center items-center bg-white">
			<div className="w-full max-w-md py-8">
				<form className="mt-4" onSubmit={handleLogin}>
					<fieldset disabled={isSubmitting} className="flex flex-col gap-2">
						{loginError && (
							<div className="text-red-500 text-center">{loginError}</div>
						)}
						<div className="flex gap-2 items-center">
							<label htmlFor="username-input" className="text-sm font-medium">
								Username
							</label>
							<input
								id="username-input"
								type="text"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								className="border border-gray-300 rounded-md p-2 w-full"
								required
							/>
						</div>
						<div className="flex gap-2 items-center">
							<label htmlFor="password-input" className="text-sm font-medium">
								Password
							</label>
							<input
								id="password-input"
								type="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className="border border-gray-300 rounded-md p-2 w-full"
								required
							/>
						</div>
						<button
							type="submit"
							className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md w-full"
						>
							{isSubmitting ? "Loading..." : "Login"}
						</button>
					</fieldset>
				</form>
				<div className="mt-4 text-center">
					No account?{" "}
					<a href="/register" className="text-blue-500">
						Register now
					</a>
				</div>
			</div>
		</div>
	);
}
