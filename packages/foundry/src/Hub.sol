// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";


contract Hub is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 800_000_000 * 10**18;

    address public immutable creator;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
       creator = msg.sender;
       _mint(address(this), INITIAL_SUPPLY);
    }

// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0xA336A3a70fAE2E24eF009C751b416853f6d872ab
// Transaction hash: 0x9e3a37c3d8059f915b7b418558fdc742cb2f8b84979b48332ba0a89e633f2110
// Done in 11.74s.
    // change the name of this contract
    // function mint(address _account, uint256 amount) external {

    // }
}
      