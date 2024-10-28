import { twMerge } from "tailwind-merge"
import React, { useState } from "react"
import { ViewIcon, ViewOffIcon } from "hugeicons-react"

type FormInputProps = React.ComponentProps<"input"> & {
	className?: string
	register?: any
	startIcon?: any
	endIcon?: any
	iconClick?: any
	label?: any
	description?: string
	startIconClassName?: string
	endIconClassName?: string
	embeddedComponent?: React.ReactNode
	errors?: any
	// onKeyDown?: KeyboardEventHandler<HTMLInputElement>
}

export const textFieldStyle = `bg-gray-100 dark:bg-bg-dark-50 my-1 dark:autofill:bg-gray-900 autofill:bg-gray-500 p-4 outline-0 focus:ring-1 border border-outline dark:border-outline-dark ring-primary-light transition-200 rounded-lg w-full`

const FormInput = (props: FormInputProps) => {
	const {
		className = "",
		startIcon,
		endIcon,
		iconClick,
		label,
		register,
		description,
		startIconClassName,
		endIconClassName,
		type,
		errors = {},
		embeddedComponent,
		// onKeyDown,
		...rest
	} = props

	const [showPassword, setShowPassword] = useState(false)

	const textFieldClass = `${textFieldStyle} ${Object.keys(errors)?.length > 0 ? "dark:border-red-400 border-red-400 ring-red-400" : "border-gray-400"} font-heading text-black dark:text-white ${startIcon && "pl-12"} ${
		endIcon && "pr-12"
	}`

	return (
		<div className="flex w-full flex-col text-start">
			{label && (
				<div className="my-1 flex gap-2">
					<p className="font-heading text-gray-700 dark:text-gray-400">{label}</p>
					{description && <em className="font-heading text-gray-500 dark:text-gray-700">(*{description})</em>}
				</div>
			)}
			<div className="relative flex w-full items-center">
				<div
					className={twMerge(
						`absolute left-4 flex h-6 w-6 items-center text-gray-400 ${
							iconClick && "cursor-pointer hover:text-primary"
						} ${startIconClassName}`,
					)}
					onClick={iconClick}>
					{startIcon}
				</div>
				<input
					type={showPassword ? "text" : type}
					{...rest}
					{...register}
					required
					className={twMerge(`${textFieldClass} ${className}`)}
				/>
				{embeddedComponent ? (
					<div className={`absolute right-1.5 flex h-fit w-fit items-center text-gray-400 transition `}>
						{embeddedComponent}
					</div>
				) : type === "password" ? (
					<div
						className={twMerge(
							`absolute right-4 flex h-6 w-6 cursor-pointer  items-center text-gray-400 transition`,
						)}
						onClick={() => setShowPassword(!showPassword)}>
						{showPassword ? <ViewIcon /> : <ViewOffIcon />}
					</div>
				) : (
					<div
						className={twMerge(
							`absolute right-4 flex h-6 w-6 items-center  text-gray-400 transition ${
								iconClick && "cursor-pointer hover:text-primary"
							} ${endIconClassName}`,
						)}
						onClick={iconClick}>
						{endIcon}
					</div>
				)}
			</div>
			<p className={"w-full text-sm text-red-400"}>{Object.keys(errors)?.length > 0 && errors.message}</p>
		</div>
	)
}

export default FormInput
