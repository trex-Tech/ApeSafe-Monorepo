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
			{
				name: "_BaseprotoCCTPGateway",
				type: "address",
				internalType: "address",
			},
			{
				name: "_protoCCTPGateway",
				type: "address",
				internalType: "address",
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

