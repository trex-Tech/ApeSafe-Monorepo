// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";


contract Hub is ERC20 {
    event CrossChainMint(
        uint256 indexed chainId, 
        address indexed peerContract, 
        address indexed user, 
        uint256 usdcAmount, 
        uint256 tokenAmount
    );

    event CrossChainSell(
        uint256 indexed chainId,
        address indexed peerContract,
        address indexed user,
        uint256 tokenAmount,
        uint256 usdcAmount
    );

    uint256 public constant INITIAL_SUPPLY = 800_000_000 * 10**18;

    uint256 public CURRENT_PRICE = 2 * 10 ** 6;

    uint256 public CURRENT_SUPPLY;

    address public immutable creator;

    IERC20 public constant BASE_USDC = IERC20(0x036CbD53842c5426634e7929541eC2318f3dCF7e);

    mapping(uint256 => mapping(address => uint256)) public crossChainBalances;

    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
       creator = msg.sender;
    }

    function buy(uint256 _amountUsdc) external {
        require(_amountUsdc > 0, "AMOUNT NOT GREATER THAN ZERO"); 

        require(BASE_USDC.transferFrom(msg.sender, address(this), _amountUsdc), "USDC TRANSFER FAILED");

        uint256 scaledUsdcAmount = _amountUsdc * 10 ** 12;

        uint256 tokens = scaledUsdcAmount / CURRENT_PRICE;

        require(CURRENT_SUPPLY + tokens <= INITIAL_SUPPLY, "EXCEEDS INITIAL SUPPLY");

        uint256 remainingSupply = INITIAL_SUPPLY - CURRENT_SUPPLY;

        if (remainingSupply > 0) {
            CURRENT_PRICE = (INITIAL_SUPPLY * 10 ** 6) / remainingSupply;
        }

        _mint(msg.sender, tokens);
    }

    function sell(uint256 _amountTokens) external {
        require(_amountTokens > 0, "AMOUNT NOT GREATER THAN ZERO");

        uint256 usdcAmount = (_amountTokens * CURRENT_PRICE) / 10 ** 12;

        require(BASE_USDC.balanceOf(address(this)) >= usdcAmount, "INSUFFICIENT USDC BALANCE");

        _burn(msg.sender, _amountTokens);

        CURRENT_SUPPLY -= _amountTokens;

        uint256 remainingSupply = INITIAL_SUPPLY - CURRENT_SUPPLY;

        if (remainingSupply > 0) {
            CURRENT_PRICE = (INITIAL_SUPPLY * 10 ** 6) / remainingSupply;
        }

        require(BASE_USDC.transfer(msg.sender, usdcAmount), "USDC TRANSFER FAILED");
    }

    // executed by wormhole, process usdc by circle cctp 
    function buyCC(
        uint256 _chainId, 
        address _peer, 
        address _user, 
        uint256 _amountUsdc
        ) external {
        require(_amountUsdc > 0, "AMOUNT NOT GREATER THAN ZERO"); 

        require(_peer != address(0), "INVALID PEER ADDRESS");

        require(_user != address(0), "INVALID USER ADDRESS");

        uint256 scaledUsdcAmount = _amountUsdc * 10 ** 12;

        uint256 tokens = scaledUsdcAmount / CURRENT_PRICE;

        require(CURRENT_SUPPLY + tokens <= INITIAL_SUPPLY, "EXCEEDS INITIAL SUPPLY");

        uint256 remainingSupply = INITIAL_SUPPLY - CURRENT_SUPPLY;

        if (remainingSupply > 0) {
            CURRENT_PRICE = (INITIAL_SUPPLY * 10 ** 6) / remainingSupply;
        }

        crossChainBalances[_chainId][_user] += tokens;

        _mint(_peer, tokens);

        emit CrossChainMint(_chainId, _peer, _user, _amountUsdc, tokens);
        
        // crosschain call <- wormhole
    }

    // executed by wormhole, process usdc by circle cctp 
    function sellCC(
        uint256 _chainId,
        address _peer,
        address _user,
        uint256 _amountTokens
        ) external {

        require(_amountTokens > 0, "AMOUNT NOT GREATER THAN ZERO");

        require(_peer != address(0), "INVALID PEER ADDRESS");

        require(_user != address(0), "INVALID USER ADDRESS");

        require(crossChainBalances[_chainId][_user] >= _amountTokens, "INSUFFICIENT CROSS-CHAIN BALANCE");

        uint256 usdcAmount = (_amountTokens * CURRENT_PRICE) / 10 ** 12;

        crossChainBalances[_chainId][_user] -= _amountTokens;

        _burn(_peer, _amountTokens);

        CURRENT_SUPPLY -= _amountTokens;

        uint256 remainingSupply = INITIAL_SUPPLY - CURRENT_SUPPLY;

        if (remainingSupply > 0) {
            CURRENT_PRICE = (INITIAL_SUPPLY * 10 ** 6) / remainingSupply;
        }

        emit CrossChainSell(_chainId, _peer, _user, _amountTokens, usdcAmount);


        
    }
}
      