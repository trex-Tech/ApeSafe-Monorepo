import { ReactNode } from "react"
import { twMerge } from "tailwind-merge"

type Props = {
	className?: string
	children?: ReactNode
	style?: any
} & React.HTMLAttributes<HTMLDivElement>

function CardLayout({ children, className, style, ...rest }: Props) {
	return (
		<div
			style={style}
			className={twMerge(
				`overflow-x-clip rounded-xl border border-outline px-4 py-2 dark:border-outline-dark`,
				className,
			)}
			{...rest}>
			{children}
		</div>
	)
}

export default CardLayout
