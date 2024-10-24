import CustomButton from "@/src/commons/components/CustomButton"
import FileUploader from "@/src/commons/components/FileUploader"
import FormInput from "@/src/commons/components/FormInput"
import { useRouter } from "@/src/commons/router"
import React, { useState } from "react"

const index = () => {
	const [files, setFiles] = useState<File[]>([])
	const router = useRouter()

	const handleFileChange = (file: File) => {
		console.log("File changed:", file)
		// Add any additional logic you need when a file changes
	}

	return (
		<div className={`mt-[58px] px-[5%]`}>
			<div>
				<p className={`text-center text-[#C3C3C3] lg:text-left`}>Setup token</p>
				<p className={`mt-[7px] text-center lg:text-left text-[24px] text-[#C3C3C3] lg:text-[30px]`}>
					Setup your HERITAGE token
				</p>
			</div>

			<div className={`mt-[33px]`}>
				<div className={`lg:w-[50%]`}>
					<FormInput
						className="w-full py-2"
						label={"Token Ticker"}
					/>
					<div className={`mt-[8px] flex justify-end`}>
						<span className={`text-center text-[13px] text-[#B6B6B6]`}>Enter token ticker</span>
					</div>
				</div>

				<div className={`mt-[26px] lg:w-[50%]`}>
					<FormInput
						className="w-full py-2"
						label={"Describe your token"}
					/>
				</div>

				<div className={`my-[26px] lg:w-[50%]`}>
					<div className="my-1 flex gap-2">
						<p className="font-heading text-gray-700 dark:text-gray-400">Token image</p>
					</div>
					<FileUploader
						files={files}
						setFiles={setFiles}
						onFileChange={handleFileChange}
						multi={true}
						maxFiles={5}
						prompt="Upload your files here"
						allowedFileTypes={["PNG", "JPG", "PDF"]}
						className={`h-[300px]`}
					/>
				</div>

				<div className={`mt-[26px] lg:w-[50%]`}>
					<FormInput
						className="w-full py-2"
						label={"Twitter Link (optional)"}
					/>
				</div>
				<div className={`mt-[26px] lg:w-[50%]`}>
					<FormInput
						className="w-full py-2"
						label={"Telegram Link (optional)"}
					/>
				</div>
				<div className={`mt-[26px] lg:w-[50%]`}>
					<FormInput
						className="w-full py-2"
						label={"Website (optional)"}
					/>
				</div>
				<div className={`my-[26px] flex lg:w-[50%] lg:justify-end`}>
					<CustomButton
						text="Launch Token"
						onClick={() => router.push("/select-chain")}
					/>
				</div>
			</div>
		</div>
	)
}

export default index
