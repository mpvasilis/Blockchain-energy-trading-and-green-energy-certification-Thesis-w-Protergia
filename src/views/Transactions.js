import React, {useEffect, useRef, useState} from "react";
import TablePagination from '../components/pagination/TablePagination';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from "prop-types";
import detectEthereumProvider from '@metamask/detect-provider';
import moment from 'moment';

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

var contractAddress = '0xf204b9E3f564ef0F5d827B50A8879D058FA191A9' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askEnergyNotifier","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"offerEnergyNotifier","type":"event"},{"constant":false,"inputs":[{"internalType":"string","name":"typeOfDevice","type":"string"}],"name":"addDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"askEnergy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"}],"name":"energyOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getAsksByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getBidsByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"deviceID","type":"address"}],"name":"getDeviceByAddress","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getPurchaseByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"ownerOfDevice","type":"address"},{"internalType":"string","name":"typeOfDevice","type":"string"}],"name":"updateDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"viewAllAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAllBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAllEnergyPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}] ;
const energyTrading = new web3.eth.Contract(abi, contractAddress);
var contractAddress = '0xc3D742625B6a5bfD7E28f8D80c5241cB6A8E32F4' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"bidRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onNewAsk","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onNewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onUpdateAsk","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onUpdateBid","type":"event"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"energyAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"}],"name":"energyBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getAskByID","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getBidByID","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfAsk","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"updateAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfBid","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"updateBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}] ;
const marketPlace = new web3.eth.Contract(abi, contractAddress);


function Transactions() {
  const account = useRef('');
  const [totalAsks, setTotalAsks] = useState(0);
  const [asks, setAsks] = useState(null);
  const [data, setData] = useState(null);
  const [myData, setMyData] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentPageMP, setCurrentPageMP] = useState(0);
  const [pagesCount, setPagesCount] = useState(0);
  const [pagesCountMP, setPagesCountMP] = useState(0);
  const [purchases, setPurchases] = useState(null);
  const [myPurchases, setMyPurchases] = useState(null);
  const [totalPurchases, setTotalPurchases] = useState(0);
  const [totalMyPurchases, setTotalMyPurchases] = useState(0);
  const [disable, setDisable] = useState(false);
  const[alert, setAlert] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const pageSize = 10;

  const handleAccountsChanged = async (accounts) => {

    console.log("ACCS: ", accounts);
    if(accounts.length === 0) {

      setIsConnected(false)
      console.log("connect to metamsk");
    }else if(accounts[0] !== account.current){
      account.current = accounts[0];
      setIsConnected(true)
       
       await energyTrading.methods.getDeviceByAddress(account.current).call({from: account.current}).then(function(result){

          // console.log("Object.values(result).length:", Object.values(result).length);
          if (account.current ==  Object.values(result)[0]){
            setAlert(false);
            setDisable(false);
          }
           else {
            setAlert(true);
            setDisable(true);
          } 
          
        });
        
      console.log('Current addr: ', account.current);
    }
    
    console.log("account current:", account.current);  
  }

