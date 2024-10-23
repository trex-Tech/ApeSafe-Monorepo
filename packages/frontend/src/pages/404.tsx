import Link from "@router/link"
import CustomText from "@components/CustomText"

interface Page404Props {
	className?: string
}

const Page404 = ({ className }: Page404Props) => {
	return (
		<div
			className=" transition duration-300 flex flex-col h-screen w-full items-center justify-center relative dark:text-white">
			<CustomText className="text-[5rem] my-2">️🔭</CustomText>
			<CustomText className="font-heading font-bold  text-3xl my-6">We like us an explorer but..</CustomText>
			<CustomText className="text-md">It seems like you got lost this time.</CustomText>
			<Link href="/dashboard" className="text-secondary my-1 text-md">
				Don't worry, Here is an easy way home
			</Link>

			<CustomText className="text-md text-gray-500 absolute bottom-16 ">404 ERROR: Requested page not found.</CustomText>
		</div>
	)
}


export default Page404
