pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

/*Battery Management Smart Contract*/

contract Battery{

    address public owner;

    mapping (string => battery) batteries; //mapping "string" address as key to struct battery with mapping name batteries
    
    //assigning the contract AddBattery as the owner
    //a modifier onlyOwner is created to limit the access to function AddNewBattery to contract AddBattery
    /*constructor() public{
        owner=msg.sender;
    }*/

    struct battery{
        string batteryId; //batteryId is battery's ethereum address
        uint batteryData;
        bool isexist;
    }

    battery[] public listOfbatteries;

    //assigning the battery details to a key (batteryId)
    constructor (string memory batteryId, uint batteryData) public {
        owner=msg.sender;
        require(batteries[batteryId].isexist==false, "Battery details already added");
        batteries[batteryId] = battery(batteryId, batteryData, true);
        listOfbatteries.push(battery(batteryId, batteryData, true));
    }

    modifier onlyOwner{
        require(msg.sender==owner);
        _;
    }

    function addNewBattery (string memory batteryId, uint batteryData) public onlyOwner returns(bool) {
        require(batteries[batteryId].isexist==false, "Battery details already added");
        batteries[batteryId] = battery(batteryId, batteryData, true);
        listOfbatteries.push(battery(batteryId, batteryData, true));
        return true;
    }

    function showAllBatteries () public view returns (battery[] memory){
        return listOfbatteries;
    }

    //function to get the details of a battery when batteryId is given
    //returning battery's eth address and id of battery to corresponding key
    function getBatteryDetails(string memory batteryId) public view returns (string memory, uint){
        return (batteries[batteryId].batteryId, batteries[batteryId].batteryData);
    }
}