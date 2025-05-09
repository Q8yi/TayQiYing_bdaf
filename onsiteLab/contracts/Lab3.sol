// SPDX-License-Identifier: MIT
import {IMock} from './No3ProofOfProxy.sol';
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {Proxy} from "@openzeppelin/contracts/proxy/Proxy.sol";
import "hardhat/console.sol";

pragma solidity ^0.8.28;

interface INo3ProofOfProxy  {

    function currentId() external view returns (uint256);
    function registerContract(address contractAddress) external;
    function testMock() external;
    function balanceOf(address addr) external view returns (uint256);
    function transferFrom(address from, address to, uint256 tokenID) external;
}

contract Lab3 is IMock {

    address public userAddr;
    INo3ProofOfProxy public POPContract;
    bool public toRevert;

    constructor(address user, address proofOfProxyAddr) {
        userAddr = user;
        POPContract = INo3ProofOfProxy(proofOfProxyAddr);
        toRevert = true;
    }

    function mocking() external override {
        if (toRevert) {
            revert("revert for mocking");
        }
    }

    function callProxy() public {
        POPContract.registerContract(address(this));
        toRevert = false;
        POPContract.testMock();
        require(toRevert == false, "successful next");
        require(POPContract.balanceOf(address(this)) >= 1, "NFT CHECK");
        POPContract.transferFrom(address(this), userAddr, POPContract.currentId());
        require(POPContract.balanceOf(userAddr) >= 1, "NFT CHECK");

    }

}
