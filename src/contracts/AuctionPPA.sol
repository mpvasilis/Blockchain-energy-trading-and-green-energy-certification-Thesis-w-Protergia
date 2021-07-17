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
    auppa[] pendingPPAs;

    struct activeppa {
        address buyer;
        address producer;
        uint kwhPrice;         //price per energy(kwh)
        uint startDay;
        uint endDay;           //It must be timestamp (ex. uint endDay = 1833746400; // 2028-02-10 00:00:00)
        uint id;               //id number of each ppa contract
        uint totalKwh;
        Status status;
    }

    mapping(address => mapping(uint => activeppa)) activatedPPAs;
    activeppa[] listOfAppas;

    struct purchasesppa{
        address buyer;
        address producer;
        uint timestamp;
        uint id;
        uint purchasedEnergy;
    }

    purchasesppa[] purchases;

    function createAuctionPPA(uint _kwhPrice,uint _startDay, uint _endDay) public onlyRegisteredProducers{
        require(_endDay > _startDay, "It's impossible endDay < startDay");
        contractID.increment();
        uint currentID = contractID.current();
        address _producer = msg.sender;
        pendingPPAs.push(auppa({
            producer: _producer,
            kwhPrice: _kwhPrice,
            startDay: _startDay,
            endDay: _endDay,
            id: currentID,
            status: Status.Pending
        }));
    }

    function claimAuctionPPA() public {
        uint _totalkwh = 0;
        address buyerAddr = msg.sender;
        for(uint i = 0; i < pendingPPAs.length; i++){
            bool isClaimed = false;
            for(uint j = 0; j < pendingPPAs.length; j++){
                if(pendingPPAs[j].kwhPrice < pendingPPAs[i].kwhPrice){
                    require(pendingPPAs[j].status == Status.Pending, "PPA does not exists");
                    require(pendingPPAs[j].producer != buyerAddr, "Wrong address buyer");
                    listOfAppas.push(activeppa({
                        buyer: buyerAddr,
                        producer: pendingPPAs[j].producer,
                        kwhPrice: pendingPPAs[j].kwhPrice,
                        startDay: pendingPPAs[j].startDay,
                        endDay: pendingPPAs[j].endDay,
                        id: pendingPPAs[j].id,
                        totalKwh: _totalkwh,
                        status: Status.Activated
                        }));
                    ppaBuyerRegistry.registerPPABuyer(buyerAddr);
                    isClaimed = true;
                }
                if(isClaimed){
                    if(pendingPPAs.length > 1){
                        pendingPPAs[j] = pendingPPAs[pendingPPAs.length-1];
                    }
                    pendingPPAs.length--;
                    break;
                }
            }
            if(isClaimed){
                break;
            }else{
                require(pendingPPAs[i].status == Status.Pending, "PPA does not exists");
                require(pendingPPAs[i].producer != buyerAddr, "Wrong address buyer");
                listOfAppas.push(activeppa({
                    buyer: buyerAddr,
                    producer: pendingPPAs[i].producer,
                    kwhPrice: pendingPPAs[i].kwhPrice,
                    startDay: pendingPPAs[i].startDay,
                    endDay: pendingPPAs[i].endDay,
                    id: pendingPPAs[i].id,
                    totalKwh: _totalkwh,
                    status: Status.Activated
                }));
                ppaBuyerRegistry.registerPPABuyer(buyerAddr);
                isClaimed = true;
                if(isClaimed){
                    if(pendingPPAs.length > 1){
                        pendingPPAs[i] = pendingPPAs[pendingPPAs.length-1];
                    }
                    pendingPPAs.length--;
                    break;
                }
            }
        }
    }

    //Claim an Auction type PPA with the lowest price
    function getPPAWithLowestPrice() public {
        uint x = 0;
        uint _totalKwh = 0;
        address buyerAddr = msg.sender;
        for(uint i = 0; i < pendingPPAs.length; i++){
            if(pendingPPAs[i].kwhPrice < pendingPPAs[x].kwhPrice){
                x = i;
                require(pendingPPAs[x].status == Status.Pending, "PPA does not exists");
                require(pendingPPAs[x].producer != buyerAddr, "Wrong address buyer");
                listOfAppas.push(activeppa({
                    buyer: buyerAddr,
                    producer: pendingPPAs[x].producer,
                    kwhPrice: pendingPPAs[x].kwhPrice,
                    startDay: pendingPPAs[x].startDay,
                    endDay: pendingPPAs[x].endDay,
                    id: pendingPPAs[x].id,
                    totalKwh: _totalKwh,
                    status: Status.Activated
                }));
                ppaBuyerRegistry.registerPPABuyer(buyerAddr);
                if(pendingPPAs.length > 1){
                    pendingPPAs[x] = pendingPPAs[pendingPPAs.length-1];
                }
                pendingPPAs.length--;
                break;
            }
        }
    }

    function viewAllPPAs () public view returns (auppa[] memory){
        return pendingPPAs;
    }

    function getCountPPA () public view returns (uint count){
        return pendingPPAs.length;
    }

    function viewAllpurchases() public view returns (purchasesppa[] memory){
        return purchases;
    }

    function viewAllActivatedPPAs() public view returns(activeppa[] memory){
        return listOfAppas;
    }

    function getPPAByID(uint _id) public view returns (address, uint, uint, uint){
        auppa storage _ppa = pendingPPAs[_id];
        return(_ppa.producer, _ppa.kwhPrice, _ppa.startDay, _ppa.endDay);
    }

    function getApprovedPPAByID(uint _id) public view returns (address, address, uint, uint, uint){
        activeppa storage _Actppa = listOfAppas[_id];
        return(_Actppa.producer, _Actppa.buyer, _Actppa.kwhPrice, _Actppa.startDay, _Actppa.endDay);
    }
}