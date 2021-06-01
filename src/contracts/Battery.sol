pragma solidity >=0.4.21 <0.7.0;
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
        address batteryID;            //batteryID is Owner of battery ethereum address
        string nameOfBatteryOwner;    //Name of battery owner 
        uint32 date;                  //Creation date
        bool isExist;                 //Check if battery exist into addNewBattery function
    }

    //mapping address as key to struct battery with mapping name batteries
    mapping (address => battery) batteries;
    battery[] listOfBatteries;

    modifier onlyRegisteredBattery{
         require(batteries[msg.sender].isExist==true, "Only registered batteries have access");
         _;
     }

    //add a battery by eth account address
    function addNewBattery (string memory nameOfBatteryOwner, uint32 date) public {
        require(batteries[msg.sender].isExist==false, "Battery details already added");
        batteries[msg.sender] = battery(msg.sender, nameOfBatteryOwner, date, true);

        listOfBatteries.push(battery({
            batteryID: msg.sender,
            nameOfBatteryOwner: nameOfBatteryOwner,
            date: date,
            isExist: true
            }));
    }

    //to view all batteries
    function viewAllBatteries () public view returns (battery[] memory) {
        return listOfBatteries;
    }

    //change details of a battery
    function updateBattery(address batteryID, string memory nameOfBatteryOwner) public onlyRegisteredBattery {
        for(uint i = 0; i<listOfBatteries.length; i++){
            if(listOfBatteries[i].batteryID == batteryID){
                listOfBatteries[i].nameOfBatteryOwner = nameOfBatteryOwner;
                batteries[batteryID].nameOfBatteryOwner = nameOfBatteryOwner;
            }
        }
    }

    //view single battery by battery id
    function getBatteryByID(address batteryID) public view returns (address, string memory, uint32){
        return (batteries[batteryID].batteryID, batteries[batteryID].nameOfBatteryOwner, batteries[batteryID].date);
    }
}

