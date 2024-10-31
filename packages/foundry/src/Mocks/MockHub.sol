// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
       
contract Hub is ERC20  {
    uint256 public constant INITIAL_SUPPLY = 800_000_000 * 10**18;

    address public immutable creator;

    uint256 public currentPrice = 1 * 10**5;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
       creator = msg.sender;
    }

    // send usdc 

    function buy(uint256 usdcAmount) external {
        require(usdcAmount > 0, "Amount must be greater than 0");

        // Transfer USDC to this contract
        require(ERC20(0x036CbD53842c5426634e7929541eC2318f3dCF7e).transferFrom(msg.sender, address(this), usdcAmount), "USDC transfer failed");

        uint256 tokens = usdcAmount / currentPrice;
        currentPrice = (INITIAL_SUPPLY * 1 * 10**6) / (INITIAL_SUPPLY - totalSupply());
        _mint(msg.sender, tokens);
    }

    function buyCC(uint usdcAmount, address sender) private {
        uint256 tokens = usdcAmount / currentPrice;
        currentPrice = (INITIAL_SUPPLY * 1 * 10**6) / (INITIAL_SUPPLY - totalSupply());
        
        _mint(sender, tokens);
    }

    function sell(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    function processMessage(uint usdcAmount, bytes memory data) external {
        address sender = abi.decode(data, (address));
        buyCC(usdcAmount, sender);
    }
}
      

// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0xd688C5b0eBF10b6f568c571Aa99D342eDfA095E9
// Transaction hash: 0x1c2b459a462436263834c4d3f3fad571a8203c21edfcce31d690881b298d9a90