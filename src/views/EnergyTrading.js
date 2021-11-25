import React, {useEffect, useState, useRef, useCallback } from "react";
import TablePagination from '../components/pagination/TablePagination';
import detectEthereumProvider from '@metamask/detect-provider';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import moment from 'moment';
import Modal from  'react-modal';
// import DeleteButton from '@bit/totalsoft_oss.react-mui.delete-button';



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
 contractAddress = '0x3B0B6E991D974A46a57796329eDd7Ba84E82Db5e' ;
abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"bidRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onNewAsk","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onNewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onUpdateAsk","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onUpdateBid","type":"event"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"energyAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"}],"name":"energyBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getAskByID","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getBidByID","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfAsk","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"updateAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfBid","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"updateBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}] ;
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
  const [currentPageMB, setCurrentPageMB] = useState(0);
  const pageSize = 10;
  const myPageSize = 5;
  const [pagesCountAsk, setPagesCountAsk] = useState(0);
  const [pagesCountMyAsk, setPagesCountMyAsk] = useState(0);
  const [pagesCountMyBid, setPagesCountMyBid] = useState(0);
  const [pagesCountBid, setPagesCountBid] = useState(0);
  const [energyKW, setEnergyKW] = useState('');
  const [energyModalKW, setEnergyModalKW] = useState('');
  const [priceModal, setPriceModal] = useState('');
  const [priceBid, setPriceBid] = useState('');
  const [priceAsk, setPriceAsk] = useState('');
  const account = useRef('');
  const[error, setError] = useState(false);
  const[errorEnergy, setErrorEnergy] = useState(false);
  const[errorPriceBid, setErrorPriceBid] = useState(false);
  const[errorPriceAsk, setErrorPriceAsk] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [disable, setDisable] = useState(false);
  const[alert, setAlert] = useState(false);
  const[modalIsOpen, setModalIsOpen] = useState(false);
  const[modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [dataMyAsks, setDataMyAsks] = useState(null);
  const [dataMyBids, setDataMyBids] = useState(null);
  const [myAsks, setMyAsks] = useState(null);
  const [myBids, setMyBids] = useState(null);
  const [totalMyAsks, setTotalMyAsks] = useState(0);
  const [totalMyBids, setTotalMyBids] = useState(0);
  const[isLoading, setIsLoading] = useState(false);
  const[isLoadingTrade, setIsLoadingTrade] = useState([]);
  const [tableOpenAsks, setTableOpenAsks] = useState(false);
  const [tableOpenBids, setTableOpenBids] = useState(false);
  const [tableOpenMyAsks, setTableOpenMyAsks] = useState(false);
  const [tableOpenMyBids, setTableOpenMyBids] = useState(false);
  const[id, setId] = useState('');

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
    getDataMyAsks(page  * myPageSize);
    console.log(page);
  };

  const handlePreviousClickMA= e => {
    const _currentPageMA = currentPageMA - 1 ;
    e.preventDefault();
    setCurrentPageMA(_currentPageMA);
     getDataMyAsks(_currentPageMA   * myPageSize);
     console.log(_currentPageMA);

  };

  const handleNextClickMA= e => {
    const _currentPageMA = currentPageMA + 1 ;
    e.preventDefault();
    setCurrentPageMA(_currentPageMA);
     getDataMyAsks(_currentPageMA  * myPageSize);
     console.log(_currentPageMA);

  };
  const handlePageClickMB = (e, page) => {
    console.log(page);
    e.preventDefault();
    setCurrentPageMB(page);
    console.log(page);
    getDataMyBids(page  * myPageSize);
    console.log(page);
  };

  const handlePreviousClickMB= e => {
    const _currentPageMB = currentPageMB - 1 ;
    e.preventDefault();
    setCurrentPageMB(_currentPageMB);
     getDataMyBids(_currentPageMB   * myPageSize);
     console.log(_currentPageMB);

  };

  const handleNextClickMB= e => {
    const _currentPageMB = currentPageMB + 1 ;
    e.preventDefault();
    setCurrentPageMB(_currentPageMB);
     getDataMyBids(_currentPageMB  * myPageSize);
     console.log(_currentPageMB);

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
  }
  const toggleModalUpdate = () =>{
    setModalUpdateIsOpen(true)
  }

  const afterOpenModal = () =>{
    subtitle.style.color = '#9933cc'
  }
  const afterOpenModalUpdate = () =>{
    subtitle.style.color = '#9933cc'
  }
  const closeModal = () =>{
    setModalIsOpen(false);
  }

  const closeModalUpdate = () =>{
    setModalUpdateIsOpen(false);
  }

  // function refreshPage() {
  //   window.location.reload();
  // }
  
  const removeAsk = async (id) => {
    console.log("id: ", id);
    try{
      await marketPlace.methods.removeAsk(id).send({from: account.current}).on('transactionHash', (th) => {
        console.log(th);
        toast("You deleted your ask successfully!") 
      })
      .then(function(receipt){
        getDataMyAsks(currentPageMA * myPageSize, true);
      })
    }catch(e){
      console.log(e);
      
    }
  }

  const removeBid = async (id) => {
    
    console.log("id: ", id);
    try{
      await marketPlace.methods.removeBid(id).send({from: account.current}).on('transactionHash', (th) => {
        console.log(th);
        toast("You deleted your bid successfully!") 
      })
      .then(function(receipt){
        getDataMyBids(currentPageMB * myPageSize, true);
      })
    }catch(e){
      console.log(e);
      
    }
  }

  const updateAsk = async (id, amount, price) => {
    
    try{
      await marketPlace.methods.updateAsk(id, amount * 1000000, price * 100).send({from: account.current}).on('transactionHash', (th) => {
        console.log(th);
        toast("You updated your ask successfully!") 
        closeModalUpdate();
      })
      .then(function(receipt){
        getDataMyAsks(currentPageMA * myPageSize, true);
      })
    }catch(e){
      console.log(e);
      
    }
  }

  const updateBid = async (id, amount, price) => {
    
    try{
      await marketPlace.methods.updateBid(id, amount * 1000000, price * 100).send({from: account.current}).on('transactionHash', (th) => {
        console.log(th);
        toast("You updated your bid successfully!") 
        closeModalUpdate();
      })
      .then(function(receipt){
        getDataMyBids(currentPageMB * myPageSize, true);
      })
    }catch(e){
      console.log(e);
      
    }
  }

  const tradeAsk = async (id, amount) => {

        console.log("amount: ", amount);
        console.log("id: ", id);
    try{
        await marketPlace.methods.buyAsk(id, amount * 1000000).send({from: account.current}).on('transactionHash', (th) => {
          console.log(th);
          toast("You traded successfully!") 
          closeModal();   
        })
        .then(function(receipt){
          getDataAsks(currentPageA * pageSize, true );

        })
      }catch(e){
        console.log(e);
        // setIsLoadingTrade(false);
      }}
  const tradeBid = async (id, ammount) => {

    try{
         await marketPlace.methods.buyBid(id, ammount * 1000000).send({from: account.current}).on('transactionHash', (th) => {
          console.log(th);
          toast("You traded successfully!")
          closeModal();   
        })
        .then(function(receipt){
          getDataBids(currentPageΒ * pageSize, true);
        })
      }catch(e){
        console.log(e);
        // setIsLoadingTrade(false);

      }}

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

              rows.push( <tr key={i}>
                  <td>{result[1][i]}</td>
                  <td>{result[0][i].substr(0,6)}</td> 
                  <td>{result[2][i]/1000000}</td>
                  <td>{result[3][i]/100}</td>
                <td>{moment(moment.unix(result[4][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>     
                <td>
                {/* { isLoadingTrade[id] ? 
               <div class="lds-hourglass"></div>
               : */}
               <Button variant="secondary" size="sm" data-id={result[1][i]} onClick={event=>{
                 setId(event.target.dataset.id);
                 setTableOpenBids(false);
                 setTableOpenAsks(true);
                 toggleModal();}}
                 >Trade</Button>
                
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
        <Button variant="secondary" size="sm" data-id={dataAsks[1][i]}onClick={event=>{setId(event.target.dataset.id); toggleModal();}}>Trade</Button>
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
                  <td> <Button variant="secondary" size="sm" data-id={result[1][i]} onClick={event=>{
                      setId(event.target.dataset.id);
                      setTableOpenAsks(false);
                      setTableOpenBids(true);
                      toggleModal(); }}
                      >Trade</Button></td>
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
       setDataBids(null);
      }
    }
    setBids(rows)
    console.log(rows);
  }
  }

  const getDataMyAsks = (offset, update = false)=>{

    if(dataMyAsks===null || update){
       marketPlace.methods.getCountOfAsks().call({from: account.current}).then(function(myAskNum){
      console.log("My total asks:" , myAskNum);
      setTotalMyAsks(myAskNum);
      setPagesCountMyAsk(Math.ceil(myAskNum / myPageSize));

      if(myAskNum>0)

        marketPlace.methods.getMyAsks().call({from: account.current}).then(function(result){
            setDataMyAsks(result);
            console.log(myPageSize + offset);
            var rows = [];
            for (var i = offset; i < myPageSize + offset  ; i++) {
              if(i >= myAskNum)  break;

              rows.push( <tr key={i}>
                 <td>{result[2][i]}</td>
                 <td>{result[0][i].substr(0,6)}</td>
                 <td>{result[1][i]/1000000}</td>
                 <td>{result[3][i]/100}</td>
                 <td>{moment(moment.unix(result[4][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
                <td> <Button variant="secondary"  size="sm"  data-id={result[2][i]} onClick={event => removeAsk(event.target.dataset.id)} class="btn"><i class="fa fa-trash" ></i></Button></td>
                <td> <Button class="btn" variant="secondary" size="sm" data-id={result[2][i]} onClick={event => {setId(event.target.dataset.id);
                   setTableOpenMyAsks(true);
                   setTableOpenMyBids(false);
                   toggleModalUpdate();}}>
                  <i class="fa fa-edit" ></i></Button></td>
              </tr>);
            }
             setMyAsks(rows)
            console.log(rows); 
         });
    }); 
    }
   else{
    let rows = [];
    for (let i = offset; i < myPageSize + offset  ; i++) {
      if(i < totalMyAsks )  { 
      rows.push( <tr key={i}>
        <td>{dataMyAsks[2][i]}</td>
        <td>{dataMyAsks[0][i].substr(0,6)}</td>
        <td>{dataMyAsks[1][i]/1000000}</td>
        <td>{dataMyAsks[3][i]/100}</td>
        <td>{moment(moment.unix(dataMyAsks[4][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
        <td> <Button variant="secondary" size="sm" data-id={dataMyAsks[2][i]} onClick={event => removeAsk(event.target.dataset.id)}class="btn"><i class="fa fa-trash" ></i></Button></td>
        <td> <Button class="btn" variant="secondary" size="sm" data-id={dataMyAsks[2][i]} onClick={event => {setId(event.target.dataset.id); toggleModalUpdate();}}><i class="fa fa-edit" ></i></Button></td>

      </tr>);
      setDataMyAsks(null);
      }
    }
     setMyAsks(rows)
    console.log(rows);
}
  }


  const getDataMyBids = (offset, update = false) => {

   
    if(dataMyBids===null || update){
      marketPlace.methods.getCountOfBids().call({from: account.current}).then(function(myBidNum){
      console.log("My total bids:" , myBidNum);
      setTotalMyBids(myBidNum);
      setPagesCountMyBid(Math.ceil(myBidNum / myPageSize));

      if(myBidNum>0)
      marketPlace.methods.getMyBids().call({from: account.current}).then(function(result){
            setDataMyBids(result);
            console.log("Result:" ,result);
            console.log(myPageSize + offset);
            var rows = [];
            for (var i = offset; i < myPageSize + offset  ; i++) {
              if(i >= myBidNum)  break;
              rows.push( <tr key={i}>
                 <td>{result[2][i]}</td>
                 <td>{result[0][i].substr(0,6)}</td>
                 <td>{result[1][i]/1000000}</td>
                 <td>{result[3][i]/100}</td>
                 <td>{moment(moment.unix(result[4][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
                 <td> <Button variant="secondary" size="sm" data-id={result[2][i]} onClick={event => removeBid(event.target.dataset.id)}class="btn"><i class="fa fa-trash" ></i></Button></td>
                 <td> <Button variant="secondary" size="sm" data-id={result[2][i]} onClick={event => {setId(event.target.dataset.id);
                   setTableOpenMyBids(true);
                   setTableOpenMyAsks(false);
                  toggleModalUpdate();
                  }}class="btn"><i class="fa fa-edit" ></i></Button></td>
              </tr>);
            }
             setMyBids(rows)
            console.log(rows);
          });
    });
    }
  else{
    
    let rows = [];
    for (let i = offset; i < myPageSize + offset  ; i++) {
      if(i < totalMyBids )  { 
      rows.push( <tr key={i}>
        <td>{dataMyBids[2][i]}</td>
        <td>{dataMyBids[0][i].substr(0,6)}</td>
        <td>{dataMyBids[1][i]/1000000}</td>
        <td>{dataMyBids[3][i]/100}</td>
        <td>{moment(moment.unix(dataMyBids[4][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
        <td> <Button variant="secondary" size="sm" data-id={dataMyBids[2][i]} onClick={event => removeBid(event.target.dataset.id)}class="btn"><i class="fa fa-trash" ></i></Button></td>
        <td> <Button variant="secondary" size="sm" data-id={dataMyBids[2][i]} onClick={event => {setId(event.target.dataset.id); toggleModalUpdate();}}class="btn"><i class="fa fa-edit" ></i></Button></td>

      </tr>);
      setDataMyBids(null);
      }
    }
     setMyBids(rows)
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
        setErrorEnergy(true)  
      }
      else if ( priceBid < 0 ||  isNumeric(priceBid) === false){
        setErrorPriceBid(true)  
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
          setDataMyBids(null);
          getDataMyBids(currentPageMB   * myPageSize, true);


          console.log(e)
      });
    }catch(e){
        console.log(e);
        setIsLoading(false);
      } 
      setEnergyKW("");
      setPriceBid("");
      setErrorEnergy(false);
      setErrorPriceBid(false);
      setError(false);
    }
    }else{
      
      if (energyKW === ""||energyKW > 1000000  || energyKW < 1 ||  isNumeric(energyKW) === false ){
        setErrorEnergy(true);
      }
         else if ( priceAsk < 0 ||  isNumeric(priceAsk) === false){
        setErrorPriceAsk(true)  
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
        getDataMyAsks(currentPageMA  * myPageSize, true);
            console.log(e)
      });
    }catch(e){
      console.log(e);
      setIsLoading(false);
    } 
    
      setEnergyKW("");
      setPriceAsk("");
      setErrorEnergy(false);
      setErrorPriceAsk(false);
      setError(false);
    }
  }}

  // const listener = (block) => {
  //   console.log("new action emited")
  //   console.log(block)
  //   updateBid()
  // }
  
  
  
  useEffect(() => {

  
  if(dataMyAsks===null ){
         marketPlace.methods.getCountOfAsks().call({from: account.current}).then(function(myAskNum){
        setTotalMyAsks(myAskNum);
        setPagesCountMyAsk(Math.ceil(myAskNum / myPageSize));
          marketPlace.methods.getMyAsks().call({from: account.current}).then(function(){
            getDataMyAsks(currentPageMA * myPageSize);
      }); 
    }
  )}

  if(dataMyBids===null ){
    marketPlace.methods.getCountOfBids().call({from: account.current}).then(function(myBidNum)  {
   setTotalMyBids(myBidNum);
   setPagesCountMyBid(Math.ceil(myBidNum / myPageSize));
     marketPlace.methods.getMyBids().call({from: account.current}).then(function(){
       getDataMyBids(currentPageMB * myPageSize);

 }); 
}
)}
    getDataAsks(currentPageA * pageSize);
    getDataBids(currentPageΒ * pageSize);
  
  marketPlace.events.onNewBid({} , function(error, event){ 
      console.log(event); 
  }) 
   .on('data',  function(event){
     console.log(event.returnValues);
   })

  marketPlace.events.onNewAsk({} , function(error, event){ 
      console.log(event); 
  }) 
   .on('data',  function(event){
     console.log(event.returnValues);
   })

  marketPlace.events.onUpdateAsk({} , function(error, event){ 
      console.log(event); 
  }) 
   .on('data',  function(event){
     console.log(event.returnValues);
   })

  marketPlace.events.onUpdateBid({} , function(error, event){ 
      console.log(event); 
   }) 
   .on('data',  function(event){
     console.log(event.returnValues);
   })

  marketPlace.events.bidRemoved({} , function(error, event){ 
       console.log(event); 
  }) 
    .on('data',  function(event){
      console.log(event.returnValues);
    })
    
  marketPlace.events.askRemoved({} , function(error, event){ 
      console.log(event); 
   }) 
      .on('data',  function(event){
         console.log(event.returnValues);
      })
    
  marketPlace.events.onPurchased({} , function(error, event){ 
      console.log(event); 
  }) 
      .on('data',  function(event){
        console.log(event.returnValues);
       })
   
   

    
    // .on("onPurchased", function(event){
    //   tradeAsk();
    //   tradeBid();
    //   console.log("EventOnPurchased:" , event);
    // })
    // marketPlace.events.onPurchased({}, function (event) {
    //   tradeBid();
    //   console.log("EventOnTradeBid:" , event);     
    // })
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
        ariaHideApp={false}
      >
        <h2 className="title" ref={(_subtitle) => (subtitle = _subtitle)}>Input amount</h2>
        <div>input amount of kw</div>
        
          <input 
            value = {energyModalKW}
            placeholder="Enter KWhs"
            type="text"
            onChange={event => setEnergyModalKW(event.target.value)}
          />               
         {tableOpenAsks ?
          <Button variant="secondary" size="sm"  onClick={()=>{tradeAsk(id, energyModalKW)}}> Trade</Button>
          : <></>}
          {tableOpenBids ?
          <Button variant="secondary" size="sm"  onClick={()=>{tradeBid(id, energyModalKW)}}> Trade</Button>  
          : <></>}
         
          <button variant="secondary" size="sm"  onClick={closeModal}>close</button>
    </Modal>
      
    <Modal
  
        isOpen={modalUpdateIsOpen}
        onAfterOpen={afterOpenModalUpdate}
        onRequestClose={closeModalUpdate}
        style={customStyles}
        ariaHideApp={false}
      >
        <thead className="text-primary">
       
        <h2 className="title" ref={(_subtitle) => (subtitle = _subtitle)}>Input amount</h2>
        
                  
        <div>input amount of kw</div>
        
          <input 
            value = {energyModalKW}
            placeholder="Enter KWhs"
            type="text"
            onChange={event => setEnergyModalKW(event.target.value)}
          />
                  
          <div>input amount of price</div>  
          <input 
            value = {priceModal}
            placeholder="Enter price"
            type="text"
            onChange={event => setEnergyModalKW(event.target.value)}
            onChange={event => setPriceModal(event.target.value)}
          />   

      {tableOpenMyAsks ?

          <Button variant="secondary" size="sm"  onClick={()=>{updateAsk(id, energyModalKW, priceModal)}}> Update</Button>
          : <></>}
      {tableOpenMyBids ?
          <Button variant="secondary" size="sm"  onClick={()=>{updateBid(id, energyModalKW, priceModal)}}> Update</Button>
          : <></>}
      

      <button variant="secondary" size="sm"  onClick={closeModalUpdate}>close</button>
          </thead>
          
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
                  </Button>
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
                        errorEnergy && <div style={{color: `red`}}>Please enter a valid amount of KWHs</div>
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
                        errorPriceBid && <div style={{color: `red`} }>Please enter a valid amount of price</div>
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
                        errorPriceAsk && <div style={{color: `red`} }>Please enter a valid amount of price</div>
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
            {totalMyAsks>0 ?
            <Card>
              <CardHeader>
                <h4 className="title">My Asks</h4>
              </CardHeader>
              
              <CardBody>
              {myAsks !==null ?
               
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
                  {myAsks}
                  </tbody>
                  
                
                </Table> : <></>}
                <TablePagination
                       pagesCount={pagesCountMyAsk}
                       currentPage={currentPageMA}
                       handlePageClick={handlePageClickMA}
                       handlePreviousClick={handlePreviousClickMA}
                       handleNextClick={handleNextClickMA}
                   />
              </CardBody>
              
            </Card> : <></>} 
            <br/>
            {totalMyBids>0 ?
            <Card>
              <CardHeader>
                <h4 className="title">My Bids</h4>
              </CardHeader>
                
              <CardBody>
              {myBids !== null ?
               
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
                
                </Table> : <></>}
                <TablePagination
                       pagesCount={pagesCountMyBid}
                       currentPage={currentPageMB}
                       handlePageClick={handlePageClickMB}
                       handlePreviousClick={handlePreviousClickMB}
                       handleNextClick={handleNextClickMB}
                   />
              </CardBody>
              
            </Card> 
            : <></>}
            <br/>
          </Col>

        </Row>
      </div>
    </>
  );

 
}



export default EnergyTrading; 