import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { useAuth } from "../auth";

export const Route = createFileRoute("/dashboard")({
	beforeLoad: ({ location }) => {
		try {
			const authenticated = !!localStorage.getItem("user");
			if (!authenticated) {
				throw redirect({
					to: "/login",
					search: {
						redirect: location.href,
					},
				});
			}
		} catch (error) {
			throw redirect({
				to: "/login",
				search: {
					redirect: location.href,
				},
			});
		}
	},
	component: DashboardComponent,
});

function DashboardComponent() {
	const navigate = useNavigate({ from: "/dashboard" });
	const auth = useAuth();

	return (
		<div className="p-2">
			<h3>Dashboard page</h3>
			<p>Hi {auth.user}!</p>
			<p>If you can see this, that means you are authenticated.</p>
		</div>
	);
}
