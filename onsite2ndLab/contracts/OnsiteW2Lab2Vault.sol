// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OnsiteW2Lab2Vault {

    mapping(address => mapping(address => uint256)) balance; // token => user => balance

    mapping (address => uint256) toDeduct; // temp var

    function deposit(address token, uint256 amount) external {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        balance[token][msg.sender] += amount;
    }

    function withdraw(address[] calldata tokens, uint256[] calldata amount) external payable {
        // make the transfer and record how much to deduct from balance
        for(uint256 i = 0; i < tokens.length; i++) {
            IERC20(tokens[i]).transfer(msg.sender, amount[i]);
            toDeduct[tokens[i]] = amount[i];
        }

        // clear the balance
        for(uint256 i = 0; i < tokens.length; i++) {
            balance[tokens[i]][msg.sender] -= toDeduct[tokens[i]];
            toDeduct[tokens[i]] = 0;
        }
    }

}