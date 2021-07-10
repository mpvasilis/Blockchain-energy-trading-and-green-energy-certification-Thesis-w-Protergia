pragma solidity >=0.4.21 <0.9.0;

import "./Assert.sol";
import "truffle/DeployedAddresses.sol"; //This code uses the DeployedAddresses library to create a new instance of the contract for testing.
import "src/contracts/PPA.sol";

contract testPPA {
    producerRegistry cp;
    PPA ppa;

    function beforeAll() public{
        cp = new producerRegistry();
        ppa = new PPA();
    }

    function testInitializePPA() public returns (bool success) {
        address buyerExpected = address(0x0);
        uint priceExpected = 10;
        uint startDayExpected = 1625928641;
        uint dayExpected = 1657453721;
        //note: in order to pass this test, should remove the current producer requirement "onlyRegisteredProducers" from function createPPA

        address producer;
        address buyer;
        uint enPrice;
        uint startDay;
        uint endDay;
        uint status;
        uint id;

        uint _id = 0;
        ppa.createPPA(priceExpected, startDayExpected, dayExpected);
        (producer, buyer, enPrice, startDay, endDay, status, id) = ppa.getPPAByID(_id);
        Assert.equal(buyer, buyerExpected, "Wrong 1");
        Assert.equal(startDay, startDayExpected, "Wrong 2");
        Assert.equal(enPrice, priceExpected, "Wrong 3");
        Assert.equal(endDay, dayExpected, "wrong 4");
    }

    function testBuyPPA() public returns (bool success) {
        //address buyerExpected = address(1);
        uint priceExpected = 10;
        uint startDayExpected = 1625928641;
        uint dayExpected = 1657453721;
        //note: in order to pass this test, should remove the require "require(listOfPPAs[i].producerID != buyerId, "Wrong address buyer");" from claimPPA function 

        address producer;
        address buyer;
        uint enPrice;
        uint startDay;
        uint endDay;

        uint idx = 0;
        ppa.claimPPA();
        (producer, buyer, enPrice, startDay, endDay) = ppa.getApprovedPPAByID(idx);
        Assert.equal(startDay, startDayExpected, "Wrong 5");
        Assert.equal(enPrice, priceExpected, "Wrong 6");
        Assert.equal(endDay, dayExpected, "wrong 7");
    }
}