import { twMerge } from "tailwind-merge"
import React, { useEffect, useState } from "react"
import { useRouter } from "@router"
import useUserStore from "@store/userStore"
import FormInput from "@/src/commons/components/FormInput"
import CustomButton from "@/src/commons/components/CustomButton"
import { ArrowDown, ArrowUp, ChevronDown, Search } from "lucide-react"
import { renderTable } from "@/src/commons/components/Table"
import { useAccount } from "wagmi"
import { TableRowType } from "@interfaces"
import { useGetAllTokens } from "@commons/api/tokens"
import axios from "axios"

const API_URL = "https://6dc1-102-89-69-234.ngrok-free.app/api/v1"

interface Props {
	className?: string
}

const rows: TableRowType<IToken>[] = [
	{
		label: "Rank",
		value: "rank",
		visible: true,
	},
	{
		label: "Name",
		value: "name",
		visible: true,
		view: (row) => (
			<div className="flex items-center gap-2">
				<img
					src={"/b-icon.png"}
					alt={row.name}
					className="h-6 w-6"
				/>{" "}
				<span>{row.name}</span>
			</div>
		),
	},
	{
		label: "Ticker",
		value: "ticker",
		visible: true,
	},
	{
		label: "Creator",
		value: "creator.username" as any,
		visible: true,
	},
	{
		label: "24h Change",
		value: "change",
		visible: true,
		view: (row: any) => (
			<div className="flex items-center gap-1">
				<p>{row.change}</p>
				{row.change > 0 ? (
					<ArrowUp
						size={20}
						color="green"
						strokeWidth={3}
					/>
				) : (
					<ArrowDown
						size={20}
						color="red"
						strokeWidth={3}
					/>
				)}
			</div>
		),
	},
	{
		label: "Date",
		format: (row) => new Date(row.date).toDateString(),
		visible: true,
	},
]

const HomePage = ({ className }: Props) => {
	const router = useRouter()
	const { user } = useUserStore()
	const { data } = useGetAllTokens()
	const { address } = useAccount()
	const [tokenName, setTokenName] = useState<string>("")
	// console.log("tokenName:", tokenName) // Add this line

	useEffect(() => {
		console.log(data)
	}, [data])

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4", className)}>
			<p className="h-1 text-off-white ">
				{address ? `Welcome, ${address.substring(36, 42)} 🐸` : "Welcome, mate"}
			</p>
			<p className="text-primary-500 h-1 text-2xl">Create a new token</p>

			<label className="mt-6">Token Name</label>
			<div className="-mt-4 flex w-auto items-center justify-between gap-x-4 md:justify-start">
				<div className="w-[55%] md:w-[45%]">
					<FormInput
						className="py-2"
						value={tokenName}
						onChange={(e) => setTokenName(e.target.value)}
					/>
				</div>
				<CustomButton
					text="Create Token"
					className="rounded-md"
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
				<div className=" flex w-full flex-row items-center border-b-2 md:mt-0 md:w-[25%]">
					<Search />
					<input
						className="border-none bg-inherit py-2 pl-2 outline-none"
						placeholder="Search token..."
					/>
				</div>
			</div>

			{/* <div>
				<NFTList items={items} />
			</div> */}

			<div className="mt-4 flex flex-col rounded-lg border p-4">
				<div className="mb-6 flex flex-col justify-between md:flex-row md:items-center">
					<h3 className="text-[20px]">Tokens</h3>
					<div className="flex gap-x-4">
						<FormInput
							startIcon={<Search />}
							placeholder="Search"
							className="py-2"
						/>
						<button className="hidden items-center rounded-lg bg-input bg-off-white px-2 py-0 md:flex">
							<p className="whitespace-nowrap">Sort by date</p>
							<ChevronDown />
						</button>
					</div>
				</div>

				{renderTable<IToken>({
					rows,
					data,
					tHeadBorder: false,
					onRowClick: (row) => {
						router.push({
							pathname: `/tokens/${row.ticker}`,
							query: { ticker: row.ticker },
						} as any)
					},
				})}
			</div>
		</div>
	)
}

export default HomePage
