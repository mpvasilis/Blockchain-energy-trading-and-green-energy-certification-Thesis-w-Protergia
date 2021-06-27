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
    mapping(address => bool) public producers;
    
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

contract PPA is producerRegistry {

    mapping (uint => uint) price;

    enum Status {Pending, Approved, Rejected, Expired}
    event createdPPA(address indexed producer, uint energy, uint price);
    event purchasedPPA(uint itemID, address indexed buyer, address indexed producer);
    event expiredPPA(address indexed producer, address indexed buyer, uint startDay, uint endDay, Status status);
    //event changedPPA(address indexed producer, address indexed buyer, uint energy, uint endDay);

    struct ppa {
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

    struct producerEnergy{
        address producerID;
        uint timestamp;
        uint energy;
    }

    struct purchasesPPA{
        address buyerID;
        address producerID;
        uint timestamp;
        uint idOfPPA;
        uint purchasedEnergy;
    }

    mapping(address => uint) ppas;
    ppa[] listOfPPAs;
    uint nextID = 0;
    producerEnergy[] listOfkwhs;
    purchasesPPA[] listOfprchs;

    function createPPA(uint _energy, uint _price, uint _endDay) public onlyRegisteredProducers {
        uint _totalKwh = 0;
        address _producerID = msg.sender;
        listOfPPAs.push(ppa({
            buyerID: address(0x0),
            producerID: _producerID,
            energy: _energy,
            price: _price,
            startDay: block.timestamp,
            endDay: _endDay,
            id: nextID,
            totalKwh: _totalKwh,
            status: Status.Pending
        }));
        nextID++;
        emit createdPPA(_producerID, _energy, _price);
    }

    /*function changePPATerms(address _buyerID, uint _endDay) public{
        for(uint i = 0; i<listOfPPAs.length; i++){
            if(listOfPPAs[i].buyerID == _buyerID){
                //require(listOfPPAs[i].producerID , "Only producer");
                require(listOfPPAs[i].status != Status.Approved, "You can not change an approved PPA");
                listOfPPAs[i].endDay = _endDay;
                emit changedPPA(listOfPPAs[i].producerID, listOfPPAs[i].buyerID, listOfPPAs[i].energy, listOfPPAs[i].endDay);
            }
        }
    }*/

    function claimPPA() public {
        address buyerId = msg.sender;
        for(uint i = 0; i<listOfPPAs.length; i++){
            require(listOfPPAs[i].startDay < listOfPPAs[i].endDay, "end day error");
            require(listOfPPAs[i].producerID != buyerId, "Wrong address buyer");
            require(listOfPPAs[i].status != Status.Rejected, "You can not accept a rejected PPA");
            if(listOfPPAs[i].status != Status.Approved){
            listOfPPAs[i].status = Status.Approved;
            listOfPPAs[i].startDay = block.timestamp;
            listOfPPAs[i].buyerID = buyerId;
            emit purchasedPPA(listOfPPAs[i].id, listOfPPAs[i].buyerID, listOfPPAs[i].producerID);
            break;
            }
        }
    }

    //this is a trial function 
    function energyForSale(uint _energy) public onlyRegisteredProducers{
        address _producer = msg.sender;
        listOfkwhs.push(producerEnergy({
            producerID: _producer,
            timestamp: block.timestamp,
            energy: _energy
        }));
    }

    function viewAvailableKwhs() public view returns(producerEnergy[] memory){
        return listOfkwhs;
    }

    /*function denyPPA() public {
        address buyerId = msg.sender;
        for(uint i = 0; i<listOfPPAs.length; i++){
            require(listOfPPAs[i].producerID != msg.sender, "Wrong3");
            require(listOfPPAs[i].status != Status.Rejected, "You can not reject an already rejected PPA");
            if((listOfPPAs[i].buyerID == buyerId)){
                listOfPPAs[i].status = Status.Rejected;
            }
        }
    }*/

    function buy_Energy_PPA(uint _energy) public{
        uint indexID = 0;
        for(uint i = 0; i<listOfPPAs.length; i++){
            require(listOfPPAs[i].startDay < listOfPPAs[i].endDay, "End day error");
            //require(listOfPPAs[i].endDay <= block.timestamp, "PPA has closed");
            require(listOfPPAs[i].status == Status.Approved, "It must be approved");
            if((listOfPPAs[i].buyerID == msg.sender) && (listOfPPAs[i].id == indexID)){
                if(listOfPPAs[i].endDay < block.timestamp){
                    listOfPPAs[i].status = Status.Expired;
                    emit expiredPPA(listOfPPAs[i].producerID, listOfPPAs[i].buyerID, listOfPPAs[i].startDay, listOfPPAs[i].endDay, listOfPPAs[i].status);
                    break;
                }
                for(uint j = 0; j<listOfkwhs.length; j++){
                    uint remainingEnergy = _energy;
                    uint totalPurEnergy = 0;
                    bool isEnergyPurchased = false;
                    if(listOfkwhs[j].energy < remainingEnergy){
                        listOfPPAs[i].totalKwh = listOfPPAs[i].totalKwh + listOfkwhs[j].energy;
                        totalPurEnergy = listOfkwhs[j].energy;
                        remainingEnergy = remainingEnergy - listOfkwhs[j].energy;
                        listOfkwhs[j].energy = 0;
                        isEnergyPurchased = true;
                        
                    }else if(listOfkwhs[j].energy == remainingEnergy){
                        listOfPPAs[i].totalKwh = listOfPPAs[i].totalKwh + remainingEnergy;
                        totalPurEnergy = remainingEnergy;
                        listOfkwhs[j].energy = 0;
                        remainingEnergy = 0;
                        isEnergyPurchased = true;

                    }else{
                        listOfPPAs[i].totalKwh = listOfPPAs[i].totalKwh + remainingEnergy;
                        totalPurEnergy = remainingEnergy;
                        listOfkwhs[j].energy = listOfkwhs[j].energy - remainingEnergy;
                        remainingEnergy = 0;
                        isEnergyPurchased = true;

                    }

                    if(isEnergyPurchased){
                        listOfprchs.push(purchasesPPA({
                            buyerID: listOfPPAs[i].buyerID,
                            producerID: listOfPPAs[i].producerID,
                            timestamp: block.timestamp,
                            idOfPPA: listOfPPAs[i].id,
                            purchasedEnergy: totalPurEnergy
                        }));
                    }

                    if(listOfkwhs[j].energy == 0){
                        if(listOfkwhs.length > 1){
                            listOfkwhs[j] = listOfkwhs[listOfkwhs.length-1];
                        }
                        listOfkwhs.length--;
                        break;
                    }
                }
                break;
            }
            indexID++;
        }
    }

    /*function killPPA() public {
        for(uint i = 0; i<listOfPPAs.length; i++){
            if(listOfPPAs[i].endDay < now){
                selfdestruct(msg.sender);
            }
        }
    }*/

    function viewAllPPAs () public view returns (ppa[] memory){
        return listOfPPAs;
    }

    function viewAllpurchases() public view returns (purchasesPPA[] memory){
        return listOfprchs;
    }

    function getPPAbyID(uint _id) public view returns (address, address, uint, uint, uint, uint, uint){
        ppa storage _ppa = listOfPPAs[_id];
        return (_ppa.producerID, _ppa.buyerID, _ppa.energy, _ppa.price, _ppa.startDay, _ppa.endDay, uint(_ppa.status));
    }
}