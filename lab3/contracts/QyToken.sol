// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract QyToken is ERC20 {

    address payable private owner;

    constructor() ERC20("QYToken", "QTK") {
        uint256 totalSupply = 100000000 * (10 ** 18);
        _mint(msg.sender, totalSupply);
        owner = payable(msg.sender);
    }

    function getTokens(address _to, uint _amt) external payable {
        require(owner == msg.sender);
        super.transfer(_to, _amt);
    }

    function exchangeToken(address from, uint256 value) external {
        super._transfer(from, owner, value);
    }

}