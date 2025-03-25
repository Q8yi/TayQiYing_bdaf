//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import { WithdrawTK } from "../contracts/WithdrawTK.sol";

contract FactoryContract {

    function getContractByteCode() public pure returns (bytes memory) {
        return type(WithdrawTK).creationCode;
    }

    function deploys(bytes32 _salt, bytes memory _bytecode) public returns (address) {
        return Create2.deploy(
            0,
            _salt,
            _bytecode
        );
    }

    function computeAddress(bytes32 _salt, bytes32 bytecodeHash, address _deployer) public pure returns (address) {
        return Create2.computeAddress(
            _salt,
            bytecodeHash,
            _deployer
        );
    }
}