// SPDX-License-Identifier: Unknown
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract WithdrawTK {

    address payable private owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function getTokens(address token, uint256 _amt) external payable {
        require(owner == msg.sender);
        require(ERC20(token).balanceOf(address(this)) >= _amt, "insufficient balance");
        ERC20(token).transfer(owner, _amt);
    }
}