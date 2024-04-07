import { createFileRoute } from "@tanstack/react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

export const Route = createFileRoute("/")({
	component: HomeComponent,
});

function HomeComponent() {
	const BASE_URL = import.meta.env.VITE_BACKEND_URL;
	const form = useForm<z.infer<typeof QuerySchema>>({
		resolver: zodResolver(QuerySchema),
	});

	async function onSubmit(data: z.infer<typeof QuerySchema>) {
		// initialize URLSearchParams
		const queryParams = new URLSearchParams();

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
			console.log(result);

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
	}

	return (
		<div className="p-2">
			<h2 className="text-2xl font-bold">graph test page</h2>
			<h3 className="text-xl font-bold">form fields</h3>
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
					<FormField
						control={form.control}
						name="search"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Search Query</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>Filter by specific terms</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit">Submit</Button>
				</form>
			</Form>
			<br />
			<h3 className="text-xl font-bold">test graphs</h3>
		</div>
	);
}
