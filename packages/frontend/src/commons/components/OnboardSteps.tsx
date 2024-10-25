import React from "react"
import { twMerge } from "tailwind-merge"
import { PencilEdit01Icon } from "hugeicons-react"

interface stepInfo {
	title: string
	description: string
}

interface onBoardStepper {
	stepInfo: stepInfo[]
	currentStep: number
	className?: string
	setCurrentStep?: (value: number) => void
}

function OnboardSteps({
						  stepInfo, className, currentStep, setCurrentStep = () => {
	},
					  }: onBoardStepper) {
	return (
		<main className={twMerge("w-[560px]", className)}>
			{stepInfo.map((obj: stepInfo, index: number) => (
				<div
					key={index}
					className={`${currentStep >= index + 1 ? "opacity-100" : "opacity-40"} ${index + 1 !== 1 && "mt-5"} text-white`}>
					<div className="flex items-start gap-8">
						<div className=" flex flex-col items-center">
							<div
								onClick={() => (currentStep > index + 1 ? setCurrentStep(index + 1) : () => {
								})}
								className="gradient flex h-10 w-10 cursor-pointer items-center justify-center rounded-full">
								<PencilEdit01Icon color="white" size={20} />
							</div>
							{(stepInfo.length === 1 || index + 1 !== stepInfo.length) && (
								<div className="mt-5 h-24 w-[0.1px] bg-[#CDCDCD]"></div>
							)}
						</div>
						<div>
							<h1 className="mt-1 text-[22px] font-medium">{obj.title}</h1>
							<p className="mt-8 w-[87%] font-medium text-gray-400">{obj.description}</p>
						</div>
					</div>
				</div>
			))}
		</main>
	)
}

export default OnboardSteps
