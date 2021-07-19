pragma solidity >=0.4.21 <0.9.0;
pragma experimental ABIEncoderV2;

import "src/contracts/SafeMath.sol";
import "src/contracts/Counters.sol";

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

//Corporate PPAs
contract PPA is producerRegistry, ppaBuyerRegistry {

    //using SafeMath for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private contractID;

    mapping (uint => uint) price;

    enum Status {Pending, Approved, Rejected, Expired}
    event createdPPA(address indexed producer, uint price);
    event createdCorpPPA(address indexed producer, address indexed buyer, uint price);
    event acceptedCorpPPA(address indexed producer, address indexed buyer, uint id, uint agreedPrice);
    event purchasedPPA(uint id, address indexed buyer, address indexed producer);
    event expiredPPA(address indexed producer, address indexed buyer, uint startDay, uint endDay, Status status);

    struct ppa {               //Struct with all PPA contracts
        address buyer;
        address producer;
        uint kwhPrice;         //price per energy(kwh)
        uint startDay;
        uint endDay;           //It must be timestamp (ex. uint endDay = 1833746400; // 2028-02-10 00:00:00)
        uint id;               //id number of each ppa contract
        Status status;
    }

    mapping(address => ppa) ppas;
    ppa[] listOfPPAs;
    ppa[] corporatePPAList;
    //uint contractID = 0;

    struct approvedPPA{       //Struct only for approved PPAs
        address buyer;
        address producer;
        uint kwhPrice;        //price per energy(kwh)
        uint startDay;
        uint endDay;          //It must be timestamp (ex. uint endDay = 1833746400; // 2028-02-10 00:00:00)
        uint id;              //id number of each ppa contract
        uint totalKwh;        //total amount of purchased kwh
        Status status;
    }

    mapping(address => mapping(uint => approvedPPA)) approvedPPAs;
    approvedPPA[] Appas;

    struct producerEnergy{      //Trial struct for available producer' s energy in order to sale 
        address producer;
        address buyer;          //Address of owner of each PPA conract
        uint timestamp;
        uint energy;
        uint idOfmatchContract; //id of ppa contract that refers to
    }

    mapping(address => mapping(uint => uint)) pEnergy;
    producerEnergy[] listOfkwhs;

    struct purchasesPPA{
        address buyer;
        address producer;
        uint timestamp;
        uint idOfPPA;
        uint purchasedEnergy;
    }

    purchasesPPA[] listOfprchs;

    function corporatePPA(address _buyer, uint _agreedKwhPrice,uint _startDay, uint _endDay, uint _id) public onlyRegisteredProducers {
        address _producer = msg.sender;
        require(_endDay > _startDay, "It's impossible endDay < startDay");
        corporatePPAList.push(ppa({
            buyer: _buyer,
            producer: _producer,
            kwhPrice: _agreedKwhPrice,
            startDay: _startDay,
            endDay: _endDay,
            id: _id,
            status: Status.Pending
        }));
        emit createdCorpPPA(_producer, _buyer, _agreedKwhPrice);
    }

    //Corporate PPAs are based on an agreed price
    //Both parties benefit from long-term price guarantees that protect them from market price volatility
    function acceptCorporatePPA() public {
        address _buyer = msg.sender;
        uint _totalKwh = 0;
        for(uint i = 0; i < corporatePPAList.length; i++){
            if((corporatePPAList[i].buyer == _buyer) && (corporatePPAList[i].status == Status.Pending)){
                Appas.push(approvedPPA({
                    buyer: _buyer,
                    producer: corporatePPAList[i].producer,
                    kwhPrice: corporatePPAList[i].kwhPrice,
                    startDay: corporatePPAList[i].startDay,
                    endDay: corporatePPAList[i].endDay,
                    id: corporatePPAList[i].id,
                    totalKwh: _totalKwh,
                    status: Status.Approved
                }));
                ppaBuyerRegistry.registerPPABuyer(_buyer);
                emit acceptedCorpPPA(corporatePPAList[i].producer, _buyer, corporatePPAList[i].id, corporatePPAList[i].kwhPrice);
                if(corporatePPAList.length > 1){
                    corporatePPAList[i] = corporatePPAList[corporatePPAList.length-1];
                }
                corporatePPAList.length--;
                break;
            }
        }
    }

    function createPPA(uint _kwhPrice,uint _startDay, uint _endDay) public onlyRegisteredProducers { //onlyRegisteredProducers
        address _producer = msg.sender;
        //uint currentTime = block.timestamp;
        //uint idOfContract = _endDay-currentTime;
        contractID.increment();
        uint currentID = contractID.current();
        require(_endDay > _startDay, "It's impossible endDay < startDay");
        listOfPPAs.push(ppa({
            buyer: address(0x0),
            producer: _producer,
            kwhPrice: _kwhPrice,
            startDay: _startDay,
            endDay: _endDay,
            id: currentID,
            status: Status.Pending
        }));
        //nextID++;
        emit createdPPA(_producer, _kwhPrice);
    }

    function claimPPA() public {
        uint _totalKwh = 0;
        address buyer = msg.sender;
        for(uint i = 0; i<listOfPPAs.length; i++){
            require(listOfPPAs[i].producer != buyer, "Wrong address buyer");
            require(listOfPPAs[i].status != Status.Rejected, "error");
            if(listOfPPAs[i].status == Status.Pending){
                Appas.push(approvedPPA({
                    buyer: buyer,
                    producer: listOfPPAs[i].producer,
                    kwhPrice: listOfPPAs[i].kwhPrice,
                    startDay: listOfPPAs[i].startDay,
                    endDay: listOfPPAs[i].endDay,
                    id: listOfPPAs[i].id,
                    totalKwh: _totalKwh,
                    status: Status.Approved
                }));
                ppaBuyerRegistry.registerPPABuyer(buyer);
                emit purchasedPPA(listOfPPAs[i].id, listOfPPAs[i].buyer, listOfPPAs[i].producer);
                if(listOfPPAs.length > 1){
                    listOfPPAs[i] = listOfPPAs[listOfPPAs.length-1];
                }
                listOfPPAs.length--;
                break;
            }
        }
    }

    //Claim an Auction type PPA with the lowest price
    function claimAuctionPPA() public {
        uint _totalkwh = 0;
        bool isClaimed = false;
        address buyerAddr = msg.sender;
        //Check for the best price per kwh based on PPA terms
        //Claim the PPA with lowest price and record this purchase
        for(uint i = 0; i < listOfPPAs.length; i++){
            for(uint j = 0; j < listOfPPAs.length; j++){
                if(listOfPPAs[j].kwhPrice < listOfPPAs[i].kwhPrice){
                    require(listOfPPAs[j].status == Status.Pending, "PPA does not exists");
                    require(listOfPPAs[j].producer != buyerAddr, "Wrong address buyer");
                    Appas.push(approvedPPA({
                        buyer: buyerAddr,
                        producer: listOfPPAs[j].producer,
                        kwhPrice: listOfPPAs[j].kwhPrice,
                        startDay: listOfPPAs[j].startDay,
                        endDay: listOfPPAs[j].endDay,
                        id: listOfPPAs[j].id,
                        totalKwh: _totalkwh,
                        status: Status.Approved
                        }));
                    ppaBuyerRegistry.registerPPABuyer(buyerAddr);
                    isClaimed = true;
                    emit purchasedPPA(listOfPPAs[j].id, listOfPPAs[j].buyer, listOfPPAs[j].producer);
                }
                if(isClaimed){
                    if(listOfPPAs.length > 1){
                        listOfPPAs[j] = listOfPPAs[listOfPPAs.length-1];
                    }
                    listOfPPAs.length--;
                    break;
                }
            }
            if(isClaimed){
                break;
            }else{
                require(listOfPPAs[i].status == Status.Pending, "PPA does not exists");
                require(listOfPPAs[i].producer != buyerAddr, "Wrong address buyer");
                Appas.push(approvedPPA({
                    buyer: buyerAddr,
                    producer: listOfPPAs[i].producer,
                    kwhPrice: listOfPPAs[i].kwhPrice,
                    startDay: listOfPPAs[i].startDay,
                    endDay: listOfPPAs[i].endDay,
                    id: listOfPPAs[i].id,
                    totalKwh: _totalkwh,
                    status: Status.Approved
                }));
                ppaBuyerRegistry.registerPPABuyer(buyerAddr);
                isClaimed = true;
                emit purchasedPPA(listOfPPAs[i].id, listOfPPAs[i].buyer, listOfPPAs[i].producer);
                if(isClaimed){
                    if(listOfPPAs.length > 1){
                        listOfPPAs[i] = listOfPPAs[listOfPPAs.length-1];
                    }
                    listOfPPAs.length--;
                    break;
                }
            }
        }
    }

    //this is a trial function just for PPA_energy_trading part
    function availableKwhs(address _buyer, uint _energy, uint _idOfMatchPPA) public onlyRegisteredProducers{
        address _producer = msg.sender;
        listOfkwhs.push(producerEnergy({
            producer: _producer,
            buyer: _buyer,
            timestamp: block.timestamp,
            energy: _energy,
            idOfmatchContract: _idOfMatchPPA
        }));
    }

    function buyPPAKwhs(uint _idOfPPA) public onlyPPABuyers{
        uint currentTime = block.timestamp;
        address aBuyer = msg.sender; 
        for(uint j = 0; j<Appas.length; j++){ //uint j = 0; j<Appas.length; j++
            //search on Approved PPAs to match the id - producer with kwhs
            for(uint i = 0; i<listOfkwhs.length; i++){ //uint i = 0; i<listOfkwhs.length; i++
                uint totalEnergyPurchased = 0;
                //find the correct available kwhs based on id of ppa
                if((Appas[j].producer == listOfkwhs[i].producer) && (Appas[j].id == _idOfPPA) && (Appas[j].id == listOfkwhs[i].idOfmatchContract)){
                    require(Appas[j].startDay <= currentTime, "PPA is not active yet");
                    //if endDay < now then PPA has expired 
                    if(Appas[j].endDay < currentTime){
                        revert("PPA has expired");
                    }
                    totalEnergyPurchased = listOfkwhs[i].energy;
                    Appas[j].totalKwh = Appas[j].totalKwh + totalEnergyPurchased;
                    listOfkwhs[i].energy = 0;
                    listOfprchs.push(purchasesPPA({
                        buyer: aBuyer,
                        producer: listOfkwhs[i].producer,
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

    function buyEnergyByPPA(uint _idOfContract, uint _buyEnergy) public onlyPPABuyers{
        uint currentTime = block.timestamp;
        uint buyEnergy = _buyEnergy;
        address aBuyer = msg.sender; 
        address _producer;
        bool isEnergyPurchased = false;
        for(uint j = 0; j<Appas.length; j++){
            for(uint i = 0; i<listOfkwhs.length; i++){
                uint totalEnergyPurchased = 0;
                if((Appas[j].producer == listOfkwhs[i].producer) && (Appas[j].id == _idOfContract) && (listOfkwhs[i].buyer == aBuyer) && (Appas[j].id == listOfkwhs[i].idOfmatchContract)){
                    require(Appas[j].startDay <= currentTime, "PPA is not active yet");
                    if(Appas[j].endDay < currentTime){
                        revert("PPA has expired");
                    }
                    if(listOfkwhs[i].energy < buyEnergy){
                        _producer = listOfkwhs[i].producer;
                        totalEnergyPurchased = listOfkwhs[i].energy;
                        buyEnergy = buyEnergy - totalEnergyPurchased;
                        Appas[j].totalKwh = Appas[j].totalKwh + totalEnergyPurchased;
                        listOfkwhs[i].energy = 0;

                        isEnergyPurchased = true;

                        if(listOfkwhs.length > 1){
                            listOfkwhs[i] = listOfkwhs[listOfkwhs.length-1];
                        }
                        listOfkwhs.length--;
                        //i--;

                    }else if(listOfkwhs[i].energy == buyEnergy){
                        _producer = listOfkwhs[i].producer;
                        totalEnergyPurchased = buyEnergy;
                        Appas[j].totalKwh = Appas[j].totalKwh + totalEnergyPurchased;
                        buyEnergy = 0;
                        listOfkwhs[i].energy = 0;

                        isEnergyPurchased = true;

                        if(listOfkwhs.length > 1){
                            listOfkwhs[i] = listOfkwhs[listOfkwhs.length-1];
                        }
                        listOfkwhs.length--;

                    }else{
                        _producer = listOfkwhs[i].producer;
                        totalEnergyPurchased = buyEnergy;
                        Appas[j].totalKwh = Appas[j].totalKwh + totalEnergyPurchased;
                        listOfkwhs[i].energy = listOfkwhs[i].energy - buyEnergy;
                        buyEnergy = 0;

                        isEnergyPurchased = true;
                    }

                    if(isEnergyPurchased){
                        listOfprchs.push(purchasesPPA({
                            buyer: aBuyer,
                            producer: _producer,
                            timestamp: currentTime,
                            idOfPPA: listOfkwhs[i].idOfmatchContract,
                            purchasedEnergy: totalEnergyPurchased
                        }));
                    }
                    
                    if(buyEnergy == 0){
                        break;
                    }
                }
                /*if(buyEnergy == 0){
                    //i--;
                    break;
                }*/
            }
        }
    }

    function killPPA(uint _id) public {
        uint currentTime = block.timestamp;
        for(uint i = 0; i<Appas.length; i++){
            if((Appas[i].id == _id) && (Appas[i].endDay < currentTime)){
                Appas[i].status = Status.Expired;
                listOfPPAs.push(ppa({
                    buyer: Appas[i].buyer,
                    producer: Appas[i].producer,
                    kwhPrice: Appas[i].kwhPrice,
                    startDay: Appas[i].startDay,
                    endDay: Appas[i].endDay,
                    id: Appas[i].id,
                    status: Status.Expired
                }));
                ppaBuyerRegistry.deregisterPPABuyer(Appas[i].buyer);
                emit expiredPPA(Appas[i].producer, Appas[i].buyer, Appas[i].startDay, Appas[i].endDay, Appas[i].status);
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

    function viewCorporatePPAlist() public view returns(ppa[] memory){
        return corporatePPAList;
    }

    function getApprovedPPAByID(uint _id) public view returns (address, address, uint, uint, uint){
        approvedPPA storage _Appa = Appas[_id];
        return(_Appa.producer, _Appa.buyer, _Appa.kwhPrice, _Appa.startDay, _Appa.endDay);
    }

    function getPPAByID(uint _id) public view returns (address, address, uint, uint, uint, uint, uint){
        ppa storage _ppa = listOfPPAs[_id];
        return(_ppa.producer, _ppa.buyer, _ppa.kwhPrice, _ppa.startDay, _ppa.endDay, uint(_ppa.status), _ppa.id);
    }

    function viewAvailableKwhs() public view returns(producerEnergy[] memory){
        return listOfkwhs;
    }

    function getAvKwhs() public view returns(uint count){
        return listOfkwhs.length;
    }
}