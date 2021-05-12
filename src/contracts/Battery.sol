pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

/*----------------------------------------owned Contract----------------------------------------*/
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

/*----------------------------------------batteryRegistry Contract----------------------------------------*/
//Contract that allows battery address to be registered
contract batteryRegistry is owned {

    event batteryAdded(address indexed batteryID);

    struct battery {
        address batteryID;            //batteryID is Owner of battery ethereum address
        string nameOfBatteryOwner;    //Name of battery owner 
        uint32 date;                  //Creation date
        bool isExist;                 //Check if battery exist into addNewBattery function
    }

    //mapping address as key to struct battery with mapping name batteries
    mapping (address => battery) batteries;
    battery[] public listOfBatteries;

    /*
    constructor () public{
        addNewBattery(msg.sender, "chris", 123);
    }
     */

    constructor (address batteryID, string memory nameOfBatteryOwner, uint32 date) public{
        require(batteries[batteryID].isExist==false, "Battery details already added");
        batteries[batteryID] = battery(batteryID, nameOfBatteryOwner, date, true);

        listOfBatteries.push(battery({
            batteryID: batteryID,
            nameOfBatteryOwner: nameOfBatteryOwner,
            date: date,
            isExist: true
            }));
        emit batteryAdded(batteryID);
    }

    //add a battery
    function addNewBattery (address batteryID, string memory nameOfBatteryOwner, uint32 date) public onlyOwner returns(bool) {
        require(batteries[batteryID].isExist==false, "Battery details already added");
        batteries[batteryID] = battery(batteryID, nameOfBatteryOwner, date, true);

        listOfBatteries.push(battery({
            batteryID: batteryID,
            nameOfBatteryOwner: nameOfBatteryOwner,
            date: date,
            isExist: true
            }));
        emit batteryAdded(batteryID);
        return true;
    }

    //to view all batteries
    function viewAllBatteries () public view returns (battery[] memory){
        return listOfBatteries;
    }

    //change details of a battery
    function updateBattery(address batteryID, string memory nameOfBatteryOwner) public onlyOwner{
        for(uint i = 0; i<listOfBatteries.length; i++){
            if(listOfBatteries[i].batteryID == batteryID){
                listOfBatteries[i].nameOfBatteryOwner = nameOfBatteryOwner;
            }
        }
    }

    //delete a battery by batteryID
    function removeBattery(address batteryID) public onlyOwner{
        for(uint i = 0; i<listOfBatteries.length; i++){
            if(listOfBatteries[i].batteryID == batteryID){
                delete listOfBatteries[i];
                listOfBatteries.length--;
            }
        }
    }

    //view single battery by battery id
    function getBatteryByID(address batteryID) public view returns (address, string memory, uint32){
        return (batteries[batteryID].batteryID, batteries[batteryID].nameOfBatteryOwner, batteries[batteryID].date);
    }
}

/*----------------------------------------energyBid Contract----------------------------------------*/
//Contract for energy offers from current batteries
contract energyBid is owned, batteryRegistry {

    event bidMade(address indexed batteryID, uint32 indexed day, uint32 indexed price, uint64 energy);
    event AskMade(uint32 day, uint64 energy);

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
        energyOffer(msg.sender, 20052020, 130, 1000000, 1618653420);   
    } 
     */  

    constructor (address _batteryID, uint32 _day, uint32 _price, uint64 _energy, uint64 _timestamp) public{
        require(batteries[_batteryID].isExist==true, "Battery details are not exist");
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh (1.000.000mWh)");
        uint index = bids[_batteryID][_day][nextNumberOfBid];

        index = listOfBids.length;
        bids[_batteryID][_day][nextNumberOfBid] = index;
        listOfBids.push(bid({
            batteryID: _batteryID,
            numberOfBid: nextNumberOfBid,
            day: _day,
            price: _price,
            energy: _energy,
            timestamp: _timestamp
        }));
        emit bidMade(listOfBids[index].batteryID, listOfBids[index].day, listOfBids[index].price, listOfBids[index].energy);
        nextNumberOfBid++;
    }                                          

    //create energy offer
    function energyOffer(address _batteryID, uint32 _day, uint32 _price, uint64 _energy, uint64 _timestamp) public onlyOwner{
        require(batteries[_batteryID].isExist==true, "Battery details are not exist");
        require(_energy >= kWh, "Wrong energy input require a minimum offer of 1 kWh (1.000.000mWh)");
        uint index = bids[_batteryID][_day][nextNumberOfBid];

        index = listOfBids.length;
        bids[_batteryID][_day][nextNumberOfBid] = index;
        listOfBids.push(bid({
            batteryID: _batteryID,
            numberOfBid: nextNumberOfBid,
            day: _day,
            price: _price,
            energy: _energy,
            timestamp: _timestamp
        }));
        emit bidMade(listOfBids[index].batteryID, listOfBids[index].day, listOfBids[index].price, listOfBids[index].energy);
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
    function askEnergy(address  _batteryId, uint32 _day, uint64 _energy, uint64 _timestamp)  public   {
        uint indexA = asks[_batteryId][_day][nextNumberOfAsk];
        
        listOfAsks.push(Ask({
            batteryID: _batteryId,
            energy: _energy,
            timestamp: _timestamp,
            day:_day,
            numberOfAsk: nextNumberOfAsk
        }));
        
        emit AskMade(listOfAsks[indexA].day, listOfAsks[indexA].energy);
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