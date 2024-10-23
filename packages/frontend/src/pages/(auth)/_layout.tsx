import { Outlet } from "react-router-dom"
import ThemeSwitch from "@components/ThemeSwitch"
import React, { useEffect } from "react"
import { useGlobalStore } from "@store"
import { useRouter } from "@router"
import useUserStore, { refreshLoggedInUser } from "@store/userStore"
import BgPattern from "@assets/images/bg-pattern.png"
import Logo from "@components/Logo"

const AuthLayout = ({ children }) => {
	const { loading } = useGlobalStore()
	const router = useRouter()


	useEffect(() => {
		refreshLoggedInUser()
			.then(() => router.replace("/"))
			.finally(loading.reset)
	}, [])


	return (
		<div className="bg-[#E0F4FFF2] dark:bg-bg-dark min-h-screen flex flex-col justify-center items-center px-12">
			<div className={"w-full flex justify-between items-center absolute top-0 z-10 px-[5%] py-[2%]"}>
				<Logo />
				<ThemeSwitch icon className={"my-5 "} />
			</div>

			<img src={BgPattern} className={"absolute top-0 left-0 opacity-10 w-full h-full"} alt={"bg"} />

			{children ? children : <Outlet />}
		</div>
	)
}

export default AuthLayout
