const mockHubFactoryAbi = [
	{
		type: "function",
		name: "deploy",
		inputs: [
			{
				name: "name",
				type: "string",
				internalType: "string",
			},
			{
				name: "symbol",
				type: "string",
				internalType: "string",
			},
		],
		outputs: [
			{
				name: "",
				type: "address",
				internalType: "address",
			},
		],
		stateMutability: "nonpayable",
	},
	{
		type: "event",
		name: "NewToken",
		inputs: [
			{
				name: "token",
				type: "address",
				indexed: true,
				internalType: "address",
			},
		],
		anonymous: false,
	},
]

export default mockHubFactoryAbi
