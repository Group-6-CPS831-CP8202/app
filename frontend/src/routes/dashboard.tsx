import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import type { Query } from "../lib/query";
import { QuerySchema } from "../lib/query";
import type { z } from "zod";

import { useAuth } from "../auth";
import React, { useEffect } from "react";

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
	const [query, setQuery] = React.useState({});
	const [queryList, setQueryList] = React.useState<Query[]>([]);
	const BASE_URL = import.meta.env.VITE_BACKEND_URL;

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch(`${BASE_URL}/user/queries`, {
					method: "GET",
					credentials: "include",
				});
				const data = await response.json();
				setQueryList(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchData();
	}, []);

	return (
		<div className="p-2">
			<h3>Dashboard page</h3>
			<p>Hi {auth.user}!</p>
			<p>If you can see this, that means you are authenticated.</p>
		</div>
	);
}
