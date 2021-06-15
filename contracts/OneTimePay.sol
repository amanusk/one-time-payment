// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "hardhat/console.sol";

contract OneTimePay {
    constructor(address payable payee) public {
        console.log("Balance in contract", address(this).balance);
        console.log("Contract Address", address(this));
        payee.transfer(address(this).balance);
        console.log("Balance in contract after", address(this).balance);
    }
}
