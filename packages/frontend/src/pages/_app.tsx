import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Outlet } from "@router"
import { Toaster } from "react-hot-toast"
import LoadingModal from "@components/modals/Loading.modal"
import { useLocalStorage } from "@hooks"
import { useEffect } from "react"
import { Keys } from "@utils"
import { retrieveSettings, useSettingsStore } from "@store/settingsStore"


export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
		},
	},
})
retrieveSettings().then(()=>console.log("Settings retrieved and loaded"))

function BaseLayout({}) {

	// const { darkMode: isDark } = useSettingsStore()

	// useEffect(() => {
	// 	if (isDark) {
	// 		document.body.classList.add("dark")
	// 	} else {
	// 		document.body.classList.remove("dark")
	// 	}
	// }, [isDark])


	return (
		<div className={"w-full h-full"}>
			<QueryClientProvider client={queryClient}>
				<LoadingModal />
				<Toaster position={"top-right"} />
				<div className={" w-full"}>
					<Outlet />
				</div>
				<ReactQueryDevtools buttonPosition={"bottom-right"} initialIsOpen={false} />
			</QueryClientProvider>
		</div>
	)
}

export default BaseLayout
