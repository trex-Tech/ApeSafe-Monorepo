// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";
import {Script, console2} from "forge-std/Script.sol";
import {NttManager} from "@wormhole-ntt/NttManager/NttManager.sol";
import {WormholeTransceiver} from "@wormhole-ntt/Transceiver/WormholeTransceiver/WormholeTransceiver.sol";
import "../src/interfaces/IWormholeDeployment.sol";
import {SetupPeer} from "../src/Peer/SetupPeer.sol";

contract SetupPeerScript is Script {
    event Deployments(address indexed token, address indexed nttManager, address indexed transceiver);

    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRV_KEY");
        vm.startBroadcast(deployPrivateKey);

        bytes memory nttManagerCode = type(NttManager).creationCode;
        bytes memory transceiverCode = type(WormholeTransceiver).creationCode;

        IWormholeDeployment.DeploymentParams memory deploymentParams = IWormholeDeployment.DeploymentParams({
            wormholeCoreBridge: 0x31377888146f3253211EFEf5c676D41ECe7D58Fe,
            wormholeRelayerAddr: 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE,
            specialRelayerAddr: 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE,
            _consistencyLevel: 202,
            _gasLimit: 150_000,
            outboundLimit: uint256(type(uint64).max)
        });

        SetupPeer setupPeer = SetupPeer(0x9B5D2C2B5a3b8F68D357D8951110ffDA47fB2832);

        // Record all logs before the call
        vm.recordLogs();

        setupPeer.setupPeerDeployments(deploymentParams, "Bobn", "sks", nttManagerCode, transceiverCode);

        vm.stopBroadcast();

        // Get and process logs
        Vm.Log[] memory entries = vm.getRecordedLogs();
        bool found = false;
        for (uint256 i = 0; i < entries.length; i++) {
            bytes32 eventSignature = keccak256("Deployments(address,address,address)");
            if (entries[i].topics[0] == eventSignature) {
                found = true;
                // address token = address(uint160(uint256(entries[i].topics[1])));
                address nttManager = address(uint160(uint256(entries[i].topics[2])));
                address transceiver = address(uint160(uint256(entries[i].topics[3])));

                console2.log("=== Deployment Addresses ===");
                // console2.log("Token Address:", token);
                console2.log("NTT Manager Address:", nttManager);
                console2.log("Transceiver Address:", transceiver);
                break;
            }
        }

        if (!found) {
            console2.log("Warning: No Deployments event was emitted");
        }
    }
}

//   Token Address: 0x322b9f62d9d23B02Db45fd86593198164B7d6CFE
//   NTT Manager Address: 0xE0D5517ddf0fa8B21E5C0f023bF315121A6D97C0
//   Transceiver Address: 0xf0E38908465de8e7818934Ce89D814D36EdCD9b8
