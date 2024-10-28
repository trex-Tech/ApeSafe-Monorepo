// SPDX-License-Identifier: UNLICENSED

// This code was pieced together by taking a look at Wormhole's Foundation Example-Native-Token-Transfer

pragma solidity ^0.8.13;

import "./NttHubDeployment.sol";
import "./TransceiverHubDeployment.sol";
import "./ERC20HubDeployment.sol";
import "../interfaces/IWormholeDeployment.sol";
import {IManagerBase} from "@wormhole-ntt/interfaces/IManagerBase.sol";
import {INttManager} from "@wormhole-ntt/interfaces/INttManager.sol";

contract SetupHub is ERC20HubDeployment, NttHubDeployment, TransceiverHubDeployment {
    event Deployments(address indexed token, address indexed nttManager, address indexed transceiver);

    function setupHubDeployments(
        IWormholeDeployment.DeploymentParams memory deploymentParams,
        string calldata _name,
        string calldata _symbol,
        bytes memory _nttMgrCode,
        bytes memory _transceiverCode
    ) external {
        address token = _initiateERC20HubDeployment(_name, _symbol);

        address nttProxy = _initiateNttHubDeployment(token, _nttMgrCode, deploymentParams);

        address transceiver = _intiateTransceiverHubDeployment(nttProxy, _transceiverCode, deploymentParams);

        IManagerBase(nttProxy).setTransceiver(transceiver);

        INttManager(nttProxy).setOutboundLimit(deploymentParams.outboundLimit);

        INttManager(nttProxy).setThreshold(1);

        Hub(token).peerDeployment(nttProxy, transceiver);

        emit Deployments(token, nttProxy, transceiver);
    }

    function setPeers(address _nttMgr1,) external {

    }
}

// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0xd4C7D6Ba9Aa8c48ef91C7B583228A32F37DCFDBa
// Transaction hash: 0xcca698733abfe83605471f2d91b1d423f44f65ebfe673c8ad419fea5a653a8fb
