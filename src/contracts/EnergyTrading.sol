pragma solidity >=0.4.21 <0.9.0;

import "src/contracts/EPA.sol";

//Contract that allows device address to be registered
contract deviceRegistry {

    event deviceAdded(address indexed ownerOfDevice, uint date, string id);
    event deviceUpdated(address indexed ownerOfDevice, uint date, string id);

    //@notice Struct to store all devices 
    //@dev ownerOfDevice is the current address which the device is connected
    //@dev typeOfDevice, PV, EV, Solar, Biomass, Hydo Turbine or battery(Multiple)
    //@dev isExist to match the registered device with bool value.
    struct device {
        address ownerOfDevice;
        string typeOfDevice;
        uint timestamp;
        bool isExist;
    }

    //@notice Mapping address as key to struct battery with mapping name batteries
    mapping (address => device) devices;

    modifier onlyRegisteredDevice{
         require(devices[msg.sender].isExist==true, "Only registered devices have access");
         _;
     }

    //@notice Add a battery by address.
    //@dev Only one device can register by each address.
    function addDevice (string memory typeOfDevice) public {
        require(devices[msg.sender].isExist==false, "Device details already added");
        devices[msg.sender] = device(msg.sender, typeOfDevice, block.timestamp, true);
        emit deviceAdded(msg.sender, block.timestamp, typeOfDevice);
    }

    //@notice Change details of a battery.
    //@dev Only registered devices have access to this function.
    function updateDevice(address ownerOfDevice, string memory typeOfDevice) public onlyRegisteredDevice {
        devices[ownerOfDevice].typeOfDevice = typeOfDevice;
        uint day = block.timestamp;
        emit deviceUpdated(ownerOfDevice, day, typeOfDevice);
    }

    //@notice Get signle device details from specific address
    function getDeviceByAddress(address deviceID) public view returns (address, string memory, uint){
        return (devices[deviceID].ownerOfDevice, devices[deviceID].typeOfDevice, devices[deviceID].timestamp);
    }
}

