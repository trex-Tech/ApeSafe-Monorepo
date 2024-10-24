// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";


contract Peer is ERC20 {
    error CallerNotMinterOrNTTManager(address caller);
    error InvalidMinterZeroAddress();

    event NewMinter(address newMinter);

    address public minterOrNTTManager;

    address public immutable creator;

    modifier onlyMinterOrNTTManager() {
        if (msg.sender != minterOrNTTManager) {
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
        minterOrNTTManager = newMinter;
        emit NewMinter(newMinter);
    }
}
      

// No files changed, compilation skipped
// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0x8Ae42e26767CC2e5363457992658b4d0dE31C103
// Transaction hash: 0xc52747339e76d085f0e66ba62b3d7075557634ef4fd7c69b4ce070990ed4d748
// Done in 12.09s.      




