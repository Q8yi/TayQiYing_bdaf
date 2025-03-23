//SPDX-License-Identifier: MIT
pragma solidity ^0.8.15;

import {Create2} from "@openzeppelin/contracts/utils/Create2.sol";
import "./FirstToken.sol";
import "./SecondToken.sol";
import "./WithdrawTK.sol";

contract FactoryContract {

    function computeAddress(bytes32 _salt, bytes32 bytecodeHash) public view returns (address) {
        return Create2.computeAddress(
            _salt,
            bytecodeHash
        );
    }
}