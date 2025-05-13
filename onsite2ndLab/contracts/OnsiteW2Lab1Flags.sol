// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract OnsiteW2Lab1Flags {

    bool globalFlag;
    mapping(address => bool) flag;
    uint256 count;
    address owner;

    mapping(address => bool) passed;

    event PASS(address targetContract, address origin);

    constructor() {
        owner = msg.sender;
    }

    function setFlag(address set) external {
        require(msg.sender == owner);
        flag[set] = true;
    }

    function acquireFlag() external payable {
        require(msg.value != 0, "send some fees, will return half");
        if(!globalFlag){
            uint256 oldBalance = address(this).balance;

            globalFlag = true;
            count = 0;
            payable(msg.sender).transfer(msg.value / 2);
            globalFlag = false;

            uint256 newBalance = address(this).balance;
            if(oldBalance == newBalance) {
                passed[tx.origin] = true;
                emit PASS(msg.sender, tx.origin);
            }
        } else {
            require(count <= 0, "cannot get more");
            count++;
            payable(msg.sender).transfer(msg.value / 2);
            count = 0;
        }
    }

    function withdraw() external {
        require(msg.sender == owner);
        payable(msg.sender).transfer(address(this).balance);
    }

}