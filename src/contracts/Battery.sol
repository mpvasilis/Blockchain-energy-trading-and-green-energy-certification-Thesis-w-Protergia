pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

/********owned Contract********/
//Create a contract owner
contract owned {
    
    address public owner;
    
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

    /*
    constructor () public{
        addNewBattery("chris", 123);
    }
     */

    modifier onlyRegisteredBattery{
         require(batteries[msg.sender].isExist==true);
         _;
     }

    constructor (string memory nameOfBatteryOwner, uint32 date) public{
        //batteryID = msg.sender;
        require(batteries[msg.sender].isExist==false, "Battery details already added");
        batteries[msg.sender] = battery(msg.sender, nameOfBatteryOwner, date, true);

        listOfBatteries.push(battery({
            batteryID: msg.sender,
            nameOfBatteryOwner: nameOfBatteryOwner,
            date: date,
            isExist: true
            }));
    }

    //add a battery
    function addNewBattery (string memory nameOfBatteryOwner, uint32 date) public returns(bool) {
        //batteryID = msg.sender;
        require(batteries[msg.sender].isExist==false, "Battery details already added");
        batteries[msg.sender] = battery(msg.sender, nameOfBatteryOwner, date, true);

        listOfBatteries.push(battery({
            batteryID: msg.sender,
            nameOfBatteryOwner: nameOfBatteryOwner,
            date: date,
            isExist: true
            }));
        return true;
    }

    //to view all batteries
    function viewAllBatteries () public view returns (battery[] memory){
        return listOfBatteries;
    }

    //change details of a battery
    function updateBattery(address batteryID, string memory nameOfBatteryOwner) public {
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

    uint64 constant mWh = 1;
    uint64 constant Wh = 1000 * mWh;
    uint64 constant kWh = 1000 * Wh;
    uint64 constant MWh = 1000 * kWh;
    uint64 constant GWh = 1000 * MWh;
    uint64 constant TWh = 1000 * GWh;

    struct bid{
        address batteryID;    //battery public key
        uint numberOfBid;     //A battery can create more than one energy offer
        uint32 day;           //day for which the offer is valid
        uint32 price;         //price vs market price
        uint64 energy;        //energy to trade
        uint64 timestamp;     //timestamp for when the bid was created
    }
    
    struct Ask {
        address batteryID;
        uint64 energy;
        uint64 timestamp;
        uint32 day;
        uint numberOfAsk;     
    }
    
    mapping(address => mapping(uint32 => mapping(uint=> uint))) public asks;
    Ask[] public listOfAsks;
    uint nextNumberOfAsk;

    mapping(address => mapping(uint32 => mapping(uint=> uint))) public bids;
    bid[] public listOfBids;
    uint nextNumberOfBid;  

    /*
    constructor () public{                            
        energyOffer(20052020, 130, 1000000, 1618653420);   
    } 
     */  

    constructor (uint32 _day, uint32 _price, uint64 _energy, uint64 _timestamp) public{
        require(batteries[msg.sender].isExist==true, "Battery details are not exist");
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh (1.000.000mWh)");
        uint index = bids[msg.sender][_day][nextNumberOfBid];

        index = listOfBids.length;
        bids[msg.sender][_day][nextNumberOfBid] = index;
        listOfBids.push(bid({
            batteryID: msg.sender,
            numberOfBid: nextNumberOfBid,
            day: _day,
            price: _price,
            energy: _energy,
            timestamp: _timestamp
        }));
        nextNumberOfBid++;
    }                                          

    //create energy offer
    function energyOffer(uint32 _day, uint32 _price, uint64 _energy, uint64 _timestamp) public onlyRegisteredBattery{
        require(batteries[msg.sender].isExist==true, "Battery details are not exist");
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh (1.000.000mWh)");
        uint index = bids[msg.sender][_day][nextNumberOfBid];

        index = listOfBids.length;
        bids[msg.sender][_day][nextNumberOfBid] = index;
        listOfBids.push(bid({
            batteryID: msg.sender,
            numberOfBid: nextNumberOfBid,
            day: _day,
            price: _price,
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
    function getBidByBatteryID (address batteryID, uint32 day, uint numberOfBid) public view returns (uint, uint32, uint32, uint64){
        uint index = bids[batteryID][day][numberOfBid];
        require(listOfBids.length > index, "Wrong index");
        require(listOfBids[index].day == day, "There is no offer on this day");
        require(listOfBids[index].batteryID == batteryID, "Wrong Battery ID");
        return (listOfBids[index].numberOfBid, listOfBids[index].day, listOfBids[index].price, listOfBids[index].energy);
        //return (listOfBids[batteryID].day, listOfBids[batteryID].price, listOfBids[batteryID].energy);
    }

    //Ask energy 
    function askEnergy(uint32 _day, uint64 _energy, uint64 _timestamp) public onlyRegisteredBattery {
        require(batteries[msg.sender].isExist==true, "Battery details are not exist");
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh (1.000.000mWh)");
        uint indexA = asks[msg.sender][_day][nextNumberOfAsk];
        
        indexA = listOfAsks.length;
        listOfAsks.push(Ask({
            batteryID: msg.sender,
            energy: _energy,
            timestamp: _timestamp,
            day:_day,
            numberOfAsk: nextNumberOfAsk
        }));
        nextNumberOfAsk++;
    }

    //list of all asks
    function viewAllAsks () public view returns (Ask[] memory){
        return listOfAsks;
    }

    //view single ask by batteryID
    function getAskByBatteryId (address batteryID, uint32 day, uint numberOfAsk) public view returns (uint, uint32, uint64){
        uint indexA = asks[batteryID][day][numberOfAsk];
        require(listOfAsks.length > indexA, "Wrong index");
        require(listOfAsks[indexA].day == day, "There is no demand on this day");
        require(listOfAsks[indexA].batteryID == batteryID, "Wrong Battery Id");
        return (listOfAsks[indexA].numberOfAsk, listOfAsks[indexA].day, listOfAsks[indexA].energy);
        
    }
}