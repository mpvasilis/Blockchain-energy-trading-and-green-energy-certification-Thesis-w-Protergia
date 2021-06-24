pragma solidity >=0.4.21 <0.9.0;
pragma experimental ABIEncoderV2;

import "src/contracts/token/ERC1155.sol";
import "src/contracts/token/ERC1155Mintable.sol";
import "src/contracts/token/IERC1155.sol";

//import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
/*
*Installed open zeppelin version 3.1.0
*https://github.com/OpenZeppelin/openzeppelin-contracts/tree/v3.1.0
*with "npm i @openzeppelin/contracts@3.1.0"
*/
contract PPAToken is ERC1155, ERC1155Mintable {
    constructor() public {

    }
}
contract PPA is IERC1155{

    IERC1155 private _token;

    mapping (uint => uint) price;

    enum Status {Pending, Approved, Rejected}
    event createdPPA(address indexed producer, uint energy, uint price);
    event purchasedPPA(uint itemID, address indexed buyer, address indexed producer);
    event changedPPA(address indexed producer, address indexed buyer, uint energy, uint endDay);

    struct ppa {
        address buyerID;
        address producerID;
        uint energy;
        uint price;
        uint startDay;
        uint endDay;
        uint collectID;
        Status status;
    }

    mapping(address => uint) ppas;
    ppa[] listOfPPAs;
    uint nextCollectID = 0;

    function createPPA(uint _energy, uint _price, uint _endDay, IERC1155 token) public {
        require(address(token) != address(0x0));
        price[nextCollectID] = 1;
        token = _token;
        address _producerID = msg.sender;
        listOfPPAs.push(ppa({
            buyerID: address(0x0),
            producerID: _producerID,
            energy: _energy,
            price: _price,
            startDay: block.timestamp,
            endDay: _endDay,
            collectID: nextCollectID,
            status: Status.Pending
        }));
        //ERC1155Mintable.create(price[nextCollectID], "PPA");
        //mint(_producerID, nextCollectID, 1, "");
        nextCollectID++;
        emit createdPPA(_producerID, _energy, _price);
    }

    function changePPATerms(address _buyerID, uint _endDay) public{
        for(uint i = 0; i<listOfPPAs.length; i++){
            if(listOfPPAs[i].buyerID == _buyerID){
                require(listOfPPAs[i].status != Status.Approved, "You can not change an approved PPA");
                listOfPPAs[i].endDay = _endDay;
                emit changedPPA(listOfPPAs[i].producerID, listOfPPAs[i].buyerID, listOfPPAs[i].energy, listOfPPAs[i].endDay);
            }
        }
    }

    function claimPPA() external payable {
        address buyerId = msg.sender;
        //uint tokenId = 1;
        for(uint i = 0; i<listOfPPAs.length; i++){
            require(listOfPPAs[i].producerID != buyerId, "Wrong address buyer");
            require(listOfPPAs[i].status != Status.Rejected, "You can not accept a rejected PPA");
            listOfPPAs[i].status = Status.Approved;
            listOfPPAs[i].buyerID = buyerId;
            claimToken(listOfPPAs[i].producerID, listOfPPAs[i].buyerID, listOfPPAs[i].collectID);
            emit purchasedPPA(listOfPPAs[i].collectID, listOfPPAs[i].buyerID, listOfPPAs[i].producerID);
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

    function claimToken(address _from, address _to, uint tokenID) public payable{
        uint256 weiAmount = msg.value;
        require(weiAmount >= price[tokenID] && price[tokenID] != 0, "error");

        _token.safeTransferFrom(_from, _to, tokenID, 1 wei, "PPA");
    }

    function onERC1155Received(address _operator, address _from, uint256 _id, uint256 _value, bytes calldata _data) external returns(bytes4){
        return bytes4(keccak256("onERC1155Received(address,address,uint256,uint256,bytes)"));
    }

    function buyEnergyByPPA() public{

    }

    function viewAllPPAs () public view returns (ppa[] memory){
        return listOfPPAs;
    }

    function getPPAbyID(uint _id) public view returns (address, address, uint, uint, uint, uint, uint){
        ppa storage _ppa = listOfPPAs[_id];
        return (_ppa.producerID, _ppa.buyerID, _ppa.energy, _ppa.price, _ppa.startDay, _ppa.endDay, uint(_ppa.status));
    }
}