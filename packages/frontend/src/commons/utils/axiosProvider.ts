import axios, { AxiosError } from "axios"
import toast from "react-hot-toast"
import Keys from "@utils/query-keys"

let API_URL = import.meta.env.VITE_API_URL
// let API_URL = "https://6dc1-102-89-69-234.ngrok-free.app/api/v1"

const axiosInstance = axios.create({
	baseURL: API_URL,
	//withCredentials: true,
})

let token = null

if (localStorage.getItem(Keys.access_token)) {
	axiosInstance.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem(Keys.access_token)}`
	axiosInstance.defaults.headers.Authorization = `Bearer ${localStorage.getItem(Keys.access_token)}`
}

export const updateAuthToken = async (new_token: string, save?: boolean) => {
	token = new_token

	if (new_token === null) {
		localStorage.removeItem(Keys.access_token)
		axiosInstance.defaults.headers.common.Authorization = null
		axiosInstance.defaults.headers.Authorization = null
		return
	}

	if (save) {
		localStorage.setItem(Keys.access_token, new_token)
	}
	axiosInstance.defaults.headers.common.Authorization = "Bearer " + new_token
	axiosInstance.defaults.headers.Authorization = "Bearer " + new_token
}

axiosInstance.interceptors.request.use(
	async (config) => {
		/*const fetch_token = localStorage.getItem("access_token")
		if (fetch_token) {
			await updateAuthToken(fetch_token, true)
			config.headers.Authorization = `Bearer ${fetch_token}`
		}*/

		return config
	},
	(error) => {
		return Promise.reject(error)
	},
)

// Response interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		return response
	},
	(error: AxiosError) => {
		if (error.code === "ECONNABORTED") {
			toast.error("Request timed out. Please check your network connection.")
		} else if (error.message.includes("Network Error")) {
			toast.remove()
			toast.error("Network Error occurred. Please check your network connection.")
		} else {
			console.log("An unexpected error occurred:", error.message)
		}

		if (error?.response?.status === 401) {
			const currentPath = window.location.pathname
			if (currentPath !== "/login" && currentPath !== "/signup" && currentPath !== "/") {
				window.location.replace(`/login?redirect=${encodeURIComponent(currentPath)}`)
			}
		}

		return Promise.reject(error)
	},
)

export default axiosInstance

const makeRequest = async (
	method: "get" | "post" | "patch" | "put" | "delete",
	path: string,
	data: any,
	headers: any = {},
	select: boolean = true,
) => {
	const endpoint = path ? `${API_URL}${path.charAt(0) === "/" ? "" : "/"}${path}` : null
	if (!endpoint) {
		console.error("API request error: No endpoint provided")
		throw new Error("API request error: No endpoint provided")
	}

	let config: IAxiosRequestConfig = {
		method: method,
		url: endpoint,
		data: data,
		headers: {
			"Content-Type": "application/json",
			...headers,
		},
	}

	console.debug(
		`🚀 Requesting Api: %c${config.method.toUpperCase()} ===> %c${config?.url}\n`,
		"color: yellow",
		"color: yellow",
	)

	return await axiosInstance(config)
		.then((res) => {
			return select ? res.data.data : res.data
		})
		.catch((err: AxiosError) => {
			return Promise.reject(err)
		})
}

export const api = {
	get: async (path: string, headers: any = {}, select?: boolean) =>
		await makeRequest("get", path, null, headers, select),
	post: async (path: string, data: any, headers: any = {}, select?: boolean) =>
		await makeRequest("post", path, data, headers, select),
	patch: async (path: string, data: any, headers: any = {}, select?: boolean) =>
		await makeRequest("patch", path, data, headers, select),
	put: async (path: string, data: any, headers: any = {}, select?: boolean) =>
		await makeRequest("put", path, data, headers, select),
	delete: async (path: string, data: any, headers: any = {}, select?: boolean) =>
		await makeRequest("delete", path, data, headers, select),
}

interface IAxiosRequestConfig {
	method: "get" | "post" | "patch" | "put" | "delete"
	url: string
	headers: any
	data?: any
}

export const handleApiError = async (error: AxiosError) => {
	let message = "An unexpected error occurred. Please try again later."
	console.error(error)
	if ((error.response?.data as any)?.message) {
		message = (error.response?.data as any)?.message
	}

	if (error.response?.status === 401) {
		await updateAuthToken(null, true)
		toast.error("Session expired. Please login again to continue.")
		return
	}

	if (error.response.status !== 401) toast.error(message)
}

export function mockApiCall<T>(data: T, time = 1000, status: number = 200): Promise<T> {
	return new Promise((resolve, reject) => {
		setTimeout(() => {
			if (status.toString().startsWith("4") || status.toString().startsWith("5")) {
				reject({
					status: status,
					message: "error",
					data: data,
				})
			} else {
				resolve(data)
			}
		}, time)
	})
}
