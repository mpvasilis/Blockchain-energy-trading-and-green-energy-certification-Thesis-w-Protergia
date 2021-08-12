pragma solidity >=0.4.21 <0.9.0;
pragma experimental ABIEncoderV2;

contract owned {
    
    address owner;
    
    constructor() public {
        owner = msg.sender;
    }
    
    modifier onlyOwner {
        require(msg.sender == owner, "Only owner can call this function.");
         _;
    }
}

//Contract that allows battery address to be registered
contract batteryRegistry is owned {

    struct battery {
        address batteryID;            //battery wallet address
        string uuID;                  //id of battery
        uint timestamp;
        bool isExist;                 //Check if battery exists
    }

    //mapping address as key to struct battery with mapping name batteries
    mapping (address => battery) batteries;
    battery[] listOfBatteries;

    modifier onlyRegisteredBattery{
         require(batteries[msg.sender].isExist==true, "Only registered batteries have access");
         _;
     }

    //add a battery by eth account address
    function addNewBattery (string memory uuID) public {
        require(batteries[msg.sender].isExist==false, "Battery details already added");
        //batteries[msg.sender] = battery(msg.sender, uuID, date, block.timestamp, true);

        listOfBatteries.push(battery({
            batteryID: msg.sender,
            uuID: uuID,
            timestamp: block.timestamp,
            isExist: true
            }));
    }

    //to view all batteries
    function viewAllBatteries () public view returns (battery[] memory) {
        return listOfBatteries;
    }

    function getCountOfBatteries () public view returns (uint count) {
        return listOfBatteries.length;
    }

    //change details of a battery
    function updateBattery(address batteryID, string memory uuID) public onlyRegisteredBattery {
        for(uint i = 0; i<listOfBatteries.length; i++){
            if(listOfBatteries[i].batteryID == batteryID){
                listOfBatteries[i].uuID = uuID;
                //batteries[batteryID].uuID = uuID;
            }
        }
    }

    //view single battery by battery id
    function getBatteryByID(address batteryID) public view returns (address, string memory, uint){
        return (batteries[batteryID].batteryID, batteries[batteryID].uuID, batteries[batteryID].timestamp);
    }

    //This function created in order to help us in unit test
    function getBatteryByLength(uint _idbat) public view returns(address, string memory, uint){
        battery storage _bat = listOfBatteries[_idbat];
        return(_bat.batteryID, _bat.uuID, _bat.timestamp);
    }
}

