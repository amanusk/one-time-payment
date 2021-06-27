// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract OneTimePay {
    constructor(address payable payee) public {
        selfdestruct(payee);
    }
}
