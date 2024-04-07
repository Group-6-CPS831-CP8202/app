import {
	Link,
	Outlet,
	createRootRouteWithContext,
	useNavigate,
} from "@tanstack/react-router";
import { useAuth, type AuthContext } from "../auth";
import Footer from "@/components/ui/footer";
import { Button } from "@/components/ui/button";

interface MyRouterContext {
	auth: AuthContext;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	component: RootComponent,
});

function RootComponent() {
	const auth = useAuth();
	const navigate = useNavigate({ from: "/logout" });

	const handleLogout = async () => {
		try {
			await auth.logout();
			navigate({ to: "/" });
		} catch (error) {
			console.error(error);
		}
	};

	function truncateName(name: string) {
		if (name.length > 8) {
			return `${name.slice(0, 8)}...`;
		}
		return name;
	}

	return (
		<>
			<div className="flex justify-between items-center p-2">
				<div className="flex items-center md:gap-4	md:text-lg sm:text-md gap-1">
					<Link to="/" activeProps={{ className: "font-bold" }}>
						<img src="/Icon.png" alt="logo icon" className="max-h-16" />
					</Link>
					{auth.isAuthenticated && (
						<Link to={"/dashboard"} activeProps={{ className: "font-bold" }}>
							Dashboard
						</Link>
					)}
				</div>
				<div className="flex md:gap-4 md:text-lg text-center sm:max-sm:text-sm gap-2">
					{auth.isAuthenticated ? (
						<>
							<span className="flex items-center italic">
								Welcome, {truncateName(auth.user || "User")}
							</span>
							<Button onClick={handleLogout}>Logout</Button>
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
				</div>
			</div>
			<hr />
			<div style={{ minHeight: "80vh" }}>
				<Outlet />
			</div>
			<Footer />
		</>
	);
}
