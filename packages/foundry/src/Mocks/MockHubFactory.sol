// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Hub} from "./MockHub.sol";


contract HubFactory {

    event NewToken(address indexed token);
    function deploy(string memory name, string memory symbol) external returns (address) {
        Hub hub = new Hub(name, symbol);
        emit NewToken(address(hub));
        return address(hub);
    }

// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0xBc53B85fcB5aCBe82935418Ed96e9925bf569860
// Transaction hash: 0xd643f119168a3f5c3a657e4119ff1bc7a9e0ce42beb94e2bdb5d3743a64c80bb
}
     