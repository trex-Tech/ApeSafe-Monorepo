// SPDX-License-Identifier: UNLICENSED

// This code was pieced together by taking a look at Wormhole's Foundation Example-Native-Token-Transfer
pragma solidity ^0.8.13;

import "./interfaces/IWormholeDeployment.sol";
import { WormholeTransceiver } from "@wormhole-ntt/Transceiver/WormholeTransceiver/WormholeTransceiver.sol";
import {Create2} from "openzeppelin-contracts/contracts/utils/Create2.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

abstract contract TransceiverHubDeployment {
    function _intiateTransceiverHubDeployment(
        address _nttProxy, 
        IWormholeDeployment.DeploymentParams memory deploymentParams
    ) internal returns (address) {
        bytes memory tConstructorArgs = abi.encode(_nttProxy, deploymentParams.wormholeCoreBridge, deploymentParams.wormholeRelayerAddr, deploymentParams.specialRelayerAddr, 202, 500000);

        bytes memory bytecodeWithArgs = abi.encodePacked(type(WormholeTransceiver).creationCode, tConstructorArgs);

        bytes32 salt = keccak256(abi.encodePacked(_nttProxy,  "NttFactory"));

        address _transceiver = Create2.deploy(0, salt, bytecodeWithArgs);

        WormholeTransceiver transceiverProxy =
            WormholeTransceiver(address(new ERC1967Proxy(_transceiver, "")));

        transceiverProxy.initialize();

        return address(transceiverProxy);
    }
}