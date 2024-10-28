// src/components/MultiChainSelector.tsx
import React, { useState } from "react"
import CustomButton from "./CustomButton"

const MultiChainSelector: React.FC = () => {
	const [selectedChains, setSelectedChains] = useState<string[]>(["ETH", "BTC"])
	const [inputValue, setInputValue] = useState<string>("")

	const handleAddChain = () => {
		if (inputValue && !selectedChains.includes(inputValue) && selectedChains.length < 3) {
			setSelectedChains([...selectedChains, inputValue])
			setInputValue("")
		}
	}

	const handleDeleteChain = (chainToDelete: string) => {
		setSelectedChains(selectedChains.filter((chain) => chain !== chainToDelete))
	}

	return (
		<div className="mt-5 flex">
			<div>
				<p>Chains (Max 5)</p>
				<div className="flex flex-wrap items-center rounded-md border border-gray-300 p-2 lg:flex-nowrap mt-[8px]">
					<div className={`flex flex-wrap items-center`}>
						{selectedChains.map((chain, index) => (
							<span
								key={index}
								className="mr-2 flex items-center rounded bg-gray-800 px-2 py-1 text-white">
								{chain}
								<button
									onClick={() => handleDeleteChain(chain)}
									className="ml-2 text-primary">
									x
								</button>
							</span>
						))}
					</div>
					<input
						type="text"
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						placeholder="Type chain..."
						className="mr-2 rounded border bg-transparent p-1 px-[6px] outline-none"
						disabled={selectedChains.length >= 3}
					/>
					<button
						onClick={handleAddChain}
						className="rounded bg-blue-500 px-3 py-1 text-white"
						disabled={selectedChains.length >= 3}>
						Add +
					</button>
				</div>

				<div className={`mt-[30px] flex w-full lg:justify-end`}>
					<CustomButton text="Launch Token" />
				</div>
			</div>
		</div>
	)
}

export default MultiChainSelector