const signInMetamask = async(accounts) => {
  const provider = await detectEthereumProvider();
  

  if(provider !== window.ethereum) {
    console.error('Do you have multiple wallets installed?');
  }

  if(!provider) {
    console.error('Metamask not found');
    return;
  }

  provider.on('accountsChanged', handleAccountsChanged);

  provider.on('disconnect', () => {
    
    console.log('disconnect');
    account.current = '';
  });

  provider.on('chainIdChanged', chainId => {
    console.log('chainIdChanged', chainId);
    
  });
  

  provider.request({method: 'eth_requestAccounts' }).then(async params => {
    handleAccountsChanged(params);
    
  }).catch(err => {
    if(err.code === 4001){
      console.error('Please connect to Metamask.');
    }else {
      console.error(err);
    }
    
  })
};
  // const handlePageClick = (e, page) => {
  //   console.log(page);
  //   e.preventDefault();
  //   setCurrentPage(page);
  //   console.log(page);
  //   getData(page  * pageSize);
  //   console.log(page);
  // };

  // const handlePreviousClick= e => {
  //   const _currentPage = currentPage - 1 ;
  //   e.preventDefault();
  //   setCurrentPage(_currentPage);
  //    getData(_currentPage   * pageSize);
  //    console.log(_currentPage);
  // };

  // const handleNextClick= e => {
  //   const _currentPage = currentPage + 1 ;
  //   e.preventDefault();
  //   setCurrentPage(_currentPage);
  //    getData(_currentPage  * pageSize);
  //    console.log(_currentPage);
  // };

  const handlePageClickMP = (e, page) => {
    console.log(page);
    e.preventDefault();
    setCurrentPageMP(page);
    console.log(page);
    getMyData(page  * pageSize);
    console.log(page);
  };

  const handlePreviousClickMP= e => {
    const _currentPageMP = currentPageMP - 1 ;
    e.preventDefault();
    setCurrentPageMP(_currentPageMP);
     getMyData(_currentPageMP  * pageSize);
     console.log(_currentPageMP);
  };

  const handleNextClickMP= e => {
    const _currentPageMP = currentPageMP + 1 ;
    e.preventDefault();
    setCurrentPageMP(_currentPageMP);
     getMyData(_currentPageMP  * pageSize);
     console.log(_currentPageMP);
  };

  // const getData = (offset)=>{

  //   if(data===null){
  //   energyTrading.methods.getCountOfPurchases().call().then(function(total){
  //     setTotalPurchases(total)
  //     setPagesCount(Math.ceil(total / pageSize));

  //     if(total>0)
  //     energyTrading.methods.viewAllEnergyPurchases().call()
  //         .then(function(result){
  //           setData(result);
  //           console.log(pageSize + offset);
  //           var rows = [];
  //           for (var i = offset; i < pageSize + offset  ; i++) {
  //             if(i >= pageSize)  break;
  //             if(i >= total)  break;

  //             rows.push( <tr key={i}>
  //               <td>{result[0][i].substr(0,6)}</td>
  //               <td>{result[1][i].substr(0,6)}</td>
  //               <td>{result[2][i]}</td>
  //               <td>{result[3][i]/100}</td>
  //               <td>{result[4][i]}</td>
  //             </tr>);
  //           }
  //           setPurchases(rows)
  //         });
  //   });
  // }else{
  //   let rows = [];
  //   for (let i = offset; i < pageSize + offset  ; i++) {
  //     if(i < totalPurchases )  {
  //     rows.push( <tr key={i}>
  //       <td>{data[0][i].substr(0,6)}</td>
  //       <td>{data[1][i].substr(0,6)}</td>
  //       <td>{data[2][i]}</td>
  //       <td>{data[3][i]/100}</td>
  //       <td>{data[4][i]}</td>
  //     </tr>);
  //     }
  //   }
  //   setPurchases(rows)
  //   console.log(rows);
  // }

  // }
  const getMyData = (offset, update = false)=>{

    if(myData===null || update){
      marketPlace.methods.getCountOfPurchases().call({from: account.current}).then(function(total){
        console.log("total purchases:" , total);
      setTotalMyPurchases(total);
      setPagesCountMP(Math.ceil(total / pageSize));
      

      if(total>0)
      marketPlace.methods.getPurchases().call({from: account.current})
          .then(function(result){
            setMyData(result);
            console.log(pageSize + offset);
            var rows = [];
            for (var i = offset; i < pageSize + offset  ; i++) {
              if(i >= total)  break;

              rows.push( <tr key={i}>
                <td>{result[3][i]}</td>
                <td>{result[0][i].substr(0,6)}</td>
                <td>{result[1][i].substr(0,6)}</td>
                <td>{result[2][i]/1000000}</td>
                <td>{result[4][i]/1000000000000}</td>
                <td>{moment((moment.unix(result[5][i]))).startOf('minute').fromNow()}</td>
              </tr>);
            }
            setMyPurchases(rows);
            console.log(rows);
          });
    });
  }
  else{
    let rows = [];
    for (let i = offset; i < pageSize + offset  ; i++) {
      if(i < totalMyPurchases )  {
      rows.push( <tr key={i}>
       <td>{myData[3][i]}</td>
       <td>{myData[0][i].substr(0,6)}</td>
       <td>{myData[1][i].substr(0,6)}</td>
       <td>{myData[2][i]/1000000}</td>
       <td>{myData[4][i]/1000000000000}</td>
       <td> <td>{moment((moment.unix(myData[5][i]))).startOf('minute').fromNow()}</td></td>
      </tr>);
      setMyData(null);
      }
    }
    setMyPurchases(rows)//* update table*/
    console.log(rows);
  }}

  if(myData===null){
        getMyData(currentPageMP * pageSize, true);
  }

  useEffect(() => {
    
    web3.eth.getAccounts().then(r=>{
      handleAccountsChanged(r);
    });
    // getData(currentPage * pageSize);
    // getMyData(currentPageMP * pageSize, true);
  }, []);

  return (
    <>
      <div className="content">

        <Row>
          <Col md="12">
          {totalMyPurchases>0 ?
                <Card>
              <CardHeader>
                <h5 className="title">Purchased Energy</h5>
              </CardHeader>
              <CardBody>

                {myPurchases!==null ?
                    <Table className="tablesorter" responsive>
                      <thead className="text-primary">
                  <tr>
                    <th>id</th>
                    <th>Buyer</th>
                    <th>Seller</th>
                    <th>Energy (KWhs)</th>
                    <th>Price</th>
                    <th>Date</th>
                  </tr>
                  </thead>
                  <tbody>
                  {myPurchases}

                  </tbody>
                </Table> 
                : <></>}
                <TablePagination
                  pagesCount={pagesCountMP}
                  currentPage={currentPageMP}
                  handlePageClick={handlePageClickMP}
                  handlePreviousClick={handlePreviousClickMP}
                  handleNextClick={handleNextClickMP}
      />
              </CardBody>
              <CardFooter>

              </CardFooter>
            </Card>
               : <></> } 
          {/* {totalPurchases>0 ?
                <Card>
              <CardHeader>
                <h5 className="title">Purchased Energy {totalPurchases}</h5>
              </CardHeader>
              <CardBody>

                {purchases!==null ?
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
                  {purchases}

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
            </Card> : <></>} */}
          </Col>
        </Row>
      </div>
    </>
  );
}
export default Transactions;
