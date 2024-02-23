import * as React from "react";
import { flushSync } from "react-dom";
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
	const [name, setName] = React.useState("");

	const search = routeApi.useSearch();

	const handleRegistration = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsSubmitting(true);

		flushSync(() => {
			auth.setUser(name);
		});

		navigate({ to: search.redirect });
	};

	return (
		<div className="p-2">
			<h3>Register page</h3>
		</div>
	);
}
