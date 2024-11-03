import { toast } from "react-hot-toast"
import { saveToken } from "../commons/api/saveToken"
import { NewTokenData, PendingToken } from "../commons/interfaces"

const PENDING_TOKENS_KEY = "pending_tokens"
export const MAX_RETRIES = 3
export const RETRY_DELAY = 5000

export class PendingTokensService {
	static savePendingToken(token: NewTokenData) {
		const pendingTokens: PendingToken[] = JSON.parse(localStorage.getItem(PENDING_TOKENS_KEY) || "[]")

		// Find existing token with the same contract address
		const existingTokenIndex = pendingTokens.findIndex(
			(t) => t.chains[0].contract_address === token.chains[0].contract_address,
		)

		if (existingTokenIndex !== -1) {
			// Update existing token
			pendingTokens[existingTokenIndex] = {
				...token,
				retryCount: 0,
				lastAttempt: Date.now(),
			}
		} else {
			// Add new token
			pendingTokens.push({
				...token,
				retryCount: 0,
				lastAttempt: Date.now(),
			})
		}

		localStorage.setItem(PENDING_TOKENS_KEY, JSON.stringify(pendingTokens))
	}

	static removePendingToken(tokenAddress: string) {
		const pendingTokens: PendingToken[] = JSON.parse(localStorage.getItem(PENDING_TOKENS_KEY) || "[]")
		const filtered = pendingTokens.filter((token) => token.chains[0].contract_address !== tokenAddress)
		localStorage.setItem(PENDING_TOKENS_KEY, JSON.stringify(filtered))
	}

	static async retryPendingToken(token: PendingToken, onSuccess?: () => void) {
		toast.dismiss()
		try {
			await saveToken(token)
			this.removePendingToken(token.chains[0].contract_address)
			onSuccess?.()
			return true
		} catch (error) {
			const message = error.response.data.messages[0].message
			const status = error.response.status
			const errorMessage = status === 401 ? "You are not authorized to save a token" : message
			toast.error(errorMessage)
			console.log("error", message, error.response.status)
			if (token.retryCount < MAX_RETRIES) {
				const pendingTokens: PendingToken[] = JSON.parse(localStorage.getItem(PENDING_TOKENS_KEY) || "[]")
				const updatedTokens = pendingTokens.map((t) =>
					t.chains[0].contract_address === token.chains[0].contract_address
						? { ...t, retryCount: t.retryCount + 1, lastAttempt: Date.now() }
						: t,
				)
				localStorage.setItem(PENDING_TOKENS_KEY, JSON.stringify(updatedTokens))
			}
			return false
		}
	}

	static getPendingTokens(): PendingToken[] {
		return JSON.parse(localStorage.getItem(PENDING_TOKENS_KEY) || "[]")
	}

	static shouldRetry(token: PendingToken): boolean {
		const timeSinceLastAttempt = Date.now() - token.lastAttempt
		return token.retryCount < MAX_RETRIES && timeSinceLastAttempt >= RETRY_DELAY
	}
}
