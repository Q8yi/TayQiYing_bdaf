// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract UniSwap {

    /**
    Allowing swap of 1 : 3 ratio,
    1 firstTokenAdd to 3 secTokenAdd
     */
    address private owner;
    // 2 specific tokens for swap
    address private firstTokenAdd;
    address private secTokenAdd;

    event Swap(address indexed user, address tokenIn, uint256 amtIn, address tokenOut, uint256 amtOut, uint256 amtRefunded);

    constructor(address first, address second){
        owner = msg.sender;
        firstTokenAdd = first;
        secTokenAdd = second;
    }

    function swap(uint256 _amount, address token) external {
        //check if token is one of the 2 specified
        require(token == firstTokenAdd || token == secTokenAdd, "we do not accept this token");

        //doing the swap accordingly
        bool success = ERC20(token).transferFrom(msg.sender, address(this), _amount); // ensure successful transfer
        require(success, "unable to trasnfer from user;");

        ERC20 firstToken = ERC20(firstTokenAdd);
        ERC20 secondToken = ERC20(secTokenAdd);

        //once token is received successfully, then transfer the other token
        bool success1;
        if (token == firstTokenAdd) { //since the tokenAdd has been checked that it belongs to either firstToken or secTokenAdd, an if else statement works
            require(secondToken.balanceOf(address(this)) >=  _amount * 3, "Insufficient Token in contract");
            success1 = secondToken.transfer(msg.sender, _amount * 3);
            emit Swap(msg.sender, firstTokenAdd, _amount, secTokenAdd, _amount * 3, 0);
        } else {
            uint256 updatedAmt = _amount;
            if (_amount % 3 != 0 ) {
                bool successRefund = secondToken.transfer(msg.sender, _amount % 3);
                require(successRefund, "unable to refund extra");
                updatedAmt = _amount - (_amount % 3);
            }
            require(firstToken.balanceOf(address(this)) >= updatedAmt, "Insufficient Token in contract");
            success1 = firstToken.transfer(msg.sender, updatedAmt);
            emit Swap(msg.sender, secTokenAdd, _amount, firstTokenAdd, updatedAmt, _amount % 3);

        }
        require(success1, "unable to transfer to user"); //ensure successful transfer to msg.sender
    }
}