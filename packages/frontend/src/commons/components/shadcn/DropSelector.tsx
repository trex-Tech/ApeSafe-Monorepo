import React from "react"
import { twMerge } from "tailwind-merge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@components/shadcn/ui/select"

interface DropdownSelectItem {
	value: string
	label: string
	icon?: string | React.ReactElement
	render?: (item: DropdownSelectItem, handleClose: () => void) => React.ReactNode
}

interface DropdownSelectProps {
	className?: string
	noItemMessage?: string
	label?: string
	labelClassName?: string
	prompt?: string
	disabled?: boolean
	items: (string | DropdownSelectItem)[]
	selected: any
	setSelected: (value: any) => void
}

const DropdownSelect: React.FC<DropdownSelectProps> = ({
														   className = "",
														   noItemMessage = "No items",
														   disabled = false,
														   label,
														   labelClassName = "",
														   prompt = "-- Choose an item --",
														   setSelected,
														   items = [],
													   }: DropdownSelectProps) => {


	return (
		<div className={"z-[9000]"}>
			<div className="my-2 flex w-full flex-col gap-2">
				{label && (
					<p className={twMerge("font-heading font-medium text-gray-700 dark:text-gray-500", labelClassName)}>
						{label}
					</p>
				)}
			</div>

			<Select disabled={disabled} onValueChange={(value) => setSelected(value)}>
				<SelectTrigger className={twMerge("w-[180px]", className)}>
					<SelectValue
						className={twMerge("font-heading font-medium text-gray-700 dark:text-gray-500", labelClassName)}
						placeholder={prompt} />
				</SelectTrigger>
				<SelectContent>
					{items?.length > 0 ? (
						items.map((item, i) => (
							<SelectItem value={typeof item === "string" ? item : item?.value}>
								{typeof item === "string" ? item : item?.label}
							</SelectItem>
						))
					) : (
						<SelectItem value={null}>{noItemMessage}</SelectItem>
					)}
				</SelectContent>
			</Select>

		</div>
	)
}

export default DropdownSelect
