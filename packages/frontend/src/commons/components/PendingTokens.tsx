import { useEffect, useState } from "react"
import { PendingToken } from "../interfaces"
import { MAX_RETRIES, PendingTokensService } from "@/src/service/pendingTokensService"
import { useQueryClient } from "@tanstack/react-query"
import { Keys } from "@utils"
import { toast } from "react-toastify"
import CustomButton from "./CustomButton"
import LoadingSpinner from "./LoadingSpinner"

export const PendingTokens = () => {
	const [pendingTokens, setPendingTokens] = useState<PendingToken[]>([])
	const queryClient = useQueryClient()
	const [isRetrying, setIsRetrying] = useState(false)

	const handleRetry = async (token: PendingToken) => {
		setIsRetrying(true)
		const success = await PendingTokensService.retryPendingToken(token, () => {
			queryClient.invalidateQueries({ queryKey: [Keys.tokens] })
		})
		if (success) {
			toast.success("Token saved successfully!")
			setIsRetrying(false)
		} else {
			toast.error("Failed to save token. Will keep trying automatically.")
			setIsRetrying(false)
		}
	}

	useEffect(() => {
		setPendingTokens(PendingTokensService.getPendingTokens())

		// Optional: Setup periodic UI refresh
		const refreshInterval = setInterval(() => {
			setPendingTokens(PendingTokensService.getPendingTokens())
		}, 5000)

		return () => clearInterval(refreshInterval)
	}, [])

	// useEffect(() => {
	// 	if (process.env.NODE_ENV === "development") {
	// 		const dummyToken: PendingToken = {
	// 			name: "Dummy Token",
	// 			ticker: "DMT",
	// 			description: "This is a dummy token for testing purposes.",
	// 			website_url: "https://example.com",
	// 			image: "https://example.com/dummy-token.png",
	// 			chains: [
	// 				{
	// 					contract_address: "0x1234567890abcdef1234567890abcdef1234567890",
	// 					chain_id: "asd",
	// 				},
	// 			],
	// 			retryCount: 1,
	// 			lastAttempt: Date.now() - 5000, // Simulate a recent retry attempt
	// 		}
	// 		PendingTokensService.savePendingToken(dummyToken)
	// 	}
	// }, [])

	return pendingTokens.length > 0 ? (
		<div className="w-full">
			<h4 className="font-semibold">Pending Tokens</h4>
			<p className="mb-4">
				The following tokens were created successfully but haven't been saved to our database yet:
			</p>
			<ul>
				{pendingTokens.map((token) => (
					<li
						key={token.chains[0].contract_address}
						className="w-full gap-y-2 rounded-md border p-4">
						<div className="flex items-center space-x-2">
							<div className=" text-gray-400">Name: </div>
							<div>{token.name}</div>
						</div>
						<div className="flex items-center space-x-2">
							<div className="text-gray-400">Ticker: </div>
							<div>{token.ticker}</div>
						</div>
						<div className="flex items-center space-x-2">
							<div className="text-gray-400">Address:</div>
							<div className="truncate"> {token.chains[0].contract_address}</div>
						</div>

						<CustomButton
							onClick={() => handleRetry(token)}
							disabled={!navigator.onLine}>
							Retry
							{isRetrying && <LoadingSpinner />}
						</CustomButton>
					</li>
				))}
			</ul>
		</div>
	) : (
		<div>There are no pending tokens</div>
	)
}
