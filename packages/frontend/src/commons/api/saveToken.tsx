import axios from "axios"
import { NewTokenData, TokenData } from "../interfaces"

let API_URL = "https://api.solgram.app/api/v1"
// let API_URL = import.meta.env.VITE_API_URL

export const saveToken = async (data: NewTokenData) => {
	const token = localStorage.getItem("apesafe_access_token")

	const response = await axios.post(`${API_URL}/tokens/token/`, data, {
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
	})
	console.log("res", response)
	return response.data
}
