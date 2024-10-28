import React, { useState } from "react"
import { Avatar, Menu, MenuItem } from "@mui/material"
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { twMerge } from "tailwind-merge"
import { textFieldStyle } from "@commons/components/FormInput"

interface DropdownSelectItem {
	value: string
	label: string
	icon?: string | React.ReactElement
	render?: (item: DropdownSelectItem, handleClose: () => void) => React.ReactNode
}

interface DropdownSelectProps {
	className?: string
	noItemMessage?: string
	menuItemWidth?: string
	label?: string
	labelClassName?: string
	prompt?: string
	selector?: React.ReactNode
	disabled?: boolean
	items: (string | DropdownSelectItem)[]
	onSelect?: (value: string) => void
	itemLabelKey?: string
	selected: any
	setSelected: (value: any) => void
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
	className = "",
	noItemMessage = "No items",
	menuItemWidth = "w-[100vw]",
	selector = null,
	disabled = false,
	label,
	labelClassName = "",
	prompt = "-- Choose an item --",
	itemLabelKey = "label",
	selected,
	setSelected,
	items = [],
	onSelect,
}: DropdownSelectProps) => {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClick = (event: React.MouseEvent<HTMLElement>) => {
		if (!disabled) {
			setAnchorEl(event.currentTarget)
		}
	}

	const handleClose = () => {
		setAnchorEl(null)
	}

	const handleItemClick = (value: any) => {
		setSelected(value)
		onSelect && onSelect(value)
		handleClose()
	}

	const getSelectedItemLabel = (): string => {
		return selected ? (selected[itemLabelKey] ?? selected?.value) : prompt
	}

	const renderSelector = () => {
		if (selector) {
			return (
				<div
					className="w-full cursor-pointer"
					onClick={handleClick}>
					{selector}
				</div>
			)
		}

		return (
			<div
				className={twMerge(
					`${textFieldStyle} z-[400] my-0  flex cursor-pointer flex-row items-center justify-between text-gray-700 dark:text-gray-300`,
					className,
				)}
				onClick={handleClick}>
				{getSelectedItemLabel()}
				{anchorEl ? (
					<ChevronUpIcon className="inline-block h-4 w-4" />
				) : (
					<ChevronDownIcon className="inline-block h-4 w-4" />
				)}
			</div>
		)
	}

	const renderMenuItem = (item: string | DropdownSelectItem, i: number) => {
		if (itemLabelKey) {
			return (
				<MenuItem
					className={menuItemWidth}
					key={i}
					onClick={() => handleItemClick(item)}>
					{item[itemLabelKey]}
				</MenuItem>
			)
		} else if (typeof item === "string") {
			return (
				<MenuItem
					className={menuItemWidth}
					key={i}
					onClick={() => handleItemClick(item)}>
					{item}
				</MenuItem>
			)
		} else if (item?.label) {
			return (
				<MenuItem
					className={menuItemWidth}
					key={i}
					onClick={() => handleItemClick(item)}>
					{item?.icon && typeof item?.icon === "string" ? (
						<Avatar
							src={item?.icon}
							sx={{ width: 20, height: 20, marginRight: "0.5rem" }}
						/>
					) : item?.icon && React.isValidElement(item?.icon) ? (
						<div className="mr-2">{item?.icon}</div>
					) : null}
					{item?.label}
				</MenuItem>
			)
		}
	}

	return (
		<div className={"relative "}>
			<div className="my-2 flex w-full flex-col gap-2">
				{label && (
					<p className={twMerge("font-heading font-medium text-gray-700 dark:text-gray-500", labelClassName)}>
						{label}
					</p>
				)}
				{renderSelector()}
			</div>

			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={Boolean(anchorEl)}
				onClose={handleClose}>
				{items?.length > 0 ? (
					items.map((item, i) => renderMenuItem(item, i))
				) : (
					<MenuItem onClick={handleClose}>{noItemMessage}</MenuItem>
				)}
			</Menu>
		</div>
	)
}

export default DropdownSelect
