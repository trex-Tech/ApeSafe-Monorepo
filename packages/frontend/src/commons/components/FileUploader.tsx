import { ArrowUpOnSquareIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { FileUploader as Uploader } from "react-drag-drop-files"
import React from "react"
import { twMerge } from "tailwind-merge"
import { DocumentAttachmentIcon } from "hugeicons-react"
import CustomText from "@components/CustomText"

interface Props {
	className?: string,
	fieldClassName?: string,
	files: File[],
	setFiles: (files: File[]) => void,
	onFileChange?: (file: File) => void,
	maxFiles?: number,
	multi?: boolean,
	prompt?: string,
	allowedFileTypes?: string[],
}

const FileUploader = (props: Props) => {

	const {
		className,
		fieldClassName,
		files,
		setFiles,
		onFileChange = (file) => {
		},
		multi = false,
		maxFiles = 3,
		prompt = "Drag or Upload media files",
		allowedFileTypes = ["PNG", "JPG", "JPEG", "SVG", "PDF", "DOCX", "TXT"],
	} = props

	let fileChangedHandler = (file: File) => {
		setFiles([...files, file])
		onFileChange(file)
	}

	return (
		<div className={twMerge("flex flex-col", className)}>
			{
				(files.length > 0) && (
					<div className="flex my-4 flex-wrap w-full h-[20vh] gap-4">
						{
							files.map((file, i) => (
								file.type.includes("image") ? (
									<div className={"aspect-square h-full relative"}>
													<span
														onClick={() => setFiles(files.filter((f) => f !== file))}
														className="w-6 h-6 top-2 right-2 cursor-pointer absolute bg-white bg-opacity-70  rounded-full p-1">
														<XMarkIcon className={"text-primary-dark"} />
													</span>
										<img alt={file.name}
											 src={URL.createObjectURL(file)}
											 className={"bg-primary rounded-xl h-full"} />
									</div>
								) : (
									<div
										className={"bg-primary-dark rounded-xl p-4 h-full aspect-square flex flex-col items-center justify-center relative"}>
													<span
														onClick={() => setFiles(files.filter((f) => f !== file))}
														className="w-6 h-6 top-2 right-2 cursor-pointer absolute bg-white bg-opacity-70 rounded-full p-1">
														<XMarkIcon className={"text-primary-dark"} />
													</span>
										<DocumentAttachmentIcon
											className={"h-12 w-12 text-gray-400 my-2"} />
										<p className={"text-gray-400 w-full text-lg truncate text-ellipsis"}>{file.name}</p>
									</div>
								)
							))
						}

					</div>
				)
			}
			{
				((!multi && files.length === 0) || (multi && files.length < maxFiles)) && (
					<Uploader
						handleChange={fileChangedHandler}
						name="file"
						types={allowedFileTypes}>
						<div className={"w-full"}>
							<label
								className={twMerge("flex w-full h-[20vh] cursor-pointer flex-col gap-2 appearance-none justify-center items-center overflow-clip rounded-lg border-2 border-dashed border-gray-600 bg-primary-dark transition hover:border-gray-400 focus:outline-none dark:bg-bg-dark-50", fieldClassName)}>

								<ArrowUpOnSquareIcon className="h-8 w-8 text-gray-500" />
								<p className="text-gray-500 text-lg font-heading">{prompt}</p>
								<p className="text-gray-500 text-center text-sm font-heading">
									{
										allowedFileTypes.map((type, i) => `${type}${i + 1 < allowedFileTypes.length ? ", " : ""}`)
									}
								</p>

								<input type="file" name="file_upload" className="hidden" />
							</label>
						</div>
					</Uploader>
				)
			}
		</div>
	)
}


export default FileUploader
