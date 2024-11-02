// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {PeerERC20} from "./PeerERC20.sol";
import "lib/wormhole-solidity-sdk/src/interfaces/IWormholeRelayer.sol";
import "lib/wormhole-solidity-sdk/src/interfaces/IWormholeReceiver.sol";


interface IProtoCCTPGateway {
    function usdc() external view returns (IERC20);
    function send(uint _destChainId, address _recipient, uint256 _amount) external;
    function send(uint _destChainId, address _recipient, uint256 _amount, bytes memory _data) external;
}


contract PeerERC20Factory {
    IWormholeRelayer public wormholeRelayer;
    IProtoCCTPGateway public protoCCTPGateway;
    ERC20 public usdc;

    mapping(address => address) private base2peer;
    mapping(uint256 => uint16) private protoCCTPId2Wormhole;

    event NewToken(address indexed token);

    constructor(address _protoCCTPGateway) {
        protoCCTPId2Wormhole[11155420] = 10005;
        protoCCTPId2Wormhole[421614] = 10003;
        protoCCTPId2Wormhole[80002] = 10007;
        protoCCTPGateway = IProtoCCTPGateway(_protoCCTPGateway);
        usdc = ERC20(address(protoCCTPGateway.usdc()));
    }

    function deploy(string memory name, string memory symbol, address _baseERC20, address creator, address wRelayer) private {
        PeerERC20 peerERC20 = new PeerERC20(name, symbol, creator, wRelayer);

        wormholeRelayer = IWormholeRelayer(wRelayer);

        emit NewToken(address(peerERC20));

        base2peer[_baseERC20] = address(peerERC20);
    }

    function processMessage(uint usdcAmount, bytes memory data) external {
         require(msg.sender == address(protoCCTPGateway), "Only ProtoCCTPGateway can call this function");
         (string memory name, string memory symbol, address _baseERC20, address creator, address wRelayer) = abi.decode(data, (string,string,address,address,address));
         deploy(name, symbol, _baseERC20, creator, wRelayer);
    }

    function buy(uint256 _amountUsdc, address _baseERC20, uint256 currPCCTPChainID) external   {
        require(base2peer[_baseERC20] != address(0), "NON EXISTENT BASE");
        require(usdc.transferFrom(msg.sender, address(this), _amountUsdc), "USDC transfer failed");

        usdc.approve(address(protoCCTPGateway), _amountUsdc);

        bytes memory payload = abi.encode(protoCCTPId2Wormhole[currPCCTPChainID] , base2peer[_baseERC20], msg.sender, _amountUsdc);

        protoCCTPGateway.send(84532, _baseERC20, _amountUsdc, payload);
    }

        // To-Limit strict check to be called by baseerc20
    function receiveWormholeMessages(
        bytes memory payload,
        bytes[] memory,
        bytes32 sourceAddress,
        uint16 sourceChain,
        bytes32
    ) public payable {
        require(
            msg.sender == address(wormholeRelayer),
            "Only the Wormhole relayer can call this function"
        );

        // Decode the payload to extract the message
        (address user, uint256 amount, address _baseERC20)  = abi.decode(payload, (address,uint256,address));

        PeerERC20(base2peer[_baseERC20]).crossChainMint(user, amount);
    }
}

// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0xb48F1E15c21A643fd6C47542EdD097ea5f0aece0
// Transaction hash: 0x5666b535d0eb6351b62f37294530867bd1258a448c70a81bbb2077c5a209a55e