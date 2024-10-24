import MultiChainSelector from "@/src/commons/components/MutltiChainSelector"

const index = () => {
	return (
		<div className={`mt-[58px] px-[5%]`}>
			<div>
				<p className={`text-center text-[24px] text-[#fff] lg:text-left`}>Select Chain to Deploy</p>
				<p className={`text-center text-[13px] text-[#fff] lg:w-[668px] lg:text-left`}>
					You've successfully deployed on Base Mainnet! Now, select at least two additional chains to extend
					your token's reach.
				</p>

				<MultiChainSelector />
			</div>
		</div>
	)
}

export default index
