pragma solidity >=0.4.21 <0.9.0;

import "./Assert.sol";
import "src/contracts/EnergyTrading.sol";
//import "truffle/DeployedAddresses.sol"; //This code uses the DeployedAddresses library to create a new instance of the contract for testing.

contract testEnergyTrading {
    batteryRegistry br;
    energyBid eb;

    function beforeAll1() public {
        br = new batteryRegistry();
    }

    function beforeAll2() public {
        eb = new energyBid();
    }

    function testAddNewBattery() public {
        string memory uuIDExpected = "ead234dfdh";
        uint dateExpected = 21102021;

        address batteryID;
        string memory uuID;
        uint date;

        uint _idbat = 0;
        br.addNewBattery(uuIDExpected, dateExpected);
        (batteryID, uuID, date) = br.getBatteryByLength(_idbat);
        Assert.equal(uuID, uuIDExpected, "Wrong result 1");
        Assert.equal(date, dateExpected, "Wrong result 2");
    }
}