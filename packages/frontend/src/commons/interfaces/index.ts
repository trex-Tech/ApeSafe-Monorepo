import React from "react"

export {}

export type TableRowType<T = any> =
	| {
			label?: string
			visible: boolean
			view: (row: T) => React.ReactNode
	  }
	| {
			format: (row: T) => string
			visible: boolean
			label: string
	  }
	| {
			value: Extract<keyof T, string>
			visible: boolean
			label: string
	  }

declare global {
	interface IUser {
		id: string
		email?: string
		status: "active" | "flagged" | "pending"
		wallet_address: string
		username: string
	}

	interface IOption<T = any> {
		id?: string
		icon?: string | JSX.Element
		label: string
		value: any
		raw?: T
	}

	interface IHighlightItem {
		title: string
		visible: boolean
		value: string
		period: string
	}

	interface IToken {
		id: string | number
		rank: number
		name: string
		ticker: string
		creator: Partial<IUser>
		logo: string
		change: number
		date: string
	}

	interface ICryptoCoinData {
		id: string
		symbol: string
		name: string
		image: string
		current_price: number
		market_cap: number
		market_cap_rank: number
		fully_diluted_valuation: number
		total_volume: number
		high_24h: number
		low_24h: number
		price_change_24h: number
		price_change_percentage_24h: number
		market_cap_change_24h: number
		market_cap_change_percentage_24h: number
		circulating_supply: number
		total_supply: number
		max_supply: number
		ath: number
		ath_change_percentage: number
		ath_date: string
		atl: number
		atl_change_percentage: number
		atl_date: string
		roi: {
			times: number
			currency: string
			percentage: number
		} | null
		last_updated: string
	}
}
