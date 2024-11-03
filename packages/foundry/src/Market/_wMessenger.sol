// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "lib/wormhole-solidity-sdk/src/interfaces/IWormholeRelayer.sol";


abstract contract _wMessenger  {
    IWormholeRelayer public wormholeRelayer = IWormholeRelayer(0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE);

    uint256 constant GAS_LIMIT = 150_000;

    function quoteCrossChainCost(
        uint16 targetChain
    ) public view returns (uint256 cost) {
        (cost, ) = wormholeRelayer.quoteEVMDeliveryPrice(
            targetChain,
            0,
            GAS_LIMIT
        );
    }

    function sendMessage(
        uint16 targetChain,
        address targetAddress,
        bytes memory data
    ) public payable {
        uint256 cost = quoteCrossChainCost(targetChain);

        require(
            msg.value >= cost,
            "Insufficient funds for cross-chain delivery"
        );

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            data,
            0,
            GAS_LIMIT
        );
    }

    function sendMessage2(
        uint16 targetChain,
        address targetAddress,
        bytes memory data
    ) public {
        uint256 cost = quoteCrossChainCost(targetChain);

        require(
            address(this).balance >= cost,
            "Insufficient funds for cross-chain delivery"
        );

        wormholeRelayer.sendPayloadToEvm{value: cost}(
            targetChain,
            targetAddress,
            data,
            0,
            GAS_LIMIT
        );
    }

}