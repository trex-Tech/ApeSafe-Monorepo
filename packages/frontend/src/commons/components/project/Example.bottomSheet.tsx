import BottomSheetLayout, { dismissBottomSheet } from "@components/layouts/BottomSheet.layout"
import React, { forwardRef, useEffect } from "react"
import CustomButton from "@components/CustomButton"
import { ChevronLeftIcon } from "@heroicons/react/24/solid"
import { useRouter } from "@router"
import CustomText from "@components/CustomText"
import FormInput from "@components/FormInput"
import { SubmitHandler, useForm } from "react-hook-form"
import { api, handleApiError } from "@utils/axiosProvider"
import { useGlobalStore } from "@store"
import { __DEV__, validateMSISDN } from "@utils"
import CONFIG from "@utils/config"

interface JobInfoBottomSheetProps {
	className?: string
}

const branch = {
	name: "", id: "",
	company: "",
	members: [],
	createdAt: "",
	updatedAt: "",
}

const ExampleBottomSheet = ({ className, ...rest }: JobInfoBottomSheetProps, ref) => {

	const router = useRouter()
	const { loading } = useGlobalStore()


	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		getValues,
	} = useForm(CONFIG.useForm)


	const createBranchApiCall: SubmitHandler<any> = (data) => {
		loading.start()

		if (!data.manager_details.email) delete data.manager_details

		api.post("/company/branch/create", data)
			.then((data) => {
				dismissBottomSheet(ref)
				console.log(data)
				router.push(`/branch/${data.id}` as any)
			})
			.catch(handleApiError)
			.finally(loading.reset)
	}

	useEffect(() => {
		if (!__DEV__) return

		setValue("name", "Ibadan Local")
		setValue("office_address", "5 example street")
		setValue("manager_details.email", "jesulonimii.will+1@gmail.com")

	}, [])

	return (
		<BottomSheetLayout size={[50, 95]} ref={ref}>
			<div className="w-full h-full flex flex-col px-4 py-8 gap-4 mini-scrollbar">
				<div className="w-full flex gap-4 items-center mb-4">
					<ChevronLeftIcon className={"h-6 w-6 text-gray-400 cursor-pointer"}
									 onClick={() => dismissBottomSheet(ref)} />
					<CustomText heading className={"text-2xl font-bold"}>Create New Branch</CustomText>
				</div>

				<form
					className="w-full border border-outline dark:border-outline-dark rounded-xl p-8 flex flex-col gap-1">
					<CustomText className={"text-lg font-medium font-heading"}>Branch Information</CustomText>
					<CustomText className={"text-gray-700 dark:text-gray-500 mb-6"}>Please fill in the branch details.</CustomText>


					<FormInput
						errors={errors.name}
						register={register("name", {
							required: "Branch name is required",
						})}
						label={"Branch Name"}
						placeholder={"ex: Lagos Branch"}
					/>

					<FormInput
						errors={errors.office_address}
						register={register("office_address", {
							required: "Branch address is required",
						})}
						label={"Branch Office Address"}
						placeholder={"ex: 123, Branch street, Lagos"}
					/>

					<FormInput
						errors={errors.email}
						register={register("email", {
							pattern: {
								value: /\S+@\S+\.\S+/,
								message: "Please enter a valid email address",
							},
						})}
						label={"Branch email address"}
						description={"optional"}
						placeholder={"ex: branch@company.com"}
					/>

					<FormInput
						errors={errors.phone}
						register={register("phone", {
							validate: (value: string) => {
								return value.trim().length > 0 ? validateMSISDN(value) ? true : "Please enter a valid phone number" : true
							},
							pattern: {
								value: /^\+?[0-9]+$/,
								message: "Please enter a valid phone number",
							},
							minLength: {
								value: 11,
								message: "Phone number must be at least 11 characters",
							},
							maxLength: {
								value: 11,
								message: "Phone number must be at most 11 characters",
							},
						})}
						label={"Branch phone number"}
						description={"optional"}
						placeholder={"ex: Lagos Branch"}
					/>

				</form>

				<div
					className="w-full border border-outline dark:border-outline-dark rounded-xl p-8 flex flex-col gap-1">
					<CustomText className={"text-lg font-medium font-heading"}>Invite Branch Manager (optional)</CustomText>
					<CustomText className={"text-gray-700 dark:text-gray-500 mb-4"}>
						The manager will be in charge of the branch.
					</CustomText>

					<FormInput
						errors={(errors.manager_details as any)?.email}
						register={register("manager_details.email", {
							pattern: {
								value: /\S+@\S+\.\S+/,
								message: "Please enter a valid email address",
							},
						})}
						label={"Manager's Work Email"}
						placeholder={"ex: john@example.com"}
					/>


				</div>

				<CustomButton onClick={handleSubmit(createBranchApiCall)} variant={"primary"}
							  className={"dark:bg-white dark:text-black w-fit py-5 flex-1 mt-2"}>
					Create Branch
				</CustomButton>

			</div>
		</BottomSheetLayout>
	)
}


export default forwardRef(ExampleBottomSheet)
