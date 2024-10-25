import Link from "@router/link"
import CustomText from "@components/CustomText"

export const _404ErrorView = () => {
	return (
		<div className="relative flex h-screen w-full flex-col items-center justify-center bg-white transition duration-300 dark:bg-bg-dark dark:text-white">
			<p className="my-2 text-[5rem]">😬</p>
			<p className="my-6 font-heading  text-3xl font-bold">You're definitely an adventurer but..</p>
			<p className="text-md">It seems like you got lost this time.</p>
			<Link href="/" className="text-md my-1 text-secondary">
				Don't worry, Here is an easy way home
			</Link>

			<p className="text-md absolute bottom-16 font-heading text-gray-500">
				404 ERROR: Requested page not found.
			</p>
		</div>
	)
}
