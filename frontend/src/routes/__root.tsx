import {
	Link,
	Outlet,
	createRootRouteWithContext,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";

import { useAuth, type AuthContext } from "../auth";
import Footer from "@/components/ui/footer";

interface MyRouterContext {
	auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	const auth = useAuth();
	return (
		<>
			<div className="p-2 flex gap-2 text-lg text-center justify-center">
				<Link
					to="/"
					activeProps={{ className: "font-bold" }}
					activeOptions={{ exact: true }}
				>
					Home
				</Link>
				{auth.isAuthenticated ? (
					<>
						<Link to={"/dashboard"} activeProps={{ className: "font-bold" }}>
							Dashboard
						</Link>
					</>
				) : (
					<>
						<Link
							to={"/login"}
							activeProps={{ className: "font-bold" }}
							search={{ redirect: "/" }}
						>
							Login
						</Link>
						<Link
							to={"/register"}
							activeProps={{ className: "font-bold" }}
							search={{ redirect: "/" }}
						>
							Register
						</Link>
					</>
				)}
				<Link to="/testing" activeProps={{ className: "font-bold" }}>
					testing
				</Link>
			</div>
			<hr />
			<div style={{ minHeight: "80vh" }}>
				<Outlet />
			</div>
			<TanStackRouterDevtools position="bottom-left" initialIsOpen={false} />
			<Footer />
		</>
	);
}
