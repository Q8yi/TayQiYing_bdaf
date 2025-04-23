// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Vault {

    // event to check if shareprice and shares are updated accurately
    event Event(address indexed add, string topic, uint256 custodies, uint256 totalShare);
    //ensure balance are being updated accurately
    event BalanceCheck(address indexed add, uint256 balance);

    address private owner;

    address public underlyingToken; //vault receive this token
    uint256 public sharePrice; //underlying price of token

    uint256 public totalShares; //record shares quantity
    mapping(address => uint256) public funds; //record funds per user

    constructor(address _token) {
        underlyingToken = _token;
        owner = msg.sender;

        //initial supply of vault
        totalShares = 0;
    }

    function _updateSharePrice() private {
        sharePrice = totalShares == 0
                    ? 0
                    : ERC20(underlyingToken).balanceOf(address(this))  / totalShares;
    }

    function donates(uint256 _amount) external {
        ERC20(underlyingToken).transferFrom(msg.sender, address(this), _amount);
        _updateSharePrice();
        emit Event(msg.sender, "sharesPrice", ERC20(underlyingToken).balanceOf(address(this)), totalShares);
    }

    function deposit(uint256 _amount) external {
        uint256 shares = totalShares == 0
                    ? _amount
                    : (_amount * totalShares) / ERC20(underlyingToken).balanceOf(address(this));

        totalShares += shares;
        funds[msg.sender] += shares;
        ERC20(underlyingToken).transferFrom(msg.sender, address(this), _amount);
        _updateSharePrice();
        emit Event(msg.sender, "sharesPrice", ERC20(underlyingToken).balanceOf(address(this)), totalShares);
    }

    function withdraw(uint256 _shares) external {
        require(funds[msg.sender] >= _shares, 'Not enough shares');
        uint256 fund = (ERC20(underlyingToken).balanceOf(address(this)) * _shares) / totalShares;
        totalShares -= _shares;
        funds[msg.sender] -= _shares;

        ERC20(underlyingToken).transfer(msg.sender, fund);
        _updateSharePrice();
        emit Event(msg.sender, "sharesPrice", ERC20(underlyingToken).balanceOf(address(this)), totalShares);
    }

    function takeFeeAsOwner(uint256 _amountUnderlying) external {
        require(owner == msg.sender, 'you are not the owner');
        require((ERC20(underlyingToken).balanceOf(address(this))) >= _amountUnderlying, 'not enough amt');
        ERC20(underlyingToken).transfer(msg.sender, _amountUnderlying);
        _updateSharePrice();
        emit Event(msg.sender, "sharesPrice" ,ERC20(underlyingToken).balanceOf(address(this)), totalShares);
    }
}