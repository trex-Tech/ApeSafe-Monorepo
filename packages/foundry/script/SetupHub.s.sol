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

        // IWormholeDeployment wh = IWormholeDeployment(deploymentParams.wormholeCoreBridge); 

        // NttManager nttManager = new NttManager(
        //     0xC0266bE7A96a8112598ADb0706fd93Bd9C8d9d6a,
        //     IManagerBase.Mode.LOCKING,
        //     wh.chainId(),
        //     86400, 
        //     false
        //     );



        SetupHub setupHub = SetupHub(0xb19aB38c1f7F90876a05AdF484E33CF62cbf1b44);
        
        // Record all logs before the call
        vm.recordLogs();
        
        setupHub.setupHubDeployments(
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


// ntt-manager: 0x5690D19b14CAb9dB3981340a8c0763382dba91e4
// transceiver: 0xDA0629B800337641C9e2fBAa6B8D67D7FB5E7482
// erc20: 0x478D9Ff4939472F725cd0111e2b924Bb3ec494f0