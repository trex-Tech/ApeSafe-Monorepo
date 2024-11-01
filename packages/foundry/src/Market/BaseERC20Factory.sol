// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {BaseERC20} from "./BaseERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

interface IProtoCCTPGateway {
    function usdc() external view returns (IERC20);
    function send(uint _destChainId, address _recipient, uint256 _amount) external;
    function send(uint _destChainId, address _recipient, uint256 _amount, bytes memory _data) external;
}

contract BaseERC20Factory { 
    IProtoCCTPGateway public protoCCTPGateway;
    ERC20 public usdc;

    event NewToken(address indexed token);

    function deploy(string memory name, string memory symbol, address _BaseprotoCCTPGateway) external returns (address) {
        BaseERC20 baseERC20 = new BaseERC20(name, symbol);

        emit NewToken(address(baseERC20));

        protoCCTPGateway = IProtoCCTPGateway(_BaseprotoCCTPGateway);

        usdc = ERC20(address(protoCCTPGateway.usdc()));

        // send to arbitrum, op, polygon to deploy bellow
        
        // send a transaction to buy factory, emit an event with token and buy factory contract
        //  require(usdc.transferFrom(msg.sender, address(this), 2 * 10**5), "USDC transfer failed");
        // send(11155420, 0x20E5F83d9de7b149A18F33324230b1f0c36BBaF2, 2 * 10**5, _protoCCTPGateway, address(hub));

        return address(baseERC20);
    }
}