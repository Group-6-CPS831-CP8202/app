import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

import QueryBuilder from "@/components/query-builder";

import type { Query } from "../lib/query";
import { useAuth } from "../auth";
import React, { useEffect } from "react";
import { Separator } from "@/components/ui/separator";

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

interface QueryHistoryProps {
	timestamp: string;
	limit: number;
	offset: number;
}

const QueryHistoryComponent: React.FC<QueryHistoryProps> = ({
	timestamp,
	limit,
	offset,
}) => {
	const date = new Date(timestamp);
	const now = new Date();

	// check if the date is today
	const isToday =
		date.getDate() === now.getDate() &&
		date.getMonth() === now.getMonth() &&
		date.getFullYear() === now.getFullYear();

	// convert to 12-hour format and determine AM/PM
	const hours = date.getHours();
	const minutes = date.getMinutes();
	const ampm = hours >= 12 ? "PM" : "AM";
	const hours12 = hours % 12 || 12; // converts 0 to 12 for midnight
	const minutesPadded = minutes.toString().padStart(2, "0");
	const timeString = `${hours12}:${minutesPadded} ${ampm}`;

	// format the date or time part depending on whether the date is today
	const displayText = isToday ? `Today, ${timeString}` : date.toDateString();

	return (
		<div className="flex flex-row gap-2 p-1 min-w-[200px]">
			<p className="text-sm">{displayText}</p>
			<Badge className="text-xs">Limit: {limit}</Badge>
			<Badge className="text-xs">Offset: {offset}</Badge>
		</div>
	);
};

function DashboardComponent() {
	const navigate = useNavigate({ from: "/dashboard" });
	const auth = useAuth();
	const [query, setQuery] = React.useState({});
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
	const [queryList, setQueryList] = React.useState<Query[]>([]);
	const BASE_URL = import.meta.env.VITE_BACKEND_URL;

	const fetchData = async () => {
		try {
			const response = await fetch(`${BASE_URL}/user/queries`, {
				method: "GET",
				credentials: "include",
			});
			const data = await response.json();
			setQueryList(data);
			console.log(data);
		} catch (error) {
			console.error(error);
		}
	};

	const handleQuerySubmit = async () => {
		await fetchData();
	};

	useEffect(() => {
		fetchData();
	}, []);

	return (
		<div className="relative min-h-screen lg:flex">
			<button
				type="button"
				className="lg:hidden fixed bottom-24 z-50 p-2 bg-red-500 text-white rounded-e-md"
				onClick={() => setIsDrawerOpen(!isDrawerOpen)}
			>
				{isDrawerOpen ? "Close" : "History"}
			</button>

			<ScrollArea
				className={`fixed left-0 top-0 transform ${
					isDrawerOpen ? "translate-x-0" : "-translate-x-full"
				} h-screen w-80 overflow-auto transition-transform duration-300 ease-in-out z-40 bg-white border-r-2 p-4 lg:translate-x-0 lg:static lg:w-auto`}
			>
				<h2 className="font-bold text-lg pb-2">Query History</h2>
				{queryList
					.slice()
					.reverse()
					.map((query, index) => (
						<React.Fragment key={query.id}>
							<QueryHistoryComponent
								timestamp={query.created_at}
								limit={query.limit}
								offset={query.offset}
							/>
							{index < queryList.length - 1 && <Separator className="my-2" />}
						</React.Fragment>
					))}
			</ScrollArea>

			<div className="flex-1 p-4">
				<QueryBuilder onQuerySubmit={handleQuerySubmit} />
			</div>
		</div>
	);
}
