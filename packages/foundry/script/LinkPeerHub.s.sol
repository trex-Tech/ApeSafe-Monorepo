// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


import {Vm} from "forge-std/Vm.sol";
import {Script, console2} from "forge-std/Script.sol";
import {Peer} from "../src/Peer/Peer.sol";
import "../src/interfaces/IWormholeDeployment.sol";
import {NttManager} from "@wormhole-ntt/NttManager/NttManager.sol";




contract LinkPeerHubScript is Script {

    function run() public {
        uint256 deployPrivateKey = vm.envUint("PRV_KEY");
        vm.startBroadcast(deployPrivateKey);
        IWormholeDeployment wh = IWormholeDeployment(0x31377888146f3253211EFEf5c676D41ECe7D58Fe);

        

        address hubNttMgr = 0x5690D19b14CAb9dB3981340a8c0763382dba91e4;
        address transceiver = 0xDA0629B800337641C9e2fBAa6B8D67D7FB5E7482;
        // Peer peer = Peer(0x1376ceA20359F8E036C725BE978B3c5D8144FF28);
        // peer.setPeers(, hubNttMgr, transceiver);
        // NttManager(0x1e05EcD3AAa4E51199777BB5E48F83BF3CCA4eDE).setPeer(
        //     wh.chainId(), 
        //     bytes32(uint256(uint160(address(hubNttMgr)))),
        //     18,
        //     type(uint64).max
        //     );
        vm.stopBroadcast();
    }
}