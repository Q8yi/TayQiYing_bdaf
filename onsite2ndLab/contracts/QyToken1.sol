// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract QyToken1 is ERC20 {

    address payable private owner;

    constructor() ERC20("QYToken1", "QTKK") {
        uint256 totalSupply = 1_000_000_000e18;
        _mint(msg.sender, totalSupply);
        owner = payable(msg.sender);
    }

    function getTokens(address _to, uint256 amt) external payable {
        require(msg.sender == owner, "you are not owner");
        super._transfer(owner, _to, amt);
    }

}