contract EnergyTrading is deviceRegistry, EPA {

    event offerEnergyNotifier(address indexed seller, uint indexed day, uint indexed price, uint energy);
    event askEnergyNotifier(address indexed buyer, uint indexed day, uint energy);

    //@notice To deal with decimal, must to set a minimum value.
    //@dev For prices, the solution for decimal values is the "cent" i.e. 1.5dollars = 150cents.
    //@dev For kWhs, mWhs set as a lower value i.e. 0.4kWhs = 400.000mWhs.
    uint constant cent = 1;
    uint constant dollar = 100 * cent;

    uint constant mWh = 1;
    uint constant  Wh = 1000 * mWh;
    uint constant kWh = 1000 * Wh;
    uint constant MWh = 1000 * kWh;
    uint constant GWh = 1000 * MWh;
    uint constant TWh = 1000 * GWh;

    //@notice Structs
    //@dev A device can create more than one energy offer
    struct bid {
        address prosumerID;
        uint numberOfBid;
        uint energy;
        uint eprice;
        uint timestamp;
    }
    
    struct ask {
        address consumerID;
        uint energy;
        uint timestamp;
        uint remainingEnergy;
    }

    struct buyedEnergy {
        address consumerID;
        address prosumerID;
        uint energy;
        uint price;
        uint timestamp;
    }
    
    mapping(address => uint) asks; 
    ask[] listOfAsks;

    buyedEnergy[] listOfBuyedEnergy;

    mapping(address => uint) bids;
    bid[] listOfBids;
    uint nextNumberOfBid;                                    

    //@notice Create energy offer 
    //@dev There is a minimum energy requirement 
    //@dev Only registered devices can use this function
    //@dev If there is available ask request, when you make a bid then the kWhs automatically sold.
    function energyOffer(uint _energy, uint _eprice) public onlyRegisteredDevice {
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh(in whs), for instance 5.6kwhs = 5600whs");
        require(_eprice >= cent, "Price in 'cent', for example 1.5dollars/kwh = 150cents/kwh");
        address currentAddress = msg.sender;
        listOfBids.push(bid({
            prosumerID: currentAddress,
            numberOfBid: nextNumberOfBid,
            energy: _energy,
            eprice: _eprice,
            timestamp: block.timestamp
        }));
        nextNumberOfBid++;

        emit offerEnergyNotifier(msg.sender, block.timestamp, _eprice, _energy);
        EPAs(currentAddress, _eprice, _energy);
        bidEnergyTrading(listOfBids[listOfBids.length-1]);
    }

    //@notice Make ask request and buy energy from available bids
    //@dev Ask a minimum energy of 1kWh = 1.000.000mWhs.
    //@dev Each time you request for energy, bid will be searched automatically.
    function askEnergy(uint _energy) public onlyRegisteredDevice {
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh (in whs), for instance 5.6kwhs = 5600whs");

        listOfAsks.push(ask({
            consumerID: msg.sender,
            energy: _energy,
            timestamp: block.timestamp,
            remainingEnergy: _energy
        }));

        emit askEnergyNotifier(msg.sender, block.timestamp, _energy);

        askEnergyTrading(listOfAsks[listOfAsks.length-1]);
    }

    //@notice Energy trading (ask case).
    //@param remainingEnergy use for store the incompleted energy.
    //@param isEnergyPurchased to let us know if energy trading was made.
    //@param energyPurchased to see how much energy we bought. 
    //@dev When a purchase is made, bid removed from the list and 
    //@dev is replaced by the last item on the list.
    //@dev Purchased energy store to another list "listOfbuyedEnergy".
    //@dev At the end of each transaction-purchase, the market price calculated as well.
    function askEnergyTrading(ask memory _ask) private onlyRegisteredDevice {

        uint remainingEnergy = _ask.remainingEnergy;

        for(uint i = 0; i<listOfBids.length; i++){

            address _prosumerID;
            address currentAddr = msg.sender;
            bool isEnergyPurchased = false;
            uint energyPurchased = 0;
            uint _price = 0;

            if(listOfBids[i].energy < remainingEnergy){
                _prosumerID = listOfBids[i].prosumerID;
                energyPurchased = listOfBids[i].energy; 
                remainingEnergy = remainingEnergy - listOfBids[i].energy;
                listOfAsks[i].remainingEnergy = remainingEnergy;
                _price = listOfBids[i].eprice*energyPurchased;
                listOfBids[i].energy = 0;

                isEnergyPurchased = true;

                //remove energy offer from the list if energy is zero
                if (listOfBids.length > 1) {
                    listOfBids[i] = listOfBids[listOfBids.length-1];
                }
                listOfBids.length--;
                i--;

            }else if(listOfBids[i].energy == remainingEnergy){
                _prosumerID = listOfBids[i].prosumerID;
                energyPurchased = remainingEnergy;
                _price = listOfBids[i].eprice*energyPurchased;
                listOfBids[i].energy = 0;
                remainingEnergy = 0;

                isEnergyPurchased = true;

                if (listOfBids.length > 1) {
                    listOfBids[i] = listOfBids[listOfBids.length-1];
                }
                listOfBids.length--;

            }else{
                _prosumerID = listOfBids[i].prosumerID;
                energyPurchased = remainingEnergy;
                listOfBids[i].energy = listOfBids[i].energy - remainingEnergy;
                _price = listOfBids[i].eprice*energyPurchased;
                remainingEnergy = 0;

                isEnergyPurchased = true;
            }

            //store purchase 
            if(isEnergyPurchased){
                listOfBuyedEnergy.push(buyedEnergy({
                    consumerID: currentAddr,
                    prosumerID: _prosumerID,
                    energy: energyPurchased,
                    price: _price,
                    timestamp: _ask.timestamp
                }));
                claimEPA(_prosumerID, currentAddr, energyPurchased, _price);
            }

            //remove ask request from list 
            if(remainingEnergy == 0){
                if (listOfAsks.length > 1){
                    listOfAsks[i] = listOfAsks[listOfAsks.length-1];
                }
                listOfAsks.length--;
                break ;
            }
        }
    }

    //@notice Energy Trading (bid case)
    function bidEnergyTrading(bid memory _bid) private onlyRegisteredDevice {
        uint _remainingBidEnergy = _bid.energy;
        address currentAddr = msg.sender;

        for(uint i = 0; i<listOfAsks.length; i++){
            
            address _consumerID;
            bool isEnergyPurchased = false;
            uint energyPurchased = 0;
            uint _price = 0;
            if(listOfAsks[i].remainingEnergy < _remainingBidEnergy){
                _consumerID = listOfAsks[i].consumerID;
                energyPurchased = listOfAsks[i].remainingEnergy;
                _remainingBidEnergy = _remainingBidEnergy - energyPurchased;
                listOfBids[i].energy = _remainingBidEnergy;
                _price = _bid.eprice*energyPurchased;
                listOfAsks[i].remainingEnergy = 0;

                isEnergyPurchased = true;

                if(listOfAsks.length > 1){
                    listOfAsks[i] = listOfAsks[listOfAsks.length-1];
                }
                listOfAsks.length--;
                i--;

            }else if(listOfAsks[i].remainingEnergy == _remainingBidEnergy){
                _consumerID = listOfAsks[i].consumerID;
                energyPurchased = _remainingBidEnergy;
                _price = _bid.eprice*energyPurchased;
                _remainingBidEnergy = 0;
                listOfAsks[i].remainingEnergy = 0;

                isEnergyPurchased = true;

                if(listOfAsks.length > 1){
                    listOfAsks[i] = listOfAsks[listOfAsks.length-1];
                }
                listOfAsks.length--;

            }else{
                _consumerID = listOfAsks[i].consumerID;
                energyPurchased = _remainingBidEnergy;
                listOfAsks[i].remainingEnergy = listOfAsks[i].remainingEnergy - energyPurchased;
                _price = _bid.eprice*energyPurchased;
                _remainingBidEnergy = 0;

                isEnergyPurchased = true;
            }

            if(isEnergyPurchased){
                listOfBuyedEnergy.push(buyedEnergy({
                    consumerID: _consumerID,
                    prosumerID: msg.sender,
                    energy: energyPurchased,
                    price: _price,
                    timestamp: _bid.timestamp
                }));
                claimEPA(currentAddr, _consumerID, energyPurchased, _price);
            }

            if(_remainingBidEnergy == 0){
                if(listOfBids.length > 1){
                    listOfBids[i] = listOfBids[listOfBids.length-1];
                }
                listOfBids.length--;
                break;
            }
        }
    }

    //@notice Get functions
    //@dev All viewers are tailormade for front end. 
    //@dev each function go through the lists,  split the data and store the values to the corresponding lists.
    //@param offset to difene the point from which we want to receive data from a list. 
    //@param n to get a specific number of details. 
    function viewAllAsks (uint n, uint offset) public view returns (address[] memory, uint[] memory, uint[] memory, uint[] memory){
        require(n>0, "n must be greater than 0");
        if(n>listOfAsks.length) n=listOfAsks.length;
        uint x = 0;
        x = listOfAsks.length - offset;
        address[] memory _consumers = new address[](x);
        uint[] memory _dates = new uint[](x);
        uint[] memory _energyList = new uint[](x);
        uint[] memory _remainingEnList = new uint[](x);
        for(uint i = offset; i < n+offset; i++){
            if(i>listOfAsks.length) break;
            x = i-offset;
            _consumers[x] = listOfAsks[i].consumerID;
            _dates[x] = listOfAsks[i].timestamp;
            _energyList[x] = listOfAsks[i].energy;
            _remainingEnList[x] = listOfAsks[i].remainingEnergy;
        }
        return(_consumers, _dates, _energyList, _remainingEnList);
    }

    function viewAllEnergyPurchases (uint n, uint offset) public view returns (address[] memory, address[] memory, uint[] memory, uint[] memory, uint[] memory){
        require(n>0, "n must be greater than 0");
        if(n>listOfBuyedEnergy.length) n=listOfBuyedEnergy.length;
        uint x = 0;
        x = listOfBuyedEnergy.length - offset;
        address[] memory _prosumers = new address[](x);
        address[] memory _consumersList= new address[](x);
        uint[] memory _prchsEnergy = new uint[](x);
        uint[] memory _prices = new uint[](x);
        uint[] memory _time = new uint[](x);
        for(uint i = offset; i < n+offset; i++){
            if(i>listOfBuyedEnergy.length) break;
            x = i-offset;
            _prosumers[x] = listOfBuyedEnergy[i].prosumerID;
            _consumersList[x] = listOfBuyedEnergy[i].consumerID;
            _prchsEnergy[x] = listOfBuyedEnergy[i].energy;
            _prices[x] = listOfBuyedEnergy[i].price;
            _time[x] = listOfBuyedEnergy[i].timestamp;
        }
        return(_prosumers, _consumersList, _prchsEnergy, _prices, _time);
    }

    function viewAllBids (uint n, uint offset) public view returns (address[] memory, uint[] memory, uint[] memory, uint[] memory){
        require(n>0, "n must be greater than 0");
        if(n>listOfBids.length) n=listOfBids.length;
        uint x = 0;
        x = listOfBids.length - offset;
        address[] memory prosumers = new address[](x);
        uint[] memory dates = new uint[](x);
        uint[] memory energyList = new uint[](x);
        uint[] memory prices = new uint[](x);
        for(uint i = offset; i < n+offset; i++){
            if(i>=listOfBids.length) break;
            x = i-offset;
            prosumers[x] = listOfBids[i].prosumerID;
            dates[x] = listOfBids[i].timestamp;
            energyList[x] = listOfBids[i].energy;
            prices[x] = listOfBids[i].eprice;
        }
        return(prosumers, dates, energyList, prices);
    }

    function getCountOfAsks () public view returns (uint count){
        return listOfAsks.length;
    }

    function getCountOfBids () public view returns (uint count){
        return listOfBids.length;
    }

    function getCountOfPurchases () public view returns (uint count){
        return listOfBuyedEnergy.length;
    }

    function getPurchaseByIndex (uint _index) public view returns (address, address, uint, uint, uint){
        buyedEnergy storage _purchases = listOfBuyedEnergy[_index];
        return(_purchases.prosumerID, _purchases.consumerID, _purchases.energy, _purchases.price, _purchases.timestamp);
    }

    function getBidsByIndex (uint _index) public view returns (address, uint, uint, uint){
        bid storage _bid = listOfBids[_index];
        return(_bid.prosumerID, _bid.energy, _bid.eprice, _bid.timestamp);
    }

    function getAsksByIndex (uint _index) public view returns (address, uint, uint, uint){
        ask storage _ask = listOfAsks[_index];
        return(_ask.consumerID, _ask.energy, _ask.timestamp, _ask.remainingEnergy);
    }
}