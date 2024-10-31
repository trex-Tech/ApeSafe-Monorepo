// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Vm} from "forge-std/Vm.sol";
import {Script, console2} from "forge-std/Script.sol";
import {NttManager} from "@wormhole-ntt/NttManager/NttManager.sol";
import {WormholeTransceiver} from "@wormhole-ntt/Transceiver/WormholeTransceiver/WormholeTransceiver.sol";
import "../src/interfaces/IWormholeDeployment.sol";
import {SetupHub} from "../src/Hub/SetupHub.sol";
import {IManagerBase} from "@wormhole-ntt/interfaces/IManagerBase.sol";

contract SetupHubScript is Script {
    event Deployments(address indexed token, address indexed nttManager, address indexed transceiver);

    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRV_KEY");
        vm.startBroadcast(deployPrivateKey);

        bytes memory nttManagerCode = type(NttManager).creationCode;
        bytes memory transceiverCode = type(WormholeTransceiver).creationCode;

        IWormholeDeployment.DeploymentParams memory deploymentParams = IWormholeDeployment.DeploymentParams({
            wormholeCoreBridge: 0x79A1027a6A159502049F10906D333EC57E95F083,
            wormholeRelayerAddr: 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE,
            specialRelayerAddr: 0x93BAD53DDfB6132b0aC8E37f6029163E63372cEE,
            _consistencyLevel: 202,
            _gasLimit: 150_000,
            outboundLimit: uint256(type(uint64).max)
        });

        SetupHub setupHub = SetupHub(0x498180D1F0Bda6485393F45e0d5B0805488e851A);

        // Record all logs before the call
        vm.recordLogs();

        setupHub.setupHubDeployments(deploymentParams, "Bobn", "sks", nttManagerCode, transceiverCode);

        vm.stopBroadcast();

        // Get and process logs
        Vm.Log[] memory entries = vm.getRecordedLogs();
        bool found = false;
        for (uint256 i = 0; i < entries.length; i++) {
            bytes32 eventSignature = keccak256("Deployments(address,address,address)");
            if (entries[i].topics[0] == eventSignature) {
                found = true;
                address token = address(uint160(uint256(entries[i].topics[1])));
                address nttManager = address(uint160(uint256(entries[i].topics[2])));
                address transceiver = address(uint160(uint256(entries[i].topics[3])));

                console2.log("=== Deployment Addresses ===");
                console2.log("Token Address:", token);
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

//   Token Address: 0x04BB910f008C1DF1f2BeFF29D98b744a7D35D531
//   NTT Manager Address: 0x9d5F30B785e80E669cc8F9A66798Eb1017AA45b2
//   Transceiver Address: 0xB9A85Da4BB98472c1305b86fAEc8825b2BaeF5a4
