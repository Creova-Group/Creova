// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Lock {
    uint256 public unlockTime;
    address public owner;

    event Withdrawal(uint256 amount, address to);

    constructor(uint256 _unlockTime) {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        unlockTime = _unlockTime;
        owner = msg.sender;
    }

    function withdraw() external {
        require(block.timestamp >= unlockTime, "Lock time not expired");
        require(msg.sender == owner, "Not the owner");
        
        uint256 amount = address(this).balance;
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Transfer failed");

        emit Withdrawal(amount, owner);
    }

    receive() external payable {}
}