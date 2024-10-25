import React, { useEffect } from "react"
import { Outlet } from "react-router-dom"
import SidebarLayout from "@components/layouts/Sidebar.layout"
import Header from "@components/layouts/Header.layout"
import { refreshLoggedInUser } from "@store/userStore"
import { useGlobalStore } from "@store"
import { useRouter } from "@router"

const DashboardLayout = ({ children }) => {
	const { loading } = useGlobalStore()
	const router = useRouter()

	return (
		<main className="flex h-screen w-full flex-col">
			<Header />

			<div>{children ? children : <Outlet />}</div>
		</main>
	)
}

export default DashboardLayout
