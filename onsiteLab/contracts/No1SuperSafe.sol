
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract No1SuperSafe{

    mapping(address => bool) doneWithdraw;

    mapping (address => uint256) public balances;
    function despoit(address token, uint256 amount) external {
        require(amount <= 1_000e18, "too much");

        IERC20(token).transferFrom(msg.sender, address(this), amount);
        balances[msg.sender] += amount;
    }

    function withdraw(address token, uint256 amount) external {
        IERC20(token).transfer(msg.sender, amount);
        balances[msg.sender] -= amount;

        require(amount <= 1_000e18, "too much");
        doneWithdraw[msg.sender] = true;
    }
}