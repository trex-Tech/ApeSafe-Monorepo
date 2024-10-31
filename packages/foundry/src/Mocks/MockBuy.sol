// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";

interface IProtoCCTPGateway {
    function usdc() external view returns (IERC20);
    function send(uint _destChainId, address _recipient, uint256 _amount) external;
    function send(uint _destChainId, address _recipient, uint256 _amount, bytes memory _data) external;
}

interface IProtoCCTPClient {
    function processMessage(uint usdcAmount, bytes memory data) external;
}
       
contract MockBuy {
    event Transfer(uint destChainId, address indexed from, address indexed to, uint256 amount);

    IProtoCCTPGateway public protoCCTPGateway;
    ERC20 public usdc;

    constructor(address _protoCCTPGateway) {
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

        bytes memory _customData = abi.encode(msg.sender);
        
        protoCCTPGateway.send(_destChainId, _recipient, _amount, _customData); // @dev 4th param can be arbitrary encoded bytes with abi.encode()

        emit Transfer(_destChainId, msg.sender, _recipient, _amount);
    }

    // function processMessage(uint usdcAmount, bytes memory data) external {
    //     require(msg.sender == address(protoCCTPGateway), "Only ProtoCCTPGateway can call this function");
    //     // Process the message


    // }
}

/**
*
*
*
*
*
*
*
*Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
Deployed to: 0x65904DE3408216d0E8C18dfdE7198AFBCd3cC5ca
Transaction hash: 0x14331be90333b4ab28a0ccdff721322334295c154dc89747f9f793dde1800729
*
*
*
*/
      


    //  cast send 0x65904DE3408216d0E8C18dfdE7198AFBCd3cC5ca "send(uint,address,uint256)" 84532 0xd688C5b0eBF10b6f568c571Aa99D342eDfA095E9 2000000 --rpc-url ${OP_RPC_URL} --private-key ${PRV_KEY} 