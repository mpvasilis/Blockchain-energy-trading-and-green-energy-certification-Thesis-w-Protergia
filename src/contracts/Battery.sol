pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

/********owned Contract********/
//Create a contract owner
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

/********batteryRegistry Contract********/
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

/********energyBid Contract********/
//Contract for energy offers from current batteries
contract energyBid is owned, batteryRegistry {

    //event offerEnergyMade(address indexed sellerBatteryID, uint32 indexed day, uint32 indexed price, uint64 energy);
    //event buyEnergyMade(address indexed sellerBatteryID, uint32 indexed day, uint32 price, uint64 energy, address indexed batteryID);

    uint64 constant mWh = 1;
    uint64 constant Wh = 1000 * mWh;
    uint64 constant kWh = 1000 * Wh;
    uint64 constant MWh = 1000 * kWh;
    uint64 constant GWh = 1000 * MWh;
    uint64 constant TWh = 1000 * GWh;

    struct bid{
        address producerID;    //battery public key
        uint numberOfBid;      //A battery can create more than one energy offer
        uint32 day;            //day for which the offer is valid
        uint64 energy;         //energy to trade
        uint64 timestamp;      //timestamp for when the bid was created
    }
    
    struct ask {
        address producerID;    //battery id from produser 
        uint64 energy;
        uint64 timestamp;
        uint32 day;
        address consumerID;    //battery id from registered battery (consumer)
    }
    
    mapping(address => uint) asks; 
    ask[] listOfAsks;

    mapping(address => mapping(uint32 => mapping(uint=> uint))) bids;
    bid[] listOfBids;
    uint nextNumberOfBid;                                           

    //create energy offer 
    //There is a minimum energy requirement 
    //Only registered batteries can use this function
    function energyOffer(uint32 _day, uint64 _energy, uint64 _timestamp) public onlyRegisteredBattery {
        require(batteries[msg.sender].isExist==true, "Battery details are not exist");
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh (1.000.000mWh)");
        uint index = bids[msg.sender][_day][nextNumberOfBid];

        index = listOfBids.length;
        bids[msg.sender][_day][nextNumberOfBid] = index;
        listOfBids.push(bid({
            producerID: msg.sender,
            numberOfBid: nextNumberOfBid,
            day: _day,
            energy: _energy,
            timestamp: _timestamp
        }));
        nextNumberOfBid++;
    }

    //view all bids 
    function viewAllBids () public view returns (bid[] memory){
      return listOfBids;
    }

    //view single bid by batteryID
    function getBidByBatteryID (address producerID, uint32 day, uint numberOfBid) public view returns (uint, uint32, uint64){
        uint index = bids[producerID][day][numberOfBid];
        require(listOfBids.length > index, "Wrong index");
        require(listOfBids[index].day == day, "There is no offer on this day");
        require(listOfBids[index].producerID == producerID, "Wrong ID");
        return (listOfBids[index].numberOfBid, listOfBids[index].day, listOfBids[index].energy);
    }

    //Ask and buy energy 
    //There is a minimum energy requirement 
    //Only registered batteries can use this function
    function askAndBuyEnergy(address _producerID, uint32 _day, uint64 _energy, uint64 _timestamp, uint _numberOfBid) public onlyRegisteredBattery {
        require(batteries[msg.sender].isExist==true, "Battery details are not exist");
        require(_energy >= kWh, "Require a minimum ask energy of 1 kWh (1.000.000mWh)");
        uint index = bids[_producerID][_day][_numberOfBid];
        
        //check if required energy exist
        if((listOfBids.length > index) && (listOfBids[index].energy >= _energy) && (listOfBids[index].producerID == _producerID) && (listOfBids[index].numberOfBid == _numberOfBid)){

            listOfBids[index].energy = listOfBids[index].energy - _energy; 

            //record data from consumer' s choice
            asks[msg.sender] = listOfAsks.length;
            listOfAsks.push(ask({
                producerID: _producerID,
                energy: _energy,
                timestamp: _timestamp,
                day: _day,
                consumerID: msg.sender
            }));
        } else {
            //if energy offer does not exist then, revert.
            revert();
        }
    }

    //list of all ask energy requests
    function viewAllAsks () public view returns (ask[] memory){
        return listOfAsks;
    }

    //view single ask energy request by batteryID
    function getAskByBatteryId (address _consumerID) public view returns (address, uint32, uint64){
        uint indexA = asks[_consumerID];
        require(listOfAsks.length > indexA, "Wrong index");
        require(listOfAsks[indexA].consumerID == _consumerID, "Wrong Battery Id");
        return (listOfAsks[indexA].producerID, listOfAsks[indexA].day, listOfAsks[indexA].energy);
        
    }
}