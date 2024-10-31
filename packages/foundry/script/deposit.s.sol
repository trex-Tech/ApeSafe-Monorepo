// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";
import {Script, console2} from "forge-std/Script.sol";
import {Hub} from "../src/Hub/Hub.sol";
import {Peer} from "../src/Peer/Peer.sol";
import {INttManager} from "@wormhole-ntt/interfaces/INttManager.sol";



// No files changed, compilation skipped
// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0x2B3CC4582072B24d87B81E1920f2694aeFC20560
// Transaction hash: 0x0831a130b8e50f5385c91192365edae3fa6b05c93aa4ebba91d7fe694a0c47c3
contract depositScript is Script {
    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRV_KEY");
        vm.startBroadcast(deployPrivateKey);
        // alternating this first approve the ntt manager as spender b4 transfer
        Hub(0x75faf114eafb1BDbe2F0316DF893fd58CE46AA4d).approve(0xA336A3a70fAE2E24eF009C751b416853f6d872ab, 2 * 10**5);
        // Peer(0x2B3CC4582072B24d87B81E1920f2694aeFC20560).makeDeposit(3 * 1e18, 10005, bytes32(uint256(uint160(address(0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80)))));
    
        vm.stopBroadcast();
    }
}

     