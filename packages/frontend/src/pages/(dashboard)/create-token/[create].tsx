import CustomButton from "@/src/commons/components/CustomButton"
import FileUploader from "@/src/commons/components/FileUploader"
import FormInput from "@/src/commons/components/FormInput"
import { useRouter } from "@/src/commons/router"
import React, { useState, useEffect } from "react"
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from "wagmi"
import mockHubFactoryAbi from "@/src/commons/abi/MockHubFactory"
import { useAppKitState } from "@reown/appkit/react"
import { useParams } from "@router"
import axios from "axios"
import { useTokenMutation } from "@/src/commons/api/tokens"
import { Toaster } from "react-hot-toast"

const API_URL = "https://api.solgram.app/api/v1"

const CreateTokenPage = () => {
	const [files, setFiles] = useState<File[]>([])
	const router = useRouter()
	const [tokenTicker, setTokenTicker] = useState<string>("")
	const [tokenDescription, setTokenDescription] = useState<string>("")
	const [twitterLink, setTwitterLink] = useState<string>("")
	const [telegramLink, setTelegramLink] = useState<string>("")
	const [websiteLink, setWebsiteLink] = useState<string>("")
	const [imageBase64, setImageBase64] = useState<string | null>(null)
	const [newTokenAddress, setNewTokenAddress] = useState(null)
	const { data: hash, writeContract, error } = useWriteContract()
	const { address, isConnecting, isDisconnected, chain } = useAccount()
	const { create } = useParams()

	const handleFileChange = (file: File, base64?: string) => {
		console.log("File changed:", file)
		console.log("Image base64:", base64)
		setImageBase64(base64)

		// Add any additional logic you need when a file changes
	}

	const saveTokenMutation = useTokenMutation()

	const createToken = async () => {
		if (create === "" || tokenTicker === "" || tokenDescription === "") {
			alert("Please fill in needed fields.")
			return
		} else if (imageBase64 === null) {
			alert("Token Image is required.")
		} else {
			writeContract({
				abi: mockHubFactoryAbi,
				address: "0xBc53B85fcB5aCBe82935418Ed96e9925bf569860",
				functionName: "deploy",
				account: address,
				chain: chain,
				args: [create, tokenTicker],
			})

			if (error) {
				// error.message
				// error.name
				console.log("error:", error.message)
				if (error.message.includes("Connector not connected.")) {
					alert("Please connect your wallet.")
				}
			}
		}
	}

	const tokenData = {
		name: create,
		ticker: tokenTicker,
		description: tokenDescription,
		twitter_url: twitterLink, //OPTIONAL
		telegram_url: telegramLink, //OPTIONAL
		website_url: websiteLink, //OPTIONAL
		chains: [{ name: "base", contract_address: address }],
		image: imageBase64,
	}

	const {
		isLoading: isConfirming,
		isSuccess: isConfirmed,
		data,
	} = useWaitForTransactionReceipt({
		hash,
	})

	useEffect(() => {
		if (isConfirmed && data && data.logs) {
			setNewTokenAddress("0x" + data.logs[1].topics[1].slice(26))
			console.log("New token data:", data)
			console.log("New token ca:", data.logs[0].address)
		}
		if (isConfirmed && data && data.logs) {
			saveTokenMutation.mutate(tokenData)
		}
	}, [isConfirmed, data])

	return (
		<div className={``}>
			<div>
				<p className={`mt-[7px] text-center text-[24px] text-[#C3C3C3] lg:text-left lg:text-[30px]`}>
					Setup your {create} token
				</p>
			</div>

			<div className={`mt-[33px]`}>
				<div className={`lg:w-[50%]`}>
					<FormInput
						className="w-full py-2"
						label={"Token Ticker"}
						value={tokenTicker}
						onChange={(e) => setTokenTicker(e.target.value)}
					/>
				</div>

				<div className={`mt-[26px] lg:w-[50%]`}>
					<FormInput
						className="w-full py-2"
						label={"Describe your token"}
						value={tokenDescription}
						onChange={(e) => setTokenDescription(e.target.value)}
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
						maxFiles={1}
						prompt="Upload your file here"
						allowedFileTypes={["PNG", "JPG", "PDF"]}
						className={`h-[300px]`}
					/>
				</div>

				<div className={`mt-[26px] lg:w-[50%]`}>
					<FormInput
						className="w-full py-2"
						label={"Twitter Link (optional)"}
						value={twitterLink}
						onChange={(e) => setTwitterLink(e.target.value)}
					/>
				</div>
				<div className={`mt-[26px] lg:w-[50%]`}>
					<FormInput
						className="w-full py-2"
						label={"Telegram Link (optional)"}
						value={telegramLink}
						onChange={(e) => setTelegramLink(e.target.value)}
					/>
				</div>
				<div className={`mt-[26px] lg:w-[50%]`}>
					<FormInput
						className="w-full py-2"
						label={"Website (optional)"}
						value={websiteLink}
						onChange={(e) => setWebsiteLink(e.target.value)}
					/>
				</div>
				<div className={`my-[26px] flex space-y-[10px] lg:w-[50%] lg:justify-start`}>
					<div className={`space-y-[20px]`}>
						<div>
							<p>
								{hash && (
									<a
										href={`https://sepolia.basescan.org/tx/${hash}`}
										target="_blank"
										rel="noopener noreferrer"
										className={`text-blue-700 underline`}>
										{" "}
										{`Creating $${tokenTicker}, check status here`}
									</a>
								)}
							</p>
						</div>
						<CustomButton
							text={`Launch ${create}`}
							// onClick={() => router.push("/select-chain")}
							onClick={() => createToken()}
							loading={isConfirming}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}

export default CreateTokenPage
