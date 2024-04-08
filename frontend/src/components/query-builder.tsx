import { zodResolver } from "@hookform/resolvers/zod";
import { set, useForm } from "react-hook-form";

import type { z } from "zod";

import { QuerySchema } from "@/lib/query";

import { Table } from "@/components/ui/table";

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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import React from "react";
import { Loader2 } from "lucide-react";

const QueryBuilder: React.FC = ({ onQuerySubmit }) => {
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
		const url = `${BASE_URL}/query/contracts?${queryParams.toString()}`;

		try {
			const response = await fetch(url, {
				method: "GET",
				credentials: "include",
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const result = await response.json();
			console.log(result);
			setQueryData(result);
			setDataSet(true);
			if (onQuerySubmit) {
				onQuerySubmit();
			}

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
							<FormItem className="max-w-[200px]">
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
							<FormItem className="max-w-[200px]">
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
			{/*  
			replaced graphs not implemented yet with: <TestChart data={queryData}

			once the chart is implemented
			/> */}
			{dataSet ? <p>Graphs not implemented yet.</p> : <p>No data to display</p>}

			<br />
			<h2 className="text-xl font-bold mt-10">Records</h2>
		</div>
	);
};

export default QueryBuilder;
