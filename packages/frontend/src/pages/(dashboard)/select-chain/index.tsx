import MultiChainSelector from "@/src/commons/components/MutltiChainSelector"

const index = () => {
	return (
		<div className={""}>
			<div>
				<p className={`text-center text-[24px] text-[#fff] lg:text-left`}>Token Live on Base Testnet!</p>
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
