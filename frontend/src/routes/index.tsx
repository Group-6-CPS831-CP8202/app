import { createFileRoute } from "@tanstack/react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";

import type { z } from "zod";

import { QuerySchema } from "@/lib/query";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import React from "react";
import { Loader2 } from "lucide-react";
import * as d3 from "d3";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const BASE_URL = import.meta.env.VITE_BACKEND_URL;

	const [queryData, setQueryData] = React.useState([]);
	const [dataSet, setDataSet] = React.useState(false);

	const form = useForm<z.infer<typeof QuerySchema>>({
		resolver: zodResolver(QuerySchema),
	});
	const [loading, setLoading] = React.useState(false);

	async function onSubmit(data: z.infer<typeof QuerySchema>) {
		// initialize URLSearchParams
		const queryParams = new URLSearchParams();
		setLoading(true);

		// iterate over each key in the data object
		// biome-ignore lint/complexity/noForEach: <explanation>
		Object.keys(data).forEach((key) => {
			const value = data[key];

			// check if the value is undefined or null
			if (value !== undefined && value !== null) {
				// for non-undefined, non-null values, add them to queryParams
				queryParams.set(key, String(value));
			} // omits all others
		});

		// construct the full URL with query parameters
		const url = `${BASE_URL}/query?${queryParams.toString()}`;

		try {
			const response = await fetch(url, {
				method: "GET",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			setQueryData(result.records);
			setDataSet(true);

			// success toast with data display
			toast({
				title: "Success! You submitted:",
				description: (
					<div>
						<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
							<code className="text-white">
								{JSON.stringify(data, null, 2)}
							</code>
						</pre>
						<p>Check the console for the data</p>
					</div>
				),
			});
		} catch (error) {
			// error handling with toast
			toast({
				title: "Error submitting form",
				description: error.message,
			});
		}
		setLoading(false);
	}

	return (
		<div className="p-2 m-10">
			<h2 className="text-xl font-bold">Search Options</h2>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="w-2/3 space-y-6"
				>
					<FormField
						control={form.control}
						name="limit"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Results Limit</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>Default: 10</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="offset"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Data Offset</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>Default: 0</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					{loading ? (
						<Button className={"min-w-[130px]"} disabled>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Loading...
						</Button>
					) : (
						<Button className={"min-w-[130px]"} type="submit">
							Submit
						</Button>
					)}
				</form>
			</Form>
			<br />
			<h2 className="text-xl font-bold mt-10">Graphs</h2>
			{dataSet ? <TestChart data={queryData} /> : <p>No data to display</p>}
		</div>
	);
}

function TestChart(data) {
	console.log(data.data);
	// Specify the chart’s dimensions.
	const width = 928;
	const height = 500;
	const marginTop = 10;
	const marginRight = 10;
	const marginBottom = 20;
	const marginLeft = 40;

	// Determine the series that need to be stacked.
	const series = d3
		.stack()
		.keys(d3.union(data.data.map((d) => d.owner_org_title))) // distinct series keys, in input order
		.value(([, D], key) => D.get(key).contract_value)(
		// get value for each series key and stack
		d3.index(
			data.data,
			(d) => d.contract_date,
			(d) => d.owner_org_title,
		),
	); // group by stack then series key
	console.log(series);

	// Prepare the scales for positional and color encodings.
	const x = d3
		.scaleUtc()
		.domain(d3.extent(data, (d) => d.date))
		.range([marginLeft, width - marginRight]);

	const y = d3
		.scaleLinear()
		.domain([0, d3.max(series, (d) => d3.max(d, (d) => d[1]))])
		.rangeRound([height - marginBottom, marginTop]);

	const color = d3
		.scaleOrdinal()
		.domain(series.map((d) => d.key))
		.range(d3.schemeTableau10);

	// Construct an area shape.
	const area = d3
		.area()
		.x((d) => x(d.data[0]))
		.y0((d) => y(d[0]))
		.y1((d) => y(d[1]));

	// Create the SVG container.
	const svg = d3
		.create("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [0, 0, width, height])
		.attr("style", "max-width: 100%; height: auto;");

	// Add the y-axis, remove the domain line, add grid lines and a label.
	svg
		.append("g")
		.attr("transform", `translate(${marginLeft},0)`)
		.call(d3.axisLeft(y).ticks(height / 80))
		.call((g) => g.select(".domain").remove())
		.call((g) =>
			g
				.selectAll(".tick line")
				.clone()
				.attr("x2", width - marginLeft - marginRight)
				.attr("stroke-opacity", 0.1),
		)
		.call((g) =>
			g
				.append("text")
				.attr("x", -marginLeft)
				.attr("y", 10)
				.attr("fill", "currentColor")
				.attr("text-anchor", "start")
				.text("↑ Contract Value"),
		);

	// Append a path for each series.
	svg
		.append("g")
		.selectAll()
		.data(series)
		.join("path")
		.attr("fill", (d) => color(d.key))
		.attr("d", area)
		.append("title")
		.text((d) => d.key);

	// Append the horizontal axis atop the area.
	svg
		.append("g")
		.attr("transform", `translate(0,${height - marginBottom})`)
		.call(d3.axisBottom(x).tickSizeOuter(0));

	// Return the chart with the color scale as a property (for the legend).
	return Object.assign(svg.node(), { scales: { color } });
}
