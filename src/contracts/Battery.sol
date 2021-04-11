pragma solidity >=0.4.21 <0.7.0;

/*Battery Management Smart Contract*/

contract Battery{

    address public owner;

    mapping (address => battery) batteries; //mapping address as key to struct battery with mapping name batteries
    
    //assigning the contract AddBattery as the owner
    //a modifier onlyOwner is created to limit the access to function AddNewBattery to contract AddBattery
    constructor() public{
        owner=msg.sender;
    }

    modifier onlyOwner{
        require(msg.sender==owner);
        _;
    }

    struct battery{
        address batteryId; //batteryId is battery's ethereum address
        string name;
        bool isexist;
    }

    address[] public listOfbatteries;

    //assigning the battery details to a key (batteryId)
    /*function isExist(address batteryId) public view returns(bool isIndeed) {
        if(listOfbatteries.length == 0) return false;
        return batteries[batteryId].isexist;
    }*/

    function AddNewBattery (address batteryId, string memory name) public onlyOwner {
        require(batteries[batteryId].isexist==false, "Battery details already added");
        batteries[batteryId] = battery(batteryId, name, true);
        listOfbatteries.push(batteryId);
    }

    function showAllbatteries () public view returns (address[] memory){
        return listOfbatteries;
    }

    //function to get the details of a battery when batteryId is given
    //returning battery's eth address and id of battery to corresponding key
    function getBatteryDetails(address batteryId) public view returns (address, string memory){
        return (batteries[batteryId].batteryId, batteries[batteryId].name);
    }
}