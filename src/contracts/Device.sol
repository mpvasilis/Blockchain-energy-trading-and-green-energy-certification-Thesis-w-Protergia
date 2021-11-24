pragma solidity >=0.4.21 <0.9.0;

contract Device {
    event onDeviceAdded(address indexed ownerOfDevice, uint date, string id);
    event onDeviceUpdated(address indexed ownerOfDevice, uint date, string id);
    event onDeviceTransferOwnership(address oldOwner, address indexed newOwner);
    event onDeviceRemoved(address device, uint date);

    ///@notice Struct to store all devices 
    ///@dev ownerOfDevice is the current address which the device is connected
    ///@dev typeOfDevice, PV, EV, Solar, Biomass, Hydo Turbine or battery(Multiple)
    ///@dev isExist to match the registered device with bool value.
    struct device {
        address ownerOfDevice;
        string typeOfDevice;
        uint timestamp;
        bool isExist;
    }

    ///@notice Mapping address as key to struct battery with mapping name batteries
    mapping (address => device) devices;

    modifier onlyRegisteredDevice{
         require(devices[msg.sender].isExist==true, "Only registered devices have access");
         _;
     }

    ///@notice Add a battery by address.
    ///@dev Only one device can register by each address.
    function addDevice (string memory typeOfDevice) public {
        require(devices[msg.sender].isExist == false, "Device details already added");
        devices[msg.sender] = device(msg.sender, typeOfDevice, block.timestamp, true);
        emit onDeviceAdded(msg.sender, block.timestamp, typeOfDevice);
    }

    ///@notice Change details of a battery.
    ///@dev Only registered devices have access to this function.
    function updateDevice(address ownerOfDevice, string memory typeOfDevice) public onlyRegisteredDevice {
        devices[ownerOfDevice].typeOfDevice = typeOfDevice;
        uint day = block.timestamp;
        emit onDeviceUpdated(ownerOfDevice, day, typeOfDevice);
    }

    function transferOwnershipOfDevice(address newOwner) public onlyRegisteredDevice {
        require(newOwner != address(0), "The address you would like to change is the same");
        address currentAddr = msg.sender;
        devices[newOwner] = device(newOwner, devices[currentAddr].typeOfDevice, devices[currentAddr].timestamp, devices[currentAddr].isExist);
        delete devices[currentAddr];
        emit onDeviceTransferOwnership(currentAddr, newOwner);
    }

    function removeDevice() public {
        address currentAddr = msg.sender;
        devices[currentAddr].isExist = false;
        delete devices[currentAddr];
        emit onDeviceRemoved(currentAddr, block.timestamp);
    }

    ///@notice Get signle device details from specific address
    function getDeviceByAddress() public view returns (address, string memory, uint){
        address deviceID = msg.sender;
        return (devices[deviceID].ownerOfDevice, devices[deviceID].typeOfDevice, devices[deviceID].timestamp);
    }
}