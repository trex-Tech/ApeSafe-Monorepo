import { LucideArrowLeft, LucideChevronLeft, LucideChevronRight } from "lucide-react"
import React, { useState } from "react"

interface Item {
	id: number
	image: string
	createdBy: string
	timeAgo: string
	marketCap: string
	replies: string
	token: string
}

const NFTItem = ({ item }: { item: Item }) => {
	return (
		<div className="flex items-center justify-center gap-x-2 rounded-lg">
			<img
				src={item.image}
				//alt="NFT"
				className="h-36 w-32 rounded object-cover"
			/>
			<div className=" py-2 text-[14px]">
				<p className="whitespace-nowrap text-green-500">
					Created by {item.createdBy} <span className="text-black dark:text-white">{item.timeAgo}</span>
				</p>
				<p className="text-red-500">
					Market Cap: <span className="text-black dark:text-white">{item.marketCap}</span>
				</p>
				<p>Replies {item.replies}</p>
				<p className="font-bold">TOKEN (ticker: {item.token})</p>
			</div>
		</div>
	)
}

export const NFTList = ({ items }: { items: Item[] }) => {
	const [scrollPosition, setScrollPosition] = useState(0)
	const handleScroll = (e: React.WheelEvent<HTMLDivElement>) => {
		setScrollPosition(e.target.scrollLeft)
	}
	return (
		<div className="white-space-nowrap flex w-full flex-row space-x-6 overflow-x-auto scroll-smooth">
			{/* <button
				className="relative -left-2 top-1/2 -translate-y-1/2"
				onClick={() => {
					const container = document.querySelector(".NFTList-container") as HTMLDivElement
					container.scrollLeft -= 100
				}}>
				<LucideChevronLeft />
			</button>
			<button
				className="absolute -right-2 top-1/2 -translate-y-1/2"
				onClick={() => {
					const container = document.querySelector(".NFTList-container") as HTMLDivElement
					container.scrollLeft += 100
				}}>
				<LucideChevronRight />
			</button> */}
			<div
				className="NFTList-container flex space-x-4 overflow-x-auto"
				onWheel={handleScroll}>
				{items.map((item) => (
					<NFTItem
						key={item.id}
						item={item}
					/>
				))}
			</div>
		</div>
	)
}

export default NFTList
