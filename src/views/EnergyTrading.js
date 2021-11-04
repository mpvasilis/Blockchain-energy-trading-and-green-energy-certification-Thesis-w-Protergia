import React, {useEffect, useState, useRef} from "react";
import TablePagination from '../components/pagination/TablePagination';
import detectEthereumProvider from '@metamask/detect-provider';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import moment from 'moment';
import Modal from  'react-modal';


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
import { isNumericLiteral } from "typescript";
const web3 = new Web3(Web3.givenProvider || "wss://ropsten.infura.io/ws/v3/5f552c63b2834a588871339fd81f7943");

var contractAddress = '0xf204b9E3f564ef0F5d827B50A8879D058FA191A9' ;
var abi =  [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askEnergyNotifier","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"offerEnergyNotifier","type":"event"},{"constant":false,"inputs":[{"internalType":"string","name":"typeOfDevice","type":"string"}],"name":"addDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"askEnergy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"}],"name":"energyOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getAsksByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getBidsByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"deviceID","type":"address"}],"name":"getDeviceByAddress","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getPurchaseByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"ownerOfDevice","type":"address"},{"internalType":"string","name":"typeOfDevice","type":"string"}],"name":"updateDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"viewAllAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAllBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAllEnergyPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}] ;
// const deviceRegistry = new web3.eth.Contract(abi, contractAddress);
const energyTrading = new web3.eth.Contract(abi, contractAddress);
var contractAddress = '0xD55D0E90Ae7FE6e03D22CdE72515D61974Ab526B' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onAskEnergy","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onBidEnergy","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onPurchased","type":"event"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"energyAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"}],"name":"energyBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getAskByID","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getBidByID","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}] ;
const marketPlace = new web3.eth.Contract(abi, contractAddress);