contract energyBid is owned, batteryRegistry {

    //event offerEnergyMade(address indexed sellerBatteryID, uint32 indexed day, uint32 indexed price, uint64 energy);
    //event buyEnergyMade(address indexed sellerBatteryID, uint32 indexed day, uint32 price, uint64 energy, address indexed batteryID);

    uint constant mWh = 1;
    uint constant  Wh = 1000 * mWh;
    uint constant kWh = 1000 * Wh;
    uint constant MWh = 1000 * kWh;
    uint constant GWh = 1000 * MWh;
    uint constant TWh = 1000 * GWh;

    //uint uinversalPrice = 2; //Energy market price per kWh (ex. 2euro/kWh, the price is trial)

    struct bid {
        address prosumerID;    
        uint numberOfBid;    //A battery can create more than one energy offer
        uint energy;         //energy to trade
        uint eprice;         //Energy market price per kWh
        uint timestamp;      //timestamp for when the bid was created
    }
    
    struct ask {
        address consumerID;
        uint energy;
        uint timestamp;
        uint remainingEnergy;
    }

    //struct to store all energy purchases
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

    mapping(address => mapping(uint => uint)) bids;
    bid[] listOfBids;
    uint nextNumberOfBid;                                    

    //create energy offer 
    //There is a minimum energy requirement 
    //Only registered batteries can use this function
    function energyOffer(uint _energy, uint _eprice) public onlyRegisteredBattery {
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh(in whs), for instance 5.6kwhs = 5600whs");

        listOfBids.push(bid({
            prosumerID: msg.sender,
            numberOfBid: nextNumberOfBid,
            energy: _energy,
            eprice: _eprice,
            timestamp: block.timestamp
        }));
        nextNumberOfBid++;
        bidEnergyTrading(listOfBids[listOfBids.length-1]);
    }

    //make ask request and buy energy from available bids
    function askEnergy(uint _energy) public onlyRegisteredBattery {
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh (in whs), for instance 5.6kwhs = 5600whs");

        listOfAsks.push(ask({
            consumerID: msg.sender,
            energy: _energy,
            timestamp: block.timestamp,
            remainingEnergy: _energy
        }));
        askEnergyTrading(listOfAsks[listOfAsks.length-1]);
    }

    //core function for energy trading (ask case)
    function askEnergyTrading(ask memory _ask) private onlyRegisteredBattery {
        //require(listOfBids.length > 0, "There is no energy offer");

        uint remainingEnergy = _ask.remainingEnergy;

        for(uint i = 0; i<listOfBids.length; i++){

            address _prosumerID;
            bool isEnergyPurchased = false;
            uint energyPurchased = 0;
            uint _price = 0;

            if(listOfBids[i].energy < remainingEnergy){
                _prosumerID = listOfBids[i].prosumerID;
                energyPurchased = listOfBids[i].energy; 
                remainingEnergy = remainingEnergy - listOfBids[i].energy;
                listOfAsks[i].remainingEnergy = remainingEnergy;//-----
                _price = listOfBids[i].eprice*energyPurchased; //price per kWh
                listOfBids[i].energy = 0;

                isEnergyPurchased = true;

                //remove energy offer from the list if energy is zero
                if (listOfBids.length > 1) {
                    listOfBids[i] = listOfBids[listOfBids.length-1];
                }
                listOfBids.length--;
                i--;//-----

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
                    consumerID: msg.sender,
                    prosumerID: _prosumerID,
                    energy: energyPurchased,
                    price: _price,
                    timestamp: _ask.timestamp
                }));
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

    /////Energy trading for bid case 
    function bidEnergyTrading(bid memory _bid) private onlyRegisteredBattery {
        uint _remainingBidEnergy = _bid.energy;

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

    //list of all ask energy requests
    function viewAllAsks () public view returns (ask[] memory){
        return listOfAsks;
    }

    function getCountOfAsks () public view returns (uint count){
        return listOfAsks.length;
    }

    //view single ask energy request by batteryID
    function getAskByBatteryId (address _consumerID) public view returns (address, uint, uint){
        uint indexA = asks[_consumerID];
        require(listOfAsks.length > indexA, "Wrong index");
        require(listOfAsks[indexA].consumerID == _consumerID, "Wrong Battery Id");
        return (listOfAsks[indexA].consumerID, listOfAsks[indexA].timestamp, listOfAsks[indexA].energy);
    }

    //list of all energy purchases
    function viewAllEnergyPurchases () public view returns (buyedEnergy[] memory){
        return listOfBuyedEnergy;
    }

    //view all bids 
    function viewAllBids () public view returns (bid[] memory){
      return listOfBids;
    }

    function getCountOfBids () public view returns (uint count){
        return listOfBids.length;
    }

    //view single bid by batteryID
    function getBidByBatteryID (address prosumerID, uint numberOfBid) public view returns (uint, uint, uint){
        uint index = bids[prosumerID][numberOfBid];
        require(listOfBids.length > index, "Wrong index");
        require(listOfBids[index].prosumerID == prosumerID, "Wrong ID");
        return (listOfBids[index].numberOfBid, listOfBids[index].timestamp, listOfBids[index].energy);
    }

    //Functions "getBidsByLength" and "getAsksByLength" are only for unit test
    function getBidsByLength (uint _idbid) public view returns (address, uint, uint){
        bid storage _bid = listOfBids[_idbid];
        return(_bid.prosumerID, _bid.timestamp, _bid.energy);
    }

    function getAsksByLength (uint _idask) public view returns (address, uint, uint){
        ask storage _ask = listOfAsks[_idask];
        return(_ask.consumerID, _ask.timestamp, _ask.energy);
    }
}