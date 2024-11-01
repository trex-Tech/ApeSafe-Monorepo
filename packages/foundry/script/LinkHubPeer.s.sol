// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";
import {Script, console2} from "forge-std/Script.sol";
import {SetupHub} from "../src/Hub/SetupHub.sol";
import "../src/interfaces/IWormholeDeployment.sol";
import {NttManager} from "@wormhole-ntt/NttManager/NttManager.sol";

contract LinkHubPeerScript is Script {
    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRV_KEY");
        vm.startBroadcast(deployPrivateKey);

        uint16 chainId = 10005;

        address nttMgrHub = 0x9d5F30B785e80E669cc8F9A66798Eb1017AA45b2;
        address transceiverHub = 0xB9A85Da4BB98472c1305b86fAEc8825b2BaeF5a4;
        address nttMgr = 0xE0D5517ddf0fa8B21E5C0f023bF315121A6D97C0;
        address transceiver = 0xf0E38908465de8e7818934Ce89D814D36EdCD9b8;
        SetupHub(0x498180D1F0Bda6485393F45e0d5B0805488e851A).setPeers(
            chainId, nttMgrHub, transceiverHub, nttMgr, transceiver
        );
        vm.stopBroadcast();
    }
}
