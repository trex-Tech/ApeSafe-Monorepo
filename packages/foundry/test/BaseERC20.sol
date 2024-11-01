// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {BaseERC20} from "../src/Market/BaseERC20.sol";

contract BaseERC20Test is Test {

    BaseERC20 baseERC20;

    function setUp() public {
        baseERC20 = new BaseERC20("Sdhdh", "HJK");
    }

    function testBuy() public {
        baseERC20.buy(500_000);
    }

    

    function testSell() public {
        baseERC20.buy(500_000);
        baseERC20.sell(250000000000000000);
    }
}
