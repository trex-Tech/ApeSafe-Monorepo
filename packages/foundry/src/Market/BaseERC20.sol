// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import "./_wMessenger.sol";
import "forge-std/console.sol";

/**
 * @title IProtoCCTPGateway Interface
 * @notice Interface for cross-chain token transfer gateway
 */
interface IProtoCCTPGateway {
    function usdc() external view returns (IERC20);
    function send(uint _destChainId, address _recipient, uint256 _amount) external;
}

/**
 * @title BaseERC20
 * @notice Implementation of a cross-chain compatible ERC20 token with dynamic pricing
 * @dev Extends ERC20 and _wMessenger for cross-chain functionality
 */
contract BaseERC20 is ERC20, _wMessenger {
    // Events
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

    // External contract interfaces
    IProtoCCTPGateway private protoCCTPGateway = IProtoCCTPGateway(0x1124401c258653847Ea35de2cEe31c753629D1cB);
    IERC20 public constant BASE_USDC = IERC20(0x036CbD53842c5426634e7929541eC2318f3dCF7e);
    ERC20 public protoUsdc = ERC20(address(protoCCTPGateway.usdc()));

    // Constants
    uint256 public constant MIN_TOKENS_PER_TX = 1 * 10**15;    // Minimum tokens per transaction
    uint256 public constant INITIAL_SUPPLY = 800_000_000 * 10**18;  // Total initial supply
    uint256 public constant ALPHA = 10**4;     // Scaling factor for exponent
    uint256 public constant K = 2 * 10**6 * 10**12;  // Base price constant

    // State variables
    uint256 public CURRENT_PRICE = 2 * 10**6 * 10**12;  // Current token price
    uint256 public totalUSDCCollected;     // Total USDC collected from sales
    uint256 public CURRENT_SUPPLY;         // Current token supply
    address public immutable creator;      // Contract creator address

    // Mappings for cross-chain functionality
    mapping(uint256 => mapping(address => uint256)) public crossChainBalances;
    mapping(uint256 => mapping(address => uint256)) public crossChainBalancesBase;
    mapping(uint256 => uint256) private wormhole2ProtoCCTPId;




    /**
     * @notice Contract constructor
     * @param _name Token name
     * @param _symbol Token symbol
     */
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {
        creator = msg.sender;
        
        // Initialize chain ID mappings
        wormhole2ProtoCCTPId[10005] = 11155420;
        wormhole2ProtoCCTPId[10003] = 421614;
        wormhole2ProtoCCTPId[10007] = 80002;

    
  
    }

    /**
     * @notice Updates the current token price based on remaining supply
     * @dev Price increases linearly as supply decreases
     */
    function updateCurrentPrice() internal {
        uint256 remainingSupply = INITIAL_SUPPLY - CURRENT_SUPPLY;
        
        if (remainingSupply > 0) {
            // Linear price adjustment based on remaining supply
            CURRENT_PRICE = K + (K * (INITIAL_SUPPLY - remainingSupply) / INITIAL_SUPPLY);
        }
    }

    /**
     * @notice Allows users to buy tokens with USDC
     * @param _amountUsdc Amount of USDC to spend
     */
    function buy(uint256 _amountUsdc) external {
        require(_amountUsdc > 0, "AMOUNT NOT GREATER THAN ZERO");

        // Calculate expected balance after transfer
        uint256 expectedMinBalance = totalUSDCCollected + _amountUsdc;
        require(BASE_USDC.transferFrom(msg.sender, address(this), _amountUsdc), "USDC TRANSFER FAILED");

        // Verify transfer success
        uint256 actualBalance = BASE_USDC.balanceOf(address(this));
        require(actualBalance >= expectedMinBalance, "INSUFFICIENT BALANCE AFTER TRANSFER");

        // Calculate token amount
        uint256 scaledUsdcAmount = _amountUsdc * 10**12; // Convert from 6 to 18 decimals
        uint256 tokens = (scaledUsdcAmount * 10**18) / CURRENT_PRICE;
        
        require(tokens > 0, "TOKEN AMOUNT TOO SMALL");
        require(CURRENT_SUPPLY + tokens <= INITIAL_SUPPLY, "EXCEEDS INITIAL SUPPLY");

        // Update state
        CURRENT_SUPPLY += tokens;
        updateCurrentPrice();
        _mint(msg.sender, tokens);
        totalUSDCCollected = expectedMinBalance;
    }

    /**
     * @notice Allows users to sell tokens for USDC
     * @param _amountTokens Amount of tokens to sell
     */
    function sell(uint256 _amountTokens) external {
        require(_amountTokens > 0, "AMOUNT NOT GREATER THAN ZERO");

        // Calculate USDC amount to return
        uint256 usdcAmount = (_amountTokens * CURRENT_PRICE) / (10**18 * 10**12);
        require(usdcAmount > 0, "USDC AMOUNT TOO SMALL");
        require(BASE_USDC.balanceOf(address(this)) >= usdcAmount, "INSUFFICIENT USDC BALANCE");

        // Update state
        _burn(msg.sender, _amountTokens);
        CURRENT_SUPPLY -= _amountTokens;
        updateCurrentPrice();

        // Process USDC transfer
        uint256 expectedMinBalance = totalUSDCCollected - usdcAmount;
        require(BASE_USDC.transfer(msg.sender, usdcAmount), "USDC TRANSFER FAILED");

        // Verify transfer success
        uint256 actualBalance = BASE_USDC.balanceOf(address(this));
        require(actualBalance >= expectedMinBalance, "BALANCE VERIFICATION FAILED");

        totalUSDCCollected = expectedMinBalance;
    }

    /**
     * @notice Handles cross-chain token purchases
     * @param _chainId Target chain ID
     * @param _peer Peer contract address
     * @param _user User address
     * @param _amountUsdc Amount of USDC to spend
     */
    function buyCC(
        uint16 _chainId,
        address _peer,
        address _user,
        uint256 _amountUsdc
    ) private {
        require(_amountUsdc > 0, "AMOUNT NOT GREATER THAN ZERO");
        require(_peer != address(0), "INVALID PEER ADDRESS");
        require(_user != address(0), "INVALID USER ADDRESS");

        // Verify balance
        uint256 expectedMinBalance = totalUSDCCollected + _amountUsdc;
        uint256 actualBalance = BASE_USDC.balanceOf(address(this));
        require(actualBalance >= expectedMinBalance, "INSUFFICIENT BALANCE AFTER TRANSFER");

        // Calculate tokens
        uint256 scaledUsdcAmount = _amountUsdc * 10**12;
        uint256 tokens = (scaledUsdcAmount * 10**18) / CURRENT_PRICE;
        require(tokens > 0, "TOKEN AMOUNT TOO SMALL");
        require(CURRENT_SUPPLY + tokens <= INITIAL_SUPPLY, "EXCEEDS INITIAL SUPPLY");

        // Update state
        CURRENT_SUPPLY += tokens;
        updateCurrentPrice();
        crossChainBalances[_chainId][_user] += tokens;
        crossChainBalancesBase[_chainId][_user] += tokens;
        _mint(_peer, tokens);
        totalUSDCCollected = expectedMinBalance;
    }

    function handleCrossChainMint(
        uint16 _chainId,
        address _user,
        uint256 _tokens,
        address _market
    ) external  {
        require(_user != address(0), "INVALID USER ADDRESS");
        require(_tokens > 0, "INVALID TOKEN AMOUNT");
       
        
        // Verify the user has the claimed balance on the source chain
        require(crossChainBalances[_chainId][_user] >= _tokens, 
            "INSUFFICIENT CROSS-CHAIN BALANCE");
        require(crossChainBalancesBase[_chainId][_user] >= _tokens, 
            "INSUFFICIENT CROSS-CHAIN BALANCE ON BASE");

        // Deduct from cross-chain balance Base
        crossChainBalancesBase[_chainId][_user] -= _tokens;
        
        bytes memory payload = abi.encode(_user, _tokens, address(this));

        sendMessage(_chainId, _market, payload);
    }


    /**
     * @notice Handles cross-chain token sales
     * @param _chainId Source chain ID
     * @param _peer Peer contract address
     * @param _user User address
     * @param _amountTokens Amount of tokens to sell
     */
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

        // Calculate USDC amount
        uint256 usdcAmount = (_amountTokens * CURRENT_PRICE) / (10**18 * 10**12);
        require(usdcAmount > 0, "USDC AMOUNT TOO SMALL");
        require(BASE_USDC.balanceOf(address(this)) >= usdcAmount, "INSUFFICIENT USDC BALANCE");
        
        // Update state
        crossChainBalances[_chainId][_user] -= _amountTokens;
        _burn(_peer, _amountTokens);
        CURRENT_SUPPLY -= _amountTokens;
        updateCurrentPrice();


        // have similar flow using protoCCTP
        // Process USDC transfer
        uint256 expectedMinBalance = totalUSDCCollected - usdcAmount;
        require(BASE_USDC.transfer(msg.sender, usdcAmount), "USDC TRANSFER FAILED");

        // Verify transfer success
        uint256 actualBalance = BASE_USDC.balanceOf(address(this));
        require(actualBalance >= expectedMinBalance, "BALANCE VERIFICATION FAILED");

        emit CrossChainSell(_chainId, _peer, _user, _amountTokens, usdcAmount);
    }

 
    function processMessage(uint usdcAmount, bytes memory data) external {
        require(msg.sender == address(protoCCTPGateway), "Only ProtoCCTPGateway can call this function");

        (uint16 _chainId, address _peer, address _user, ) = abi.decode(data, (uint16,address,address,uint256));

        buyCC(_chainId, _peer, _user, usdcAmount);
    }
}