// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console} from "forge-std/Test.sol";
import {Vm} from "forge-std/Vm.sol";
import {TransETH} from "../src/TransETH.sol";


contract test is Test {

    event newETH(address indexed add, uint256 amt);

    TransETH public transactions;
    uint public amtWithdraw = 1 ether;
    address private mainWithdrawal = address(88);
    address private giver = address(8);

    function setUp() public {
        vm.prank(mainWithdrawal);
        transactions = new TransETH();
    }

    function test_ReceivePayment() public {
        // test ether transfers
        uint amt = 8 ether ;
        uint initial_bal = address(transactions).balance;

        deal(giver, amt);
        vm.prank(giver);

        vm.expectEmit(true, false, false, true);
        emit newETH(giver, amt);
        transactions.transfer{value: amt}();

        assertEq(address(transactions).balance, initial_bal + amt);
    }

    function test_Withdrawal() public {
        // test owner withdrawal is successful
        uint initial_bal = address(transactions).balance;
        vm.prank(address(transactions));
        transactions.withdrawAll(mainWithdrawal);

        assertEq(initial_bal, mainWithdrawal.balance);
    }

    function test_Revert() public {
        // test other account (not owner) cannot withdraw
        vm.expectRevert('You are not the rightful owner');
        uint initial_bal = address(this).balance;

        deal(giver, amtWithdraw);
        vm.prank(giver);
        transactions.withdrawAll(giver);
        assertEq(address(this).balance, initial_bal);
    }
}
