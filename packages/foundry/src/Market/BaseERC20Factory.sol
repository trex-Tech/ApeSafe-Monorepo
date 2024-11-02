// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {BaseERC20} from "./BaseERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/security/ReentrancyGuard.sol";

interface IProtoCCTPGateway {
    function usdc() external view returns (IERC20);
    function send(uint _destChainId, address _recipient, uint256 _amount) external;
    function send(uint _destChainId, address _recipient, uint256 _amount, bytes memory _data) external;
}

interface IProtoCCTPClient {
    function processMessage(uint usdcAmount, bytes memory data) external;
}


contract BaseERC20Factory is ReentrancyGuard  { 
    IProtoCCTPGateway public protoCCTPGateway;
    ERC20 public usdc;

    event NewToken(address indexed token);

    function deploy(
        string memory name,
        string memory symbol, 
        address _BaseprotoCCTPGateway,
        address opFactory,
        address arbFactory,
        address pFactory
        ) external nonReentrant  returns (address) {
        BaseERC20 baseERC20 = new BaseERC20(name, symbol);

        emit NewToken(address(baseERC20));

        protoCCTPGateway = IProtoCCTPGateway(_BaseprotoCCTPGateway);

        usdc = ERC20(address(protoCCTPGateway.usdc()));
    
        require(usdc.transferFrom(msg.sender, address(this), 2 * 10**6), "USDC transfer failed");

        usdc.approve(address(protoCCTPGateway), 2 * 10**6);

        bytes memory payload = abi.encode(name, symbol, address(baseERC20), msg.sender, 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE);

        protoCCTPGateway.send(11155420, opFactory, 5 * 10 ** 5, payload);

        return address(baseERC20);
    }

}

// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0xc5C5bEd29FFd8631b548172772bB0208256BD2D7
// Transaction hash: 0xcc55f8ad173858d893c8c5bad6d1310add4d169dddccc99f6ccd5154bde40881