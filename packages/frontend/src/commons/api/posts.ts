import { useMutation, useQuery } from "@tanstack/react-query"
import { Keys } from "@utils"
import { api } from "@utils/axiosProvider"
import { queryClient } from "@src/pages/_app"
import toast from "react-hot-toast"

export function useGetAllPosts(page: number) {
	const query = useQuery({
		queryKey: [Keys.posts, "all", `page-${page}`],
		queryFn: () => api.get(`/admin/post?offset=${(page - 1) * 10}`, {}, false),
		select: (data) => data,
	})

	const posts = query?.data?.data as IPost[]
	const pages = Math.ceil((query.data?.meta?.count || 0) / (query.data?.meta?.limit || posts?.length || 1))

	return {
		...query,
		data: posts,
		pages,
	}
}

export function useGetPost(id: string) {
	return useQuery<{
		post: IPost
		seller: IUser & {
			total_posts: number
			flagged_posts: number
			completed_transactions: number
		}
	}>({
		queryKey: [Keys.posts, id],
		queryFn: () => api.get(`/admin/post/${id}/details`),
		select: (data) => data,
	})
}

export function useGetAllPostStats() {
	return useQuery<{
		total_posts: number
		posts_this_week: number
		active_posts: number
		flagged_posts: number
	}>({
		queryKey: [Keys.posts, "stats"],
		queryFn: () => api.get(`/admin/post/stats`),
		select: (data) => data,
	})
}

export function useFlagPost(id: string) {
	return useMutation({
		mutationFn: ({ flag }: { flag: boolean }) =>
			api.put(`/admin/post/${id}/flag/`, {
				action: flag ? "flag" : "unflag",
			}),
		onSuccess: () => {
			toast.success("Post flagged successfully")
			queryClient.refetchQueries({ queryKey: [Keys.posts, id] })
			queryClient.refetchQueries({ queryKey: [Keys.posts] })
			queryClient.refetchQueries({ queryKey: [Keys.posts, "stats"] })
		},
		onError: (error) => {
			toast.error(error?.message || "An error occurred while flagging post")
		},
	})
}
