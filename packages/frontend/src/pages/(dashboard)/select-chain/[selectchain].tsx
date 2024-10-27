import MultiChainSelector from "@/src/commons/components/MutltiChainSelector"
import { useParams } from "@router"
import { useState } from "react"
import { FaCopy } from "react-icons/fa"
import { IoMdCheckmark } from "react-icons/io"

const index = () => {
	const { selectchain } = useParams()

	const [copied, setCopied] = useState(false)

	const copyToClipboard = () => {
		navigator.clipboard.writeText(selectchain)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<div className={""}>
			<div>
				<p className={`text-center text-[24px] text-[#fff] lg:text-left`}>
					Your Token is Live on Base Testnet!
				</p>
				<div className={`my-[20px] flex items-center space-x-[20px]`}>
					<p>
						Base Testnet CA: <span className={`rounded-[10px] bg-[#181818] p-[10px]`}>{selectchain}</span>
					</p>
					<button onClick={copyToClipboard}>
						{copied ? (
							<div className={`rounded-[10px] bg-green-500 p-[3px]`}>
								<IoMdCheckmark className={`text-white`} />
							</div>
						) : (
							<FaCopy className={`text-primary`} />
						)}
					</button>
				</div>
				<p className={`text-center text-[13px] text-[#fff] lg:w-[668px] lg:text-left`}>
					Unlike traditional Signle Chain Tokens, yours can exist everywhere in one simple step. <br />
					Select up to 5 chains to extend your token's reach.
				</p>

				<MultiChainSelector />
			</div>
		</div>
	)
}

export default index
