import DialogLayout from "@components/layouts/Dialog.layout"
import { useGlobalStore } from "@store"
import Logo from "@components/Logo"
import CustomText from "@components/CustomText"


const LoadingModal = ({}) => {

	const { isLoading, loadingText } = useGlobalStore()

	return (
		<DialogLayout
			backdropClassName={"z-[9000]"}
			className={"aspect-square items-center gap-3 min-h-0 w-fit min-w-0"}
			show={isLoading}>
			<Logo icon iconSize={26} className={"animate-pulse px-4"} />
			<CustomText className={"text-gray-400"} text={"Please Wait..."} />
		</DialogLayout>
	)
}


export default LoadingModal
