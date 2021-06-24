pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol"; //This code uses the DeployedAddresses library to create a new instance of the contract for testing.
import "src/contracts/PPA.sol";

contract testPPA {
    //PPAToken ppaToken;
    PPA ppa;

    function testInitializePPA() public returns (bool success) {
        ppa = new PPA(DeployedAddresses.PPA());

        address payable adrr = DeployedAddresses.PPA();

        uint energyExpected = 1000;
        uint priceExpected = 10;
        uint dayExpected = 21102030;

        address producer = address(0x0);
        address buyer;
        uint energy;
        uint price;
        uint startDay;
        uint endDay;
        uint status;

        uint _id = ppa.createPPA(energyExpected, priceExpected, dayExpected, adrr);
        (producer, buyer, energy, price, startDay, endDay, status) = ppa.getPPAbyID(_id);
        Assert.equal(buyer, this, "Wrong 1");
        Assert.equal(energy, energyExpected, "Wrong 2");
        Assert.equal(price, priceExpected, "Wrong 3");
        Assert.equal(endDay, dayExpected, "wrong 4");
    }
}