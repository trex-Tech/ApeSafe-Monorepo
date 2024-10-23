import { create } from "zustand"

interface IModalState {
	showWelcomeDialog: boolean,
	setShowWelcomeDialog: (value: boolean) => void,
}

export const useModalStore = create<IModalState>((set) => ({
	showWelcomeDialog: false,
	setShowWelcomeDialog: (value) => set((state) => ({ showWelcomeDialog: value })),
}))
