import CardLayout from "@components/Card.layout"
import FormInput from "@components/FormInput"
import { AtSymbolIcon, LockClosedIcon } from "@heroicons/react/24/outline"
import CustomButton from "@components/CustomButton"
import CustomText from "@components/CustomText"
import { useForm } from "react-hook-form"
import { useGlobalStore } from "@store"
import { useEffect } from "react"
import { __DEV__ } from "@utils"
import { useRouter } from "@router"
import { api, handleApiError, updateAuthToken } from "@utils/axiosProvider"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router-dom"
import CONFIG from "@utils/config"
import Constants from "@utils/constants"
import { refreshLoggedInUser } from "@store/userStore"

export default function LoginPage({}) {

	const [params] = useSearchParams()
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm(CONFIG.useForm)
	const { loading } = useGlobalStore()
	const router = useRouter()

	const onSubmit = (data: any) => {
		loading.start()
		api.post("/admin/login/", data)
			.then(async (data) => {
				await updateAuthToken(data?.token?.access, true)
				await refreshLoggedInUser()
				router.push("/")
			})
			.catch(handleApiError)
			.finally(loading.reset)

	}

	useEffect(() => {
		if (params.get("session_expired")) {
			console.log("jkj")
			toast.error("Session expired. Please login again to continue")
		}
		if (__DEV__) {
			console.log("Setting default values")
			setValue("email", "adminuser@mail.com")
			setValue("password", "securepassword123")
		}
	}, [])


	return (
		<CardLayout
			className="md:w-[40%] z-10 gap-y-4 bg-white dark:bg-bg-dark-50 h-fit min-h-[50vh] items-center justify-center gap-1 px-6 py-12">

			<div className={"flex flex-col"}>
				<CustomText
					heading
					text={"Log in"}
					className="text-lg mb-[5%] dark:text-primary-light" />

				<CustomText
					heading
					text={`Welcome to ${Constants.APP_NAME}`}
					variant={"primary"}
					className="text-xl  dark:text-primary-light" />

				<CustomText
					text={"Hey, Enter your details to get sign in to your account"}
					className="mt-2 mb-6 max-w-[80%] text-sm text-gray-700 dark:text-gray-400" />
			</div>

			<form className="w-full gap-y-2 flex flex-col" onSubmit={handleSubmit(onSubmit)}>
				<FormInput
					startIcon={<AtSymbolIcon />}
					placeholder="Enter email"
					type={"email"}
					className={"dark:bg-bg-dark"}
					register={register("email", {
						required: true,
					})}
				/>

				<FormInput
					startIcon={<LockClosedIcon />}
					placeholder="Enter Password"
					className={"dark:bg-bg-dark"}
					register={register("password")}
					type="password"
				/>

				<CustomButton className="w-full py-4 mt-2">
					Login
				</CustomButton>

			</form>
		</CardLayout>
	)
}
