// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;


import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";



contract PeerERC20 is ERC20 {
    address public immutable creator;      // Contract creator address
    address public immutable market;

    constructor(string memory _name, string memory _symbol, address _creator, address _wormholeRelayer) ERC20(_name, _symbol) {
        creator = _creator;
        market = msg.sender;
    }

    function crossChainMint(address user, uint256 amount) external {
        require(
            msg.sender == market,
            "Only the Market can call this function"
        );
        _mint(user, amount);
    }





}