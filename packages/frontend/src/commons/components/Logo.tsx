import { twMerge } from "tailwind-merge"
import Constants from "@utils/constants"
import LogoSvg from "@assets/images/logo.svg?react"

type Props = {
	className?: string
	icon?: boolean
	iconSize?: number
}

const Logo = ({ className, icon, iconSize = 1 }: Props) => {

	return (
		<div className={twMerge("flex w-fit items-center", className)}>
			<LogoSvg style={{
				height: iconSize + 32,
			}} className={twMerge("fill-primary", className)} />
			{!icon && <h1 className={"min-text-lg font-bold mx-4"}>{Constants.APP_NAME}</h1>}
		</div>
	)
}

export default Logo
