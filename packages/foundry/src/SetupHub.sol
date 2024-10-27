// SPDX-License-Identifier: UNLICENSED

// This code was pieced together by taking a look at Wormhole's Foundation Example-Native-Token-Transfer

pragma solidity ^0.8.13;

import "./NttHubDeployment.sol";
import "./TransceiverHubDeployment.sol";
import "./ERC20HubDeployment.sol";
import "./interfaces/IWormholeDeployment.sol";
import { IManagerBase } from "@wormhole-ntt/interfaces/IManagerBase.sol";
import { INttManager } from "@wormhole-ntt/interfaces/INttManager.sol";

// src/libraries/TransceiverStructs.sol for dynamic linking
// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0x1485F1D089fD6640E56e91a15Eefeef7bA1f0ddB
// Transaction hash: 0x0abbd358f75d3ba16e84c8a5f0dd59d9db209c5130b01a2329a0476ad5f93fc0


contract SetupHub is ERC20HubDeployment, NttHubDeployment, TransceiverHubDeployment {

    event Deployments(address indexed token, address indexed nttManager, address indexed transceiver);

    function setupHubDeployments(
        IWormholeDeployment.DeploymentParams memory deploymentParams,
        string calldata _name, 
        string calldata _symbol
    ) external {
        address token = _initiateERC20HubDeployment(_name, _symbol);

        address nttProxy = _initiateNttHubDeployment(token, deploymentParams);

        address transceiver = _intiateTransceiverHubDeployment(nttProxy, deploymentParams);

        IManagerBase(nttProxy).setTransceiver(transceiver);

        INttManager(nttProxy).setOutboundLimit(deploymentParams.outboundLimit); 

        INttManager(nttProxy).setThreshold(1);
        
        emit Deployments(token, nttProxy, transceiver);
    }
}