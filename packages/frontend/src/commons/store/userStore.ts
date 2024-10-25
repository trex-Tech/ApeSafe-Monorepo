import { create } from "zustand"
import { api, updateAuthToken } from "@utils/axiosProvider"

interface UserState {
	user: IUser
	setUser: (userData: IUser) => void
}

const useUserStore = create<UserState>((set) => ({
	user: null,
	setUser: (user) => set((state) => ({ user })),
}))


export default useUserStore

export const refreshLoggedInUser = async () => {
	const { setUser } = useUserStore.getState()
	return await api
		.get("/user/profile")
		.then(({ user }) => {
			console.log("User", user)
			setUser(user)
			return user
		})
		.catch((e) => {
			console.log("Error fetching data", e)
			throw e
		})
}

export const refreshAll = async () => {
	await refreshLoggedInUser()
}

export const logout = async () => {
	const { setUser } = useUserStore.getState()
	await updateAuthToken(null, true)
	setUser(null)
}
