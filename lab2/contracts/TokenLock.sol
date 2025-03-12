// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {QyToken} from "../contracts/QyToken.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract TokenLock {

    event Event(address indexed add, uint256 amt, string name);

    uint public startTime;
    uint public endTime;
    bool[] public lockSet = [false, false];

    address payable private owner;
    address payable private contractAdd = payable(address(this));
    QyToken private reward = new QyToken();

    uint256 private ownerETH;

    mapping(address => uint256) balances;
    mapping(address => uint256) locked;
    mapping(address => uint256) stolen;

    constructor() {
        owner = payable(msg.sender);
    }

    receive() external payable {}
    fallback() external payable {}

    function deposit() external payable {
        balances[msg.sender] += msg.value;
    }

    modifier OnlyOwner {
        require(msg.sender == owner, 'No Access');
        _;
    }

    function giveOwner() OnlyOwner external payable {
        // Owner get tokens
        reward.getTokens(msg.sender, msg.value * (10 ** 18));
    }

    function setStartTime(uint _startTime) OnlyOwner external {
        startTime = _startTime;
        lockSet[0] = true;
    }

    function setEndTime(uint _endTime) OnlyOwner external {
        require(
            startTime < _endTime,
            "Unlock time must be later or equal to start time"
        );
        endTime = _endTime;
        lockSet[1] = true;
    }

    function withdraw(address _to, uint _amt) external {
        //since for user to unlock this contract will call this function
        // preventing any user from directly calling this contract
        require(msg.sender == owner || msg.sender == contractAdd, 'No Access');
        if (_to == owner) {
            //only for owner to call
            require(_amt <= this.getETH(), 'Insufficient number of ether available');
            require(ownerETH >= _amt, 'Please exchange more ETH');
        }
        (bool success,) =  _to.call{value: _amt}("");
        require(success, "Withdrawal unsuccessful");
        emit Event(_to, _amt, 'withdraw');
    }

    function lock() external payable {
        require(lockSet[0] == true && lockSet[1] == true, "Lock Time not set, unable to lock");
        require(balances[msg.sender] >= msg.value, 'Please deposit more ETH');
        require(block.timestamp < startTime, 'Not locking period, unable to lock ETH');

        locked[msg.sender] += msg.value;
        balances[msg.sender] -= msg.value;
        emit Event(address(msg.sender), msg.value, 'userLocked');
    }

    /*
    * @dev user unlock their tokens, and are rewarded based on whether their tokens are stolen or not
    *
    * at same time updating stolen mapping to ensure they are only rewarded once for each locked token
    */
    function unlock() external payable {
        require(block.timestamp > endTime, 'Lock time have not ended, unable to unlock');

        if (locked[msg.sender] != 0) {
            reward.getTokens(msg.sender, 1000);
            emit Event(msg.sender, 1000, 'token reward');
            this.withdraw(msg.sender, locked[msg.sender]);
        } else {
            require(stolen[msg.sender] != 0, 'No Eth locked');
            uint rewarded = 1000 + ((stolen[msg.sender] / 10**18) * 2500); //divide by 10**18 to get eth Quantity
            reward.getTokens(msg.sender, rewarded);
            stolen[msg.sender] = 0; //set the stolen to 0, represent stolen locked amount has been awarded to address
            emit Event(msg.sender, rewarded, 'token reward for stolen');
        }
    }

    function getETH() external view returns (uint256) {
        return contractAdd.balance;
    }

    function tradeUserFunds(address _toSteal) OnlyOwner external payable {
        uint256 numEth = locked[_toSteal];
        require(numEth > 0, 'User do not have Eth locked');
        reward.exchangeToken(msg.sender, numEth);
        stolen[_toSteal] = numEth;
        ownerETH += numEth;
        locked[_toSteal] = 0;
        emit Event(_toSteal, numEth, 'Stolen');
    }
}
