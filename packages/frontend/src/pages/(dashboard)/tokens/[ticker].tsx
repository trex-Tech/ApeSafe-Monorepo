import TabView from "@components/TabView"
import FormInput from "@components/FormInput"
import { useGetAllTokens, useGetToken } from "@commons/api/tokens"
import { useParams } from "@router"
import { useForm } from "react-hook-form"
import Config from "@utils/config"
import * as yup from "yup"
import REGEX from "@utils/regex.utils"
import CustomButton from "@components/CustomButton"
import CryptoCoinSelect from "@components/project/CryptoCoinSelect"
import { useEffect, useState } from "react"
import { sample_crypto_coins } from "@utils/sample-data"
import { parseUnits } from "viem"
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from "wagmi"
import mockHubAbi from "@/src/commons/abi/MockHub"
import { useQueryClient } from "@tanstack/react-query"
import { Keys } from "@/src/commons/utils"

export default function TokenPage({}) {
	const { ticker } = useParams()

	// console.log(data?.chains[0]?.contract_address)
	const queryClient = useQueryClient()
	const tokens = queryClient.getQueriesData({
		queryKey: [Keys.tokens],
		exact: false,
	})
	const { data } = useGetToken(ticker)
	console.log("ticker:::", { ticker, data })

	return (
		<div className={"m"}>
			<div className="lg:w-[65%]">
				<div className="my-4 flex flex-col">
					<p className="font-heading text-3xl">Purchase / Sell {data?.name}</p>
					<p className="text-gray-700 dark:text-gray-400">
						Enter an amount to see real-time pricing. Complete your transaction in seconds — it's that
						simple.
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

	const { address, chain } = useAccount()

	const { writeContract, data: hash, error } = useWriteContract()

	const {
		isLoading: isConfirming,
		isSuccess: isConfirmed,
		data: buyData,
	} = useWaitForTransactionReceipt({
		hash,
	})

	useEffect(() => {
		if (isConfirmed && buyData && buyData.logs) {
			console.log("New token buyData:", buyData)
			console.log("New token ca:", buyData.logs[0].address)
		}
	}, [isConfirmed, buyData])

	const buyFn = () => {
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
		} else {
			alert(`Please input an amount of $${ticker} to buy`)
		}
	}

	return (
		<div className={"py-[5%]"}>
			<p className={"text-xl"}>
				Purchase {data?.name} (${ticker})
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

			{/* <div className={"flex items-center justify-between"}>
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
						className={"mt-4 text-primary text-[12px] space-x-[40px]"}
					/>
				))}
			</div> */}

			<div className={`mt-[20px]`}>
				<p>
					{hash && (
						<a
							href={`https://sepolia.basescan.org/tx/${hash}`}
							target="_blank"
							rel="noopener noreferrer"
							className={`text-blue-700 underline`}>
							{" "}
							{`${isConfirmed ? "Bought" : "Buying"} $${ticker}, check status here`}
						</a>
					)}
				</p>

				{isConfirmed && (
					<div className={`my-[20px]`}>
						<span className={`rounded-[10px] bg-green-500 p-[10px] text-[12px] lg:text-[16px]`}>
							You have successfully purchased {amount} of ${ticker}
						</span>
					</div>
				)}
			</div>

			<div className="flex justify-start">
				<CustomButton
					text={"Buy Now"}
					className={"mt-[5%] self-end px-[5%] py-3"}
					onClick={() => buyFn()}
					loading={isConfirming}
				/>
			</div>
		</div>
	)
}

const SellTab = () => {
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

	const { address, chain } = useAccount()

	const { writeContract, data: hash, error } = useWriteContract()

	const {
		isLoading: isConfirming,
		isSuccess: isConfirmed,
		data: buyData,
	} = useWaitForTransactionReceipt({
		hash,
	})

	useEffect(() => {
		if (isConfirmed && buyData && buyData.logs) {
			console.log("New token buyData:", buyData)
			console.log("New token ca:", buyData.logs[0].address)
		}
	}, [isConfirmed, buyData])

	const sellFn = () => {
		if (amount !== "") {
			writeContract({
				abi: mockHubAbi,
				address: `0x${contractAddress.slice(2)}`,
				functionName: "sell",
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
		} else {
			alert(`Please input an amount of $${ticker} to sell`)
		}
	}

	return (
		<div className={"py-[5%]"}>
			<p className={"text-xl"}>
				Sell {data?.name} (${ticker})
			</p>
			{/* <CryptoCoinSelect
				setSelected={setSelectedCoin}
				selected={selectedCoin}
			/> */}
			<div className="relative flex h-fit w-full flex-col">
				<p className="absolute left-[2%] top-[30%] z-20 text-xs text-gray-500">You sell</p>
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

			{/* <div className={"flex justify-between"}>
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
			</div> */}

			<div className={`mt-[20px]`}>
				<p>
					{hash && (
						<a
							href={`https://sepolia.basescan.org/tx/${hash}`}
							target="_blank"
							rel="noopener noreferrer"
							className={`text-blue-700 underline`}>
							{" "}
							{`${isConfirmed ? "Sold" : "Selling"} $${ticker}, check status here`}
						</a>
					)}
				</p>

				{isConfirmed && (
					<div className={`my-[20px]`}>
						<span className={`rounded-[10px] bg-green-500 p-[10px] text-[12px] lg:text-[16px]`}>
							You have successfully sold {amount} of ${ticker}
						</span>
					</div>
				)}
			</div>

			<div className="flex justify-start">
				<CustomButton
					text={"Sell Now"}
					className={"mt-[5%] self-end px-[5%] py-3"}
					onClick={() => sellFn()}
					loading={isConfirming}
				/>
			</div>
		</div>
	)
}
