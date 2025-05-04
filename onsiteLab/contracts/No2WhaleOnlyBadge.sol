// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract No2WhaleOnlyBadge is ERC721{

    address public token;
    uint256 public currentId;
    uint256 private secret;

    constructor(address _token, uint256 initialSecret) ERC721("WhaleOnlyBadge", "WOB") {
        token = _token;
        currentId = 0;
        secret = initialSecret;
    }

    // requires 1 million tokens
    function obtainProofOfWhale(uint256 _secret) external {
        require(IERC20(token).balanceOf(msg.sender) > 1_000_000e18, "Not enough tokens");
        _mint(msg.sender, currentId + 1);
        secret = _secret;
        currentId++;
    }
}