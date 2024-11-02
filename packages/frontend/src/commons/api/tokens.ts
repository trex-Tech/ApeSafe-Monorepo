import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Keys } from "@utils"
import { api, mockApiCall } from "@utils/axiosProvider"
import { sample_token_data, sample_tokens } from "@utils/sample-data"
import { NewTokenData, PendingToken, TokenData } from "../interfaces"
import axios from "axios"
import { useTokenStore } from "../store/tokensStore"
import { useEffect } from "react"
import { useRouter } from "../router"
import { saveToken } from "./saveToken"
import { toast } from "react-hot-toast"
import { PendingTokensService, RETRY_DELAY } from "@/src/service/pendingTokensService"

export function useGetAllTokens(
	page: number = 1,
	search?: string,
	timeFilter?: "1h" | "24h" | "3d" | "7d" | "30d" | "1y",
) {
	const { setTokens } = useTokenStore()
	const query = useQuery({
		queryKey: [Keys.tokens, "all", `page-${page},`, search, timeFilter],
		queryFn: async () => {
			const response = await axios.get(
				`https://api.solgram.app/api/v1/tokens/token/?page=${page}&search=${search}&date=${timeFilter}`,
			)
			//console.log({ response })
			//console.log("time", new Date())

			return response.data
		},
		placeholderData: keepPreviousData,
		select: (data) => data,
	})

	useEffect(() => {
		console.log("data set", query?.data?.results)
		setTokens(query?.data?.results)
	}, [query.data])

	//const tokens: TokenData[] = filteredD
	const tokens = query?.data?.results as TokenData[]
	const count = query?.data?.meta?.count
	const page_size = query?.data?.meta?.page_size
	const pages = Math.ceil((count || 0) / page_size || 1) //Math.ceil((query.data?.meta?.count || 0) / (query.data?.meta?.limit || tokens?.length || 1))

	return {
		...query,
		data: tokens,
		pages,
	}
}

export function useGetToken(ticker: string) {
	const { tokens } = useTokenStore()
	return useQuery<TokenData>({
		queryKey: [Keys.tokens, ticker],
		queryFn: () => mockApiCall(tokens.find((token) => token?.ticker?.toLowerCase() === ticker?.toLowerCase())), //
		select: (data) => data,
	})
}

export const useTokenMutation = () => {
	const router = useRouter()
	const queryClient = useQueryClient()

	useEffect(() => {
		const retryInterval = setInterval(() => {
			const pendingTokens = PendingTokensService.getPendingTokens()

			pendingTokens.forEach((token) => {
				if (PendingTokensService.shouldRetry(token)) {
					PendingTokensService.retryPendingToken(token, () => {
						queryClient.invalidateQueries({ queryKey: [Keys.tokens] })
					})
				}
			})
		}, RETRY_DELAY)

		return () => clearInterval(retryInterval)
	}, [])

	return useMutation({
		mutationFn: async (data: NewTokenData) => {
			const result = await saveToken(data)
			return result
		},
		// mutationFn: async (data: NewTokenData) => {
		// 	try {
		// 		const result = await saveToken(data)
		// 		return result
		// 	} catch (error) {
		// 		// Save to pending tokens if it's a network error
		// 		console.log("error", error.response)
		// 		if (!navigator.onLine || (error as any)?.isAxiosError) {
		// 			PendingTokensService.savePendingToken(data)
		// 			console.log("error", error.response)
		// 		}
		// 		// throw error
		// 	}
		// },

		onSuccess: (data, variables) => {
			const address = variables.chains[0].contract_address
			PendingTokensService.removePendingToken(address)
			queryClient.invalidateQueries({ queryKey: [Keys.tokens] })
			router.push({
				pathname: `/select-chain/${address}`,
				query: { address },
			} as any)
		},
		onError: (error: any, variables: NewTokenData) => {
			console.log("Error saving token:", error)
			toast.error(
				error.response.message ??
					error.response.data.message ??
					error.message ??
					"An error occurred while saving your token",
			)
			// Handle error (e.g., show toast notification)
			// Save to pending tokens if it's a network error
			if (!navigator.onLine || (error as any)?.isAxiosError) {
				PendingTokensService.savePendingToken(variables)
				console.log("error", error.response)
			}
		},
	})
}
