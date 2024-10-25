import React from "react"
import { Link as Linker, Path } from "../router"
import { twMerge } from "tailwind-merge"

type Props = {
	href: Path
	className?: string
	children: React.ReactNode
} & Omit<React.ComponentProps<"a">, "ref">

const Link = ({ href, className, children, ...rest }: Props) => {
	return (
		// @ts-ignore
		<Linker className={twMerge("", className)} to={href} {...rest}>
			{children}
		</Linker>
	)
}

export default Link
