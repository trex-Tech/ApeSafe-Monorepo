// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";
import {Script, console2} from "forge-std/Script.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";


/**
    base sepolia: 0x036CbD53842c5426634e7929541eC2318f3dCF7e
    optimism sepolia: 0x5fd84259d66Cd46123540766Be93DFE6D43130D7
*/

interface ITokenMessenger {
    function depositForBurn(
        uint256 amount, 
        uint32 destinationDomain,
        bytes32 mintRecipient,
        address burnToken
        ) external returns (uint64);
}

contract cctpBaseScript is Script {
    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRV_KEY");
        vm.startBroadcast(deployPrivateKey);

        address usdcBase = 0x036CbD53842c5426634e7929541eC2318f3dCF7e;

        address tokenMessenger = 0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5;

        address msgTransmitter = 0x7865fAfC2db2093669d92c0F33AeEF291086BEFD;

        address tokenMinter = 0xE997d7d2F6E065a9A93Fa2175E878Fb9081F1f0A;

        // IERC20(usdcBase).approve(0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5, 0.00005 * 1e6);

        // ITokenMessenger(0x9f3B8679c73C2Fef8b59B4f3444d4e156fb70AA5).depositForBurn(0.00001 * 1e6, uint32(2), bytes32(uint256(uint160(address(msg.sender)))), usdcBase);


        vm.stopBroadcast();
    }
}

// send a deposit + send a message 