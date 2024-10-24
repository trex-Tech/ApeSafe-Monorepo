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
import { LucideChevronDown, LucideSearch } from "lucide-react"
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
					src={row.logo}
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
			<span
				className={`rounded-full p-2 text-white ${row.changeType === "positive" ? "bg-green-500" : "bg-red-500"}`}>
				{row.change}
			</span>
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
		<div className={twMerge("mt-[58px] flex w-full flex-col gap-y-4 px-[5%] pb-[5%]", className)}>
			<p className="h-1 text-off-white ">Welcome,</p>
			<p className="text-primary-500 h-1 text-2xl">Create a new coin</p>

			<label className="mb-0 mt-6">Token Name</label>
			<div className="flex w-auto flex-row items-center justify-start ">
				<FormInput
					className="w-48 py-2"
					// label={"Token Name"}
				/>
				<CustomButton
					text="Create Token"
					className="w-36 "
					onClick={() => router.push("/create-token")}
				/>
			</div>

			<div className="mt-8 flex flex-row items-center justify-between">
				{/* <TabView
					tabs={[
						{ name: "Following", component: <div className="w-full border">asd</div> },
						{ name: "Terminal", component: <div>asd</div> },
					]}
				/> */}
				<div className="flex flex-row gap-x-2">
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
					{/* <div
						className={`relative bottom-0 left-0 h-1 w-full bg-red-500 transition-transform duration-300 ease-in-out ${
							activeTab === "following" ? "translate-x-0" : "translate-x-1/2"
						}`}
					/> */}
				</div>
				<div className="flex flex-row items-center border-b-2">
					<LucideSearch />
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
				<div className="mb-6 flex items-center justify-between">
					<h3 className="text-[20px]">Tokens</h3>
					<div className="flex gap-x-4">
						<FormInput
							startIcon={<LucideSearch />}
							placeholder="Search"
							className="py-2"
						/>
						<button className="flex items-center rounded-lg bg-input bg-off-white px-2 py-0">
							<p className="whitespace-nowrap">Sort by date</p>
							<LucideChevronDown />
						</button>
					</div>
				</div>

				{renderTable({ rows, data, tHeadBorder: false })}
			</div>
		</div>
	)
}

export default HomePage
