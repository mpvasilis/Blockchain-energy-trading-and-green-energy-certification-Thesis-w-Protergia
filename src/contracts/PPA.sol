pragma solidity >=0.4.21 <0.9.0;
pragma experimental ABIEncoderV2;

//import "src/contracts/token/ERC1155.sol";
//import "src/contracts/token/ERC1155Mintable.sol";
//import "src/contracts/token/IERC1155.sol";

//import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
/*
*Installed open zeppelin version 3.1.0
*https://github.com/OpenZeppelin/openzeppelin-contracts/tree/v3.1.0
*with "npm i @openzeppelin/contracts@3.1.0"
*/
contract producerRegistry {
    event producerRegistered(address indexed producer);
    event producerDeregistered(address indexed producer);
    
    // map address to bool "is a registered producer"
    mapping(address => bool) producers;
    
    modifier onlyRegisteredProducers {
        require(producers[msg.sender], "You must be a current Producer");
        _;
    }
    
    function registerProducer() public {
        address aproducer = msg.sender;
        emit producerRegistered(aproducer);
        producers[aproducer] = true;
    }

    function deregisterProducer() public {
        address aproducer = msg.sender;
        emit producerDeregistered(aproducer);
        producers[aproducer] = false;
    }
}

contract ppaBuyerRegistry {
    event buyerRegistered(address indexed ppaBuyer);
    event buyerDeregistered(address indexed ppaBuyer);

    mapping(address => uint32) ppaBuyers;
    address[] listOfPPABuyers;

    modifier onlyPPABuyers {
      require(ppaBuyers[msg.sender] > 0, "Only PPA owners");
      _;
    }
    
    function deregisterPPABuyer(address abuyer) public {
        uint32 abuyerID = 0;
        if(abuyerID != 0) {
            emit buyerDeregistered(abuyer);
        }
        ppaBuyers[abuyer] = abuyerID;
    }

    function registerPPABuyer(address abuyer) public {
        uint32 abuyerID = 0;
        abuyerID++;
        if(abuyerID != 0) {
            emit buyerRegistered(abuyer);
        }
        ppaBuyers[abuyer] = abuyerID;
    }
}

