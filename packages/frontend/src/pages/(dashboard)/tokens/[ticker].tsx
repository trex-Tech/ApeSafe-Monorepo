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
import { parseUnits, parseEther } from "viem"
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
	console.log(data)

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
						{
							name: "MINT",
							component: <MintTab />,
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

	let approveAddr
	let marketAddr
	let mintAddr

	if (chain?.id === 84532) {
		approveAddr = "0x036CbD53842c5426634e7929541eC2318f3dCF7e"

		marketAddr = `0x${contractAddress?.slice(2)}`
		mintAddr = marketAddr
	}

	// if (chain?.id === 80002) {
	// 	approveAddr = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582"
	// }

	// if (chain?.id === 421614) {
	// 	approveAddr = "0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d"
	// }

	if (chain?.id === 11155420) {
		approveAddr = "0x5fd84259d66Cd46123540766Be93DFE6D43130D7"
		marketAddr = "0x40228E975C2bE8671E53f35c8c4D5Cda8Ce1c650"
	}

	if (approveAddr?.length === 0) {
		return
	}

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
			console.log("New token ca:", buyData.logs[0].address, "isConfirmed:::", isConfirmed, "hash:::", hash)
			if (approveAddr === "0x036CbD53842c5426634e7929541eC2318f3dCF7e") {
				buyContract(amount)
			} else {
				buyContract(amount)
			}
		}
	}, [isConfirmed, buyData])

	const buyContract = (amount: string) => {
		console.log(approveAddr)
		console.log(`contract address 0x${contractAddress?.slice(2)}`);
		if (approveAddr === "0x036CbD53842c5426634e7929541eC2318f3dCF7e") {
			writeContract({
				abi: [
					{
						name: "buy",
						type: "function",
						inputs: [
							{
								name: "_amountUsdc",
								type: "uint256",
							},
						],
						outputs: [],
						stateMutability: "public",
					},
				],
				address: marketAddr,
				functionName: "buy",
				account: address,
				chain: chain,
				args: [parseUnits(amount, 6)],
			})
		} else {
			// buy(uint256 _amountUsdc, address _baseERC20, uint256 currPCCTPChainID)
			
			console.log(`contract address 0x${contractAddress?.slice(2)}`);
			writeContract({
				abi: [
					{
						name: "buy",
						type: "function",
						inputs: [
							{
								name: "_amountUsdc",
								type: "uint256",
							},
							{
								name: "_baseERC20",
								type: "address",
							},
							{
								name: "currPCCTPChainID",
								type: "uint256",
							},
						],
						outputs: [],
						stateMutability: "public",
					},
				],
				address: marketAddr,
				functionName: "buy",
				account: address,
				chain: chain,
				args: [parseUnits(amount, 6), `0x${contractAddress?.slice(2)}`, 11155420],
			})
		}

		if (error) {
			// error.message
			// error.name
			console.log("error:", error.message)
			if (error.message.includes("Connector not connected.")) {
				alert("Please connect your wallet.")
			}
		}
	}

	const transferContract = () => {}

	// const mintContract = () => {
	// 	writeContract({
	// 		abi: [
	// 			{
	// 				name: "handleCrossChainMint",
	// 				type: "function",
	// 				inputs: [
	// 					{
	// 						name: "_chainId",
	// 						type: "uint16",
	// 					},
	// 					{
	// 						name: "_user",
	// 						type: "address",
	// 					},
	// 					{
	// 						name: "_tokens",
	// 						type: "uint256",
	// 					},
	// 					{
	// 						name: "_market",
	// 						type: "address",
	// 					},
	// 				],
	// 				outputs: [],
	// 				stateMutability: "public",
	// 			},
	// 		],
	// 		address: marketAddr,
	// 		functionName: "handleCrossChainMint",
	// 		account: address,
	// 		chain: chain,
	// 		args: [10005, address, parseUnits(amount, 18), "0xb48F1E15c21A643fd6C47542EdD097ea5f0aece0"],
	// 		value: parseEther("0.05"),
	// 	})
	// }

	const buyFn = () => {
		if (amount !== "") {
			writeContract({
				abi: [
					{
						name: "approve",
						type: "function",
						inputs: [
							{
								name: "spender",
								type: "address",
							},
							{
								name: "amount",
								type: "uint256",
							},
						],
						outputs: [
							{
								name: "",
								type: "bool",
							},
						],
						stateMutability: "public",
					},
				],
				address: `0x${approveAddr.slice(2)}`,
				functionName: "approve",
				account: address,
				chain: chain,
				args: [marketAddr, parseUnits(amount, 6)],
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

			<div className="flex w-full justify-start space-x-[20px]">
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

	let marketAddr

	if (chain?.id === 84532) {
		marketAddr = `0x${contractAddress?.slice(2)}`
	}

	if (chain?.id === 80002) {
	}

	if (chain?.id === 421614) {
	}

	if (chain?.id === 11155420) {
		marketAddr = `0x40228E975C2bE8671E53f35c8c4D5Cda8Ce1c650`
	}

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
				abi: [
					{
						name: "sell",
						type: "function",
						inputs: [
							{
								name: "_amountTokens",
								type: "uint256",
							},
						],
						outputs: [],
						stateMutability: "public",
					},
				],
				address: marketAddr,
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

const MintTab = () => {
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

	let marketAddr

	if (chain?.id === 84532) {
		marketAddr = `0x${contractAddress?.slice(2)}`
	}

	if (chain?.id === 80002) {
	}

	if (chain?.id === 421614) {
	}

	if (chain?.id === 11155420) {
		marketAddr = `0x40228E975C2bE8671E53f35c8c4D5Cda8Ce1c650`
	}

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

	const mintContract = () => {
		console.log(3783737)
		writeContract({
			abi: [
				{
					name: "handleCrossChainMint",
					type: "function",
					inputs: [
						{
							name: "_chainId",
							type: "uint16",
						},
						{
							name: "_tokens",
							type: "uint256",
						},
						{
							name: "_market",
							type: "address",
						},
					],
					outputs: [],
					stateMutability: "public",
				},
			],
			address: marketAddr,
			functionName: "handleCrossChainMint",
			account: address,
			chain: chain,
			args: [10005, parseUnits(amount, 18), "0x40228E975C2bE8671E53f35c8c4D5Cda8Ce1c650"],
			value: parseEther("0.02")
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

	return (
		<div className={"py-[5%]"}>
			<p className={"text-xl"}>
				Mint {data?.name} (${ticker})
			</p>
			{/* <CryptoCoinSelect
				setSelected={setSelectedCoin}
				selected={selectedCoin}
			/> */}
			<div className="relative flex h-fit w-full flex-col">
				<p className="absolute left-[2%] top-[30%] z-20 text-xs text-gray-500">You mint</p>
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
						
							href={`https://wormholescan.io/#/tx/${hash}?network=Testnet&view=progress`}
							target="_blank"
							rel="noopener noreferrer"
							className={`text-blue-700 underline`}>
							{" "}
							{`${isConfirmed ? "Minting" : "Selling"} $${ticker}, check status here`}
						</a>
					)}
				</p>

				{isConfirmed && (
					<div className={`my-[20px]`}>
						<span className={`rounded-[10px] bg-green-500 p-[10px] text-[12px] lg:text-[16px]`}>
							Minting {amount} of ${ticker}, Please check Wormhole scanner for status.
						</span>
					</div>
				)}
			</div>

			<div className="flex justify-start">
				<CustomButton
					text={"Mint Now"}
					className={"mt-[5%] self-end px-[5%] py-3"}
					onClick={() => mintContract()}
					loading={isConfirming}
				/>
			</div>
		</div>
	)
}
