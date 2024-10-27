// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import { NttManager } from "@wormhole-ntt/NttManager/NttManager.sol";

contract Hub is ERC20 {
    uint256 public constant INITIAL_SUPPLY = 800_000_000 * 10**18;

    address public immutable creator;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
       creator = msg.sender;
       _mint(address(this), INITIAL_SUPPLY);
    }


}
      