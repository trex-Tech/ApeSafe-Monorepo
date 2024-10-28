import TabView from "@components/TabView"
import FormInput from "@components/FormInput"
import { useGetToken } from "@commons/api/tokens"
import { useParams } from "@router"
import { useForm } from "react-hook-form"
import Config from "@utils/config"
import * as yup from "yup"
import REGEX from "@utils/regex.utils"
import CustomButton from "@components/CustomButton"
import CryptoCoinSelect from "@components/project/CryptoCoinSelect"
import { useState } from "react"
import { sample_crypto_coins } from "@utils/sample-data"
import { parseUnits } from "viem"
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from "wagmi"
import mockHubAbi from "@/src/commons/abi/MockHub"

export default function TokenPage({}) {
	const { ticker } = useParams()
	

	const { data } = useGetToken(ticker)
	console.log("data in token:::", { ticker, data })

	return (
		<div className={"m"}>
			<div className="w-[65%]">
				<div className="my-4 flex flex-col">
					<p className="font-heading text-3xl">Purchase / Sell {data?.name}</p>
					<p className="text-gray-700 dark:text-gray-400">
						Enter the amount you want to buy or sell and get instant pricing. Confirm your transaction in
						just a few clicks and enjoy seamless token management.
					</p>
				</div>
				<TabView
					className={"my-[5%] p-0"}
					tabs={[
						{
							name: "BUY",
							component: <BuyTab />,
						},
						{
							name: "SELL",
							component: <SellTab />,
						},
					]}
				/>
			</div>
		</div>
	)
}
       
const BuyTab = () => {
	const { ticker } = useParams()
	const { data } = useGetToken(ticker)
	
	// console.log(data?.chains[0]?.contract_address)
	const [selectedCoin, setSelectedCoin] = useState<ICryptoCoinData>(
		sample_crypto_coins.find((coin) => coin.symbol.toLowerCase() === "usdc"),
	)

	const baseChain = data?.chains?.find((chain) => chain.name === "base")
	const contractAddress = baseChain?.contract_address


	const schema = yup.object().shape({
		amount: yup.string().matches(REGEX.number, "Amount must be a number").required(),
	})

	const { register, formState, setValue } = useForm(Config.useForm({}, schema))

	const [amount, setAmount] = useState("")

	const {address, chain} = useAccount()

	const {writeContract, error } = useWriteContract();

	const buyFn = () =>  {
		if (amount !== "") {
			writeContract({
				abi: mockHubAbi,
				address: `0x${contractAddress.slice(2)}`,
				functionName: "buy",
				account: address,
				chain: chain,
				args: [parseUnits(amount, 18)],
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

	return (
		<div className={"py-[5%]"}>
			<p className={"text-xl"}>
				Purchase {data?.name} ({ticker})
			</p>
			{/* <CryptoCoinSelect
				setSelected={setSelectedCoin}
				selected={selectedCoin}
			/> */}
			<div className="relative flex h-fit w-full flex-col">
				<p className="absolute left-[2%] top-[30%] z-20 text-xs text-gray-500">You buy</p>
				<FormInput
					type="text"
					className="mt-4 w-full pt-[4%]"
					placeholder="Enter amount"
					value={amount}
					endIcon={
						<img
							className={"aspect-square h-full  rounded-full"}
							alt={"coin image"}
							src={selectedCoin?.image}
						/>
					}
					onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1"))}
				/>
			</div>

			<div className={"flex justify-between"}>
				<CustomButton
					text={"Reset"}
					variant={"text"}
					onClick={() => setValue("amount", "")}
					className={"mt-4 text-primary"}
				/>
				{[0.01, 0.05, 0.1, 0.5, 1].map((value, index) => (
					<CustomButton
						key={index}
						onClick={() => setValue("amount", value)}
						variant={"text"}
						text={value + " " + ticker}
						className={"mt-4 text-primary"}
					/>
				))}
			</div>

			<div className="flex justify-end">
				<CustomButton
					text={"Buy Now"}
					className={"mt-[5%] self-end px-[5%] py-3"}
					onClick={() => buyFn()}
				/>
			</div>
		</div>
	)
}

const SellTab = () => {
	return (
		<div>
			<p>Sell</p>
		</div>
	)
}
