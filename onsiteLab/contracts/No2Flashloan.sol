// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IFlashLoanReceiver {
    function executeOperation(
        address token,
        uint256 amount,
        uint256 fee,
        bytes calldata params
    ) external;
}


contract No2Flashloan{

    address public token;

    constructor(address _token) {
        token = _token;
    }

    function flashloan(
        uint256 amount,
        bytes calldata params
    ) external {
        uint256 initialBalance = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(msg.sender, amount);
        IFlashLoanReceiver(msg.sender).executeOperation(token, amount, 0, params);
        uint256 finalBalance = IERC20(token).balanceOf(address(this));
        require(
            finalBalance >= initialBalance,
            "Flashloan not paid back"
        );
    }

}