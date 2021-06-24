pragma solidity >=0.4.21 <0.7.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol"; //This code uses the DeployedAddresses library to create a new instance of the contract for testing.
import "src/contracts/PPA.sol";

contract testPPA {
    //PPAToken ppaToken;
    PPA ppa;

    function testInitializePPA() public returns (bool success) {
        ppa = new PPA();

        address payable adrr = DeployedAddresses.PPA();

        uint energyExpected = 1000;
        uint priceExpected = 10;
        uint dayExpected = 21102030;

        ppa.createPPA(energyExpected, priceExpected, dayExpected, adrr);
    }
}