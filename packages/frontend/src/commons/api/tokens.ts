import { useQuery } from "@tanstack/react-query"
import { Keys } from "@utils"
import { mockApiCall } from "@utils/axiosProvider"
import { sample_tokens } from "@utils/sample-data"

export function useGetAllTokens(page: number = 1) {
	const query = useQuery({
		queryKey: [Keys.tokens, "all", `page-${page}`],
		queryFn: () => mockApiCall({ data: sample_tokens, meta: { count: sample_tokens.length, limit: 10 } }),
		select: (data) => data,
	})

	const tokens = query?.data?.data as IToken[]
	const pages = Math.ceil((query.data?.meta?.count || 0) / (query.data?.meta?.limit || tokens?.length || 1))

	return {
		...query,
		data: tokens,
		pages,
	}
}

export function useGetToken(ticker: string) {
	return useQuery<IToken>({
		queryKey: [Keys.tokens, ticker],
		queryFn: () =>
			mockApiCall(sample_tokens.find((token) => token?.ticker?.toLowerCase() === ticker?.toLowerCase())),
		select: (data) => data,
	})
}
