// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";
import {Script, console2} from "forge-std/Script.sol";
import {Hub} from "../src/Hub/Hub.sol";


contract HubMintScript is Script {
    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRV_KEY");
        vm.startBroadcast(deployPrivateKey);

        Hub(0x04BB910f008C1DF1f2BeFF29D98b744a7D35D531).mint(56922 * 1e18);
    
        vm.stopBroadcast();
    }
}
