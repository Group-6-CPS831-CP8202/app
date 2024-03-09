import { createFileRoute, Link } from "@tanstack/react-router";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

import { useAuth } from "../auth";

export const Route = createFileRoute("/testing")({
	component: GraphTestComponent,
});

const FormSchema = z.object({
	limit: z.number(),
	offset: z.number(),
	search: z.string(),
});

function GraphTestComponent() {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			limit: 10,
			offset: 0,
			search: "",
		},
	});

	async function onSubmit(data: z.infer<typeof FormSchema>) {
		try {
			const response = await fetch("http://127.0.0.1:8000/api/query", {
				method: "POST", // Assuming your backend expects a POST request
				headers: {
					"Content-Type": "application/json",
					// Include authentication token if required:
					// 'Authorization': `Bearer ${auth.token}`,
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error(`Error: ${response.status}`);
			}

			const result = await response.json();
			toast({
				title: "Success!",
				description: (
					<pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
						<code className="text-white">
							{JSON.stringify(result, null, 2)}
						</code>
					</pre>
				),
			});
		} catch (error) {
			toast({
				title: "Error submitting form",
				description: error.message,
			});
		}
	}

	const auth = useAuth();
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
								<FormLabel>limit</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>row limit</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="offset"
						render={({ field }) => (
							<FormItem>
								<FormLabel>offset</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>row offset count</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="search"
						render={({ field }) => (
							<FormItem>
								<FormLabel>search query</FormLabel>
								<FormControl>
									<Input {...field} />
								</FormControl>
								<FormDescription>filter by search</FormDescription>
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