contract PPA is producerRegistry, ppaBuyerRegistry {

    mapping (uint => uint) price;

    enum Status {Pending, Approved, Rejected, Expired}
    event createdPPA(address indexed producer, uint energy, uint price);
    event purchasedPPA(uint itemID, address indexed buyer, address indexed producer);
    event expiredPPA(address indexed producer, address indexed buyer, uint startDay, uint endDay, Status status);

    struct ppa {              //Struct with all PPA contracts
        address buyerID;
        address producerID;
        uint energy;
        uint price;           //price per energy(kwh)
        uint startDay;
        uint endDay;          //It must be timestamp (ex. uint endDay = 1518220800; // 2018-02-10 00:00:00)
        uint id;              //id number of each ppa contract
        Status status;
    }

    mapping(address => ppa) ppas;
    ppa[] listOfPPAs;
    //uint nextID = 0;

    struct approvedPPA{       //Struct only for approved PPAs
        address buyerID;
        address producerID;
        uint energy;
        uint price;           //price per energy(kwh)
        uint startDay;
        uint endDay;          //It must be timestamp (ex. uint endDay = 1518220800; // 2018-02-10 00:00:00)
        uint id;              //id number of each ppa contract
        uint totalKwh;        //total amount of purchased kwh
        Status status;
    }

    mapping(address => mapping(uint => approvedPPA)) approvedPPAs;
    approvedPPA[] Appas;

    struct producerEnergy{      //Trial struct for available producer' s energy in order to sale 
        address producerID;
        uint timestamp;
        uint energy;
        uint idOfmatchContract; //id oc ppa contract that refers to
    }

    mapping(address => mapping(uint => uint)) pEnergy;
    producerEnergy[] listOfkwhs;

    struct purchasesPPA{
        address buyerID;
        address producerID;
        uint timestamp;
        uint idOfPPA;
        uint purchasedEnergy;
    }

    purchasesPPA[] listOfprchs;

    function createPPA(uint _energy, uint _price, uint _endDay) public onlyRegisteredProducers {
        address _producerID = msg.sender;
        uint currentTime = block.timestamp;
        uint idOfContract = _endDay - currentTime;
        require(_endDay > block.timestamp, "It's impossible endDay < startDay");
        listOfPPAs.push(ppa({
            buyerID: address(0x0),
            producerID: _producerID,
            energy: _energy,
            price: _price,
            startDay: block.timestamp,
            endDay: _endDay,
            id: idOfContract,
            status: Status.Pending
        }));
        //nextID++;
        emit createdPPA(_producerID, _energy, _price);
    }

    function claimPPA() public {
        uint _totalKwh = 0;
        address buyerId = msg.sender;
        for(uint i = 0; i<listOfPPAs.length; i++){
            require(listOfPPAs[i].producerID != buyerId, "Wrong address buyer");
            require(listOfPPAs[i].status != Status.Rejected, "error");
            if(listOfPPAs[i].status == Status.Pending){
                //listOfPPAs[i].status = Status.Approved;
                Appas.push(approvedPPA({
                    buyerID: buyerId,
                    producerID: listOfPPAs[i].producerID,
                    energy: listOfPPAs[i].energy,
                    price: listOfPPAs[i].price,
                    startDay: block.timestamp,
                    endDay: listOfPPAs[i].endDay,
                    id: listOfPPAs[i].id,
                    totalKwh: _totalKwh,
                    status: Status.Approved
                }));
            ppaBuyerRegistry.registerPPABuyer(buyerId);
            emit purchasedPPA(listOfPPAs[i].id, listOfPPAs[i].buyerID, listOfPPAs[i].producerID);
            if(listOfPPAs.length > 1){
                listOfPPAs[i] = listOfPPAs[listOfPPAs.length-1];
            }
            listOfPPAs.length--;
            break;
            }
        }
    }

    //this is a trial function just for PPA_energy_trading part
    function availableKwhs(uint _energy, uint _idOfMatchPPA) public onlyRegisteredProducers{
        address _producer = msg.sender;
        listOfkwhs.push(producerEnergy({
            producerID: _producer,
            timestamp: block.timestamp,
            energy: _energy,
            idOfmatchContract: _idOfMatchPPA
        }));
    }

    function buy_PPA_Kwhs(uint _idOfPPA) public onlyPPABuyers{
        uint currentTime = block.timestamp;
        address aBuyerId = msg.sender; 
        for(uint j = 0; j<Appas.length; j++){ //uint j = 0; j<Appas.length; j++
            //search on Approved PPAs to match the id - producer with kwhs
            for(uint i = 0; i<listOfkwhs.length; i++){ //uint i = 0; i<listOfkwhs.length; i++
                uint totalEnergyPurchased = 0;
                //find the correct available kwhs based on id of ppa
                if((Appas[j].producerID == listOfkwhs[i].producerID) && (Appas[j].id == _idOfPPA) && (Appas[j].id == listOfkwhs[i].idOfmatchContract)){
                    //if endDay < now then PPA has expired 
                    if(Appas[j].endDay < currentTime){
                        revert("PPA has expired");
                    }
                    totalEnergyPurchased = listOfkwhs[i].energy;
                    Appas[j].totalKwh = Appas[j].totalKwh + totalEnergyPurchased;
                    listOfkwhs[i].energy = 0;
                    listOfprchs.push(purchasesPPA({
                        buyerID: aBuyerId,
                        producerID: listOfkwhs[i].producerID,
                        timestamp: currentTime,
                        idOfPPA: _idOfPPA,
                        purchasedEnergy: totalEnergyPurchased
                    }));
                }
                if(listOfkwhs[i].energy == 0){
                    if(listOfkwhs.length > 1){
                        listOfkwhs[i] = listOfkwhs[listOfkwhs.length-1];
                    }
                    listOfkwhs.length--;
                    break;
                }
            }
        }
    }

    function killPPA(uint _id) public {
        uint currentTime = block.timestamp;
        for(uint i = 0; i<Appas.length; i++){
            if((Appas[i].id == _id) && (Appas[i].endDay < currentTime)){
                Appas[i].status = Status.Expired;
                listOfPPAs.push(ppa({
                    buyerID: Appas[i].buyerID,
                    producerID: Appas[i].producerID,
                    energy: Appas[i].energy,
                    price: Appas[i].price,
                    startDay: Appas[i].startDay,
                    endDay: Appas[i].endDay,
                    id: Appas[i].id,
                    status: Status.Expired
                }));
                ppaBuyerRegistry.deregisterPPABuyer(Appas[i].buyerID);
                emit expiredPPA(Appas[i].producerID, Appas[i].buyerID, Appas[i].startDay, Appas[i].endDay, Appas[i].status);
                if(Appas.length > 1){
                    Appas[i] = Appas[Appas.length-1];
                }
                Appas.length--;
                break;
            }
        }
    }

    function viewAllPPAs () public view returns (ppa[] memory){
        return listOfPPAs;
    }

    function viewAllpurchases() public view returns (purchasesPPA[] memory){
        return listOfprchs;
    }

    function viewAllApprovedPPAs() public view returns(approvedPPA[] memory){
        return Appas;
    }

    function getPPAbyID(uint _id) public view returns (address, address, uint, uint, uint, uint, uint, uint){
        ppa storage _ppa = listOfPPAs[_id];
        return (_ppa.producerID, _ppa.buyerID, _ppa.energy, _ppa.price, _ppa.startDay, _ppa.endDay, uint(_ppa.status), _ppa.id);
    }

    function viewAvailableKwhs() public view returns(producerEnergy[] memory){
        return listOfkwhs;
    }

    function getAvKwhs() public view returns(uint count){
        return listOfkwhs.length;
    }
}