// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.13;

abstract contract MessageSender {
    uint256 constant GAS_LIMIT = 50000;

    function quoteCrossChainCost(
        uint16 targetChain
    ) public view returns (uint256 cost) { 

    }

}