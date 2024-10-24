import React from "react"
import useUserStore from "@store/userStore"
import { usePathname, useRouter } from "@router"
import { api, handleApiError } from "@utils/axiosProvider"
import { useGlobalStore } from "@store"
import ThemeSwitch from "@components/ThemeSwitch"
import DynamicBreadcrumb from "@components/DynamicBreadcrumb"
import ApeSafeLogo from "@assets/images/apesafe-logo.svg"
import CustomButton from "../CustomButton"

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
				"sticky top-0 z-50 flex min-h-[10vh] w-full items-center justify-between bg-white px-8 py-[24px] dark:bg-bg-dark"
			}>
			<div className={`flex items-center gap-x-10`}>
			<div onClick={() => router.push("/")} className={`cursor-pointer`}>
				<img src={ApeSafeLogo} alt="ApeSafe Logo" />
			</div>

				<div className={`lg:flex flex-row gap-x-5 items-center hidden`}>
					<div className={`flex flex-row gap-x-2 items-center border border-[#FCA5A5] px-[10px] py-[8px] text-[#FCA5A5]`}>
						<div className={`w-[20px] h-[20px] rounded-[2px] bg-gray-500`} />
						<p className={`text-[13px]`}>Heritage sold 0.34 SOL of TOKEN</p>
						<div className={`w-[20px] h-[20px] rounded-full bg-gray-500`} />
					</div>
					<div className={`flex flex-row gap-x-2 items-center border border-[#FFFF00] px-[10px] py-[8px] text-[#FFFF00]`}>
						<div className={`w-[20px] h-[20px] rounded-[2px] bg-gray-500`} />
						<p className={`text-[13px]`}>Heritage sold 0.34 SOL of TOKEN</p>
						<div className={`w-[20px] h-[20px] rounded-full bg-gray-500`} />
					</div>
				</div>
			</div>
			<div className={`flex flex-row gap-x-10 items-center`}>
			<ThemeSwitch icon className={`hidden lg:block`} />
			<CustomButton
				text="Connect Wallet"
				className="w-[155px]"
			/>
			</div>
		</div>
	)
}

export default Header
