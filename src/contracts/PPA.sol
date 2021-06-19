pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

import "src/contracts/token/ERC1155.sol";
import "src/contracts/token/ERC1155Mintable.sol";
import "src/contracts/token/IERC1155.sol";

contract PPAToken is ERC1155, ERC1155Mintable {
  constructor() public {
  }
}

contract PPA {

    IERC1155 private _token;

    mapping (uint => uint) price;

    enum Status {Pending, Approved, Rejected}
    event Claim(address _buyer, uint256 _amount);

    struct ppa {
        address buyerID;
        address payable producerID;
        uint energy;
        uint price;
        uint startDay;
        uint endDay;
        Status status;
    }

    /////////////////////////////////////Implematation of ERC1155 Token Tomorrow/////////////////////////////////////
    mapping(uint => ppa) ppas;
    ppa[] listOfPPAs;

    function createPPA(address _buyerID, uint _energy, uint _price, uint _startDay, uint _endDay) public payable {
        address payable _producerID = msg.sender;

        listOfPPAs.push(ppa({
            buyerID: _buyerID,
            producerID: _producerID,
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
                require(listOfPPAs[i].status != Status.Approved, "You can not change an approved PPA");
                listOfPPAs[i].energy = _energy;
                listOfPPAs[i].price = _price;
                listOfPPAs[i].startDay = _startDay;
                listOfPPAs[i].endDay = _endDay;
                listOfPPAs[i].status = Status.Pending;
            }
        }
    }

    function claimPPA() public payable {
        address buyerId = msg.sender;

        for(uint i = 0; i<listOfPPAs.length; i++){
            require(listOfPPAs[i].producerID != buyerId, "Wrong2");
            if((listOfPPAs[i].buyerID == buyerId)){
                require(listOfPPAs[i].status != Status.Rejected, "You can not accept a rejected PPA");
                listOfPPAs[i].status = Status.Approved;
            }
        }
    }

    function denyPPA() public {
        address buyerId = msg.sender;
        for(uint i = 0; i<listOfPPAs.length; i++){
            require(listOfPPAs[i].producerID != msg.sender, "Wrong3");
            if((listOfPPAs[i].buyerID == buyerId)){
                listOfPPAs[i].status = Status.Rejected;
            }
        }
    }

    function buyEnergy() public{

    }

    function viewAllPPAs () public view returns (ppa[] memory){
        return listOfPPAs;
    }
}