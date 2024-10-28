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

        SetupPeer setupPeer = SetupPeer(0xd4C7D6Ba9Aa8c48ef91C7B583228A32F37DCFDBa);
        
        // Record all logs before the call
        vm.recordLogs();
        
        setupPeer.setupPeerDeployments(
            deploymentParams,
            "Bobn",
            "sks",
            nttManagerCode,
            transceiverCode
        );

        vm.stopBroadcast();

        // Get and process logs
        Vm.Log[] memory entries = vm.getRecordedLogs();
        bool found = false;
        for (uint i = 0; i < entries.length; i++) {
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



//   Token Address: 0x1376ceA20359F8E036C725BE978B3c5D8144FF28
//   NTT Manager Address: 0x1e05EcD3AAa4E51199777BB5E48F83BF3CCA4eDE
//   Transceiver Address: 0x018CAc486aadd2098a2876595b2eD74AB39318d1