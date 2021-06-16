pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract PPA{

    enum Status {NotExist, Pending, Approved, Rejected}

    struct ppa {
        address buyerID;
        address producerID;
        uint energy;
        uint price;
        uint startDay;
        uint endDay;
        Status status;
    }

    mapping(string => ppa) ppas;
    ppa[] listOfPPAs;

    function createPPA(address _buyerID, uint _energy, uint _price, uint _startDay, uint _endDay) public {

        require(_buyerID != msg.sender, "Wrong");

        listOfPPAs.push(ppa({
            buyerID: _buyerID,
            producerID: msg.sender,
            energy: _energy,
            price: _price,
            startDay: _startDay,
            endDay: _endDay,
            status: Status.Pending
        }));
    }

    function changePPATerms(address _buyerID, uint _energy, uint _price, uint _startDay, uint _endDay) public {
        for(uint i = 0; i<listOfPPAs.length; i++){
            if(listOfPPAs[i].buyerID == _buyerID){
                listOfPPAs[i].energy = _energy;
                listOfPPAs[i].price = _price;
                listOfPPAs[i].startDay = _startDay;
                listOfPPAs[i].endDay = _endDay;
            }
        }
    }

    function acceptPPA() public {
        address buyerId = msg.sender;
        for(uint i = 0; i<listOfPPAs.length; i++){
            require(listOfPPAs[i].producerID != msg.sender, "Wrong2");
            if((listOfPPAs[i].buyerID == buyerId)){
                listOfPPAs[i].status = Status.Approved;
            }else{
                break;
            }
        }
    }

    function denyPPA() public {
        address buyerId = msg.sender;
        for(uint i = 0; i<listOfPPAs.length; i++){
            require(listOfPPAs[i].producerID != msg.sender, "Wrong3");
            if((listOfPPAs[i].buyerID == buyerId)){
                listOfPPAs[i].status = Status.Rejected;
            }else{
                break;
            }
        }
    }

    /*function PPA(wPPA memory _ppa) public onlyRegisteredBattery {
        for(uint i = 0; i<listOfppas.length; i++){
            if(listOfppas[i].producerID == msg.sender){

            }
        }
    }*/

    function viewAllWaitingPPAs () public view returns (ppa[] memory){
        return listOfPPAs;
    }

    /*function getPPA(string memory _status) public view returns(ppa[] memory){
        //require(_status = "Waiting" || _status = "Active", "it must be Waiting or Active only");

        if(_status = "Active"){
            return listOfppas[_status];
        }else{
            return listOfppas[_status];
        }
    }*/
}