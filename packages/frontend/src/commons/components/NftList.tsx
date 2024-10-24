import { LucideArrowLeft, LucideChevronLeft, LucideChevronRight } from "lucide-react"
import React, { useRef, useState } from "react"
import { useNavigate } from "../router"

interface Item {
	id: number
	image: string
	createdBy: string
	timeAgo: string
	marketCap: string
	replies: string
	token: string
}

export const NFTItem = ({ item }: { item: Item }) => {
	const navigate = useNavigate()
	return (
		<button className="flex min-w-[320px] max-w-[320px] items-center gap-x-4 rounded-lg py-4">
			<img
				src={item.image}
				alt={`NFT created by ${item.createdBy}`}
				className="h-32 w-28 shrink-0 rounded-lg object-cover"
			/>
			<div className="flex w-full flex-col gap-y-2 overflow-hidden">
				<div className="flex flex-wrap items-center  gap-x-1">
					<span className="truncate text-green-500">Created by {item.createdBy}</span>
					<span className="text-sm text-gray-600 dark:text-gray-300">{item.timeAgo}</span>
				</div>
				<p className="flex truncate text-sm">
					<span className="text-red-500">Market Cap:</span>
					<span className="w-[4px]" />
					<span className="font-medium"> {item.marketCap}</span>
				</p>
				<p className="flex truncate text-sm">
					<span className="text-gray-600 dark:text-gray-300">Replies:</span>
					<span className="w-[4px]" />
					<span className="font-medium">{item.replies}</span>
				</p>
				<p className="flex truncate text-sm font-bold">
					TOKEN <span className="w-[4px]" /> <span className="text-sm">(ticker: {item.token})</span>
				</p>
			</div>
		</button>
	)
}

export const NFTList = ({ items }: { items: Item[] }) => {
	const scrollRef = useRef<HTMLDivElement>(null)
	const [showLeftScroll, setShowLeftScroll] = useState(false)
	const [showRightScroll, setShowRightScroll] = useState(true)

	const handleScroll = () => {
		if (scrollRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
			setShowLeftScroll(scrollLeft > 0)
			setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10)
		}
	}

	const scroll = (direction: "left" | "right") => {
		if (scrollRef.current) {
			const scrollAmount = 340
			scrollRef.current.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			})
		}
	}

	return (
		<div className="relative w-full">
			{showLeftScroll && (
				<button
					onClick={() => scroll("left")}
					className="left-0 top-1/2  z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 md:absolute"
					aria-label="Scroll left">
					<LucideChevronLeft className="h-6 w-6" />
				</button>
			)}

			<div
				ref={scrollRef}
				onScroll={handleScroll}
				className="flex flex-col gap-x-4 overflow-x-auto scroll-smooth px-4 pb-4 pt-2 md:flex-row"
				style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
				{items.map((item) => (
					<NFTItem
						key={item.id}
						item={item}
					/>
				))}
			</div>

			{showRightScroll && (
				<button
					onClick={() => scroll("right")}
					className="right-0 top-1/2 z-10 hidden -translate-y-1/2 rounded-full bg-white p-2 shadow-lg hover:bg-gray-100 dark:bg-gray-800 dark:hover:bg-gray-700 md:absolute"
					aria-label="Scroll right">
					<LucideChevronRight className="h-6 w-6" />
				</button>
			)}
		</div>
	)
}

export default NFTList
