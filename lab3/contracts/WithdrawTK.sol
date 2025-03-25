// SPDX-License-Identifier: Unknown
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract WithdrawTK {

    event Event(address indexed add, uint256 amt);
    address payable public owner;

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {}
    fallback() external payable {}

    function getOwner() public view returns (address) {
        return owner;
    }

    modifier OnlyOwner {
        require(msg.sender == owner, 'No Access');
        _;
    }

    function getTokens(ERC20 token, uint256 _amt) external payable OnlyOwner {
        require(token.balanceOf(address(this)) >= _amt, "insufficient balance");
        token.transfer(owner, _amt);
        emit Event(msg.sender, _amt);

    }
}