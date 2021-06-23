pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

import "src/contracts/token/ERC1155.sol";
import "src/contracts/token/ERC1155Mintable.sol";
import "src/contracts/token/IERC1155.sol";
import "src/contracts/Battery.sol";

contract PPAToken is ERC1155, ERC1155Mintable {
  constructor() public {
  }
}

contract PPA is owned{

    IERC1155 private _token;

    mapping (uint => uint) price;

    enum Status {Pending, Approved, Rejected}
    event Claim(address _buyer, uint256 _amount);

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

    mapping(uint => ppa) ppas;
    ppa[] listOfPPAs;
    uint nextCollectID = 0;

    function createPPA(uint _energy, uint _price, uint _endDay, IERC1155 token) public payable {
        
        require(address(token) != address(0x0));
        _token = token;
        price[nextCollectID] = 1 wei;
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
        nextCollectID++;
    }

    function changePPATerms(address _buyerID, uint _endDay) public{
        for(uint i = 0; i<listOfPPAs.length; i++){
            if(listOfPPAs[i].buyerID == _buyerID){
                require(listOfPPAs[i].status != Status.Approved, "You can not change an approved PPA");
                listOfPPAs[i].endDay = _endDay;
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

    function viewAllPPAs () public view returns (ppa[] memory){
        return listOfPPAs;
    }
}