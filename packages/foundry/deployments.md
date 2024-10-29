## Deployment

The smart contracts are deployed using `foundry`. Base is the Hub chain and Optimism is the spoke chain.
To Reproduce deployment follow this steps:

### Set environment variables

```bash
export OP_RPC_URL=
export BASE_RPC_URL=
export PRV_KEY=
```


### Deploy SetupHub and SetupPeer

```bash
forge create src/Hub/SetupHub.sol:SetupHun  --rpc-url ${OP_RPC_URL} --private-key ${PRV_KEY}
```

```bash
forge create src/Peer/SetupPeer.sol:SetupPeer  --rpc-url ${BASE_RPC_URL} --private-key ${PRV_KEY}
```

### Setup Hub Deployments ( N.B 😊 change the current SetupHub and SetupPeer in their respective script files SetupHub.s.sol SetupPeer.s.sol to the deployed addresses above)

```bash
forge script --via-ir script/SetupHub.s.sol:SetupHubScript  --rpc-url ${BASE_RPC_URL} --private-key ${PRV_KEY}  --broadcast --  --vvvv
```

The values gotten here are a your ERC20 token address, Ntt Manager address, and Transceiver address for the Hub chain. Save this values as the would be used in linking the hub chain to the spoke chain and vice versa. 

```bash
forge script --via-ir script/SetupPeer.s.sol:SetupPeerScript  --rpc-url ${OP_RPC_URL} --private-key ${PRV_KEY}  --broadcast --  --vvvv
```

The values gotten here are a your ERC20 token address, Ntt Manager address, and Transceiver address for the Peer chain. Save this values as the would be used in linking the hub chain to the spoke chain and vice versa. 

### Linking the hub chain to the spoke chain and vice versa
Set the values gotten above on *script/SetupHub.s.sol* for erc20, ntt, transceiver as main values in *script/LinkHubPeer.s.sol* and the values gotten in *script/SetupPeer.s.sol* as the peer values, also specify the chainId of wormhole peer chain. For  *script/LinkHubPeer.s.sol* the value from *script/SetupPeer.s.sol* becomes main and the value from *script/SetupHub.s.sol* becomes peers and the Hubs wormehole chain Id is used. 

### Mint the token you wish to send
Here set the address of the erc20 token on the hub chain.

```bash
forge script --via-ir script/HubMint.s.sol:HubMintScript  --rpc-url ${BASE_RPC_URL} --private-key ${PRV_KEY}  --broadcast --  --vvvv
```


### Approve NTT Manger as the spender before attempting to transfer 
Here set the addresses of the erc20 token, ntt manger on the hub chain, and use it to approve the NTT Manger On the Hub chain as spender. 


```bash
forge script --via-ir script/cTransfer.s.sol:cTransferScript  --rpc-url ${BASE_RPC_URL} --private-key ${PRV_KEY}  --broadcast --  --vvvv
```

