import { twMerge } from "tailwind-merge"
import React from "react"

type Props = {
	className?: string
	heading?: boolean
	children?: React.ReactNode
	text?: string | number
	variant?: "default" | "primary" | "secondary" | "gradient"
} & React.HTMLAttributes<HTMLParagraphElement>

const CustomText = ({ className, heading, text, children, variant = "default", ...rest }: Props) => {
	const styling = {
		default: "",
		primary: "text-primary",
		secondary: "text-secondary",
		gradient: "text-transparent w-fit bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-secondary",
	}[variant]

	if (heading) return (
		<h1 style={{ lineHeight: 1 }} className={twMerge(`${styling} font-heading font-bold`, className)}>
			{text ? text : children}
		</h1>
	)

	return (
		<p className={twMerge(styling, className)} {...rest}>
			{text ? text : children}
		</p>
	)

}

export default CustomText
