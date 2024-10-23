import { twMerge } from "tailwind-merge"
import { useParams } from "@router"
import { useFlagPost, useGetPost } from "@commons/api/posts"
import React, { useEffect } from "react"
import { useGlobalStore } from "@store"
import { formatDate } from "@utils"
import { PRODUCT_TYPES } from "@utils/enum"
import CustomButton from "@components/CustomButton"
import AvatarImage from "@components/AvatarImage"
import CustomText from "@components/CustomText"

interface Props {
	className?: string
}

const PostDetailsPage = ({ className }: Props) => {
	const { id } = useParams()
	const { data, isPending } = useGetPost(id)
	const { mutateAsync: flagPost, isPending: isLoadingFlag } = useFlagPost(id)
	const post: IPost = data?.post || ({} as IPost)
	const seller =
		data?.seller ||
		({} as IUser & {
			total_posts: number
			flagged_posts: number
			completed_transactions: number
		})
	const { loading } = useGlobalStore()

	useEffect(() => {
		if (isPending) return loading.start()
		else loading.reset()
	}, [isPending])

	const highlights: IOption[] = [
		{
			label: "Posted",
			value: formatDate(post?.created_at),
		},
		{
			label: "Location",
			value: post?.location ? `${post?.location?.address || post?.location?.city}` : "-",
		},
		{
			label: "Post Type",
			value: PRODUCT_TYPES[post?.type],
		},
	]

	const userStats: IOption[] = [
		{
			label: "Total Posts",
			value: seller?.total_posts,
		},
		{
			label: "Flagged Posts",
			value: seller?.flagged_posts,
		},
		{
			label: "Transactions Completed",
			value: seller?.completed_transactions,
		},
	]
	return (
		<div className={twMerge("flex w-full px-[5%] pb-[5%]", className)}>
			<div className="mx-8 w-[70%] flex-col gap-y-4">
				<p className={"mt-4 font-heading text-3xl"}>{post?.title}</p>

				<div className="my-2 flex items-center gap-x-8">
					{highlights.map(({ value, label }, index) => (
						<div
							key={index}
							className="flex flex-col gap-x-1">
							<p className={"text-gray-500"}>{label}:</p>
							<p className={"text-gray-700 dark:text-gray-300"}>{value}</p>
						</div>
					))}
				</div>

				<hr className="my-5 border-t border-outline dark:border-outline-dark" />

				<p className={"text-gray-700 dark:text-gray-300"}>{post?.description}</p>

				<p className={"mt-[10%] font-heading text-lg font-medium"}>Media</p>

				<div className="mt-4 flex flex-wrap">
					{post?.photos?.map((photo, index) => (
						<img
							alt={"product image"}
							key={index}
							src={photo?.photo}
							className="aspect-square w-[50%] rounded-lg object-cover"
						/>
					))}
				</div>
			</div>

			<div className="flex w-[30%] flex-col border-l border-outline p-6 dark:border-outline-dark">
				{!post?.is_flagged ? (
					<CustomButton
						loading={isLoadingFlag}
						onClick={() => flagPost({ flag: true })}
						text={"Flag Post"}
						className={"w-full"}
					/>
				) : (
					<CustomButton
						loading={isLoadingFlag}
						onClick={() => flagPost({ flag: false })}
						text={"Unflag Post"}
						className={"w-full bg-white text-black"}
					/>
				)}
				{/*<CustomButton
					variant={"text"}
					text={"Share Post"}
					className={"my-2"}
					endIcon={<Share08Icon />}
				/>*/}

				<p className={"mt-[15%] font-heading text-xl font-bold"}>About the User</p>

				<div className="my-5 flex cursor-pointer items-center gap-4">
					<AvatarImage
						className="aspect-square w-10 rounded-lg"
						src={seller?.profile_details?.photo}
					/>
					<div className="flex flex-col">
						<CustomText className="text-md capitalize">
							{seller?.first_name} {seller?.last_name}
						</CustomText>
						<CustomText className="lowercase text-gray-500">{seller?.username}</CustomText>
					</div>
				</div>

				<div className="my-4 flex flex-col gap-y-4">
					{userStats.map(({ value, label }, index) => (
						<div
							key={index}
							className="flex flex-col gap-x-1">
							<p className={"text-gray-500"}>{label}:</p>
							<p className={"text-gray-700 dark:text-gray-300"}>{value}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

export default PostDetailsPage
