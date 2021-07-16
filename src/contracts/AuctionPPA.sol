pragma solidity >=0.4.21 <0.9.0;
pragma experimental ABIEncoderV2;

import "src/contracts/PPA.sol";
import "src/contracts/SafeMath.sol";
import "src/contracts/Counters.sol";

contract auctionPPA is producerRegistry, ppaBuyerRegistry{

    using Counters for Counters.Counter;
    Counters.Counter private contractID;

    enum Status {Pending, Activated, Expired}

    struct auppa {
        address producer;
        uint kwhPrice;         //price per energy(kwh)
        uint startDay;
        uint endDay;           //It must be timestamp (ex. uint endDay = 1833746400; // 2028-02-10 00:00:00)
        uint id;               //id number of each ppa contract
        Status status;
    }

    mapping(address => auppa) ppas;
    auppa[] listOfPPAs;

    struct activeppa {
        address buyer;
        address producer;
        uint kwhPrice;         //price per energy(kwh)
        uint startDay;
        uint endDay;           //It must be timestamp (ex. uint endDay = 1833746400; // 2028-02-10 00:00:00)
        uint id;               //id number of each ppa contract
        Status status;
    }

    mapping(address => mapping(uint => activeppa)) activatedPPAs;
    activeppa[] listOfAppas;

    function createAuctionPPA(uint _kwhPrice,uint _startDay, uint _endDay) public onlyRegisteredProducers{
        require(_endDay > _startDay, "It's impossible endDay < startDay");
        contractID.increment();
        uint currentID = contractID.current();
        address _producer = msg.sender;
        listOfPPAs.push(auppa({
            producer: _producer,
            kwhPrice: _kwhPrice,
            startDay: _startDay,
            endDay: _endDay,
            id: currentID,
            status: Status.Pending
        }));
    }
}