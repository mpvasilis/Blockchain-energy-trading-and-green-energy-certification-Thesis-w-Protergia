pragma solidity >=0.4.21 <0.9.0;

import "src/contracts/SafeMath.sol";
import "src/contracts/Counters.sol";

contract Marketplace {

    using Counters for Counters.Counter;
    Counters.Counter private ID;

    event onBidEnergy(address indexed seller, uint indexed day, uint indexed price, uint energy);
    event onAskEnergy(address indexed buyer, uint indexed day, uint indexed price, uint energy);
    event onPurchased(address indexed seller, address indexed buyer, uint indexed day, uint energy);

    uint constant cent = 1;
    uint constant dollar = 100 * cent;

    uint constant mWh = 1;
    uint constant  Wh = 1000 * mWh;
    uint constant kWh = 1000 * Wh;
    uint constant MWh = 1000 * kWh;
    uint constant GWh = 1000 * MWh;
    uint constant TWh = 1000 * GWh;

    struct eBid {
        address seller;
        uint idOfBid;
        uint energy;
        uint eprice;
        uint timestamp;
    }

    mapping(uint => uint) ebids;
    eBid[] listOfEnergyBids;
    
    struct eAsk {
        address buyer;
        uint idOfAsk;
        uint energy;
        uint price;
        uint timestamp;
    }

    mapping(uint => uint) easks;
    eAsk[] listOfEnergyAsks;

    struct ePurchases {
        address buyer;
        address seller;
        uint energy;
        uint id;
        uint price;
        uint timestamp;
    }

    mapping(uint => uint) epurchases;
    ePurchases[] listOfPurchases;

    function energyBid(uint _energy, uint _eprice) public {
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh(in whs), for instance 5.6kwhs = 5600whs");
        require(_eprice >= cent, "Price in 'cent', for example 1.5dollars/kwh = 150cents/kwh");
        address currentAddr = msg.sender;
        ID.increment();
        uint currentID = ID.current();
        uint idx = ebids[currentID];
        idx = listOfEnergyBids.length;
        ebids[currentID] = idx;
        listOfEnergyBids.push(eBid({
            seller: currentAddr,
            idOfBid: currentID,
            energy: _energy,
            eprice: _eprice,
            timestamp: block.timestamp
        }));
        emit onBidEnergy(currentAddr, block.timestamp, _eprice, _energy);
    }

    function energyAsk(uint _energy, uint _price) public {
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh(in whs), for instance 5.6kwhs = 5600whs");
        address currentAddr = msg.sender;
        ID.increment();
        uint currentID = ID.current();
        listOfEnergyAsks.push(eAsk({
            buyer: currentAddr,
            idOfAsk: currentID,
            energy: _energy,
            price: _price,
            timestamp: block.timestamp
        }));
        emit onAskEnergy(currentAddr, block.timestamp, _price, _energy);
    }

    function buyBid(uint _id, uint amount) public{
        address currentAddr = msg.sender;
        address _seller;
        uint index = 0;
        uint idx = epurchases[_id];
        bool isEnergyPurchased = false;
        uint _price = 0;
        uint energyPurchased = 0;
        for(uint i = 0; i<listOfEnergyBids.length; i++){
            if(listOfEnergyBids[i].idOfBid == _id){
                if(listOfEnergyBids[i].energy < amount){
                    _seller = listOfEnergyBids[i].seller;
                    energyPurchased = listOfEnergyBids[i].energy;
                    _price = energyPurchased*listOfEnergyBids[i].eprice;
                    amount = amount-energyPurchased;
                    ID.increment();
                    uint currentID = ID.current();
                    index = easks[currentID];
                    index = listOfEnergyAsks.length;
                    easks[currentID] = idx;
                    listOfEnergyAsks.push(eAsk({
                        buyer: currentAddr,
                        idOfAsk: currentID,
                        energy: amount,
                        price: listOfEnergyBids[i].eprice,
                        timestamp: block.timestamp
                    }));
                    emit onAskEnergy(currentAddr, block.timestamp, listOfEnergyBids[i].eprice, amount);

                    isEnergyPurchased = true;

                    if (listOfEnergyBids.length > 1) {
                        listOfEnergyBids[i] = listOfEnergyBids[listOfEnergyBids.length-1];
                    }
                    listOfEnergyBids.length--;
                    //i--;

                }else if(listOfEnergyBids[i].energy == amount){
                    _seller = listOfEnergyBids[i].seller;
                    energyPurchased = amount;
                    _price = energyPurchased*listOfEnergyBids[i].eprice;

                    isEnergyPurchased = true;

                    if (listOfEnergyBids.length > 1) {
                        listOfEnergyBids[i] = listOfEnergyBids[listOfEnergyBids.length-1];
                    }
                    listOfEnergyBids.length--;

                }else{
                    _seller = listOfEnergyBids[i].seller;
                    energyPurchased = amount;
                    _price = energyPurchased * listOfEnergyBids[i].eprice;
                    listOfEnergyBids[i].energy = listOfEnergyBids[i].energy-energyPurchased;

                    isEnergyPurchased = true;
                }

                if(isEnergyPurchased){
                    idx = listOfPurchases.length;
                    epurchases[_id] = idx;
                    listOfPurchases.push(ePurchases({
                        buyer: currentAddr,
                        seller: _seller,
                        energy: energyPurchased,
                        id: listOfEnergyBids[i].idOfBid,
                        price: _price,
                        timestamp: block.timestamp
                    }));
                    emit onPurchased(_seller, currentAddr, block.timestamp, energyPurchased);
                }
            }
        }
    }
        
    function buyAsk(uint _id, uint amount) public {
        address currentAddr = msg.sender;
        address _buyer;
        uint index = 0;
        uint idx = epurchases[_id];
        bool isEnergyPurchased = false;
        uint _price = 0;
        uint energyPurchased = 0;
        for(uint i = 0; i<listOfEnergyAsks.length; i++){
            if(listOfEnergyAsks[i].idOfAsk == _id){
                if(listOfEnergyAsks[i].energy < amount){
                    _buyer = listOfEnergyAsks[i].buyer;
                    energyPurchased = listOfEnergyAsks[i].energy;
                    _price = energyPurchased*listOfEnergyAsks[i].price;
                    amount = amount - energyPurchased;
                    ID.increment();
                    uint currentID = ID.current();
                    index = easks[currentID];
                    index = listOfEnergyAsks.length;
                    easks[currentID] = idx;
                    listOfEnergyAsks.push(eAsk({
                        buyer: currentAddr,
                        idOfAsk: currentID,
                        energy: amount,
                        price: listOfEnergyAsks[i].price,
                        timestamp: block.timestamp
                    }));

                    isEnergyPurchased = true;

                    if (listOfEnergyAsks.length > 1) {
                        listOfEnergyAsks[i] = listOfEnergyAsks[listOfEnergyBids.length-1];
                    }
                    listOfEnergyAsks.length--;
                    //i--;

                }else if(listOfEnergyAsks[i].energy == amount){
                    _buyer = listOfEnergyAsks[i].buyer;
                    energyPurchased = amount;
                    _price = energyPurchased * listOfEnergyAsks[i].price;

                    isEnergyPurchased = true;

                    if (listOfEnergyAsks.length > 1) {
                        listOfEnergyAsks[i] = listOfEnergyAsks[listOfEnergyAsks.length-1];
                    }
                    listOfEnergyAsks.length--;

                }else{
                    _buyer = listOfEnergyAsks[i].buyer;
                    energyPurchased = amount;
                    _price = energyPurchased * listOfEnergyAsks[i].price;
                    listOfEnergyAsks[i].energy = listOfEnergyAsks[i].energy-energyPurchased;

                    isEnergyPurchased = true;
                }

                if(isEnergyPurchased){
                    idx = listOfPurchases.length;
                    epurchases[_id] = idx;
                    listOfPurchases.push(ePurchases({
                        buyer: _buyer,
                        seller: currentAddr,
                        energy: energyPurchased,
                        id: listOfEnergyAsks[i].idOfAsk,
                        price: _price,
                        timestamp: block.timestamp
                    }));
                    emit onPurchased(currentAddr, _buyer, block.timestamp, energyPurchased);
                }
            }
        }
    }

    function getBidByID(uint _id) public view returns(address, uint, uint, uint, uint){
        uint index = ebids[_id];
        require(listOfEnergyBids.length > index, "Wrong index");
        require(listOfEnergyBids[index].idOfBid == _id, "Wrong ID");
        return(listOfEnergyBids[index].seller, listOfEnergyBids[index].idOfBid, listOfEnergyBids[index].energy, listOfEnergyBids[index].eprice, listOfEnergyBids[index].timestamp);
    }

    function getAskByID(uint _id) public view returns(address, uint, uint, uint, uint){
        uint index = ebids[_id];
        require(listOfEnergyAsks.length > index, "Wrong index");
        require(listOfEnergyAsks[index].idOfAsk == _id, "Wrong ID");
        return(listOfEnergyAsks[index].buyer, listOfEnergyAsks[index].idOfAsk, listOfEnergyAsks[index].energy, listOfEnergyAsks[index].price, listOfEnergyAsks[index].timestamp);
    }

    function getAllBids() public view returns(address[] memory, uint[] memory, uint[] memory, uint[] memory, uint[] memory){
        address[] memory seller = new address[](listOfEnergyBids.length);
        uint[] memory ids = new uint[](listOfEnergyBids.length);
        uint[] memory energies = new uint[](listOfEnergyBids.length);
        uint[] memory prices = new uint[](listOfEnergyBids.length);
        uint[] memory dates = new uint[](listOfEnergyBids.length);
        for(uint i = 0; i < listOfEnergyBids.length; i++){
            seller[i] = listOfEnergyBids[i].seller;
            ids[i] = listOfEnergyBids[i].idOfBid;
            energies[i] = listOfEnergyBids[i].energy;
            prices[i] = listOfEnergyBids[i].eprice;
            dates[i] = listOfEnergyBids[i].timestamp;
        }
        return(seller, ids, energies, prices, dates);
    }

    function getAllAsks() public view returns(address[] memory, uint[] memory, uint[] memory, uint[] memory, uint[] memory){
        address[] memory buyers = new address[](listOfEnergyAsks.length);
        uint[] memory _ids = new uint[](listOfEnergyAsks.length);
        uint[] memory _energies = new uint[](listOfEnergyAsks.length);
        uint[] memory _prices = new uint[](listOfEnergyAsks.length);
        uint[] memory _dates = new uint[](listOfEnergyAsks.length);
        for(uint i = 0; i < listOfEnergyAsks.length; i++){
            buyers[i] = listOfEnergyAsks[i].buyer;
            _ids[i] = listOfEnergyAsks[i].idOfAsk;
            _energies[i] = listOfEnergyAsks[i].energy;
            _prices[i] = listOfEnergyAsks[i].price;
            _dates[i] = listOfEnergyAsks[i].timestamp;
        }
        return(buyers, _ids, _energies, _prices, _dates);
    }

    function getCountOfPurchases() public view returns(uint){
        address currentAddr = msg.sender;
        uint count = 0;
        for(uint i = 0; i<listOfPurchases.length; i++){
            if((listOfPurchases[i].buyer == currentAddr) || (listOfPurchases[i].seller == currentAddr)){
                count++;
            }
        }
        return count;
    }

    function getPurchases() public view returns(address[] memory, address[] memory, uint[] memory, uint[] memory, uint[] memory, uint[] memory){
        uint k = 0;
        uint cnt = getCountOfPurchases();
        address[] memory buyerList = new address[](cnt);
        address[] memory sellerList = new address[](cnt);
        uint[] memory energyList = new uint[](cnt);
        uint[] memory idList = new uint[](cnt);
        uint[] memory priceList = new uint[](cnt);
        uint[] memory dateList = new uint[](cnt);

        for(uint i = 0; i < listOfPurchases.length; i++){
            if((listOfPurchases[i].buyer == msg.sender) || (listOfPurchases[i].seller == msg.sender)){
                buyerList[k] = listOfPurchases[i].buyer;
                sellerList[k] = listOfPurchases[i].seller;
                energyList[k] = listOfPurchases[i].energy;
                idList[k] = listOfPurchases[i].id;
                priceList[k] = listOfPurchases[i].price;
                dateList[k] = listOfPurchases[i].timestamp;
                k++;
            }
        }
        return(buyerList, sellerList, energyList, idList, priceList, dateList);
    }
}