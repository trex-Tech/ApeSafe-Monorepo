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

    function buy(uint256 usdcAmount) external {
        require(usdcAmount > 0, "Amount must be greater than 0");

        // Transfer USDC to this contract
        require(ERC20(0x036CbD53842c5426634e7929541eC2318f3dCF7e).transferFrom(msg.sender, address(this), usdcAmount), "USDC transfer failed");

        uint256 tokens = usdcAmount / currentPrice;
        require(totalSupply() + tokens <= INITIAL_SUPPLY, "Exceeds initial supply");

        // Update the price based on remaining supply
        uint256 remainingSupply = INITIAL_SUPPLY - totalSupply();
        if (remainingSupply > 0) {
            currentPrice = (INITIAL_SUPPLY * 10**6) / remainingSupply;
        }

        _mint(msg.sender, tokens);
    }

    function buyCC(uint usdcAmount, address sender) private {
        uint256 tokens = usdcAmount / currentPrice;
        require(totalSupply() + tokens <= INITIAL_SUPPLY, "Exceeds initial supply");
        uint256 remainingSupply = INITIAL_SUPPLY - totalSupply();
        if (remainingSupply > 0) {
            currentPrice = (INITIAL_SUPPLY * 10**6) / remainingSupply;
        }

        
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
// Deployed to: 0x5c2d2fCE53834c6129e46b748773D686d0d98F5D
// Transaction hash: 0xbbe9462058aa1bc33611a00db295262816af57766ce9596b17a39597131c4fa1