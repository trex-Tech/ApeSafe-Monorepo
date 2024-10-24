import toast from "react-hot-toast"
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline"
import React from "react"
import { twMerge } from "tailwind-merge"

interface Props {
	text: string
	className?: string
	onCopy?: () => void
}

const CopyToClipboardButton = ({ text, className, onCopy = () => toast.success("Copied to clipboard") }: Props) => {
	return (
		<div onClick={() => {
			navigator.clipboard.writeText(text)
			onCopy()
		}}
			 className={twMerge("w-8 h-8 border border-outline dark:border-outline-dark hover:border-primary dark:hover:border-primary-light cursor-pointer rounded-lg flex items-center justify-center", className)}>
			<DocumentDuplicateIcon className="w-5 h-5 text-gray-800 dark:text-white" />
		</div>
	)
}


export default CopyToClipboardButton
