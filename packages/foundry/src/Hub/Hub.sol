// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IWormholeTransceiverState} from "@wormhole-ntt/interfaces/IWormholeTransceiverState.sol";
import {INttManager} from "@wormhole-ntt/interfaces/INttManager.sol";

interface IMessageTransmitter {
    function receiveMessage(
        bytes calldata messageBody,
        bytes calldata attestation
    ) external;
}

contract Hub is ERC20 {
    INttManager internal nttManager;

    IWormholeTransceiverState internal transceiverState;

    uint256 public constant INITIAL_SUPPLY = 800_000_000 * 10 ** 18;

    address public immutable creator;

    uint256 public upup;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        creator = msg.sender;
    }

    function mint(uint256 _amount) external {
        _mint(msg.sender, _amount);
    }

    function peerDeployment(address _nttManager, address transceiver) external {
        nttManager = INttManager(_nttManager);
        transceiverState = IWormholeTransceiverState(transceiver);
    }

    function buy(uint256 amount) external {
        upup += amount;
    }

    function recieveDeposit(bytes memory attestation, bytes memory message) external {
        IMessageTransmitter(0x7865fAfC2db2093669d92c0F33AeEF291086BEFD).receiveMessage(message, attestation);
    }
}

// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0xd9B586bA07bB9056854c126abFB0f3C48Db627e9
// Transaction hash: 0x660287f4530a0ba0f764db7f349e7d877f15772f46949f3401e1090e993534bf


// 0xe710a530adf6574eeb0b6a4f4247d7fdde88bdcead31ec30618b38139416ae3e016cd1c1db5daf4383512561af6d9758e95c8780b7020c62536514f69492734e1b02b2e080446fb565b1ccacc195e62f0426f4cbb5283a3d723cd2b7b897f1b3472d71b7ab474eed8c9381fcf95073afcf9c3aedaf0900c9dd9e865714be8109551b