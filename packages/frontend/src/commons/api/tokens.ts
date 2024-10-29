import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Keys } from "@utils"
import { api, mockApiCall } from "@utils/axiosProvider"
import { sample_token_data, sample_tokens } from "@utils/sample-data"
import { TokenData } from "../interfaces"
import axios from "axios"
import { useTokenStore } from "../store/tokensStore"

export function useGetAllTokens(
	page: number = 1,
	search?: string,
	timeFilter?: "1h" | "24h" | "3d" | "7d" | "30d" | "1y",
) {
	const query = useQuery({
		queryKey: [Keys.tokens, "all", `page-${page},`, search, timeFilter],
		queryFn: async () => {
			const response = await axios.get(
				`https://api.solgram.app/api/v1/tokens/token/?search=${search}&date=${timeFilter}`,
			)
			console.log({ response })
			return response.data
		},
		placeholderData: keepPreviousData,

		// select: (data) => data,
	})

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
	//const { tokens } = useTokenStore()
	return useQuery<TokenData>({
		queryKey: [Keys.tokens, ticker],
		queryFn: () =>
			mockApiCall(sample_token_data.find((token) => token?.ticker?.toLowerCase() === ticker?.toLowerCase())), //
		select: (data) => data,
	})
}
