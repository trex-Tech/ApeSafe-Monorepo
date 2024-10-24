import { twMerge } from "tailwind-merge"
import React, { useState } from "react"
import CustomText from "@components/CustomText"
import { useRouter } from "@router"
import useUserStore from "@store/userStore"
import AvatarImage from "@components/AvatarImage"
import { StarIcon } from "@heroicons/react/24/solid"
import { useGetDashboardStats } from "@commons/api/general"
import FormInput from "@/src/commons/components/FormInput"
import CustomButton from "@/src/commons/components/CustomButton"
import TabView from "@/src/commons/components/TabView"
import { ArrowDown, ArrowUp, ChevronDown, Search } from "lucide-react"
import NFTList from "@/src/commons/components/NftList"
import { renderTable } from "@/src/commons/components/Table"

interface Props {
	className?: string
}

const items = [
	{
		id: 1,
		image: "https://media.mkpcdn.com/prod/1000x/d41d8cd98f00b204e9800998ecf8427e_656731.jpg",
		createdBy: "heritage",
		timeAgo: "10h ago",
		marketCap: "4.9K",
		replies: "13",
		token: "TKN",
	},
	{
		id: 2,
		image: "https://media.mkpcdn.com/prod/1000x/d41d8cd98f00b204e9800998ecf8427e_656731.jpg",
		createdBy: "heritage",
		timeAgo: "10h ago",
		marketCap: "4.9K",
		replies: "13",
		token: "TKN",
	},
	{
		id: 3,
		image: "https://media.mkpcdn.com/prod/1000x/d41d8cd98f00b204e9800998ecf8427e_656731.jpg",
		createdBy: "heritage",
		timeAgo: "10h ago",
		marketCap: "4.9K",
		replies: "13",
		token: "TKN",
	},
	{
		id: 4,
		image: "https://media.mkpcdn.com/prod/1000x/d41d8cd98f00b204e9800998ecf8427e_656731.jpg",
		createdBy: "heritage",
		timeAgo: "10h ago",
		marketCap: "4.9K",
		replies: "13",
		token: "TKN",
	},
]

const data = [
	{
		rank: 1,
		name: "TOKEN",
		ticker: "TKN",
		creator: "Heritage",
		change: "+26%",
		date: "04/09/24",
		logo: "path/to/bitcoin.png",
		changeType: "positive", // This can be used to determine the color of the change bubble
	},
	{
		rank: 2,
		name: "Ethereum",
		ticker: "$1,850",
		creator: "Txnt",
		change: "+12%",
		date: "01/06/24",
		logo: "path/to/ethereum.png",
		changeType: "positive",
	},
	{
		rank: 3,
		name: "Solana",
		ticker: "$25.6",
		creator: "Crypto_m",
		change: "-18%",
		date: "02/04/24",
		logo: "path/to/solana.png",
		changeType: "negative",
	},
]

const rows = [
	{
		label: "Rank",
		value: "rank",
		visible: true,
	},
	{
		label: "Name",
		value: "name",
		visible: true,
		view: (row: any) => (
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
		value: "creator",
		visible: true,
	},
	{
		label: "24h Change",
		value: "change",
		visible: true,
		view: (row: any) => (
			<div className="flex items-center gap-1">
				<p>{row.change}</p>
				{row.changeType === "positive" ? (
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
		value: "date",
		visible: true,
	},
]

const HomePage = ({ className }: Props) => {
	const router = useRouter()
	const { user } = useUserStore()
	const { data: stats } = useGetDashboardStats()
	const [activeTab, setActiveTab] = useState<"following" | "terminal">("following")

	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-[5%] pb-[5%]", className)}>
			<p className="text-off-white h-1 text-center font-semibold md:text-left ">Welcome,</p>
			<p className="text-primary-500 h-1 text-center text-3xl font-semibold md:text-left">Create a new coin</p>

			<label className="mt-6">Token Name</label>
			<div className="-mt-4 flex w-auto items-center justify-between gap-x-4 md:justify-start">
				<div className="w-[55%] md:w-[45%]">
					<FormInput
						className="py-2"
						width={"45%"}
					/>
				</div>
				<CustomButton
					text="Create Token"
					className="rounded-sm "
				/>
			</div>

			<div className="mt-8 flex flex-col items-start md:flex-row  md:items-center md:justify-between">
				{/* <div className="flex flex-row gap-x-2">
					<button
						onClick={() => setActiveTab("following")}
						className={`text-custom-grey ${activeTab === "following" && "border-b-2 border-black dark:border-white"}`}>
						Following
					</button>
					<button
						onClick={() => setActiveTab("terminal")}
						className={`text-custom-grey ${activeTab === "terminal" && "border-b-2 border-black dark:border-white"}`}>
						Terminal
					</button>
				</div> */}
				<div className=" flex w-full flex-row items-center border-b-2 md:mt-0 md:w-[25%]">
					<Search />
					<input
						className="border-none bg-inherit py-2 pl-2 outline-none"
						placeholder="Search"
					/>
				</div>
			</div>

			<div>
				<NFTList items={items} />
			</div>

			<div className="mt-12 flex flex-col rounded-lg border p-4">
				<div className="mb-6 flex flex-col justify-between md:flex-row md:items-center">
					<h3 className="text-[20px]">Tokens</h3>
					<div className="flex gap-x-4">
						<FormInput
							startIcon={<Search />}
							placeholder="Search"
							className="py-2"
						/>
						<button className="bg-off-white flex hidden items-center rounded-lg bg-input px-2 py-0 md:flex">
							<p className="whitespace-nowrap">Sort by date</p>
							<ChevronDown />
						</button>
					</div>
				</div>

				{renderTable({ rows, data, tHeadBorder: false })}
			</div>
		</div>
	)
}

export default HomePage
