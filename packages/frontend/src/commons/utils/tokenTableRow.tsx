import { Keys } from "."
import { MAX_RETRIES, PendingTokensService } from "@/src/service/pendingTokensService"
import { PendingToken, TableRowType, TokenData } from "../interfaces"
import { toast } from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"

export type DateFilter = "1h" | "24h" | "3d" | "7d" | "30d" | "1y"

export const rows: TableRowType<TokenData>[] = [
	{
		label: "ID",
		value: "id",
		visible: true,
		view: (row) => <div className="w-24 truncate">{row.id}</div>,
	},
	{
		label: "Name",
		value: "name",
		visible: true,
		view: (row) => (
			<div className="flex items-center gap-2">
				<img
					src={row.image}
					alt={row.name}
					className="h-10 w-10 rounded-full"
				/>
				<span className="w-36 truncate">{row.name}</span>
			</div>
		),
	},
	{
		label: "Ticker",
		value: "ticker",
		visible: true,
		view: (row) => <div className="w-24 truncate">{row.ticker}</div>,
	},
	{
		label: "Description",
		value: "description",
		visible: true,
		view: (row) => <div className="w-48 truncate">{row.description}</div>,
	},
	{
		label: "Creator",
		value: "name",
		visible: true,
		view: (row) => <div className="w-24 truncate">{row.creator}</div>,
	},
	// {
	// 	label: "24h Change",
	// 	value: "change",
	// 	visible: true,
	// 	view: (row) => (
	// 	  <div className="flex items-center gap-1">
	// 		<p>{row.change}</p>
	// 		{row.change > 0 ? (
	// 		  <ArrowUp size={20} color="green" strokeWidth={3} />
	// 		) : (
	// 		  <ArrowDown size={20} color="red" strokeWidth={3} />
	// 		)}
	// 	  </div>
	// 	),
	//   },
	{
		label: "Website",
		value: "website_url",
		visible: true,
		view: (row) => (
			<a
				className="w-24 truncate"
				href={row.website_url}
				target="_blank"
				rel="noopener noreferrer">
				{row.website_url}
			</a>
		),
	},
	{
		label: "Date Created",
		value: "date_created",
		visible: true,
		format: (row) => new Date(row.date_created).toLocaleDateString(),
		view: (row) => <div className="w-24 truncate">{new Date(row.date_created).toLocaleDateString()}</div>,
	},
]

export const dateFilterOptions = [
	{ value: "", label: "Clear Filter" },
	{ value: "1h", label: "Last 1 hour" },
	{ value: "24h", label: "Last 24 hours" },
	{ value: "3d", label: "Last 3 days" },
	{ value: "7d", label: "Last 7 days" },
	{ value: "30d", label: "Last 30 days" },
	{ value: "1y", label: "Last 1 year" },
]
