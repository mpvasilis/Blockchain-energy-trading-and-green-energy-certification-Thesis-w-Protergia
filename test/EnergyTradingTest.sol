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
        Assert.equal(batteryID, address(this), "Wrong result 0");
        Assert.equal(uuID, uuIDExpected, "Wrong result 1");
        Assert.equal(date, dateExpected, "Wrong result 2");
    }

    function testCreateEnergyBid() public {
        uint dayExpected = 21102021;
        uint energyExpected = 1000;
        uint priceExpected = 10;

        address prosumerID;
        uint day;
        uint energy;
        uint eprice;
        //note: this test is not working unless you removed the modifier var "onlyRegisteredBattery" from energy offer function.

        uint _idbid = 0;
        eb.energyOffer(dayExpected, energyExpected, priceExpected);
        (prosumerID, day, energy, eprice) = eb.getBidsByLength(_idbid);
        Assert.equal(energy, energyExpected, "Wrong result 3");
        Assert.equal(day, dayExpected, "Wrong result 4");
        Assert.equal(prosumerID, address(this), "Wrong result 5");
        Assert.equal(eprice, priceExpected, "Wrong result 6");
    }
}