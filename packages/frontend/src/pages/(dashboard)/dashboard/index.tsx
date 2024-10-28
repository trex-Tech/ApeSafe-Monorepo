import { twMerge } from "tailwind-merge"
import React, { useEffect, useRef, useState } from "react"
import { useRouter } from "@router"
import useUserStore from "@store/userStore"
import FormInput from "@/src/commons/components/FormInput"
import CustomButton from "@/src/commons/components/CustomButton"
import { ArrowDown, ArrowUp, ChevronDown, Search } from "lucide-react"
import { renderTable } from "@/src/commons/components/Table"
import { useAccount } from "wagmi"
import { TableRowType, TokenData } from "@interfaces"
import { useGetAllTokens } from "@commons/api/tokens"
import { Pagination, PaginationProps, useMediaQuery } from "@mui/material"
import { COLORS } from "@/src/commons/utils"
import { api } from "@/src/commons/utils/axiosProvider"
import axios from "axios"
import useDebounce from "@/src/commons/hooks/useDebounce"
import DropdownSelect from "@/src/commons/components/DropdownSelect"

interface Props {
	className?: string
}

type DateFilter = "1h" | "24h" | "3d" | "7d" | "30d" | "1y"

const rows: TableRowType<TokenData>[] = [
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
					className="h-6 w-6"
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

const dateFilterOptions = [
	{ value: "", label: "Clear Filter" },
	{ value: "1h", label: "Last 1 hour" },
	{ value: "24h", label: "Last 24 hours" },
	{ value: "3d", label: "Last 3 days" },
	{ value: "7d", label: "Last 7 days" },
	{ value: "30d", label: "Last 30 days" },
	{ value: "1y", label: "Last 1 year" },
]

const HomePage = ({ className }: Props) => {
	const router = useRouter()
	const { user } = useUserStore()
	const [page, setPage] = useState(1)
	const { address } = useAccount()
	const [tokenName, setTokenName] = useState<string>("")
	const [searchQuery, setSearchQuery] = useState("")
	const [dateFilter, setDateFilter] = useState<DateFilter | undefined>()
	const debouncedSearchTerm = useDebounce(searchQuery, 500)
	console.log("tokenName:", tokenName)
	const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
		setPage(value)
	}

	const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchQuery(e.target.value)
		setPage(1)
	}

	const handleDateFilterChange = (value: string) => {
		setDateFilter(value ? (value as DateFilter) : undefined)
		setPage(1)
	}

	const { data, error, pages } = useGetAllTokens(page, debouncedSearchTerm, dateFilter)

	useEffect(() => {
		console.log({ data, error })
	}, [data])

	const fetchTokens = async () => {
		const response = await axios.get("https://6dc1-102-89-69-234.ngrok-free.app/api/v1/tokens/token", {
			headers: {
				// "ngrok-skip-browser-warning": true,
				// "User-Agent": "MyCustomApp/1.0",
				"Content-Type": "application/json",
				Accept: "application/json",
			},
		})
		console.log("response3", response)

		// const res = await fetch("https://6dc1-102-89-69-234.ngrok-free.app/api/v1/tokens/token")
		// console.log("response2", await res.json())
	}

	// useEffect(() => {
	// 	fetchTokens()
	// }, [])

	console.log("env", import.meta.env.VITE_API_URL)

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4", className)}>
			<p className="h-1 text-off-white ">
				{address ? `Welcome, ${address.substring(36, 42)} 🐸` : "Welcome, mate"}
			</p>
			<p className="text-primary-500 h-1 text-2xl">Create a new token</p>

			<label className="mt-6">Token Name</label>
			<div className="-mt-2 flex h-[32px] w-auto items-center justify-between gap-x-4 md:justify-start">
				<div className=" w-[55%] md:w-[45%]">
					<FormInput
						className="py-[8px] "
						value={tokenName}
						onChange={(e) => setTokenName(e.target.value)}
					/>
				</div>
				<CustomButton
					text="Create Token"
					className=" rounded-md py-[12px] text-xs md:py-[10px] md:text-sm"
					onClick={() => {
						if (tokenName === "") {
							alert("Please enter a token name")
						} else {
							router.push({
								pathname: `/create-token/${tokenName}`,
								query: { create: tokenName },
							} as any)
						}
					}}
				/>
			</div>

			<div className="mt-4 flex flex-col items-start md:flex-row  md:items-center md:justify-between">
				{/* <div className=" flex w-full flex-row items-center border-b-2 md:mt-0 md:w-[25%]">
					<Search />
					<input
						className="border-none bg-inherit py-2 pl-2 outline-none"
						placeholder="Search token..."
					/>
				</div> */}
			</div>

			{/* <div>
				<NFTList items={items} />
			</div> */}

			<div className="mt-4 flex flex-col rounded-lg border p-4">
				<div className="mb-6 flex flex-col justify-between md:flex-row md:items-center">
					<h3 className="text-[20px]">Tokens</h3>
					<div className="flex flex-col gap-x-4 md:flex-row md:items-center">
						<FormInput
							startIcon={<Search />}
							placeholder="Search"
							className="py-2"
							value={searchQuery}
							onChange={handleSearch}
						/>
						<DropdownSelect
							className="w-[150px] py-2"
							prompt="Filter by date"
							items={dateFilterOptions}
							selected={dateFilterOptions.find((opt) => opt.value === dateFilter) || null}
							setSelected={(item) => handleDateFilterChange(item.value)}
							menuItemWidth="w-[150px]"
						/>
						{/* <button className="hidden items-center rounded-lg bg-input px-2 py-0 md:flex">
							<p className="whitespace-nowrap">Sort by date</p>
							<ChevronDown />
						</button> */}
					</div>
				</div>

				{renderTable<TokenData>({
					rows,
					data,
					tHeadBorder: false,
					onRowClick: (row) => {
						router.push({
							pathname: `/tokens/${"TREX is a bad boy"}`,
							query: { ticker: "TREX is a bad boy" },
						} as any)
					},
				})}

				{data && data.length > 0 && (
					<div className="mt-4 flex h-12 justify-center ">
						<Pagination
							count={pages}
							page={page}
							onChange={handlePageChange}
							color="primary"
							shape="rounded"
							variant="outlined"
							// siblingCount={isSmallScreen ? 0 : 1}
							// boundaryCount={isSmallScreen ? 1 : 2}
							sx={{
								"& .MuiPaginationItem-root": {
									color: COLORS.primary,
								},
								"& .MuiPaginationItem-root.Mui-selected": {
									backgroundColor: COLORS.primary,
									color: "white",
								},
							}}
						/>
					</div>
				)}
			</div>
		</div>
	)
}

export default HomePage
