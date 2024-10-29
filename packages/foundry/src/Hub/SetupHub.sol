// SPDX-License-Identifier: UNLICENSED

// This code was pieced together by taking a look at Wormhole's Foundation Example-Native-Token-Transfer

pragma solidity ^0.8.13;

import "./NttHubDeployment.sol";
import "./TransceiverHubDeployment.sol";
import "./ERC20HubDeployment.sol";
import "../interfaces/IWormholeDeployment.sol";
import {IManagerBase} from "@wormhole-ntt/interfaces/IManagerBase.sol";
import {INttManager} from "@wormhole-ntt/interfaces/INttManager.sol";
import {WormholeTransceiver} from "@wormhole-ntt/Transceiver/WormholeTransceiver/WormholeTransceiver.sol";

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

    function setPeers(
        uint16 chainId,
        address nttManager,
        address transceiver,
        address _ccNttManager,
        address ccTransceiver
    ) external payable {
        INttManager(nttManager).setPeer(
            chainId, bytes32(uint256(uint160(address(_ccNttManager)))), 18, type(uint64).max
        );
        WormholeTransceiver(transceiver).setWormholePeer(chainId, bytes32(uint256(uint160(address(ccTransceiver)))));
    }
}

// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0x498180D1F0Bda6485393F45e0d5B0805488e851A
// Transaction hash: 0xd12445e72f90dc75e6bd80d5023f45153e82f4911721eecefda0a540790caf42
