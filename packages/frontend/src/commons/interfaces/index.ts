import React from "react"
import { ADMIN_ACCESS_LEVELS } from "@utils/enum"

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
	interface IAdmin extends IUser {
		admin: {
			status: boolean
			role: ADMIN_ACCESS_LEVELS
		}
	}

	interface ITransaction {
		id?: number
		ref_id: string
		paystack_payment_reference?: string
		status: "completed" | "pending" | "failed"
		order_status: "pending" | "completed" | "cancelled" | "in-delivery" | "delivered" | "awaiting-pickup"
		amount: number | string
		seller: IUser
		buyer: IUser
		product: IPost
		date: string
		type: string
	}

	interface ILocation {
		coordinates: {
			latitude: number
			longitude: number
		}
		address: string
		city: string
		country: string
	}

	interface IUser {
		id: string
		email?: string
		status: "active" | "flagged" | "pending"
		phone_number?: string
		first_name: string
		last_name: string
		contact_verified?: boolean
		username: string
		profile_details?: {
			location: ILocation
			bio?: string
			photo?: string
			language?: string
			city?: string
			country?: string
			language_2?: string
			goals?: (IUserGoals["value"] | number)[]
			owns_pets?: boolean
			favourite_pets?: string[]
		}
		date_created?: string
		seller_status: "InActive" | "Review" | "Verified"
	}

	interface IUserGoals extends IOption {
		label: string
		value:
			| "pet_buyer"
			| "pet_seller"
			| "pet_adopter"
			| "pet_service_provider"
			| "feed_buyer"
			| "feed_seller"
			| "mate_seeker"
			| "connection"
	}

	interface IPost {
		id: string
		status: "active" | "pending" | "flagged"
		title: string
		photos: {
			id?: number
			photo: string
		}[]
		is_active?: true
		is_flagged?: false
		description: string
		price: string
		created_at: string
		location?: ILocation
		special_needs?: string
		type: "animal_food" | "pet_sale" | "mating" | "adoption"
		rating?: {
			average: number
			total: number
		}
		features?: {
			[feature: string]: string
		}
		seller: IUser
	}

	interface IOption<T = any> {
		id?: string
		icon?: string | JSX.Element
		label: string
		value: any
		raw?: T
	}

	interface IChatMessage {
		id: string
		chat_id: string
		sender: Partial<IUser> | string
		text: string
		is_read?: boolean
		created_at: Date
	}

	interface IChat {
		id: string
		product: IPost
		buyer: IUser
		seller: IUser
		last_message: IChatMessage
		agreed_price: string
		payment_status: "completed" | "pending" | "failed"
	}

	interface IChatDetails extends Exclude<IChat, "last_message"> {
		messages: IChatMessage[]
	}

	interface IWalletData {
		credit_wallet: {
			amount: number
			wallet_id?: string
		}
		normal_wallet: {
			amount: number
			wallet_id?: string
		}
	}

	interface ICreditPackage {
		id: number
		name: string
		credits: number
		price: string
	}

	interface IHighlightItem {
		title: string
		visible: boolean
		value: string
		period: string
	}
}
