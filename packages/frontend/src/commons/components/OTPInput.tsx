import { twMerge } from "tailwind-merge"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@components/shadcn/ui/input-otp"
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp"
import * as React from "react"

interface Props {
	className?: string
	value: string
	setValue: (value: string) => void
}

const OtpInput = ({ className, value, setValue, ...rest }: Props) => {

	const customize = {
		className: "w-[60px] h-[60px] border-gray-300 dark:border-gray-700 text-xl",
	}

	return (
		<InputOTP pattern={REGEXP_ONLY_DIGITS_AND_CHARS} value={value} onChange={(value) => setValue(value)}
				  className={twMerge("w-[90%]", className)} maxLength={6} {...rest}>
			<InputOTPGroup>
				<InputOTPSlot index={0} {...customize} />
				<InputOTPSlot index={1} {...customize} />
				<InputOTPSlot index={2} {...customize} />
			</InputOTPGroup>
			<InputOTPSeparator />
			<InputOTPGroup>
				<InputOTPSlot index={3} {...customize} />
				<InputOTPSlot index={4} {...customize} />
				<InputOTPSlot index={5} {...customize} />
			</InputOTPGroup>
		</InputOTP>
	)
}


export default OtpInput
