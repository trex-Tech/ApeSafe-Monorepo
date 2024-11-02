import { PendingTokens } from "@/src/commons/components/PendingTokens"
import React from "react"
import { Toaster } from "react-hot-toast"

const PendingTokensPage = () => {
	return (
		<div className="w-full overflow-x-hidden">
			<PendingTokens />
		</div>
	)
}

export default PendingTokensPage