function EnergyTrading() {
  const [open, setOpen] = useState('bid');
  const [totalAsks, setTotalAsks] = useState(0);
  const [asks, setAsks] = useState(null);
  const [totalBids, setTotalBids] = useState(0);
  const [dataBids, setDataBids] = useState(null);
  const [dataAsks, setDataAsks] = useState(null);
  const [bids, setBids] = useState(null);
  const [currentPageΒ, setCurrentPageΒ] = useState(0);
  const [currentPageA, setCurrentPageA] = useState(0);
  const [currentPageMA, setCurrentPageMA] = useState(0);
  const pageSize = 10;
  const [pagesCountAsk, setPagesCountAsk] = useState(0);
  const [pagesCountMyAsk, setPagesCountMyAsk] = useState(0);
  const [pagesCountBid, setPagesCountBid] = useState(0);
  const [energyKW, setEnergyKW] = useState('');
  const [energyModalKW, setEnergyModalKW] = useState('');
  const [priceBid, setPriceBid] = useState('');
  const [priceAsk, setPriceAsk] = useState('');
  const account = useRef('');
  const[error, setError] = useState(false);
  const[errorE, setErrorE] = useState(false);
  const[errorP, setErrorP] = useState(false);
  const[errorPA, setErrorPA] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [disable, setDisable] = useState(false);
  const[alert, setAlert] = useState(false);
  const[modalIsOpen, setModalIsOpen] = useState(false);
  const[modalBidIsOpen, setModalBidIsOpen] = useState(false);
  const [dataMyAsks, setDataMyAsks] = useState(null);
  const [dataMyBids, setDataMyBids] = useState(null);
  const [myAsks, setMyAsks] = useState(null);
  const [myBids, setMyBids] = useState(null);
  const [totalMyAsks, setTotalMyAsks] = useState(0);
  const [totalMyBids, setTotalMyBids] = useState(0);
  const[isLoading, setIsLoading] = useState(false);
  const[isLoadingTrade, setIsLoadingTrade] = useState(false);

  const[id, setId] = useState(false);

let subtitle;
  
 
const signInMetamask = async() => {
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

const handleAccountsChanged = (accounts) => {

  console.log("ACCS: ", accounts);
  if(accounts.length === 0) {
    setIsConnected(false)
    console.log("connect to metamsk");
  }else if(accounts[0] !== account.current){
    account.current = accounts[0];
    setIsConnected(true)
    energyTrading.methods.getDeviceByAddress(account.current).call({from: account.current}).then(function(result){

        // console.log("Object.values(result).length:", Object.values(result).length);

        if (account.current ==  Object.values(result)[0]){
          setAlert(false);
          setDisable(false);
        }
         else{
          setAlert(true);
          setDisable(true);
        } 
        
      });
    console.log('Current addr: ', account.current);
  }
  console.log("account current:", account.current);

    
}
  
  const handlePageClickΒ = (e, page) => {
    console.log(page);
    e.preventDefault();
    setCurrentPageΒ(page);
    console.log(page);
    getDataBids(page  * pageSize);
    console.log(page);
  };

  const handlePreviousClickΒ= e => {
    const _currentPageΒ = currentPageΒ - 1 ;
    e.preventDefault();
    setCurrentPageΒ(_currentPageΒ);
     getDataBids(_currentPageΒ   * pageSize);
     console.log(_currentPageΒ);

  };

  const handleNextClickΒ= e => {
    const _currentPageΒ = currentPageΒ + 1 ;
    e.preventDefault();
    setCurrentPageΒ(_currentPageΒ);
     getDataBids(_currentPageΒ  * pageSize);
     console.log(_currentPageΒ);

  };

  const handlePageClickA = (e, page) => {
    console.log(page);
    e.preventDefault();
    setCurrentPageA(page);
    console.log(page);
    getDataAsks(page  * pageSize);
    console.log(page);
  };

  const handlePreviousClickA= e => {
    const _currentPageA = currentPageA - 1 ;
    e.preventDefault();
    setCurrentPageA(_currentPageA);
     getDataAsks(_currentPageA   * pageSize);
     console.log(_currentPageA);

  };

  const handleNextClickA= e => {
    const _currentPageA = currentPageA + 1 ;
    e.preventDefault();
    setCurrentPageA(_currentPageA);
     getDataAsks(_currentPageA  * pageSize);
     console.log(_currentPageA);

  };
  const handlePageClickMA = (e, page) => {
    console.log(page);
    e.preventDefault();
    setCurrentPageMA(page);
    console.log(page);
    getDataMyAsks(page  * pageSize);
    console.log(page);
  };

  const handlePreviousClickMA= e => {
    const _currentPageMA = currentPageMA - 1 ;
    e.preventDefault();
    setCurrentPageMA(_currentPageMA);
     getDataMyAsks(_currentPageMA   * pageSize);
     console.log(_currentPageMA);

  };

  const handleNextClickMA= e => {
    const _currentPageMA = currentPageMA + 1 ;
    e.preventDefault();
    setCurrentPageMA(_currentPageMA);
     getDataMyAsks(_currentPageMA  * pageSize);
     console.log(_currentPageMA);

  };

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
    },
  };

  const toggleModal = () =>{
    setModalIsOpen(true)
    setIsLoadingTrade(true);
  }
  const afterOpenModal = () =>{
    subtitle.style.color = '#9933cc'
  }

  const closeModal = () =>{
    setModalIsOpen(false);
  }

  const tradeBid =  (id, ammount) => {
   
    console.log(id);
          marketPlace.methods.buyBid(id, ammount).send({from: account.current}).on('transactionHash', (th) => {
          console.log(th);
          toast("You traded successfully!")
          closeModal();   
        });
  }
  const tradeAsk = async (id, ammount) => {
        
        console.log("amount: ", ammount);
        console.log("id: ", id);
       

        await marketPlace.methods.buyAsk(id, ammount).send({from: account.current}).on('transactionHash', (th) => {
          console.log(th);
          toast("You traded successfully!") 
          closeModal();   
        })
        .then(function(receipt){
          setIsLoadingTrade(false);
        })
     
  }

  const getDataAsks = (offset, update = false)=>{

    if(dataAsks===null || update){
    marketPlace.methods.getTotalAsks().call().then(function(askNum){
      console.log("Total asks:" , askNum);
      setTotalAsks(askNum);
      setPagesCountAsk(Math.ceil(askNum / pageSize));
      if(askNum>0)
      marketPlace.methods.getAllAsks().call()
          .then(function(result){
            setDataAsks(result);
            console.log(pageSize + offset);
            var rows = [];
            for (var i = offset; i < pageSize + offset  ; i++) {
              if(i >= askNum)  break;
              setIsLoadingTrade(true);

              rows.push( <tr key={i}>
                  <td>{result[1][i]}</td>
                  <td>{result[0][i].substr(0,6)}</td> 
                  <td>{result[2][i]/1000000}</td>
                  <td>{result[3][i]/100}</td>
                <td>{moment(moment.unix(result[4][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
                
                <td>
                
                { isLoadingTrade ? 
                <div class="lds-hourglass"></div>:
               <Button variant="secondary" size="sm" data-id={result[1][i]} onClick={event=>{setId(event.target.dataset.id); toggleModal();}}>Trade</Button>
                }
               </td>
                </tr>);
            }
            setAsks(rows)
          });
    });
  }
  else{
    let rows = [];
    for (let i = offset; i < pageSize + offset  ; i++) {
      if(i < totalAsks )  { 
      rows.push( <tr key={i}>
        <td>{dataAsks[1][i]}</td>
        <td>{dataAsks[0][i].substr(0,6)}</td>
        <td>{dataAsks[2][i]/1000000}</td>
        <td>{dataAsks[3][i]/100}</td>
        <td>{moment(moment.unix(dataAsks[4][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
       
        <td> 
        { isLoadingTrade ? 
                <div class="lds-hourglass"></div>
              :<Button variant="secondary" size="sm" data-id={dataAsks[1][i]}onClick={event=>{setId(event.target.dataset.id); toggleModal();}}>Trade</Button>
        }
              </td>
      </tr>);
      setDataAsks(null);
      }
    }
    setAsks(rows)
    console.log(rows);
  }
  }

  const getDataBids = (offset, update = false)=>{
    
    if(dataBids===null || update){
    marketPlace.methods.getTotalBids().call().then(function(bidNum){
      console.log("Total bids:" , bidNum);
      setTotalBids(bidNum);
      setPagesCountBid(Math.ceil(bidNum / pageSize));
      
      if(bidNum>0)
        marketPlace.methods.getAllBids().call()
            .then(function(result){
              setDataBids(result);
              console.log(pageSize + offset);
              var rows = [];
              for (var i = offset; i < pageSize + offset  ; i++) {
                if(i >=  bidNum)  break;
                rows.push( <tr key={i}>
                  <td>{result[1][i]}</td>
                  <td>{result[0][i].substr(0,6)}</td> 
                  <td>{result[2][i]/1000000}</td>
                  <td>{result[3][i]/100}</td>
                  <td>{moment(moment.unix(result[4][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
                  <td> <Button variant="secondary" size="sm" data-id={result[1][i]} onClick={event=>{setId(event.target.dataset.id); toggleModal();}}>Trade</Button></td>
                </tr>); 
              }
              setBids(rows)
            });
    });
  }else{
    let rows = [];
    for (let i = offset; i < pageSize + offset  ; i++) {
      if(i < totalBids )  { 
      rows.push( <tr key={i}>
        <td>{dataBids[1][i]}</td>
        <td>{dataBids[0][i].substr(0,6)}</td>
        <td>{dataBids[2][i]/1000000}</td>
        <td>{dataBids[3][i]/100}</td>
        <td>{moment(moment.unix(dataBids[4][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
        <td> <Button variant="secondary" size="sm" data-id={dataBids[1][i]} onClick={event=>{setId(event.target.dataset.id); toggleModal();}}>Trade</Button></td>
      </tr>);
      }
    }
    setBids(rows)
    console.log(rows);
  }
  }

  const getDataMyAsks = async (offset, update = false)=>{

    if(dataMyAsks===null || update){
     await marketPlace.methods.getCountOfAsks().call({from: account.current}).then(function(myAskNum){
      console.log("My total asks:" , myAskNum);
      setTotalMyAsks(myAskNum);
      // setPagesCountMyAsk(Math.ceil(myAskNum / pageSize));

      if(myAskNum>0)
      marketPlace.methods.getMyAsks().call()
          .then(function(result){
            setDataMyAsks(result);
            console.log(pageSize + offset);
            var rows = [];
            for (var i = offset; i < pageSize + offset  ; i++) {
              if(i >= myAskNum)  break;
              rows.push( <tr key={i}>
                 <td>{result[2][i]}</td>
                 <td>{result[0][i]}</td>
                 <td>{result[1][i]/1000000}</td>
                 <td>{result[3][i]/100}</td>
                 <td>{moment(moment.unix(result[4][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
                {/* <td> <Button variant="secondary" size="sm" data-id={result[4][i]} onClick={event => tradeAsk(event.target.dataset.id)}>Trade</Button></td> */}
              </tr>);
            }
            setMyAsks(rows)
          });
    });
  }
  else{
    let rows = [];
    for (let i = offset; i < pageSize + offset  ; i++) {
      if(i < totalMyAsks )  { 
      rows.push( <tr key={i}>
        <td>{dataMyAsks[2][i]}</td>
        <td>{dataMyAsks[0][i]}</td>
        <td>{dataMyAsks[1][i]/1000000}</td>
        <td>{dataMyAsks[3][i]/100}</td>
        <td>{moment(moment.unix(dataMyAsks[4][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
        {/* <td> <Button variant="secondary" size="sm" data-id={dataAsks[1][i]} onClick={event => tradeAsk(event.target.dataset.id)}>Trade</Button></td> */}

      </tr>);
      setDataMyAsks(null);
      }
    }
    setMyAsks(rows)
    console.log(rows);
  }
  }

  const isNumeric = (number)  =>{
    if (+number === +number) { // if is a number
        return true;
    }
  
    return false;
  }

  const addBidOrAsk = async () => {
    
  
  if (open === 'bid'){
    
      if (energyKW === "" || priceBid === "" ){
        setError(true);
      }  
       else if ( energyKW < 1 ||  isNumeric(energyKW) === false ) {
        setErrorE(true)  
      }
      else if ( priceBid < 0 ||  isNumeric(priceBid) === false){
        setErrorP(true)  
      }
    else{

      setIsLoading(true);

    try{
      await marketPlace.methods.energyBid(energyKW * 1000000, priceBid * 100).send({from: account.current}).on('transactionHash', (th) => {


        toast("Bid has been succesfully submited!")
      }).then(function(e) {

        setIsLoading(false);
          setDataBids(null);
          getDataBids(currentPageΒ   * pageSize, true);
          console.log(e)
      });
    }catch(e){
        console.log(e);
        setIsLoading(false);
      } 
      setEnergyKW("");
      setPriceBid("");
      setErrorE(false);
      setErrorP(false);
      setError(false);
    }
    }else{
      
      if (energyKW === ""||energyKW > 1000000  || energyKW < 1 ||  isNumeric(energyKW) === false ){
        setErrorE(true);
      }
         else if ( priceAsk < 0 ||  isNumeric(priceAsk) === false){
        setErrorPA(true)  
      }
     else{

        setIsLoading(true);
    try{  
        await marketPlace.methods.energyAsk(energyKW * 1000000, priceAsk * 100).send({from: account.current}).on('transactionHash', (th) => {
      
        toast("Ask has been succesfully submited!")
      }).then(function(e) {

        setIsLoading(false);
        setDataAsks(null);
        setDataMyAsks(null);
        getDataAsks(currentPageA  * pageSize, true);
        getDataMyAsks(currentPageMA  * pageSize, true);
            console.log(e)
      });
    }catch(e){
      console.log(e);
      setIsLoading(false);
    } 
      setEnergyKW("");
      setPriceAsk("");
      setErrorE(false);
      setErrorPA(false);
      setError(false);
    }
  }

  }
 
  useEffect(() => {

    getDataAsks(currentPageA * pageSize);
    getDataBids(currentPageΒ* pageSize);
    getDataMyAsks(currentPageMA * pageSize);
   
    console.log("pagecountbids: ", totalBids);
    console.log("pagecountask: ", totalAsks);
    console.log("pagecountmyask: ", totalMyAsks);
   
    web3.eth.getAccounts().then(r=>{
      
      handleAccountsChanged(r);
    });
   
  }, []);
  
 
  return (
    <>
      <div className="content">             
      <Modal
  
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
      >
        <h2 className="title" ref={(_subtitle) => (subtitle = _subtitle)}>Input amount</h2>
        <div>input amount of kw</div>
        
          <input 
            value = {energyModalKW}
            placeholder="Enter KWhs"
            type="text"
            onChange={event => setEnergyModalKW(event.target.value)}
          />              
          
              
          <Button variant="secondary" size="sm"  onClick={()=>{tradeAsk(id, energyModalKW)}}> Trade</Button>
           {/* <Button variant="secondary" size="sm"  onClick={()=>{tradeBid(id, energyModalKW)}}> Trade</Button>  */}

          <button variant="secondary" size="sm"  onClick={closeModal}>close</button>
     
      </Modal>
        <Row>
          <Col md="7">
            {totalAsks>0 ?
                <Card>
              <CardHeader>
                <h4 className="title">Open Asks</h4>
              </CardHeader>
              <CardBody>
                {asks!==null ?
                  <Table className="tablesorter" responsive>                  
                      <thead className="text-primary">
                   <tr>
                   <th>id</th>
                   <th>Owner</th>
                   <th>Total KWhs</th>
                   <th>Price (EUR)</th>
                   <th>Date</th>
                  </tr>
                  </thead>
                  <tbody>
                  {asks}
                  </tbody>
                
                </Table> : <></>}
                <TablePagination
                       pagesCount={pagesCountAsk}
                       currentPage={currentPageA}
                       handlePageClick={handlePageClickA}
                       handlePreviousClick={handlePreviousClickA}
                       handleNextClick={handleNextClickA}
                   />
              </CardBody>
              <CardFooter>

              </CardFooter>
            </Card> : <></>}
            <br/>
            {totalBids>0 ?
                <Card>
                  <CardHeader>
                    <h5 className="title">Open Bids</h5>
                  </CardHeader>
                  <CardBody>
                    {bids !==null ?
                        <Table className="tablesorter" responsive>
                          <thead className="text-primary">
                          <tr>
                            <th>id</th>
                            <th>Owner</th>
                            <th>Total KWhs</th>
                            <th>Price (EUR)</th>
                            <th>Date</th>
                          </tr>
                          </thead>
                          <tbody>
                          {bids}
                          </tbody>
                          <script src="extensions/auto-refresh/bootstrap-table-auto-refresh.js"></script>
                        </Table> : <></>}
                        <TablePagination
                             previousLabel={"previous"}
                             nextLabel={"next"}
                             breakLabel={"..."}
                             pagesCount={pagesCountBid}
                             currentPage={currentPageΒ}
                             handlePageClick={handlePageClickΒ}
                             handlePreviousClick={handlePreviousClickΒ}
                             handleNextClick={handleNextClickΒ}
                         />
                  </CardBody>
                  <CardFooter>

                  </CardFooter>
                </Card> : <></>}
          </Col>
          <Col md="5">
            <Card className="card-user">
              <CardBody>
                <CardText />
                
              <div>
                  {isConnected
                  ? <>  <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <p className="description">New bid or ask</p>
                  <br/>
                  <Button variant="primary" size="lg" onClick={()=>{setOpen('bid')}}>
                    Bid
                  </Button>{' '}
                  <Button variant="secondary" size="lg" onClick={()=>{setOpen('ask')}}>
                    Ask
                  </Button>
                </div>
                <Row>
                  <Col className="pr-md-1 form"  md="11"  >
                    <FormGroup>
                      <label>{open==='ask'? 'Ask':"Bid"} amount (KWhs)</label>
                      <Input
                          value = {energyKW}
                          placeholder="Enter KWhs"
                          type="text"
                          onChange={event => setEnergyKW(event.target.value)}
                      />
                       {
                        errorE && <div style={{color: `red`}}>Please enter a valid amount of KWHs</div>
                      }
                    </FormGroup>
                    <FormGroup style={{display:(open==='ask'? 'none':"block")}} >
                      <label>Price (EUR)</label>
                      <Input
                          value = {priceBid}
                          placeholder="Bid price (EUR)"
                          type="text"
                          onChange={event => setPriceBid(event.target.value)}
                      />
                      {
                        errorP && <div style={{color: `red`} }>Please enter a valid amount of price</div>
                      }
                    </FormGroup>
                    <FormGroup style={{display:(open==='bid'? 'none':"block")}} >
                      <label>Price (EUR)</label>
                      <Input
                          value = {priceAsk}
                          placeholder="Ask price (EUR)"
                          type="text"
                          onChange={event => setPriceAsk(event.target.value)}
                      />
                      {
                        errorPA && <div style={{color: `red`} }>Please enter a valid amount of price</div>
                      }
                    </FormGroup>
                    
                    <FormGroup>
                    {
                        error && <div style={{color: `red`}}>Please fill all the blanks</div>
                      }
                   { isLoading ? 
                     <div class="lds-hourglass"></div>
                     :
                         <Button  variant="secondary" size="lg" disabled={disable}  onClick={() => addBidOrAsk()}>  
                           Place {open==='ask'? 'Ask':"Bid"}
                         </Button>
                  } 
                  </FormGroup>
                 { alert && <div class="alert alert-warning" size= "lg" role="alert">
                  You must add a device first!
                </div>
                }
          </Col>
                </Row> 
</>
                  :<div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                   <p className="description">Connect your wallet to make a new Bid/Ask</p>
                     < Button className="btn-fill" variant="primary"  size="lg"  color="secondary" type="button" onClick= { signInMetamask }>
                  <img src={"https://docs.metamask.io/metamask-fox.svg"} style={{"height": "30px"}}></img>{"  "} Connect Wallet
                  </Button>         
             </div>   
                }
</div> 
              </CardBody>
              <CardFooter>
              </CardFooter>
            </Card>
            {/* {totalMyAsks>0 ? */}
            <Card>
              <CardHeader>
                <h4 className="title">My Asks</h4>
              </CardHeader>
              
              <CardBody>
              {myAsks !==null ?
               
                  <Table className="tablesorter" responsive>                  
                      <thead className="text-primary">
                   <tr>
                   <th>Owner</th>
                   <th>Total KWhs</th>
                   <th>id</th>
                   <th>Price (EUR)</th>
                   <th>Date</th>
                  </tr>
                  </thead>
                  <tbody>
                  {myAsks}
                  </tbody>
                
                </Table> : <></>}
                {/* <TablePagination
                       pagesCount={pagesCountMyAsk}
                       currentPage={currentPageMA}
                       handlePageClick={handlePageClickMA}
                       handlePreviousClick={handlePreviousClickMA}
                       handleNextClick={handleNextClickMA}
                   /> */}
              </CardBody>
              
            </Card> 
             {/* : <></>} */}
            <br/>
             
            <Card>
              <CardHeader>
                <h4 className="title">My Bids</h4>
              </CardHeader>
              
              <CardBody>
               
                  <Table className="tablesorter" responsive>                  
                      <thead className="text-primary">
                   <tr>
                   <th>id</th>
                   <th>Owner</th>
                   <th>Total KWhs</th>
                   <th>Price (EUR)</th>
                   <th>Date</th>
                  </tr>
                  </thead>
                  <tbody>
                   {myBids}
                  </tbody>
                
                </Table> 
                {/* <TablePagination
                       pagesCount={pagesCountAsk}
                       currentPage={currentPageA}
                       handlePageClick={handlePageClickA}
                       handlePreviousClick={handlePreviousClickA}
                       handleNextClick={handleNextClickA}
                   /> */}
              </CardBody>
              
            </Card> 
            <br/>
          </Col>

        </Row>
      </div>
    </>
  );

 
}



export default EnergyTrading; 


