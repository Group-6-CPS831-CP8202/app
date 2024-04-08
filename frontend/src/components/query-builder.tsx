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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import React, { PureComponent } from "react";
import { Loader2 } from "lucide-react";
import {
	BarChart,
	Bar,
	Rectangle,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
	Line,
} from "recharts";
import "./query-builder.css";

/*
const Contract: Record<string:string> = {
    additional_comments_en: string,
    additional_comments_fr: string,
    agreement_type_code: number,
	amendment_value:string,
	article_6_exceptions:string,
	award_criteria:string,
	buyer_name:string,
	comments_en:string,
	comments_fr:string,
	commodity_code:string,
	commodity_type:string,
	contract_date:string,
	contract_period_start:string,
	contract_value:string,
	contracting_entity:string,
	country_of_vendor:string,
	delivery_date:string,
	description_en:string,
	description_fr:string,
	economic_object_code:string,
	former_public_servant:string,
	indigenous_business:string,
	indigenous_business_excluding_psib:string,
	instrument_type:string,
	intellectual_property:string,
	land_claims:string,
	limited_tendering_reason:string,
	ministers_office:string,
	number_of_bids:string,
	original_value:string,
	owner_org:string,
	owner_org_title:string,
	potential_commercial_exploitation:string,
	procurement_id:string,
	reporting_period:string,
	socioeconomic_indicator:string,
	solicitation_procedure:string,
	standing_offer_number:string,
	trade_agreement:string,
	trade_agreement_exceptions:string,
	vendor_name:string,
	vendor_postal_code:string,
	reference_number:string,
}
*/
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
			<div className="">
				<ResponsiveContainer width={"99%"} height={300}>
					<BarChart
						width={500}
						height={500}
						data={queryData}
						margin={{
							top: 5,
							right: 30,
							left: 100,
							bottom: 5,
						}}
					>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis name="Contractor" dataKey="contractor" />
						<YAxis name="Value (CAD$)" />
						<Tooltip />
						<Legend />
						<Bar
							name="Contract Value"
							dataKey="contract_value"
							fill="#8884d8"
							activeBar={<Rectangle fill="pink" stroke="blue" />}
						/>
						<Bar
							name="Amendment Value"
							dataKey="amendment_value"
							fill="#82ca9d"
							activeBar={<Rectangle fill="gold" stroke="purple" />}
						/>

						<Legend verticalAlign="top" height={36} />
						<Line
							name="Contract Value"
							type="monotone"
							dataKey="contract_value"
							stroke="#8884d8"
						/>
						<Line
							name="Amendment Value"
							type="monotone"
							dataKey="amendment_value"
							stroke="#82ca9d"
						/>
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
};

export default QueryBuilder;
