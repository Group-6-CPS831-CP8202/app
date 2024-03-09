import { createFileRoute, Link } from "@tanstack/react-router";
import * as d3 from "d3";

import { useAuth } from "../auth";

export const Route = createFileRoute("/testing")({
	component: GraphTestComponent,
});

function GraphTestComponent() {
	const auth = useAuth();
	return (
		<div className="p-2">
			<h2 className="text-2xl font-bold">graph test page</h2>
			<h3 className="text-xl font-bold">form fields</h3>
			<br />
			<h3 className="text-xl font-bold">test graphs</h3>
		</div>
	);
}
