// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Hub} from "./MockHub.sol";
import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {ERC20} from "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

interface IProtoCCTPGateway {
    function usdc() external view returns (IERC20);
    function send(uint _destChainId, address _recipient, uint256 _amount) external;
    function send(uint _destChainId, address _recipient, uint256 _amount, bytes memory _data) external;
}

interface IProtoCCTPClient {
    function processMessage(uint usdcAmount, bytes memory data) external;
}

contract HubFactory {
    event Transfer(uint destChainId, address indexed from, address indexed to, uint256 amount);

    IProtoCCTPGateway public protoCCTPGateway;
    ERC20 public usdc;

    event NewToken(address indexed token);

// op protocctp    
    function deploy(string memory name, string memory symbol, address _BaseprotoCCTPGateway, address _protoCCTPGateway) external returns (address) {
        Hub hub = new Hub(name, symbol);
        emit NewToken(address(hub));

        protoCCTPGateway = IProtoCCTPGateway(_BaseprotoCCTPGateway);
        usdc = ERC20(address(protoCCTPGateway.usdc()));
        // send a transaction to buy factory, emit an event with token and buy factory contract
        //  require(usdc.transferFrom(msg.sender, address(this), 2 * 10**5), "USDC transfer failed");
        // send(11155420, 0x20E5F83d9de7b149A18F33324230b1f0c36BBaF2, 2 * 10**5, _protoCCTPGateway, address(hub));

        return address(hub);
    }

    //     /// @notice Sends USDC to another chain
    // /// @param _destChainId The destination chain ID
    // /// @param _recipient The recipient address on the destination chain
    // /// @param _amount The amount of USDC to send
    // function send(uint _destChainId, address _recipient, uint256 _amount, address _protoCCTPGateway, address _tokenAddr) private  {
    //     require(_amount > 0, "Amount must be greater than 0");

    //     // Transfer USDC to this contract
        

    //     usdc.approve(address(protoCCTPGateway), _amount);

    //     bytes memory _customData = abi.encode(_protoCCTPGateway, _tokenAddr);
        
    //     protoCCTPGateway.send(_destChainId, _recipient, _amount, _customData); // @dev 4th param can be arbitrary encoded bytes with abi.encode()

    //     emit Transfer(_destChainId, msg.sender, _recipient, _amount);
    // }

// Deployer: 0xC855358E52E0efeF34aAd09a8914d9cCb6D96f80
// Deployed to: 0xDa894BBc8Fce2Ee4D204Bb2EE7ed856D6400bc2f
// Transaction hash: 0xaffcd44d47bdf6eafed90d7a6f2c2832d29c03f453e347ce8f01e1565f318d9d
}
     