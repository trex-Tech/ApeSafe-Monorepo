import { twMerge } from "tailwind-merge"
import CustomButton from "@components/CustomButton"
import React from "react"
import { formatDate } from "@utils"
import { useFlagPost } from "@commons/api/posts"
import { useRouter } from "@router"

interface IPostingCard extends IPost {
	className?: string
	onClick?: () => void
}

const PostingCard = ({ className, onClick, ...post }: IPostingCard) => {
	const router = useRouter()

	const { mutateAsync: flagPost, isPending } = useFlagPost(post?.id)

	const onClickPost = () => {
		router.push(`/posts/${post?.id}`)
		onClick()
	}

	return (
		<div
			onClick={onClickPost}
			className={twMerge(
				"hover:bg-primary-dark m-1 flex w-full cursor-pointer flex-col gap-4 rounded-lg border-b border-outline px-3 py-5 pb-8",
				className,
			)}>
			<div className="flex items-center justify-between">
				<div className={"flex flex-col gap-1"}>
					<h3 className={"text-sm text-gray-400"}>{formatDate(post?.created_at)}</h3>
					<h3 className={"font-heading font-semibold capitalize"}>{post?.title}</h3>
					<h3 className={"text-sm"}>
						<span className={"text-gray-400"}>Price: </span>
						{post?.price}
					</h3>
				</div>

				{!post?.is_flagged ? (
					<CustomButton
						loading={isPending}
						onClick={() => flagPost({ flag: true })}
						text={"Flag Post"}
						className={
							"hidden rounded-full bg-black hover:bg-red-500 dark:bg-white dark:text-black dark:hover:bg-red-500 dark:hover:text-white md:flex"
						}
					/>
				) : (
					<CustomButton
						loading={isPending}
						onClick={() => flagPost({ flag: false })}
						text={"Unflag Post"}
						className={"hidden rounded-full bg-black dark:bg-white dark:text-black md:flex"}
					/>
				)}
			</div>

			<p className="line-clamp-2 w-full ">{post?.description}</p>
		</div>
	)
}

export default PostingCard

export const PostingCardSkeleton = ({ className = "" }) => {
	return (
		<div
			className={twMerge(
				"hover:bg-primary-dark m-1  flex w-full cursor-pointer flex-col gap-4 rounded-lg border-outline px-3 py-5 pb-8",
				className,
			)}>
			<div className="flex items-center justify-between">
				<div className={"flex w-[60%] flex-col gap-2"}>
					<span className="h-6 w-full animate-pulse rounded-lg bg-skeleton" />
					<span className="h-4 w-[20%] animate-pulse rounded-lg bg-skeleton" />
				</div>

				<span className="h-10 w-[20%] animate-pulse rounded-full bg-skeleton" />
			</div>

			<span className="h-24 w-full animate-pulse rounded-lg bg-skeleton" />

			<div className="flex flex-wrap gap-2">
				{Array.from({ length: 4 })?.map((_, i) => (
					<span
						key={i}
						className="h-6 w-16 animate-pulse rounded-3xl bg-skeleton"
					/>
				))}
			</div>
		</div>
	)
}
