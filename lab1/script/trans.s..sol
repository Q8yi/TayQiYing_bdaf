// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TransETH} from "../src/TransETH.sol";

contract CounterScript is Script {
    TransETH public trans;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        trans = new TransETH();

        vm.stopBroadcast();
    }
}
