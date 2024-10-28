import { twMerge } from "tailwind-merge"
import DropdownSelect from "@components/shadcn/DropSelector"
import { sample_crypto_coins } from "@utils/sample-data"

interface Props {
	className?: string
	selected?: ICryptoCoinData
	setSelected?: (coin: ICryptoCoinData) => void
}

const CryptoCoinSelect = ({ className, selected, setSelected }: Props) => {
	function generateOption(coin: ICryptoCoinData): IOption<ICryptoCoinData> {
		return {
			label: coin?.name,
			value: coin?.symbol,
			icon: coin?.image,
			raw: coin,
		}
	}

	function triggerDropDown() {
		const dropdown = document.querySelector(".crypto-dropdown")
		//trigger native event as if the user clicked on the dropdown
		dropdown
	}

	return (
		<DropdownSelect
			prompt={"Select a coin"}
			className={twMerge("", className)}
			items={sample_crypto_coins.map((coin) => generateOption(coin))}
			selected={generateOption(selected)}
			setSelected={(option) => setSelected(option.raw)}
		/>
	)
}

export default CryptoCoinSelect
