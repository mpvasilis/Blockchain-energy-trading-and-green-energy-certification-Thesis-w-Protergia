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
         require(batteries[msg.sender].isExist==true, "only registered batteries have access");
         _;
     }

    //add a battery by eth account address
    function addNewBattery (string memory nameOfBatteryOwner, uint32 date) public onlyOwner {
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

    event offerEnergyMade(address indexed sellerBatteryID, uint32 indexed day, uint32 indexed price, uint64 energy);
    event buyEnergyMade(address indexed sellerBatteryID, uint32 indexed day, uint32 price, uint64 energy, address indexed batteryID);

    uint64 constant mWh = 1;
    uint64 constant Wh = 1000 * mWh;
    uint64 constant kWh = 1000 * Wh;
    uint64 constant MWh = 1000 * kWh;
    uint64 constant GWh = 1000 * MWh;
    uint64 constant TWh = 1000 * GWh;

    struct bid{
        address sellerBatteryID;    //battery public key
        uint numberOfBid;           //A battery can create more than one energy offer
        uint32 day;                 //day for which the offer is valid
        uint32 price;               //price vs market price
        uint64 energy;              //energy to trade
        uint64 timestamp;           //timestamp for when the bid was created
    }
    
    struct ask {
        address sellerBatteryID;    //battery id from prosumer 
        uint64 energy;
        uint32 price;
        uint64 timestamp;
        uint32 day;
        address batteryID;         //battery id from registered battery (consumer)
    }
    
    mapping(address => uint) asks; 
    ask[] listOfAsks;

    mapping(address => mapping(uint32 => mapping(uint=> uint))) bids;
    bid[] listOfBids;
    uint nextNumberOfBid;                                           

    //create energy offer 
    //There is a minimum energy requirement 
    //Only registered batteries can use this function
    function energyOffer(uint32 _day, uint32 _price, uint64 _energy, uint64 _timestamp) public onlyRegisteredBattery{
        require(batteries[msg.sender].isExist==true, "Battery details are not exist");
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh (1.000.000mWh)");
        uint index = bids[msg.sender][_day][nextNumberOfBid];

        index = listOfBids.length;
        bids[msg.sender][_day][nextNumberOfBid] = index;
        listOfBids.push(bid({
            sellerBatteryID: msg.sender,
            numberOfBid: nextNumberOfBid,
            day: _day,
            price: _price,
            energy: _energy,
            timestamp: _timestamp
        }));
        nextNumberOfBid++;
        emit offerEnergyMade(listOfBids[index].sellerBatteryID, listOfBids[index].day, listOfBids[index].price, listOfBids[index].energy);
    }

    //view all bids 
    function viewAllBids () public view returns (bid[] memory){
      return listOfBids;
    }

    //view single bid by batteryID
    function getBidByBatteryID (address batteryID, uint32 day, uint numberOfBid) public view returns (uint, uint32, uint32, uint64){
        uint index = bids[batteryID][day][numberOfBid];
        require(listOfBids.length > index, "Wrong index");
        require(listOfBids[index].day == day, "There is no offer on this day");
        require(listOfBids[index].sellerBatteryID == batteryID, "Wrong ID");
        return (listOfBids[index].numberOfBid, listOfBids[index].day, listOfBids[index].price, listOfBids[index].energy);
    }

    //Ask and buy energy 
    //There is a minimum energy requirement 
    //Only registered batteries can use this function
    function askAndBuyEnergy(address _sellerBatteryID, uint32 _day, uint32 _price, uint64 _energy, uint64 _timestamp, address _batteryID) public onlyRegisteredBattery {
        require(batteries[msg.sender].isExist==true, "Battery details are not exist");
        require(_energy >= kWh, "Require a minimum ask energy of 1 kWh (1.000.000mWh)");
        uint index = bids[_sellerBatteryID][_day][nextNumberOfBid];
        
        //check if energy offer exist
        if((listOfBids.length > index) && (listOfBids[index].sellerBatteryID == _sellerBatteryID) && (listOfBids[index].day == _day)){

            require(listOfBids[index].price == _price, "Price does not match");

            //record data from consumer' s choice
            asks[_batteryID] = listOfAsks.length;
            listOfAsks.push(ask({
                sellerBatteryID: _sellerBatteryID,
                price: _price,
                energy: _energy,
                timestamp: _timestamp,
                day:_day,
                batteryID: _batteryID
            }));
            
            emit buyEnergyMade(_sellerBatteryID, _day, _price, _energy, _batteryID);
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
    function getAskByBatteryId (address batteryID) public view returns (address, uint32, uint32, uint64){
        uint indexA = asks[batteryID];
        require(listOfAsks.length > indexA, "Wrong index");
        require(listOfAsks[indexA].batteryID == batteryID, "Wrong Battery Id");
        return (listOfAsks[indexA].sellerBatteryID, listOfAsks[indexA].day, listOfAsks[indexA].price, listOfAsks[indexA].energy);
        
    }
}