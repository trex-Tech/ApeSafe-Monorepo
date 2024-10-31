// SPDX-License-Identifier: UNLICENSED

// This code was pieced together by taking a look at Wormhole's Foundation Example-Native-Token-Transfer

pragma solidity ^0.8.13;

import "./NttPeerDeployment.sol";
import "../Hub/TransceiverHubDeployment.sol";
import "./ERC20PeerDeployment.sol";
import "../interfaces/IWormholeDeployment.sol";
import {IManagerBase} from "@wormhole-ntt/interfaces/IManagerBase.sol";
import {INttManager} from "@wormhole-ntt/interfaces/INttManager.sol";
import {WormholeTransceiver} from "@wormhole-ntt/Transceiver/WormholeTransceiver/WormholeTransceiver.sol";

contract SetupPeer is ERC20PeerDeployment, NttPeerDeployment, TransceiverHubDeployment {
    event Deployments(address indexed token, address indexed nttManager, address indexed transceiver);

    function setupPeerDeployments(
        IWormholeDeployment.DeploymentParams memory deploymentParams,
        string calldata _name,
        string calldata _symbol,
        bytes calldata _nttMgrCode,
        bytes calldata _transceiverCode
    ) external {
        address token = _initiateERC20PeerDeployment(_name, _symbol);

        address nttProxy = _initiateNttPeerDeployment(token, _nttMgrCode, deploymentParams);

        address transceiver = _intiateTransceiverHubDeployment(nttProxy, _transceiverCode, deploymentParams);

        IManagerBase(nttProxy).setTransceiver(transceiver);

        INttManager(nttProxy).setOutboundLimit(deploymentParams.outboundLimit);

        INttManager(nttProxy).setThreshold(1);

        // Peer(token).peerDeployment(nttProxy, transceiver);

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
// Deployed to: 0x9B5D2C2B5a3b8F68D357D8951110ffDA47fB2832
// Transaction hash: 0x3672f1562006befa3c53e3787e3d8ba4a3365f482902ef4f8f1cd18114d64e4d
