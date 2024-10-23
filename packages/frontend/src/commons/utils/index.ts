import { createTheme } from "@mui/material"
import { default as COLORS } from "./colors"
import moment from "moment"
import { ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export { default as Keys } from "./query-keys"

export const cleanUrl = (url: string) => {
	const uri = encodeURIComponent(url)
	return uri.replace("/", "%2F")
}

export const HEX2RGBA = (hex, alpha = 1) => {
	if (hex.length < 6 || hex.length > 7) {
		return `rgba(1, 1, 1, ${alpha})`
	} else {
		const [r, g, b] = hex.match(/\w\w/g).map((x) => parseInt(x, 16))
		return `rgba(${r},${g},${b},${alpha})`
	}
}

export const sortArrayByDate = <T>(array: T[], key: keyof T, order: "asc" | "desc" = "desc") => {
	return array?.sort((a, b) => {
		const dateA = new Date(a[key] as unknown as string) // Convert to string and create Date
		const dateB = new Date(b[key] as unknown as string)

		if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
			return 0 // Handle invalid dates gracefully
		}

		return order === "asc" ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime()
	})
}

export const gradientColor = (color1 = COLORS.primary, color2 = COLORS.secondary, color3 = null) => {
	if (color3) {
		return `bg-gradient-to-r from-${color1} via-${color2} to-${color3}`
	} else {
		return `bg-gradient-to-r from-${color1} to-${color1}`
	}
}

export const __DEV__ = process.env.NODE_ENV === "development"

interface IFormatDateOptions {
	by: "hour" | "day"
}

export function formatDate(
	dateString: Date | string,
	options: IFormatDateOptions = {
		by: "hour",
	},
): string {
	const { by } = options

	if (by === "hour") return moment(dateString).fromNow()

	const date = moment(dateString)

	const now = moment() // Current date and time

	// Format for "11:00 pm yesterday"
	if (date.isSame(now.clone().subtract(1, "day"), "day")) {
		return date.format("h:mm a") + " yesterday"
	}

	// Format for "11:00 pm today"
	if (date.isSame(now, "day")) {
		return date.format("h:mm a") + " today"
	}

	// Format for "11:00 pm on Tuesday 27th, 2024"
	if (date.year() === now.year()) {
		return date.format("h:mm a [on] dddd Do")
	} else {
		return date.format("h:mm a [on] dddd Do, YYYY")
	}
}

export function calculateElapsedTimePercentage(startDate: Date | string, endDate: Date | string) {
	// Convert date strings to Date objects
	const start = new Date(startDate)
	const end = new Date(endDate)

	// Calculate total time difference in milliseconds
	// @ts-ignore
	const totalTimeDifference = end - start

	// Calculate elapsed time difference in milliseconds
	const elapsedTimeDifference = Date.now() - start.getTime()

	// Calculate the percentage of elapsed time
	const elapsedTimePercentage = (elapsedTimeDifference / totalTimeDifference) * 100

	// Return the elapsed time percentage
	return elapsedTimePercentage
}

export function getBase64(file) {
	var reader = new FileReader()
	reader.readAsDataURL(file)
	reader.onload = function () {
		console.log(reader.result)
	}
	reader.onerror = function (error) {
		console.log("Error: ", error)
	}
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export let MuiTheme = createTheme({
	typography: {
		// transform: "none",
		fontFamily: ["PPMori-Regular"].join(","),
	},
	palette: {
		primary: {
			main: COLORS.secondary,
		},
		secondary: {
			main: COLORS.secondary,
		},
	},
})

export const formatAmount = (
	amount: number | string,
	options: {
		currency?: string
		displaySymbol?: boolean
	} = { currency: "NGN", displaySymbol: true },
) => {
	if (options.displaySymbol) {
		return Number(amount).toLocaleString("en-NG", {
			style: "currency",
			currency: options.currency,
		})
	}
	return Number(amount).toFixed(2)
}

export function getNestedProperty(obj: object, path: string) {
	const keys = path.split(".")
	let nestedObj: any = obj
	for (const key of keys) {
		if (!nestedObj || typeof nestedObj !== "object") {
			return undefined
		}
		nestedObj = nestedObj[key]
	}
	return nestedObj
}

export const padUserId = (id: number | string) => {
	if (!id) return null

	const userId = id.toString()

	if (userId?.length === 10 && userId?.length < 11 && userId[0] !== "0") {
		return userId?.padStart(11, "0")
	} else return userId
}

const isNumber = (n) => {
	return !isNaN(parseFloat(n)) && !isNaN(n - 0)
}

const getArrayValues = (myList, number) => {
	let result = Array()
	let found = false

	for (let i = 0; i < myList.length; i++) {
		if (number.indexOf(myList[i]) !== -1) {
			result.push(myList[i])
		}
	}

	return result.length
}

export const validateMSISDN = (phone: string) => {
	let mobile = null
	if (phone.startsWith("234")) {
		mobile = phone.replace("234", "0")
	} else if (phone.startsWith("+234")) {
		mobile = phone.replace("+234", "0")
	} else mobile = phone

	let isValidNumber = false

	let prefix_array = [
		"0803",
		"0806",
		"0703",
		"0706",
		"0813",
		"0816",
		"0810",
		"0814",
		"0903",
		"0906",
		"0913",
		"0916",
		"07025",
		"07026",
		"0704",
		"0805",
		"0807",
		"0705",
		"0815",
		"0911",
		"0811",
		"0905",
		"0915",
		"0802",
		"0808",
		"0708",
		"0812",
		"0701",
		"0902",
		"0901",
		"0904",
		"0907",
		"0912",
		"0809",
		"0818",
		"0817",
		"0909",
		"0908",
		"0804",
		"0702",
	]

	if (isNumber(mobile) && /0\d+/.test(mobile) && mobile.length == 11) {
		//check for prefixes
		if (getArrayValues(prefix_array, mobile) <= 0) {
			isValidNumber = false
		} else {
			isValidNumber = true
		}
	} else {
		isValidNumber = false
	}
	return isValidNumber
}

export { COLORS }
