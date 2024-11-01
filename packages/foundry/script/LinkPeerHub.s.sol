// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";
import {Script, console2} from "forge-std/Script.sol";
import {SetupPeer} from "../src/Peer/SetupPeer.sol";
import "../src/interfaces/IWormholeDeployment.sol";
import {NttManager} from "@wormhole-ntt/NttManager/NttManager.sol";

contract LinkPeerHubScript is Script {
    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRV_KEY");
        vm.startBroadcast(deployPrivateKey);
        // confirm this is optimism chain id
        uint16 chainId = 10004;

        address nttMgrPeer = 0xE0D5517ddf0fa8B21E5C0f023bF315121A6D97C0;
        address transceiverPeer = 0xf0E38908465de8e7818934Ce89D814D36EdCD9b8;
        address nttMgr = 0x9d5F30B785e80E669cc8F9A66798Eb1017AA45b2;
        address transceiver = 0xB9A85Da4BB98472c1305b86fAEc8825b2BaeF5a4;
        SetupPeer(0x9B5D2C2B5a3b8F68D357D8951110ffDA47fB2832).setPeers(chainId, nttMgrPeer, transceiverPeer, nttMgr, transceiver);
        vm.stopBroadcast();
    }
}
