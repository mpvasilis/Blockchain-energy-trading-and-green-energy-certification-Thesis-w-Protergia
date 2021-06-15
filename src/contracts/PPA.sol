pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

import "src/contracts/Battery.sol";

contract PPA is batteryRegistry{

    struct wPPA {
        address buyerID;
        address producerID;
        uint64 energy;
        uint32 price;
        uint32 startDay;
        uint32 endDay;
        string status;
    }

    struct aPPA {
        address buyerID;
        address producerID;
        uint64 energy;
        uint32 price;
        uint32 startDay;
        uint32 endDay;
        string status;
    }

    mapping(string => wPPA) wppas;
    wPPA[] listOfWaitingPPAs;

    mapping(string => aPPA) apps;
    aPPA[] listOfActivePPAs;

    function createPPA(address _buyerID, uint64 _energy, uint32 _price, uint32 _startDay, uint32 _endDay) public onlyRegisteredBattery {

        require(_buyerID != msg.sender, "Wrong");

        listOfWaitingPPAs.push(wPPA({
            buyerID: _buyerID,
            producerID: msg.sender,
            energy: _energy,
            price: _price,
            startDay: _startDay,
            endDay: _endDay,
            status: "Waiting"
        }));
    }

    function acceptPPA(string memory _status) public onlyRegisteredBattery {

        address buyerId = msg.sender;

        for(uint i = 0; i<listOfWaitingPPAs.length; i++){
            if((listOfWaitingPPAs[i].buyerID == buyerId)){
                listOfActivePPAs.push(aPPA({
                    buyerID: msg.sender,
                    producerID: listOfWaitingPPAs[i].producerID,
                    energy: listOfWaitingPPAs[i].energy,
                    price: listOfWaitingPPAs[i].price,
                    startDay: listOfWaitingPPAs[i].startDay,
                    endDay: listOfWaitingPPAs[i].endDay,
                    status: _status
                }));
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

    function viewAllWaitingPPAs () public view returns (wPPA[] memory){
        return listOfWaitingPPAs;
    }

    function viewAllActivePPAs () public view returns (aPPA[] memory){
        return listOfActivePPAs;
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