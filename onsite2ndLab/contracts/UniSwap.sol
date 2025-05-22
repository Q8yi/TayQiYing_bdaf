// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract UniSwap {

    address private owner;
    address public tokenAdd;

    receive() external payable {
    }

    constructor(){
        owner = msg.sender;
    }
}