// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";
import {Script, console2} from "forge-std/Script.sol";
import {Hub} from "../src/Hub/Hub.sol";
import {Peer} from "../src/Peer/Peer.sol";
import {INttManager} from "@wormhole-ntt/interfaces/INttManager.sol";


contract cTransferScript is Script {
    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRV_KEY");
        vm.startBroadcast(deployPrivateKey);
        // alternating this first approve the ntt manager as spender b4 transfer
        // Hub(0x04BB910f008C1DF1f2BeFF29D98b744a7D35D531).approve(0x9d5F30B785e80E669cc8F9A66798Eb1017AA45b2, 3 * 1e18);
        INttManager(0x9d5F30B785e80E669cc8F9A66798Eb1017AA45b2).transfer(3 * 1e18, 10005, bytes32(uint256(uint160(address(0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80)))));
    
        vm.stopBroadcast();
    }
}

