pragma solidity >=0.4.21 <0.7.0;
pragma experimental ABIEncoderV2;

contract PPAToken {

    string public name = "PPA Token"; 
    string public symbol = "PPA";
    string public standard = "PPA v1.0";
    uint256 public totalSupply;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    event Approval(address indexed _owner, address indexed _spender, uint256 _value);
    event Claim(address _buyer, uint256 _amount);

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value, "Not enough balance");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(
            balanceOf[_from] >= _value,
            "_from does not have enough tokens"
        );
        require(
            allowance[_from][msg.sender] >= _value,
            "Spender limit exceeded"
        );
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;
        allowance[_from][msg.sender] -= _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}

contract PPA is PPAToken{

    PPAToken public tokenContract;

    enum Status {Pending, Approved, Rejected}

    struct ppa {
        address buyerID;
        address payable producerID;
        uint energy;
        uint price;
        uint startDay;
        uint endDay;
        Status status;
    }

    mapping(uint => ppa) ppas;
    ppa[] listOfPPAs;

    function createPPA(address _buyerID, uint _energy, uint _price, uint _startDay, uint _endDay, PPAToken _tokenContract) public {
        tokenContract = _tokenContract;
        uint256 _tokenSupply = 1;
        require(_buyerID != msg.sender, "Wrong");
        balanceOf[msg.sender] = _tokenSupply;
        totalSupply = _tokenSupply;

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

        //uint256 numberOfToken
        uint256 _numberOfPPA = 1;
        address buyerId = msg.sender;

        require(
            msg.value == _numberOfPPA * tokenPrice,
            "Number of tokens does not match with the value"
        );
        require(
            tokenContract.balanceOf(address(this)) >= _numberOfPPA,
            "Contact does not have enough tokens"
        );
        require(
            tokenContract.transfer(msg.sender, _numberOfPPA),
            "Some problem with token transfer"
        );

        for(uint i = 0; i<listOfPPAs.length; i++){
            require(listOfPPAs[i].producerID != msg.sender, "Wrong2");
            if((listOfPPAs[i].buyerID == buyerId)){
                require(listOfPPAs[i].status != Status.Rejected, "You can not accept a rejected PPA");
                listOfPPAs[i].status = Status.Approved;
            }
        }
        emit Claim(buyerId, _numberOfPPA);
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

    function viewAllPPAs () public view returns (ppa[] memory){
        return listOfPPAs;
    }
}