// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import { IWormholeTransceiverState } from "@wormhole-ntt/interfaces/IWormholeTransceiverState.sol";
import { INttManager } from "@wormhole-ntt/interfaces/INttManager.sol";

contract Hub is ERC20 {
    INttManager internal nttManager;

    IWormholeTransceiverState internal transceiverState;

    uint256 public constant INITIAL_SUPPLY = 800_000_000 * 10**18;

    address public immutable creator;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
       creator = msg.sender;
       _mint(address(this), INITIAL_SUPPLY);
    }

    function peerDeployment(
        address _nttManager,
        address transceiver
    ) external {
        nttManager = INttManager(_nttManager);
        transceiverState = IWormholeTransceiverState(transceiver);
    }

    function setPeers(
        uint16 chainId, 
        address _ccNttManager,
        address ccTransceiver
    ) external payable {
        nttManager.setPeer(chainId, bytes32(uint256(uint160(address(_ccNttManager)))), 18, type(uint64).max);
        transceiverState.setWormholePeer(chainId, bytes32(uint256(uint160(address(ccTransceiver)))));
    }
}
      