contract energyBid is owned, batteryRegistry {

    //event offerEnergyMade(address indexed sellerBatteryID, uint32 indexed day, uint32 indexed price, uint64 energy);
    //event buyEnergyMade(address indexed sellerBatteryID, uint32 indexed day, uint32 price, uint64 energy, address indexed batteryID);

    //uint64 constant mWh = 1;
    //uint64 constant Wh = 1000 * mWh;
    //uint64 constant kWh = 1000 * Wh;
    //uint64 constant MWh = 1000 * kWh;
    //uint64 constant GWh = 1000 * MWh;
    //uint64 constant TWh = 1000 * GWh;

    struct bid{
        address prosumerID;    
        uint numberOfBid;      //A battery can create more than one energy offer
        uint32 day;            //day for which the offer is valid
        uint64 energy;         //energy to trade
        uint64 timestamp;      //timestamp for when the bid was created
    }
    
    struct ask {
        address consumerID;    
        uint64 energy;
        uint64 timestamp;
        uint32 day;
        uint64 remainingEnergy;
    }

    //struct to store all energy purchases
    struct buyedEnergy {
        address consumerID;
        address prosumerID;
        uint64 energy;
        uint32 day;
        uint64 timestamp;
    }
    
    mapping(address => uint) asks; 
    ask[] listOfAsks;

    buyedEnergy[] listOfBuyedEnergy;

    mapping(address => mapping(uint32 => mapping(uint=> uint))) public bids;
    bid[] public listOfBids;
    uint nextNumberOfBid;                                    

    //create energy offer 
    //There is a minimum energy requirement 
    //Only registered batteries can use this function
    function energyOffer(uint32 _day, uint64 _energy, uint64 _timestamp) public onlyRegisteredBattery {
        require(_energy >= 1000, "Wrong energy input require a minimum offer of 1 kWh (1000 Wh)");

        listOfBids.push(bid({
            prosumerID: msg.sender,
            numberOfBid: nextNumberOfBid,
            day: _day,
            energy: _energy,
            timestamp: _timestamp
        }));
        nextNumberOfBid++;
    }

    //make ask request and buy energy from available bids
    function askEnergy(uint32 _day, uint64 _energy, uint64 _timestamp) public onlyRegisteredBattery{
        require(_energy >= 1000, "Wrong energy input require a minimum offer of 1 kWh (1000 Wh)");

        listOfAsks.push(ask({
            consumerID: msg.sender,
            energy: _energy,
            timestamp: _timestamp,
            day: _day,
            remainingEnergy: _energy
        }));
        energyTrading(listOfAsks[listOfAsks.length-1]);
    }

    //core function for energy trading 
    function energyTrading(ask memory _ask) public onlyRegisteredBattery {
        require(listOfBids.length > 0, "There is no energy offer");

        uint64 remainingEnergy = _ask.remainingEnergy;//---

        for(uint i = 0; i<listOfBids.length; i++){

            address _prosumerID;
            bool isEnergyPurchased = false;
            uint64 energyPurchased = 0;
            bid[] storage _listOfBids = listOfBids;
            ask[] storage _listOfAsks = listOfAsks;

            if(listOfBids[i].energy < remainingEnergy){
                _prosumerID = listOfBids[i].prosumerID;
                energyPurchased = listOfBids[i].energy; //---
                _ask.remainingEnergy = remainingEnergy - listOfBids[i].energy;//---
                remainingEnergy = remainingEnergy - listOfBids[i].energy;
                listOfBids[i].energy = 0;

                isEnergyPurchased = true;

                //remove energy offer from the list if energy is zero
                if (listOfBids.length > 1) {
                    listOfBids[i] = listOfBids[listOfBids.length-1];
                }
                listOfBids.length--;

            }else if(listOfBids[i].energy == remainingEnergy){
                _prosumerID = listOfBids[i].prosumerID;
                energyPurchased = remainingEnergy;
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
                remainingEnergy = 0;

                isEnergyPurchased = true;
            }

            //store purchase 
            if(isEnergyPurchased){
                listOfBuyedEnergy.push(buyedEnergy({
                    consumerID: msg.sender,
                    prosumerID: _prosumerID,
                    energy: energyPurchased,
                    day: _ask.day,
                    timestamp: _ask.timestamp
                }));
            }

            //remove ask request from list 
            if(remainingEnergy == 0){
                //delete listOfAsks[i];
                //listOfAsks.length--;
                break ;
            }
        }
    }

    //list of all ask energy requests
    function viewAllAsks () public view returns (ask[] memory){
        return listOfAsks;
    }

    /*function View () public view returns (uint){
        return listOfBids.length;
    }*/

    //view single ask energy request by batteryID
    function getAskByBatteryId (address _consumerID) public view returns (address, uint32, uint64){
        uint indexA = asks[_consumerID];
        require(listOfAsks.length > indexA, "Wrong index");
        require(listOfAsks[indexA].consumerID == _consumerID, "Wrong Battery Id");
        return (listOfAsks[indexA].consumerID, listOfAsks[indexA].day, listOfAsks[indexA].energy);
    }

    //list of all energy purchases
    function viewAllEnergyPurchases () public view returns (buyedEnergy[] memory){
        return listOfBuyedEnergy;
    }

    //view all bids 
    function viewAllBids () public view returns (bid[] memory){
      return listOfBids;
    }

    //view single bid by batteryID
    function getBidByBatteryID (address prosumerID, uint32 day, uint numberOfBid) public view returns (uint, uint32, uint64){
        uint index = bids[prosumerID][day][numberOfBid];
        require(listOfBids.length > index, "Wrong index");
        require(listOfBids[index].day == day, "There is no offer on this day");
        require(listOfBids[index].prosumerID == prosumerID, "Wrong ID");
        return (listOfBids[index].numberOfBid, listOfBids[index].day, listOfBids[index].energy);
    }
}