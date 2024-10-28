// SPDX-License-Identifier: UNLICENSED

// This code was pieced together by taking a look at Wormhole's Foundation Example-Native-Token-Transfer

pragma solidity ^0.8.13;

import "./NttPeerDeployment.sol";
import "../Hub/TransceiverHubDeployment.sol";
import "./ERC20PeerDeployment.sol";
import "../interfaces/IWormholeDeployment.sol";
import {IManagerBase} from "@wormhole-ntt/interfaces/IManagerBase.sol";
import {INttManager} from "@wormhole-ntt/interfaces/INttManager.sol";

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

        Peer(token).peerDeployment(nttProxy, transceiver);

        emit Deployments(token, nttProxy, transceiver);
    }


// re - write ;
    function setPeers(uint16 chainId, address _ccNttManager, address ccTransceiver) external payable {
        nttManager.setPeer(chainId, bytes32(uint256(uint160(address(_ccNttManager)))), 18, type(uint64).max);
        transceiverState.setWormholePeer(chainId, bytes32(uint256(uint160(address(ccTransceiver)))));
    }
}

// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0x907Fa7421002f9D9F11354f1C09BFa9aa5BDeB25
// Transaction hash: 0x7298521027bb6af7a4fd2adeae3a9d23a27b14082d6ddc0c479681909cd7a10f



//   Token Address: 0x1376ceA20359F8E036C725BE978B3c5D8144FF28
//   NTT Manager Address: 0x1e05EcD3AAa4E51199777BB5E48F83BF3CCA4eDE
//   Transceiver Address: 0x018CAc486aadd2098a2876595b2eD74AB39318d1