// SPDX-License-Identifier: UNLICENSED

// This code was pieced together by taking a look at Wormhole's Foundation Example-Native-Token-Transfer

pragma solidity ^0.8.13;

import { NttManager } from "@wormhole-ntt/NttManager/NttManager.sol";
import { IManagerBase } from "@wormhole-ntt/interfaces/IManagerBase.sol";
import { INttManager } from "@wormhole-ntt/interfaces/INttManager.sol";
import { WormholeTransceiver } from "@wormhole-ntt/Transceiver/WormholeTransceiver/WormholeTransceiver.sol";
import {Create2} from "openzeppelin-contracts/contracts/utils/Create2.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";


import "@wormhole-ntt/interfaces/IManagerBase.sol";

import { Hub } from "./Hub.sol";
    

interface IWormhole {
    function chainId() external view returns (uint16);
}

contract NttHubFactory {

    // to-do: do i need a universal manager
    struct DeploymentParams {
        address wormholeCoreBridge;
        address wormholeRelayerAddr;
        address specialRelayerAddr;
        uint8 _consistencyLevel;
        uint256 _gasLimit;
        uint256 outboundLimit;
    }

    function deployERC20WithNtt(string calldata _name, string calldata _symbol, DeploymentParams memory deploymentParams) public {
        bytes memory erc20ConstructorArgs = abi.encode(_name, _symbol);

        bytes memory bytecodeWithArgs = abi.encodePacked(type(Hub).creationCode, erc20ConstructorArgs);

        bytes32 salt = keccak256(abi.encodePacked(_name, _symbol, "NttFactory"));

        address _token = Create2.deploy(0, salt, bytecodeWithArgs);

        address _nttProxy = _initiateNttDeployment(_token, deploymentParams);

        address transceiver = _intiateTransceiverDeployment(_nttProxy, deploymentParams);

        IManagerBase(_nttProxy).setTransceiver(transceiver);

        INttManager(_nttProxy).setOutboundLimit(deploymentParams.outboundLimit); /// <-====

        INttManager(_nttProxy).setThreshold(1);
    }


    function _initiateNttDeployment(address _token, DeploymentParams memory deploymentParams) internal returns (address) {
        IWormhole wh = IWormhole(deploymentParams.wormholeCoreBridge);
        
        bytes memory nttConstructorArgs = abi.encode(_token, IManagerBase.Mode.LOCKING, wh.chainId(), 86400, false);

        bytes memory bytecodeWithArgs = abi.encodePacked(type(NttManager).creationCode, nttConstructorArgs);

        bytes32 salt = keccak256(abi.encodePacked(_token, IManagerBase.Mode.LOCKING, wh.chainId(), "NttFactory"));

        address _nttManager = Create2.deploy(0, salt, bytecodeWithArgs);

        NttManager nttManagerProxy = NttManager(address(new ERC1967Proxy(_nttManager, "")));

        nttManagerProxy.initialize();

        return address(nttManagerProxy);
    }

    function _intiateTransceiverDeployment(address _nttProxy, DeploymentParams memory deploymentParams) internal returns (address) {
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
      


// scale 

// set as minter