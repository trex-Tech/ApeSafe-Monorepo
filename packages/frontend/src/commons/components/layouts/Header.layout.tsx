import React from "react"
import useUserStore from "@store/userStore"
import { usePathname, useRouter } from "@router"
import { api, handleApiError } from "@utils/axiosProvider"
import { useGlobalStore } from "@store"
import ThemeSwitch from "@components/ThemeSwitch"
import DynamicBreadcrumb from "@components/DynamicBreadcrumb"

type Props = {
	className?: string
} & React.PropsWithChildren

const Header = ({ className = "" }: Props) => {
	const { user } = useUserStore()
	const { loading } = useGlobalStore()
	const router = useRouter()
	const pathname = usePathname()

	let logOut = () => {
		loading.start()

		api.post("/auth/logout", {})
			.then(() => {
				router.push("/login")
			})
			.catch(handleApiError)
			.finally(loading.reset)
	}

	return (
		<div
			className={
				"sticky top-0 z-50 flex min-h-[10vh] w-full items-center justify-between bg-white px-8 py-6 dark:bg-bg-dark"
			}>
			<DynamicBreadcrumb />
			<ThemeSwitch icon />
		</div>
	)
}

export default Header
