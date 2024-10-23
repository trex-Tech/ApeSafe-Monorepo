import React, { useEffect, useState } from "react"
import { textFieldStyle } from "@components/FormInput"
import { twMerge } from "tailwind-merge"
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline"
import CustomText from "@components/CustomText"

interface IChip {
	option: string
	selectedChips?: string[]
	setSelectedChips?: (chips: string[]) => void
	limit?: number
	selected?: boolean
	className?: string
}

export const Chip = ({ option, selectedChips, setSelectedChips, limit, selected = false, className }: IChip) => {
	const toggleChip = () => {
		const isSelected = selectedChips.includes(option)

		if (isSelected) {
			setSelectedChips(selectedChips.filter((chip) => chip !== option))
		} else {
			if (limit && selectedChips.length >= limit) {
				// Limit reached, do not add more chips
				return
			}
			setSelectedChips([...selectedChips, option])
		}
	}

	return (
		<div
			className={twMerge(
				"mx-1 flex cursor-pointer items-center rounded-full bg-gray-800 px-2 py-1 dark:bg-gray-700",
				className,
			)}
			onClick={setSelectedChips && toggleChip}>
			{option}

			{selected && <PlusIcon className="ml-1 h-4 w-4 text-gray-400 dark:text-gray-500" />}
		</div>
	)
}

const ChipSelect = ({
						options,
						label = "Select items",
						selectedChips,
						setSelectedChips,
						limit = null,
						itemName = "items",
					}) => {
	const [searchValue, setSearchValue] = useState<string>("")

	const [filteredOptions, setFilteredOptions] = useState<string[]>([])

	function handleKeyPress({ key }: { key: string }): void {
		if (key === "Delete" || key === "Backspace") {
			if (searchValue?.length === 0) {
				setSelectedChips(selectedChips.slice(0, selectedChips.length - 1))
			}
		}
	}

	useEffect(() => {
		if (searchValue.length === 0) {
			return
		}

		// match similar options and show dropdown
		const filtered = options.filter((option) => {
			return (option.toLowerCase().includes(searchValue.toLowerCase()) && !selectedChips.includes(option))
		})
		console.log(filtered)
		setFilteredOptions(filtered)


	}, [searchValue])

	return (
		<div className="flex flex-col relative">
			<p className="font-heading text-white">{label}</p>

			<div className={twMerge(textFieldStyle, "my-4 flex w-full gap-2 ")}>
				<MagnifyingGlassIcon className="w-[5%] text-gray-400 dark:text-gray-500" />

				<div className="flex w-[95%] flex-col gap-2 ">
					<div className={twMerge("flex w-[95%] flex-wrap gap-y-3")}>
						{selectedChips.map((chip) => (
							<Chip
								key={chip}
								option={chip}
								selectedChips={selectedChips}
								setSelectedChips={setSelectedChips}
								limit={limit}
							/>
						))}

						{selectedChips.length < limit && (
							<input
								onChange={(e) => setSearchValue(e.target.value)}
								value={searchValue}
								type="text"
								placeholder={"Type to search..."}
								onKeyDown={handleKeyPress}
								className="grow bg-transparent px-4 text-sm text-white focus:outline-none dark:text-gray-400"
								onClick={() => {
									// Handle click to focus on the input field
								}}
							/>
						)}

					</div>
				</div>
			</div>

			{/*show dropdown select with filtered options*/}
			{searchValue.length > 0 && (
				<div className="absolute top-[85%] bg-gray-800 dark:bg-gray-700 w-full rounded-lg">
					{filteredOptions.map((option) => (
						<div
							key={option}
							className={twMerge(
								"flex cursor-pointer items-center hover:opacity-50 bg-gray-800 px-2 py-1 dark:bg-gray-700",
							)}
							onClick={() => {
								setSelectedChips([...selectedChips, option])
								setSearchValue("")
							}}
						>
							{option}
						</div>
					))}
				</div>
			)}

			<p className="w-full text-end text-sm text-gray-500">
				At most {limit} {itemName}
			</p>
		</div>
	)
}

export default ChipSelect
