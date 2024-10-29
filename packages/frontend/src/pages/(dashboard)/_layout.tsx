import React from "react"
import { Outlet } from "react-router-dom"
import Header from "@components/layouts/Header.layout"
import { useGlobalStore } from "@store"
import { useRouter } from "@router"

const DashboardLayout = ({ children }) => {
	const { loading } = useGlobalStore()
	const router = useRouter()

	return (
		<main className="flex h-screen w-full flex-col ">
			<Header />

			<div className={"px-[10%] py-[6%]"}>{children ? children : <Outlet />}</div>
		</main>
	)
}

export default DashboardLayout
