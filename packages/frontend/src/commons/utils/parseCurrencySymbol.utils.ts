const parseCurrencySymbol = (currency: string) => {
	switch (currency) {
		case "EUR":
			return "€"
		case "USD":
			return "$"
		case "GBP":
			return "£"
		case "JPY":
			return "¥"
		case "CNY":
			return "¥"
		case "RUB":
			return "₽"
		case "KRW":
			return "₩"
		case "INR":
			return "₹"
		case "BRL":
			return "R$"
		case "TRY":
			return "₺"
		case "PLN":
			return "zł"
		case "CAD":
			return "CA$"
		case "NGN":
			return "₦"
		case "MXN":
			return "MX$"
		case "SOS":
			return "ShSo"
		default:
			return currency
	}
}

export const CURRENCY_LIST = [
	{
		currency_name: "Euro",
		symbol: "€",
		value: "EUR",
		label: "EUR",
	},
	{
		currency_name: "US Dollar",
		symbol: "$",
		value: "USD",
		label: "USD",
	},
	{
		currency_name: "British Pound",
		symbol: "£",
		value: "GBP",
		label: "GBP",
	},
	{
		currency_name: "Japanese Yen",
		symbol: "¥",
		value: "JPY",
		label: "JPY",
	},
	{
		currency_name: "Chinese Yuan",
		symbol: "¥",
		value: "CNY",
		label: "CNY",
	},
	{
		currency_name: "Russian Ruble",
		symbol: "₽",
		value: "RUB",
		label: "RUB",
	},
	{
		currency_name: "South Korean Won",
		symbol: "₩",
		value: "KRW",
		label: "KRW",
	},
	{
		currency_name: "Indian Rupee",
		symbol: "₹",
		value: "INR",
		label: "INR",
	},
	{
		currency_name: "Brazilian Real",
		symbol: "R$",
		value: "BRL",
		label: "BRL",
	},
	{
		currency_name: "Turkish Lira",
		symbol: "₺",
		value: "TRY",
		label: "TRY",
	},
	{
		currency_name: "Polish Zloty",
		symbol: "zł",
		value: "PLN",
		label: "PLN",
	},
	{
		currency_name: "Canadian Dollar",
		symbol: "CA$",
		value: "CAD",
		label: "CAD",
	},
	{
		currency_name: "Nigerian Naira",
		symbol: "₦",
		value: "NGN",
		label: "NGN",
	},
	{
		currency_name: "Mexican Peso",
		symbol: "MX$",
		value: "MXN",
		label: "MXN",
	},
	{
		currency_name: "Somali Shilling",
		symbol: "ShSo",
		value: "SOS",
		label: "SOS",
	},
]

export default parseCurrencySymbol
