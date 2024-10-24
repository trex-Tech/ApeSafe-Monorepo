import { twMerge } from "tailwind-merge"
import React from "react"
import CustomText from "@components/CustomText"
import { useRouter } from "@router"
import useUserStore from "@store/userStore"
import AvatarImage from "@components/AvatarImage"
import { StarIcon } from "@heroicons/react/24/solid"
import { useGetDashboardStats } from "@commons/api/general"

interface Props {
	className?: string
}

const HomePage = ({ className }: Props) => {
	const router = useRouter()
	const { user } = useUserStore()
	const { data: stats } = useGetDashboardStats()


	return (
		<div className={twMerge("flex w-full flex-col gap-y-4 px-[5%] pb-[5%]", className)}>

			<p className="h-1 text-2xl text-primary-500">
				This is homepage [START EDITING HERE]
			</p>

		</div>
	)
}

export default HomePage
