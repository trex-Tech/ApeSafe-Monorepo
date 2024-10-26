import { Path, useNavigate } from "./router"
import { useEffect } from "react"
import { Routes } from "@generouted/react-router"

export * from "react-router-dom"
export { redirect, useNavigate, Navigate } from "./router"

export const RouterSetup = () => {
	return <Routes />
}

export const usePathname = () => {
	return window.location.pathname
}

export const useRouter = () => {
	const navigate = useNavigate()
	const location = window.location

	const push = (path: Path) => navigate(path)
	const replace = (path: Path) => navigate(path, { replace: true })

	const query = Object.fromEntries(new URLSearchParams(location.search))

	return {
		push,
		replace,
		query,
	}
}

export const router = useRouter

/*export const redirect = (url: string) => {
	return window.location.replace(url);
};*/

export const setPageTitle = (title: string) => {
	return useEffect(() => {
		document.title = `${title} - MyChange`
	}, [])
}

export default RouterSetup
