pragma solidity >=0.4.21 <0.9.0;

// SPDX-License-Identifier: MIT

import "src/contracts/SafeMath.sol";
import "src/contracts/Counters.sol";

contract EPA {
    using Counters for Counters.Counter;
    Counters.Counter private contractID;
    address registry;

    enum Status {Pending, Approved, Expired}
    event onEPA(address indexed prosumer, address indexed consumer, uint id);
    event onEPAClaimed(address indexed prosumer, address indexed consumer, uint energy, uint id);

    uint constant cent = 1;
    uint constant dollar = 100 * cent;

    uint constant mWh = 1;
    uint constant  Wh = 1000 * mWh;
    uint constant kWh = 1000 * Wh;
    uint constant MWh = 1000 * kWh;
    uint constant GWh = 1000 * MWh;
    uint constant TWh = 1000 * GWh;

    struct epa {
        address prosumer;
        address consumer;
        uint energy;
        uint kwhPrice;
        uint id;
        Status status;
    }

    epa[] listOfEPAs;

    struct claimedEPA{
        address prosumer;
        address consumer;
        uint totalEnergy;
        uint totalPrice;
        uint id;
        Status status;
    }

    mapping(uint => uint) claimedEPAs;
    claimedEPA[] listOfclaimedEPAs;

    //@title Energy Purchase Agreements (EPAs)
    //@dev after each energy transaction in energy trading smart contract will issued an EPA contract.
    //@notice See https://www.bchydro.com/work-with-us/selling-clean-energy/closed-offerings/open-call-for-power/epas.html
    function EPAs(address _prosumer, uint _kwhPrice, uint _energy) public {
        contractID.increment();
        uint currentID = contractID.current();
        require(_kwhPrice >= cent, "ERROR...price in Cent, i.e. 1.5dollar = 150cents");
        listOfEPAs.push(epa({
            prosumer: _prosumer,
            consumer: address(0x0),
            energy: _energy,
            kwhPrice: _kwhPrice,
            id: currentID,
            status: Status.Pending
        }));
        emit onEPA(_prosumer, address(0x0), currentID);
    }

    function claimEPA(address _prosumer, address _consumer, uint _energy, uint _price) public {
        uint idx;
        for(uint i = 0; i < listOfEPAs.length; i++){
            if(listOfEPAs[i].prosumer == _prosumer){
                idx = listOfclaimedEPAs.length;
                claimedEPAs[listOfEPAs[i].id] = idx;
                listOfclaimedEPAs.push(claimedEPA({
                    prosumer: _prosumer,
                    consumer: _consumer,
                    totalEnergy: _energy,
                    totalPrice: _price,
                    id: listOfEPAs[i].id,
                    status: Status.Approved
                }));
                emit onEPAClaimed(_prosumer, _consumer, _energy, listOfEPAs[i].id);
                if(listOfEPAs.length > 1){
                    listOfEPAs[i] = listOfEPAs[listOfEPAs.length-1];
                }
                listOfEPAs.length--;
                break;
            }
        }
    }

    function getCountOfEPAs() public view returns(uint count){
        return listOfEPAs.length;
    }

    function getCountOfClaimedEPAs() public view returns(uint count){
        return listOfclaimedEPAs.length;
    }

    function getClaimedEPAByID(uint _id) public view returns(address, address, uint, uint, uint){
        uint index = claimedEPAs[_id];
        require(listOfclaimedEPAs.length > index, "Wrong index");
        require(listOfclaimedEPAs[index].id == _id, "Wrong EPA ID");
        return(listOfclaimedEPAs[index].prosumer, listOfclaimedEPAs[index].consumer, listOfclaimedEPAs[index].totalEnergy, listOfclaimedEPAs[index].totalPrice, listOfclaimedEPAs[index].id);
    }

    function viewAllEPAs(uint n, uint offset) public view returns(address[] memory, address[] memory, uint[] memory, uint[] memory, uint[] memory){
        require(n>0, "n must be greater than 0");
        if(n>listOfEPAs.length) n=listOfEPAs.length;
        if(offset > listOfEPAs.length) offset = 0;
        uint x = 0;
        x = listOfEPAs.length - offset;
        address[] memory _prosumers = new address[](x);
        address[] memory _consumers = new address[](x);
        uint[] memory _energies = new uint[](x);
        uint[] memory _prices = new uint[](x);
        uint[] memory _ids = new uint[](x);
        for(uint i = offset; i < n+offset; i++){
            if(i>=listOfEPAs.length) break;
            x = i-offset;
            _prosumers[x] = listOfEPAs[i].prosumer;
            _consumers[x] = listOfEPAs[i].consumer;
            _energies[x] = listOfEPAs[i].energy;
            _prices[x] = listOfEPAs[i].kwhPrice;
            _ids[x] = listOfEPAs[i].id;
        }
        return(_prosumers, _consumers, _energies, _prices, _ids);
    }

    function viewClaimedEPAs(uint n, uint offset) public view returns(address[] memory, address[] memory, uint[] memory, uint[] memory, uint[] memory){
        require(n>0, "n must be greater than 0");
        if(n>listOfclaimedEPAs.length) n=listOfclaimedEPAs.length;
        if(offset > listOfEPAs.length) offset = 0;
        uint x = 0;
        x = listOfclaimedEPAs.length - offset;
        address[] memory prosumers = new address[](x);
        address[] memory consumers = new address[](x);
        uint[] memory energies = new uint[](x);
        uint[] memory prices = new uint[](x);
        uint[] memory ids = new uint[](x);
        for(uint i = offset; i < n+offset; i++){
            if(i>=listOfclaimedEPAs.length) break;
            x = i-offset;
            prosumers[x] = listOfclaimedEPAs[i].prosumer;
            consumers[x] = listOfclaimedEPAs[i].consumer;
            energies[x] = listOfclaimedEPAs[i].totalEnergy;
            prices[x] = listOfclaimedEPAs[i].totalPrice;
            ids[x] = listOfclaimedEPAs[i].id;
        }
        return(prosumers, consumers, energies, prices, ids);
    }
}