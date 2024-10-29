import { ArrowUpOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { FileUploader as Uploader } from "react-drag-drop-files"
import React from "react"
import { twMerge } from "tailwind-merge"
import { DocumentAttachmentIcon } from "hugeicons-react"
import CustomText from "@components/CustomText"

interface Props {
	className?: string
	fieldClassName?: string
	files: File[]
	setFiles: (files: File[]) => void
	onFileChange?: (file: File, base64?: string) => void
	maxFiles?: number
	multi?: boolean
	prompt?: string
	allowedFileTypes?: string[]
}

const FileUploader = (props: Props) => {
	const {
		className,
		fieldClassName,
		files,
		setFiles,
		onFileChange = (file, base64) => {},
		multi = false,
		maxFiles = 3,
		prompt = "Drag or Upload media files",
		allowedFileTypes = ["PNG", "JPG", "JPEG", "SVG"],
	} = props

	const convertToBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result as string)
			reader.onerror = (error) => reject(error)
		})
	}

	let fileChangedHandler = async (file: File) => {
		setFiles([...files, file])
		if (file.type.startsWith("image/")) {
			try {
				const base64 = await convertToBase64(file)
				onFileChange(file, base64)
			} catch (error) {
				console.error("Error converting file to base64:", error)
				onFileChange(file)
			}
		} else {
			onFileChange(file)
		}
	}

	return (
		<div className={twMerge("flex flex-col", className)}>
			{files.length > 0 && (
				<div className="my-4 flex h-[150px] w-full flex-wrap gap-4">
					{files.map((file, i) =>
						file.type.includes("image") ? (
							<div className={"relative aspect-square h-full"}>
								<span
									onClick={() => setFiles(files.filter((f) => f !== file))}
									className="absolute right-2 top-2 h-6 w-6 cursor-pointer rounded-full bg-white  bg-opacity-70 p-1">
									<XMarkIcon className={"text-primary-dark"} />
								</span>
								<img
									alt={file.name}
									src={URL.createObjectURL(file)}
									className={"h-full rounded-xl bg-primary"}
								/>
							</div>
						) : (
							<div
								className={
									"bg-primary-dark relative flex aspect-square h-full flex-col items-center justify-center rounded-xl p-4"
								}>
								<span
									onClick={() => setFiles(files.filter((f) => f !== file))}
									className="absolute right-2 top-2 h-6 w-6 cursor-pointer rounded-full bg-white bg-opacity-70 p-1">
									<XMarkIcon className={"text-primary-dark"} />
								</span>
								<DocumentAttachmentIcon className={"my-2 h-12 w-12 text-gray-400"} />
								<p className={"w-full truncate text-ellipsis text-lg text-gray-400"}>{file.name}</p>
							</div>
						),
					)}
				</div>
			)}
			{((!multi && files.length === 0) || (multi && files.length < maxFiles)) && (
				<Uploader
					handleChange={fileChangedHandler}
					name="file"
					types={allowedFileTypes}>
					<div className={"h-[300px] w-full"}>
						<label
							className={twMerge(
								"bg-primary-dark flex h-full w-full cursor-pointer appearance-none flex-col items-center justify-center gap-2 overflow-clip rounded-lg border-2 border-dashed border-gray-600 transition hover:border-gray-400 focus:outline-none dark:bg-bg-dark-50",
								fieldClassName,
							)}>
							<ArrowUpOnSquareIcon className="h-8 w-8 text-gray-500" />
							<p className="font-heading text-lg text-gray-500">{prompt}</p>
							<p className="text-center font-heading text-sm text-gray-500">
								{allowedFileTypes.map(
									(type, i) => `${type}${i + 1 < allowedFileTypes.length ? ", " : ""}`,
								)}
							</p>

							<input
								type="file"
								name="file_upload"
								className="hidden"
							/>
						</label>
					</div>
				</Uploader>
			)}
		</div>
	)
}

export default FileUploader
