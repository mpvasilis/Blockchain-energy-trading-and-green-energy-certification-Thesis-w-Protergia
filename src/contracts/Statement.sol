pragma solidity >=0.4.21 <0.9.0;

contract Statement {
    
    struct data {
        address client;
        uint typeOfStatement;
        uint energy;
        uint fromDate;
        uint toDate;
    }
    data[] statements;

    function statement(uint _typeOfStatement, uint _energy, uint _fromDate, uint _toDate) public {
        address _client = msg.sender;
        require(_toDate > _fromDate, "Wrong Date");
        statements.push(data({
            client: _client,
            typeOfStatement: _typeOfStatement,
            energy: _energy,
            fromDate: _fromDate,
            toDate: _toDate
        }));
    }

    function getStatements() public view returns(uint count){
        return statements.length;
    }

    function getCountOfStatementsByAddress() public view returns(uint){
        address currentAddress = msg.sender;
        uint count = 0;
        for(uint i = 0; i<statements.length; i++){
            if(statements[i].client == currentAddress){
                count++;
            }
        }
        return count;
    }

    function viewCorporatePPAlist() public view returns(address[] memory, uint[] memory, uint[] memory, uint[] memory, uint[] memory){
        uint k = 0;
        uint cnt = getCountOfStatementsByAddress();
        address[] memory _clients = new address[](cnt);
        uint[] memory _typeOfStatement = new uint[](cnt);
        uint[] memory _energy = new uint[](cnt);
        uint[] memory _fromDate = new uint[](cnt);
        uint[] memory _toDate = new uint[](cnt);

        for(uint i = 0; i < statements.length; i++){
            if(statements[i].client == msg.sender){
                _clients[k] = statements[i].client;
                _typeOfStatement[k] = statements[i].typeOfStatement;
                _energy[k] = statements[i].energy;
                _fromDate[k] = statements[i].fromDate;
                _toDate[k] = statements[i].toDate;
                k++;
            }
        }
        return(_clients, _typeOfStatement, _energy, _fromDate, _toDate);
    }
}