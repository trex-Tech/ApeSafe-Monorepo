// SPDX-License-Identifier: UNLICENSED

// This code was pieced together by taking a look at Wormhole's Foundation Example-Native-Token-Transfer

pragma solidity ^0.8.13;

import "../interfaces/IWormholeDeployment.sol";
import {IManagerBase} from "@wormhole-ntt/interfaces/IManagerBase.sol";
import {NttManager} from "@wormhole-ntt/NttManager/NttManager.sol";
import {IManagerBase} from "@wormhole-ntt/interfaces/IManagerBase.sol";
import {Create2} from "openzeppelin-contracts/contracts/utils/Create2.sol";
import {ERC1967Proxy} from "openzeppelin-contracts/contracts/proxy/ERC1967/ERC1967Proxy.sol";

abstract contract NttPeerDeployment {
    function _initiateNttPeerDeployment(
        address _token,
        bytes calldata _nttMgrCode,
        IWormholeDeployment.DeploymentParams memory deploymentParams
    ) internal returns (address) {
        IWormholeDeployment wh = IWormholeDeployment(deploymentParams.wormholeCoreBridge);

        bytes memory nttConstructorArgs = abi.encode(_token, IManagerBase.Mode.BURNING, wh.chainId(), 86400, false);

        bytes memory bytecodeWithArgs = abi.encodePacked(_nttMgrCode, nttConstructorArgs);

        bytes32 salt = keccak256(abi.encodePacked(_token, IManagerBase.Mode.BURNING, wh.chainId(), "NttFactory"));

        address _nttManager = Create2.deploy(0, salt, bytecodeWithArgs);

        NttManager nttManagerProxy = NttManager(address(new ERC1967Proxy(_nttManager, "")));

        nttManagerProxy.initialize();

        return address(nttManagerProxy);
    }
}
