pragma solidity >=0.4.21 <0.9.0;

import "src/contracts/SafeMath.sol";
import "src/contracts/Counters.sol";

contract Device {

    using Counters for Counters.Counter;
    Counters.Counter private id;

    event onDeviceAdded(address indexed ownerOfDevice, uint date, string name);
    event onDeviceUpdated(address indexed ownerOfDevice, string name, string typeDevice, uint date, uint id);
    event onDeviceTransferOwnership(address oldOwner, address indexed newOwner, uint id);
    event onDeviceRemoved(address indexed owner, uint id, uint date);
    event onEnergyRecorded(address indexed owner, uint id, uint energy, uint date);

    struct device {
        address owner;
        string typeOfDevice;
        string name;
        uint energy;
        uint uuID;
        uint date;
    }

    mapping(uint => uint) deviceMap;
    device[] devices;

    function createDevice(string memory _typeOfDevice, string memory _name) public {

        ///@notice must added a valid way to check the validity of device input

        address _owner = msg.sender;
        uint currentTime = block.timestamp;
        id.increment();
        uint currentID = id.current();
        uint idx = devices.length;
        deviceMap[currentID] = idx;
        devices.push(device({
            owner: _owner,
            typeOfDevice: _typeOfDevice,
            name: _name,
            energy: 0,
            uuID: currentID,
            date: currentTime
        }));
        emit onDeviceAdded(_owner, currentTime, _name);
    }

    function removeDevice(uint _id) public {
        address _owner = msg.sender;
        for(uint i = 0; i<devices.length; i++){
            if(devices[i].uuID == _id && devices[i].owner == _owner){
                emit onDeviceRemoved(_owner, _id, block.timestamp);
                if (devices.length > 1) {
                    devices[i] = devices[devices.length-1];
                }
                devices.length--;
            }
        }
    }

    function updateDevice(uint _id, string memory _name, string memory _typeOfDevice) public {
        address _owner = msg.sender;
        for(uint i = 0; i<devices.length; i++){
            if(devices[i].uuID == _id && devices[i].owner == _owner){
                devices[i].name = _name;
                devices[i].typeOfDevice = _typeOfDevice;
                emit onDeviceUpdated(_owner, _name, _typeOfDevice, block.timestamp, _id);
            }
        }
    }

    function transferOwnershipOfDevice(uint _id, address _to) public {
        address _from = msg.sender;
        require(_from != _to, "You can not use the same address");
        for(uint i = 0; i<devices.length; i++){
            if(devices[i].uuID == _id && devices[i].owner == _from){
                devices[i].owner = _to;
                emit onDeviceTransferOwnership(_from, _to, _id);
            }
        }
    }

    function recordEnergyPerDevice(uint _id, uint _energy) public {
        address _owner = msg.sender;
        for(uint i = 0; i<devices.length; i++){
            if(devices[i].uuID == _id && devices[i].owner == _owner){
                devices[i].energy = devices[i].energy + _energy;
                emit onEnergyRecorded(_owner, _id, _energy, block.timestamp);
            }
        }
    }

    function getCountOfDevices() public view returns(uint){
        address currentAddr = msg.sender;
        uint count = 0;
        for(uint i = 0; i<devices.length; i++){
            if(devices[i].owner == currentAddr){
                count++;
            }
        }
        return count;
    }

    ///@notice In order to iterate with the devices of a given address we need this extra function with the current legth of device array
    ///@notice So in the Front end we would need to get the length and iterate for each device that we want to list in our platform 
    ///@notice and get the index for that device
    function getMyDevices(uint _id) public view returns(uint, string memory, string memory, uint){
        uint index = deviceMap[_id];
        require(devices.length > index, "Wrong index");
        require(devices[index].uuID == _id, "Wrong ID");
        return(devices[index].uuID, devices[index].typeOfDevice, devices[index].name, devices[index].date);
    }

    function getTotalEnergy() public view returns(uint) {
        address currentAddr = msg.sender;
        uint res = 0;
        for(uint i = 0; i<devices.length; i++){
            if(devices[i].owner == currentAddr){
                res = res + devices[i].energy;
            }
        }
        return res;
    }

    ///@notice Solidity generally can not return dynamic string arrays
    ///@notice so, you can use this function to show the available energy per device
    ///@notice and name, type of device as well, when someone click on it.
    function getEnergyPerDevice(uint _id) public view returns(uint) {
        uint index = deviceMap[_id];
        require(devices.length > index, "Wrong index");
        require(devices[index].uuID == _id, "Wrong ID");
        return(devices[index].energy);
    }
}