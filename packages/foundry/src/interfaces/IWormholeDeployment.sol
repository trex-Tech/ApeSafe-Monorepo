// SPDX-License-Identifier: UNLICENSED

// This code was pieced together by taking a look at Wormhole's Foundation Example-Native-Token-Transfer

pragma solidity ^0.8.13;

interface IWormholeDeployment {
    struct DeploymentParams {
        address wormholeCoreBridge;
        address wormholeRelayerAddr;
        address specialRelayerAddr;
        uint8 _consistencyLevel;
        uint256 _gasLimit;
        uint256 outboundLimit;
    }

    function chainId() external view returns (uint16);
}
