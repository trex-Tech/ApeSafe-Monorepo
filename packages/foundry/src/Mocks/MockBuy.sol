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
* Optimism Seploia: 
*    usdc: "0x5fd84259d66Cd46123540766Be93DFE6D43130D7", 
    protocctp: "0x4285e806D4F6047C8FbD3A106131E482B4C9B4C3",
*
*
*
*
*
*
*
*
*/

/**
* arb-sepolia: 0xA336A3a70fAE2E24eF009C751b416853f6d872ab mock buy
* op-sepolia: 0xe40B1a18fAA40E629d32785f502D4971B73302A1
*
*
**/
      


    //  cast send 0x65904DE3408216d0E8C18dfdE7198AFBCd3cC5ca "send(uint,address,uint256)" 84532 0xd688C5b0eBF10b6f568c571Aa99D342eDfA095E9 2000000 --rpc-url ${OP_RPC_URL} --private-key ${PRV_KEY} 


    // ARB_RPC_SEPOLIA=https://arb-sepolia.g.alchemy.com/v2/I5HW3RWZVtn-T4QEUy91sMraurcSl3d-

    // forge create src/Mocks/MockBuy.sol:MockBuy  --rpc-url ${ARB_RPC_SEPOLIA} --private-key ${PRV_KEY} --constructor-args "0x5abA6886778DDEB3a34ea4C58CD9BeEa264026c7"