import { useQuery } from "@tanstack/react-query"
import { Keys } from "@utils"
import { api } from "@utils/axiosProvider"

export function useGetDashboardStats() {
	return useQuery({
		queryKey: [Keys.users, "stats"],
		queryFn: () => api.get(`/admin/dashboard/stats`),
		select: (data) =>
			data as {
				active_users: number
				total_transactions: number
				total_posts: number
				recent_transactions: ITransaction[]
			},
	})
}
