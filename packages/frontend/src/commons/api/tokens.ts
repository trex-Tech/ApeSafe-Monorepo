import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Keys } from "@utils"
import { api, mockApiCall } from "@utils/axiosProvider"
import { sample_token_data, sample_tokens } from "@utils/sample-data"
import { TokenData } from "../interfaces"

export function useGetAllTokens(
	page: number = 1,
	search?: string,
	timeFilter?: "1h" | "24h" | "3d" | "7d" | "30d" | "1y",
) {
	const query = useQuery({
		queryKey: [Keys.tokens, "all", `page-${page},`, search, timeFilter],
		//queryFn: () => mockApiCall({ data: sample_tokens, meta: { count: sample_tokens.length, limit: 10 } }),
		// queryFn: async () => {
		// 	const response = await api.get("api/v1/tokens")
		// 	console.log({ response })
		// 	return response
		// },
		placeholderData: keepPreviousData,
		queryFn: () => {
			let filteredTokens = [...sample_token_data]

			// Apply search filter
			if (search) {
				filteredTokens = filteredTokens.filter(
					(token) =>
						token.name.toLowerCase().includes(search.toLowerCase()) ||
						token.ticker.toLowerCase().includes(search.toLowerCase()),
				)
			}

			// Apply time filter
			if (timeFilter) {
				const now = new Date()
				const filterMap = {
					"1h": 1 * 60 * 60 * 1000,
					"24h": 24 * 60 * 60 * 1000,
					"3d": 3 * 24 * 60 * 60 * 1000,
					"7d": 7 * 24 * 60 * 60 * 1000,
					"30d": 30 * 24 * 60 * 60 * 1000,
					"1y": 366 * 24 * 60 * 60 * 1000,
				}

				const cutoffTime = now.getTime() - filterMap[timeFilter]
				filteredTokens = filteredTokens.filter((token) => new Date(token.date_created).getTime() > cutoffTime)
			}

			const startIndex = (page - 1) * 10
			const endIndex = startIndex + 10
			const paginatedTokens = filteredTokens.slice(startIndex, endIndex)

			return mockApiCall({
				data: paginatedTokens,
				meta: {
					count: filteredTokens.length,
					limit: 10,
				},
			})
		},

		select: (data) => data,
	})

	//const tokens: TokenData[] = filteredD
	// const tokens = query?.data?.data as IToken[]
	const pages = Math.ceil((query.data?.meta?.count || 0) / 10) //Math.ceil((query.data?.meta?.count || 0) / (query.data?.meta?.limit || tokens?.length || 1))

	return {
		...query,
		data: query.data?.data,
		pages,
	}
}

export function useGetToken(ticker: string) {
	return useQuery<TokenData>({
		queryKey: [Keys.tokens, ticker],
		queryFn: () =>
			mockApiCall(sample_token_data.find((token) => token?.ticker?.toLowerCase() === ticker?.toLowerCase())), //
		select: (data) => data,
	})
}
