import React, {useEffect, useState} from "react";
import TablePagination from '../components/pagination/TablePagination';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from "prop-types";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col, Table,
} from "reactstrap";
import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "wss://ropsten.infura.io/ws/v3/5f552c63b2834a588871339fd81f7943");

var contractAddress = '0x9b8EAFe0CF9309DBec8830C2844513A5268f4241' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askEnergyNotifier","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"offerEnergyNotifier","type":"event"},{"constant":false,"inputs":[{"internalType":"string","name":"uuID","type":"string"}],"name":"addDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"askEnergy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"}],"name":"energyOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getAsksByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getBidsByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"deviceID","type":"address"}],"name":"getDeviceByAddress","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getPurchaseByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"ownerOfDevice","type":"address"},{"internalType":"string","name":"uuID","type":"string"}],"name":"updateBattery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAllAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAllBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAllEnergyPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}] ;
const energyTrading = new web3.eth.Contract(abi, contractAddress);



function Transactions() {
  const [totalAsks, setTotalAsks] = useState(0);
  const [asks, setAsks] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  const pageSize = 10;
  
 
  
  const handlePageClick = (e, currentPage) => {
    e.preventDefault();
    setCurrentPage(currentPage);
    getData(currentPage * pageSize);
  };

  const handlePreviousClick= e => {
    e.preventDefault();
    setCurrentPage(currentPage - 1);
     getData((currentPage - 1) * pageSize);

  };

  const handleNextClick= e => {
    e.preventDefault();
    setCurrentPage(currentPage + 1);
     getData((currentPage + 1) * pageSize);

    
  };
  
  const getData = (offset)=>{

    
    energyTrading.methods.getCountOfPurchases().call().then(function(total){
      setTotalAsks(total)
      setPagesCount(Math.ceil(total / pageSize));
      console.log(total);
      if(total>0)
      energyTrading.methods.viewAllEnergyPurchases(pageSize, offset).call()
          .then(function(result){
            console.log(result);
            var rows = [];
            for (var i = 0; i < total - offset; i++) {
              if(i >= pageSize)  break;
              if(i >= total)  break;

              rows.push( <tr key={i}>
                <td>{result[0][i].substr(0,6)}</td>
                <td>{result[1][i].substr(0,6)}</td>
                <td>{result[2][i]}</td>
                <td>{result[3][i]}</td>
                <td>{result[4][i]}</td>
              </tr>);
            }
            setAsks(rows)
          });
    });


  }

  useEffect(() => {
   
    getData(currentPage * pageSize);
    
  }, []);
 

  return (
    <>
      <div className="content">
      
        <Row>
          <Col md="12">
          {totalAsks>0 ?
                <Card>
              <CardHeader>
                <h5 className="title">Purchased Energy</h5>
              </CardHeader>
              <CardBody>
              
                {asks!==null ?
                    <Table className="tablesorter" responsive>
                      
                      
                      <thead className="text-primary">
                  <tr>
                    <th>Seller</th>
                    <th>Buyer</th>
                    <th>Energy (KWhs)</th>
                    <th>Price</th>
                    <th>Date</th>

                  </tr>
                  </thead>
                  <tbody> 
                  {asks}

                  </tbody>
                </Table> : <></>}
                <TablePagination
                  pagesCount={pagesCount}
                  currentPage={currentPage}
                  handlePageClick={handlePageClick}
                  handlePreviousClick={handlePreviousClick}
                  handleNextClick={handleNextClick}
      />
              </CardBody>
              <CardFooter>   
              
              </CardFooter>
            </Card> : <></>}
            
          </Col>
         

        </Row>
      </div>
      
    </>
  );
}



export default Transactions;
