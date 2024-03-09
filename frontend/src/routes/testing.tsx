import { createFileRoute, Link } from "@tanstack/react-router";

import { useAuth } from "../auth";

export const Route = createFileRoute("/testing")({
	component: GraphTestComponent,
});

function GraphTestComponent() {
	const auth = useAuth();
	return (
		<div className="p-2">
			<h2>graph test page</h2>
			<h3>form fields</h3>
			<br />
			<h3>test graphs</h3>
		</div>
	);
}
