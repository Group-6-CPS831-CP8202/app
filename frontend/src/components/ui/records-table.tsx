import React from "react";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";

type DataSetItem = {
	contractor: string;
	contract_value: number;
	amendment_value: number;
};

type RecordsTableProps = {
	dataSet: DataSetItem[];
};

export function RecordsTable({ dataSet }: RecordsTableProps) {
	// Optional: Function to format numbers as currency
	const formatCurrency = (value: number): string => {
		return value.toLocaleString("en-CA", {
			style: "currency",
			currency: "CAD",
		});
	};

	return (
		<Table>
			<TableCaption>Contract Summary Information</TableCaption>
			<TableHeader>
				<TableRow>
					<TableHead>Contractor</TableHead>
					<TableHead className="text-right">Contract Value</TableHead>
					<TableHead className="text-right">Amendment Value</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{dataSet.map((item, index) => (
					<TableRow key={index}>
						<TableCell className="font-medium">{item.contractor}</TableCell>
						<TableCell className="text-right">
							{formatCurrency(item.contract_value)}
						</TableCell>
						<TableCell className="text-right">
							{formatCurrency(item.amendment_value)}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
			<TableFooter>
				<TableRow>
					<TableCell>Total</TableCell>
					<TableCell className="text-right">
						{formatCurrency(
							dataSet.reduce((acc, cur) => acc + cur.contract_value, 0),
						)}
					</TableCell>
					<TableCell className="text-right">
						{formatCurrency(
							dataSet.reduce((acc, cur) => acc + cur.amendment_value, 0),
						)}
					</TableCell>
				</TableRow>
			</TableFooter>
		</Table>
	);
}
