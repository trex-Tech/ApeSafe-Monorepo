// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";
import {Script, console2} from "forge-std/Script.sol";
import {Peer} from "../src/Peer/Peer.sol";



contract cTransferScript is Script {
    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRV_KEY");
        vm.startBroadcast(deployPrivateKey);
        // Peer(0x322b9f62d9d23B02Db45fd86593198164B7d6CFE).peerDeployment(0xE0D5517ddf0fa8B21E5C0f023bF315121A6D97C0, 0xf0E38908465de8e7818934Ce89D814D36EdCD9b8);

        vm.stopBroadcast();
    }
}

