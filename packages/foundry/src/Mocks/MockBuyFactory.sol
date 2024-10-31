// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {MockBuy} from "./MockBuy.sol";


contract MockBuyFactory {
    event Transfer(uint destChainId, address indexed from, address indexed to, uint256 amount);

    event NewMockBuy(address indexed mockBuy, address indexed token);

    function deploy(address _protoCCTPGateway, address token) private {
        MockBuy mockBuy = new MockBuy(_protoCCTPGateway);
        emit NewMockBuy(address(mockBuy), address(token));
    }

    function processMessage(uint usdcAmount, bytes memory data) external {
        (address _protoCCTPGateway, address token) = abi.decode(data, (address,address));
        deploy(_protoCCTPGateway, token);
    }
}
     

// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0x20E5F83d9de7b149A18F33324230b1f0c36BBaF2
// Transaction hash: 0x13570ca7cd27ad80282adf9f214f4340ede45fa9a4bd9db25f3459ff100808a2