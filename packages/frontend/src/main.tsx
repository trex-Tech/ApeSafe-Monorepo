import React from "react"
import ReactDOM from "react-dom/client"
import "@assets/css/globals.css"
import RouterSetup from "@router"
import * as buffer from "buffer"
import { createAppKit } from '@reown/appkit/react'
import { WagmiProvider } from 'wagmi'
import {  QueryClientProvider } from '@tanstack/react-query'
import { wagmiAdapter, queryClient, appkitCfg } from "./commons/walletConnect/wallet"

createAppKit(appkitCfg)

window.Buffer = buffer.Buffer

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		  <WagmiProvider config={wagmiAdapter.wagmiConfig}>
		  	<QueryClientProvider client={queryClient}><RouterSetup /></QueryClientProvider>	
		  </WagmiProvider>
	</React.StrictMode>,
)
