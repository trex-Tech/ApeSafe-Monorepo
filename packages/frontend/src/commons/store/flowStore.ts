import { create } from "zustand"

interface FlowState<T> {
	step: number
	setStep: (step: number) => void
	data: T
	resetStep: () => void
	incrementStep: () => void
	decrementStep: () => void
	resetData: () => void
	updateData: (data: Partial<T>) => void
}

function createFlowStore<T>() {
	return create<FlowState<T>>((set) => ({
		data: null as any as T,
		step: 0,
		setStep: (step) => set(() => ({ step })),
		resetStep: () => set(() => ({ step: 0 })),
		incrementStep: () => set((state) => ({ step: state.step + 1 })),
		decrementStep: () => set((state) => ({ step: state.step - 1 })),
		resetData: () => set(() => ({ data: null as any as T })),
		updateData: (data) => set((state) => ({ data: { ...state.data, ...data } })),
	}))
}
