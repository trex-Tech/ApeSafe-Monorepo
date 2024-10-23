import { Link, useLocation } from "react-router-dom"
import { twMerge } from "tailwind-merge"
import { ReactElement } from "react"
import {
	ArrowLeft01Icon,
	ArrowRight01Icon,
	CircleArrowDataTransferHorizontalIcon,
	DashboardSquare03Icon,
	Logout01Icon,
	Megaphone02Icon,
	Settings01Icon,
	UserMultipleIcon,
} from "hugeicons-react"
import Logo from "@components/Logo"
import { useSettingsStore } from "@store/settingsStore"
import CustomText from "@components/CustomText"
import { useRouter } from "@router"
import { Keys } from "@utils"

interface Props {
	className?: string
}

type SidebarItem =
	| {
			name: string
			icon: ReactElement
			action: () => void
			type: "main_menu" | "account"
			hidden?: boolean
			badge: number
	  }
	| {
			name: string
			icon: ReactElement
			type: "main_menu" | "account"
			hidden?: boolean
			badge: number
			link: string
	  }

const SidebarLayout = ({ className = "" }: Props) => {
	const { minimizeSidebar, setMinimizeSidebar } = useSettingsStore()
	const router = useRouter()

	const links: SidebarItem[] = [
		{
			name: "Dashboard",
			icon: <DashboardSquare03Icon className={"text-black dark:text-white"} />,
			link: "/",
			type: "main_menu",
			badge: 0,
		},
		{
			name: "Users",
			icon: <UserMultipleIcon className={"text-black dark:text-white"} />,
			link: "/users",
			type: "main_menu",
			badge: 0,
		},
		{
			name: "Transactions",
			icon: <CircleArrowDataTransferHorizontalIcon className={"text-black dark:text-white"} />,
			type: "main_menu",
			badge: 0,
			link: "/transactions",
		},
		{
			name: "Posts",
			icon: <Megaphone02Icon className={"text-black dark:text-white"} />,
			type: "main_menu",
			badge: 0,
			link: "/posts",
			action: () => router.push("/posts"),
		},
		{
			name: "Settings",
			icon: <Settings01Icon className={"text-black dark:text-white"} />,
			type: "account",
			hidden: true,
			badge: 0,
			link: "#settings",
		},
		{
			name: "Logout",
			icon: <Logout01Icon className={"text-black dark:text-white"} />,
			type: "account",
			badge: 0,
			action: () => {
				localStorage.removeItem(Keys.access_token)
				window.location.href = "/login"
			},
		},
	]

	return (
		<div
			className={twMerge(
				`bg-primary-dark transition-width relative z-[9000] h-full border-r border-outline px-4 duration-300 dark:border-outline-dark ${minimizeSidebar ? "w-[8%]" : "w-[18%]"}`,
				className,
			)}>
			<span
				onClick={() => setMinimizeSidebar(!minimizeSidebar)}
				className="absolute -right-5 top-[17%] flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary p-2">
				{minimizeSidebar ? (
					<ArrowRight01Icon className={"text-white"} />
				) : (
					<ArrowLeft01Icon className={"text-white"} />
				)}
			</span>

			<div className="flex h-full w-full flex-col">
				<div
					className={`flex h-[20%] w-full flex-col ${minimizeSidebar ? "items-center" : ""}  justify-center overflow-clip`}>
					<Link
						to="/"
						className={`flex w-fit items-center justify-center overflow-hidden`}>
						<Logo
							icon
							className="h-8 w-8 fill-primary"
						/>
						<CustomText
							text={"App"}
							heading
							className={`uppercase ${minimizeSidebar ? "w-0 opacity-0" : "mx-4 flex w-full opacity-100"} overflow-hidden transition duration-500 `}
						/>
					</Link>
				</div>

				<div className="flex h-[50%] w-full flex-col overflow-clip">
					<CustomText
						text={"Main Menu"}
						className={`uppercase text-gray-400 ${minimizeSidebar ? "w-0 opacity-0" : "mx-4 flex w-full justify-between opacity-100"} overflow-x-hidden transition duration-500 `}
					/>
					{links
						.filter((x) => x.type === "main_menu")
						.map((link, index) => (
							<MenuItem
								key={index}
								item={link}
							/>
						))}
				</div>

				<div className="flex h-[30%] w-full flex-col overflow-clip">
					<CustomText
						text={"Account"}
						className={`uppercase text-gray-400 ${minimizeSidebar ? "w-0 opacity-0" : "mx-4 flex w-full justify-between opacity-100"} overflow-x-hidden transition duration-500 `}
					/>
					{links
						.filter((x) => !x.hidden)
						.filter((x) => x.type === "account")
						.map((link, index) => (
							<MenuItem
								key={index}
								item={link}
							/>
						))}
				</div>
			</div>
		</div>
	)
}

export default SidebarLayout

const MenuItem = ({ item }) => {
	const pathname = useLocation().pathname
	const isActive = item.link === pathname
	const router = useRouter()
	const { minimizeSidebar, setMinimizeSidebar } = useSettingsStore()

	function onClick() {
		if (item.action) return item.action()
		else return router.push(item.link)
	}

	return (
		<div
			onClick={onClick}
			className="my-3">
			<div
				className={`group flex cursor-pointer items-center justify-center rounded-lg px-4 py-3 transition duration-500 hover:bg-black/20 dark:hover:bg-white/10  ${isActive ? "hover:bg-primary-dark bg-primary/30 hover:bg-opacity-100" : ""}`}>
				<div className={`m-0 w-8 transition duration-500`}>{item.icon}</div>

				<div
					className={`${minimizeSidebar ? "w-0 opacity-0" : "mx-4 flex w-full justify-between opacity-100"} transition-opacity duration-500 `}>
					<CustomText
						className={`w-full items-center capitalize`}
						text={item.name}
					/>
					{item.badge > 0 && (
						<span className="flex aspect-square h-8 w-8 items-center justify-center rounded-full bg-secondary p-1 text-sm text-white">
							{item.badge}
						</span>
					)}
				</div>
			</div>
		</div>
	)
}
