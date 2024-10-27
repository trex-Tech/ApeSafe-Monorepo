import React, { useEffect, useState } from "react"
import useUserStore from "@store/userStore"
import { usePathname, useRouter } from "@router"
import { api, handleApiError } from "@utils/axiosProvider"
import { useGlobalStore } from "@store"
import ThemeSwitch from "@components/ThemeSwitch"
import DynamicBreadcrumb from "@components/DynamicBreadcrumb"
import ApeSafeLogo from "@assets/images/apesafe-logo.svg"
import CustomButton from "../CustomButton"
import { useAppKit } from "@reown/appkit/react"
import { useAccount, useBalance } from "wagmi"
import LoadingSpinner from "../LoadingSpinner"
import axios from "axios"

const API_URL = "https://6dc1-102-89-69-234.ngrok-free.app/api/v1"

type Props = {
	className?: string
} & React.PropsWithChildren

const Header = ({ className = "" }: Props) => {
	const { open } = useAppKit()
	const router = useRouter()
	const { address, isConnected } = useAccount()
	const { data: balanceData, isLoading } = useBalance({
		address,
	})
	const [showWalletInfo, setShowWalletInfo] = useState(false)

	const connectWallet = async () => {
		const data = {
			wallet_id: address,
		}
		const res = await axios.post(`${API_URL}/auth/connect/`, data)
		if (res.status === 200) {
			console.log("Wallet connected successfully:::", res.data)
			localStorage.setItem("apesafe_access_token", res.data.result.access)
		}
	}

	useEffect(() => {
		const timer = setTimeout(() => {
			setShowWalletInfo(true)
		}, 2000)

		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		if (isConnected) {
			connectWallet()
		}
	}, [isConnected])

	return (
		<div
			className={
				"sticky top-0 z-50 flex min-h-[10vh] w-full items-center justify-between bg-white px-8 py-[24px] dark:bg-bg-dark"
			}>
			<div className={`flex items-center gap-x-10`}>
				<div
					onClick={() => router.push("/")}
					className={`cursor-pointer`}>
					<img
						src={ApeSafeLogo}
						alt="ApeSafe Logo"
					/>
				</div>

				<div className={`hidden flex-row items-center gap-x-5 lg:flex`}>
					<div
						className={`flex flex-row items-center gap-x-2 border border-[#FCA5A5] px-[10px] py-[8px] text-[#FCA5A5]`}>
						<div className={`h-[20px] w-[20px] rounded-[2px] bg-gray-500`} />
						<p className={`text-[13px]`}>Heritage sold 0.34 SOL of TOKEN</p>
						<div className={`h-[20px] w-[20px] rounded-full bg-gray-500`} />
					</div>
					<div
						className={`flex flex-row items-center gap-x-2 border border-[#FFFF00] px-[10px] py-[8px] text-[#FFFF00]`}>
						<div className={`h-[20px] w-[20px] rounded-[2px] bg-gray-500`} />
						<p className={`text-[13px]`}>Heritage sold 0.34 SOL of TOKEN</p>
						<div className={`h-[20px] w-[20px] rounded-full bg-gray-500`} />
					</div>
				</div>
			</div>
			<div className={`flex flex-row items-center gap-x-10`}>
				<div className={"flex cursor-pointer text-white"}>
					{!isLoading ? (
						<>
							{isConnected && balanceData ? (
								<CustomButton
									text={`${address.substring(36, 42)} 🐸 ${balanceData.formatted.substring(0, 4)} ETH `}
									className="w-[200px]"
									onClick={() => open()}
								/>
							) : (
								<CustomButton
									text="Connect Wallet"
									className="w-[155px]"
									onClick={() => open()}
								/>
							)}
						</>
					) : (
						<LoadingSpinner />
					)}
				</div>
			</div>
		</div>
	)
}

export default Header
