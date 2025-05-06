// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

interface IMock{
    function mocking() external;
}

contract No3ProofOfProxy is ERC721 {
    uint256 public currentId;

    constructor() ERC721("ProofOfProxy", "POP") {
        currentId = 0;
    }

    mapping (address => bool) public registeredContracts;

    function registerContract(address contractAddress) external {
        try IMock(contractAddress).mocking() {
            revert("Mocking should fail");
        } catch {
            registeredContracts[contractAddress] = true;
        }
    }

    function testMock() external {
        require(registeredContracts[msg.sender], "Not registered");
        IMock(msg.sender).mocking();
        _mint(msg.sender, currentId + 1);
        currentId++;
    }
}