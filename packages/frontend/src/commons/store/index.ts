import { create } from "zustand"


interface GlobalDataState {
	[key: string]: any
}

interface GlobalState {
	globalData: GlobalDataState
	deviceToken: string
	setDeviceToken: (value: string) => void
	isLoading: boolean
	loading: {
		start: (loadingText?: string) => void
		reset: () => void
	}
	loadingText: string
	updateGlobalData: (value: Partial<GlobalDataState>) => void
}

export const useGlobalStore = create<GlobalState>((set) => ({
	globalData: {

	},
	deviceToken: null,
	isLoading: false,
	loadingText: "Loading, Please wait...",
	loading: {
		reset: () => set((state) => ({ loadingText: "Loading, Please wait...", isLoading: false })),
		start: (loadingText = "Loading, Please wait...") => set((state) => ({ isLoading: true, loadingText })),
	},
	setDeviceToken: (token) => set((state) => ({ deviceToken: token })),
	updateGlobalData: (value) => set((state) => ({ globalData: { ...state.globalData, ...value } })),
}))
