// SPDX-License-Identifier: UNLICENSED

// This code was pieced together by taking a look at Wormhole's Foundation Example-Native-Token-Transfer
pragma solidity ^0.8.13;

import { Hub } from "./Hub.sol";
import {Create2} from "openzeppelin-contracts/contracts/utils/Create2.sol";



abstract contract ERC20HubDeployment {
    function _initiateERC20HubDeployment(
        string calldata _name, 
        string calldata _symbol
    ) internal returns (address) {
        bytes memory erc20ConstructorArgs = abi.encode(_name, _symbol);

        bytes memory bytecodeWithArgs = abi.encodePacked(type(Hub).creationCode, erc20ConstructorArgs);

        bytes32 salt = keccak256(abi.encodePacked(_name, _symbol, "NttFactory"));

        return Create2.deploy(0, salt, bytecodeWithArgs);
    }
}