import React from "react"
import ReactDOM from "react-dom/client"
import "@assets/css/globals.css"
import RouterSetup from "@router"
import * as buffer from "buffer"

window.Buffer = buffer.Buffer

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<RouterSetup />
	</React.StrictMode>,
)
