import { keepPreviousData, useQuery } from "@tanstack/react-query"
import { Keys } from "@utils"
import { api, mockApiCall } from "@utils/axiosProvider"
import { sample_token_data, sample_tokens } from "@utils/sample-data"
import { TokenData } from "../interfaces"

export function useGetAllTokens(page: number = 1) {
	const query = useQuery({
		queryKey: [Keys.tokens, "all", `page-${page}`],
		queryFn: () => mockApiCall({ data: sample_tokens, meta: { count: sample_tokens.length, limit: 10 } }),
		// queryFn: async () => {
		// 	const response = await api.get("api/v1/tokens")
		// 	console.log({ response })
		// 	return response
		// },
		//placeholderData: keepPreviousData,
		select: (data) => data,
	})

	const tokens: TokenData[] = sample_token_data
	// const tokens = query?.data?.data as IToken[]
	const pages = 2 //Math.ceil((query.data?.meta?.count || 0) / (query.data?.meta?.limit || tokens?.length || 1))

	return {
		...query,
		data: page === 1 ? tokens.slice(0, 10) : tokens.slice(10),
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
