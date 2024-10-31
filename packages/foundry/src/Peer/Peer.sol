// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {IWormholeTransceiverState} from "@wormhole-ntt/interfaces/IWormholeTransceiverState.sol";
import {INttManager} from "@wormhole-ntt/interfaces/INttManager.sol";
import "@vialabs-io/contracts/features/FeatureCCTP.sol"; 


interface IProtoCCTPGateway {
    function usdc() external view returns (IERC20);
    function send(uint _destChainId, address _recipient, uint256 _amount) external;
}

interface IProtoCCTPClient {
    function processMessage(uint usdcAmount, bytes memory data) external;
}


contract Peer is ERC20 {
    IProtoCCTPGateway public protoCCTPGateway;
    ERC20 public usdc;
    error CallerNotMinterOrNTTManager(address caller);
    error InvalidMinterZeroAddress();

    event Transfer(uint destChainId, address indexed from, address indexed to, uint256 amount);
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

    constructor(
        string memory _name, 
        string memory _symbol, 
        address _protoCCTPGateway
    ) ERC20(_name, _symbol) {
        creator = msg.sender;
        protoCCTPGateway = IProtoCCTPGateway(_protoCCTPGateway);
        usdc = ERC20(address(protoCCTPGateway.usdc()));
    }

    /// @notice Sends USDC to another chain
    /// @param _destChainId The destination chain ID
    /// @param _recipient The recipient address on the destination chain
    /// @param _amount The amount of USDC to send
    function send(uint _destChainId, address _recipient, uint256 _amount) external  {
        require(_amount > 0, "Amount must be greater than 0");

        // Transfer USDC to this contract
        require(usdc.transferFrom(msg.sender, address(this), _amount), "USDC transfer failed");

        usdc.approve(address(protoCCTPGateway), _amount);
        protoCCTPGateway.send(_destChainId, _recipient, _amount); // @dev 4th param can be arbitrary encoded bytes with abi.encode()

        emit Transfer(_destChainId, msg.sender, _recipient, _amount);
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

    function processMessage(uint usdcAmount, bytes memory data) external {
        require(msg.sender == address(protoCCTPGateway), "Only ProtoCCTPGateway can call this function");
        // Process the message


    }



}



// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0x0E0693DCCaf7e1637960B0588f7658180eB9B460
// Transaction hash: 0x1f86e1bc3c77e249865994dad0b05997c7621f40985d17df0b7bc63e7fecb4d8

// cast send 0x65904DE3408216d0E8C18dfdE7198AFBCd3cC5ca "send(uint,address,uint256)" 84532 0x0E0693DCCaf7e1637960B0588f7658180eB9B460 2000000 --rpc-url ${OP_RPC_URL} --private-key ${PRV_KEY}