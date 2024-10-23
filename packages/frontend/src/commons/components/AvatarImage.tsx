import { twMerge } from "tailwind-merge"
import DefaultImage from "@commons/assets/images/user-placeholder-image.png"

type Props = {
	className?: string
	src?: string
	alt?: string
	online?: boolean
}

const AvatarImage = ({ className, online, src, alt }: Props) => {
	return (
		<div className={"relative"}>
			<img
				src={src ?? DefaultImage}
				onError={(e) => e.currentTarget.src = DefaultImage}
				className={twMerge("aspect-square w-16 rounded-full bg-gray-400", className)}
				alt={alt ?? "profile-image"}
			/>
			{online && (
				<div
					className="border-primary-dark-alt absolute -bottom-[5%] right-0 aspect-square w-3 rounded-full border bg-[#16D313FF]"></div>
			)}
		</div>
	)
}

export default AvatarImage
