// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IWormholeTransceiverState} from "@wormhole-ntt/interfaces/IWormholeTransceiverState.sol";
import {INttManager} from "@wormhole-ntt/interfaces/INttManager.sol";

contract Peer is ERC20 {
    error CallerNotMinterOrNTTManager(address caller);
    error InvalidMinterZeroAddress();

    event NewMinter(address newMinter);

    INttManager internal nttManager;

    IWormholeTransceiverState internal transceiverState;

    address public immutable creator;

    modifier onlyMinterOrNTTManager() {
        if (msg.sender != address(nttManager)) {
            revert CallerNotMinterOrNTTManager(msg.sender);
        }
        _;
    }

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        creator = msg.sender;
    }

    function mint(address _account, uint256 _amount) external onlyMinterOrNTTManager {
        _mint(_account, _amount);
    }

    function setMinter(address newMinter) external onlyMinterOrNTTManager {
        if (newMinter == address(0)) {
            revert InvalidMinterZeroAddress();
        }
        nttManager = INttManager(newMinter);
        emit NewMinter(newMinter);
    }

    function peerDeployment(address _nttManager, address transceiver) external {
        nttManager = INttManager(_nttManager);
        transceiverState = IWormholeTransceiverState(transceiver);
    }

    function setPeers(uint16 chainId, address _ccNttManager, address ccTransceiver) external payable {
        nttManager.setPeer(chainId, bytes32(uint256(uint160(address(_ccNttManager)))), 18, type(uint64).max);
        transceiverState.setWormholePeer(chainId, bytes32(uint256(uint160(address(ccTransceiver)))));
    }
}
// export BASE_RPC_URL=https://base-sepolia.g.alchemy.com/v2/I5HW3RWZVtn-T4QEUy91sMraurcSl3d-
// export OP_RPC_URL=https://opt-sepolia.g.alchemy.com/v2/I5HW3RWZVtn-T4QEUy91sMraurcSl3d-


// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0x9B5D2C2B5a3b8F68D357D8951110ffDA47fB2832
// Transaction hash: 0x18ebe2aca64c59fa671abc5ef498397b41dca6ddeedb75d07e3d22745a98c073