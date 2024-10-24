import React from "react"
import Link from "@router/link"

type Props = {
	className?: string
} & React.PropsWithChildren

const FooterLayout = ({ className = "" }: Props) => {

	const links = [
		{
			name: "Terms of Use",
			href: "#",
		},
		{
			name: "Contact Us",
			href: "#contact",
		},
		{
			name: "Features",
			href: "#features",
		},
		{
			name: "How it works",
			href: "#how-it-works",
		},
		{
			name: "Login",
			href: "/connect",
		},
	]

	return (
		<div className={"min-h-[15vh] flex items-center bg-bg-dark-50 w-full"}>
			<div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-4 p-8">

				{
					links.map((item, index) => (
						<Link
							href={item.href as any}
							className="text-gray-500 hover:text-secondary">
							{item.name}
						</Link>))
				}


			</div>
		</div>
	)
}

export default FooterLayout
