pragma solidity >=0.4.22 <0.9.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../src/contracts/Battery.sol";

contract testBattery is batteryRegistry{

    function checkAddBattery() public {
        Assert.equal(msg.sender, batteryRegistry.addNewBattery("rrrr", 11111), true, "should be add a new battery");
    }
}