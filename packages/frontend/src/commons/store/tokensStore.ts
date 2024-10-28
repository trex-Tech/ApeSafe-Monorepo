import { create } from "zustand"
import { TokenData } from "../interfaces"

interface TokenStore {
	tokens: TokenData[]
	setTokens: (newTokens: TokenData[]) => void
	addToken: (token: TokenData) => void
	removeToken: (id: string) => void
}

export const useTokenStore = create<TokenStore>((set) => ({
	tokens: [],
	setTokens: (newTokens) => set({ tokens: newTokens }),
	addToken: (token) => set((state) => ({ tokens: [...state.tokens, token] })),
	removeToken: (id) =>
		set((state) => ({
			tokens: state.tokens.filter((token) => token.id !== id),
		})),
}))
