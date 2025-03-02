// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.8;

contract TransETH {

    event newETH(address indexed add, uint256 amt);

    address payable private mainAdd; //store withdrawal address
    address payable private contractAdd = payable(address(this));
    mapping(address => uint256) balances; //store total amount transactions

    constructor() payable {
        mainAdd = payable(address(msg.sender)); //store main withdrawal
    }

    receive() external payable {}
    fallback() external payable {}

    function transfer() public payable { //payable default function'

        require(msg.value > 0 ether, "Please enter a valid amount");
        (bool success,) = contractAdd.call{value: msg.value}(""); //send ETH to mainAdd
        require(success, "Transfer unsuccessful");

        balances[msg.sender] += msg.value;
        emit newETH(address(msg.sender), uint256(msg.value));
    }

    function withdraw(address _to, uint amt) external payable {
        require(_to == mainAdd, 'You are not the rightful owner');
        (bool success,) =  mainAdd.call{value: amt}("");
        require(success, "Withdrawal unsuccessful");
        //return 0;
    }

    function withdrawAll(address _to) public {
        this.withdraw(_to, contractAdd.balance);
    }
}
