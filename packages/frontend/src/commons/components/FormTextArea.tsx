import { twMerge } from "tailwind-merge"
import React, { useEffect, useState } from "react"
import { textFieldStyle } from "@components/FormInput"
import { FieldError } from "react-hook-form"
import CustomText from "@components/CustomText"

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
	label?: string
	className?: string
	register?: any,
	errors?: FieldError | any
}

const FormTextArea = (props: Props) => {
	const {
		className = "", label, register, maxLength, errors = {}, onChange
	} = props

	const textFieldClass = `${textFieldStyle} ${Object.keys(errors)?.length > 0 ? "border-red-400 ring-red-400" : ""} font-heading text-white dark:text-gray-400 h-32`
	const [value, setValue] = useState("")

	const setup = {
		...props,
		...register,
		onChange: (e) => {
			setValue(e.target?.value)
			onChange && onChange(e)
		},
		className: twMerge(`${textFieldClass} ${className} placeholder:text-gray-400`),
	}


	return (
		<div className="w-full flex flex-col">
			{label && <p className="my-1 font-heading text-gray-400 dark:text-gray-400">{label}</p>}

			<textarea {...setup} />
			<div className="my-2 flex justify-between items-center">
				<p className={"w-full text-red-400"}>
					{Object.keys(errors)?.length > 0 && errors.message}
				</p>

				<p className={"text-xs text-gray-400"}>{value.length}/{maxLength}</p>
			</div>

		</div>
	)
}

export default FormTextArea
