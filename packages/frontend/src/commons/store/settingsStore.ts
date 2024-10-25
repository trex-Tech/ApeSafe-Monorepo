import { create } from "zustand"

interface SettingsState {
	darkMode: boolean,
	setDarkMode: (value: boolean) => void
	biometricAuthEnabled: boolean
	setBiometricAuthEnabled: (value: boolean) => void
	pushNotificationsEnabled: boolean
	setPushNotificationsEnabled: (value: boolean) => void
	minimizeSidebar: boolean,
	setMinimizeSidebar: (isMinimized: boolean) => void
}


export const useSettingsStore = create<SettingsState>((set) => ({
	darkMode: true,
	setDarkMode: (value) => set({ darkMode: value }),
	biometricAuthEnabled: false,
	setBiometricAuthEnabled: (value) => set((state) => ({ biometricAuthEnabled: value })),
	pushNotificationsEnabled: false,
	setPushNotificationsEnabled: (value) => set((state) => ({ pushNotificationsEnabled: value })),
	minimizeSidebar: false,
	setMinimizeSidebar: (isMinimized) => set((state) => ({ minimizeSidebar: isMinimized })),
}))

export enum SETTINGS {
	DARK_MODE = "dark-theme",
	BIOMETRIC_AUTH = "biometric-auth",
	SIDEBAR_MINIMIZED = "sidebar-minimized"
}

export async function retrieveSettings() {
	const darkMode = localStorage.getItem(SETTINGS.DARK_MODE)
	useSettingsStore.getState().setDarkMode(JSON.parse(darkMode) ?? false)

	const biometricAuth = localStorage.getItem(SETTINGS.BIOMETRIC_AUTH)
	useSettingsStore.getState().setBiometricAuthEnabled(JSON.parse(biometricAuth) ?? false)

	const minimizeSidebar = localStorage.getItem(SETTINGS.SIDEBAR_MINIMIZED)
	useSettingsStore.getState().setMinimizeSidebar(JSON.parse(minimizeSidebar) ?? false)
}

useSettingsStore.subscribe((state) => {
	localStorage.setItem(SETTINGS.DARK_MODE, JSON.stringify(state.darkMode))
	localStorage.setItem(SETTINGS.BIOMETRIC_AUTH, JSON.stringify(state.biometricAuthEnabled))
	localStorage.setItem(SETTINGS.SIDEBAR_MINIMIZED, JSON.stringify(state.minimizeSidebar))
})
