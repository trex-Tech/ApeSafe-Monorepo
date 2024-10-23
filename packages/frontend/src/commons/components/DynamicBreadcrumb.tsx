import { usePathname } from "@router"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList, BreadcrumbPage,
	BreadcrumbSeparator,
} from "@components/shadcn/ui/breadcrumb"
import React from "react"

const DynamicBreadcrumb = () => {
	const pathname = usePathname()

	// Get pathname and split into segments
	const pathNames = pathname.split("/").filter((x) => x)

	if (pathNames.length === 0) return <div></div>

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{/* Home link */}
				<BreadcrumbItem>
					<BreadcrumbLink href="/">Home</BreadcrumbLink>
				</BreadcrumbItem>

				{pathNames.map((value, index) => {
					const isLast = index === pathNames.length - 1
					const to = `/${pathNames.slice(0, index + 1).join("/")}`

					return (
						<React.Fragment key={to}>
							<BreadcrumbSeparator />
							<BreadcrumbItem className={"cursor-pointer"}>
								{/* If it's the last item, render as a non-clickable breadcrumb */}
								{isLast ? (
									<BreadcrumbPage className={"capitalize text-primary"}>{value}</BreadcrumbPage>
								) : (
									<BreadcrumbLink className={"capitalize"} href={to}>{value}</BreadcrumbLink>
								)}
							</BreadcrumbItem>
						</React.Fragment>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}

export default DynamicBreadcrumb
