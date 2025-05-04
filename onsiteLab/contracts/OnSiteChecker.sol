// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract OnSiteChecker {

    address public token = 0x0CB70e82cDA48ac413d15dDb5782130F57ef8844;
    address public whalebadge = 0xac9a1d6E3452D55dc42aBB8AE3ACEAd98C089FAc;
    address public proofOfProxy = 0xC0b4f10e6b91B10d77CC80a34d457663f632431D;

    mapping(address => uint256) public scores;
    mapping(uint256 => mapping(address => bool)) public lab;

    function updateScores() external {
        uint256 score = 0;
        // No1 => obtain 1000 Token
        if(IERC20(token).balanceOf(msg.sender) >= 1_000e18){
            score += 20;
            lab[1][msg.sender] = true;
        }

        // No2 => obtain the ERC721
        if(IERC721(whalebadge).balanceOf(msg.sender) >= 1) {
            score += 60;
            lab[2][msg.sender] = true;
        }

        // No3 => obtain the ERC721
        if(IERC721(proofOfProxy).balanceOf(msg.sender) >= 1) {
            score += 60;
            lab[3][msg.sender] = true;
        }
        scores[msg.sender] = score;
    }
}