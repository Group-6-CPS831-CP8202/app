import { createFileRoute } from "@tanstack/react-router";

import QueryBuilder from "@/components/query-builder";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	return <QueryBuilder />;
}
