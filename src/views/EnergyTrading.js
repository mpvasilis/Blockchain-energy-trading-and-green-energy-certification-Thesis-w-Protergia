import React, {useEffect, useState, useRef, useCallback } from "react";
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
const web3 = new Web3(Web3.givenProvider || "wss://ropsten.infura.io/ws/v3/5f552c63b2834a588871339fd81f7943");


var contractAddress = '0xFC29f8a8d9B88Df30b523D717DCadE80Df105497' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"bidRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"}],"name":"onDeviceAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"}],"name":"onDeviceRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"onDeviceTransferOwnership","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"typeDevice","type":"string"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"onDeviceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"}],"name":"onEnergyRecorded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onNewAsk","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onNewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onUpdateAsk","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onUpdateBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"onUpdated","type":"event"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_typeOfDevice","type":"string"},{"internalType":"string","name":"_name","type":"string"}],"name":"createDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_idOfDevice","type":"uint256"}],"name":"energyAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"},{"internalType":"uint256","name":"_idOfDevice","type":"uint256"}],"name":"energyBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllAsks","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllBids","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getAskByID","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getBidByID","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfDevices","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getDeviceByID","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getEnergyPerDevice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyDevices","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalEnergy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getTypeOfDevice","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"recordEnergyPerDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfDevice","type":"uint256"}],"name":"setDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"transferOwnershipOfDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfAsk","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"updateAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfBid","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"updateBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_typeOfDevice","type":"string"}],"name":"updateDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"updateDeviceByMarketplace","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}] ;
const marketplace = new web3.eth.Contract(abi, contractAddress);


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
  const [tableOpenAsks, setTableOpenAsks] = useState(false);
  const [tableOpenBids, setTableOpenBids] = useState(false);
  const [tableOpenMyAsks, setTableOpenMyAsks] = useState(false);
  const [tableOpenMyBids, setTableOpenMyBids] = useState(false);
  const [selectValue,setSelectValue]=useState('');
  const [myOptions, setMyOptions] = useState(null);
  const [totalDevices, setTotalDevices] = useState(0);
   const[id, setId] = useState('');



  let subtitle;

  const convertId=()=>{
    marketplace.methods.getMyDevices().call({from: account.current}).then(function(total){
      console.log("total devices:" , total);
      for (var i = 0; i < total.length  ; i++) {
      marketplace.methods.getTypeOfDevice(total[i]).call().then(function(type){
        console.log("typeOfDevice" ,type)

     });       
    }
    });
  }

  const handleAccountsChanged = async (accounts) => {

    console.log("ACCS: ", accounts);
    if(accounts.length === 0) {
      setIsConnected(false)
      console.log("connect to metamsk");
    }else if(accounts[0] !== account.current){
      account.current = accounts[0];
      setIsConnected(true)
       
       await marketplace.methods.getDeviceByID(account.current).call({from: account.current}).then(function(result){

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
      backgroundColor: 'rgba(255, 255, 255, 0.75)'
      
    },
  };
  

  const toggleModal = () =>{
    setModalIsOpen(true)
  }
  const toggleModalUpdate = () =>{
    setModalUpdateIsOpen(true)
  }

  const afterOpenModal = () =>{
    subtitle.style.color = '#3b144e'
    
  }
  const afterOpenModalUpdate = () =>{
    subtitle.style.color = '#3b144e'
    
  }
  const closeModal = () =>{
    setModalIsOpen(false);
  }

  const closeModalUpdate = () =>{
    setModalUpdateIsOpen(false);
  }

  const getDataAsks = (offset, update = false)=>{

    if(dataAsks===null || update){
      marketplace.methods.getTotalAsks().call().then(function(askNum){
      console.log("Total asks:" , askNum);
      setTotalAsks(askNum);
      
      setPagesCountAsk(Math.ceil(askNum / pageSize));
      if(askNum>0)

      marketplace.methods.getAllAsks().call()
          .then(function(result){
            setDataAsks(result);
            var rows = [];
            for (var i = offset; i < pageSize + offset  ; i++) {
              if(i >= askNum)  break;
            

              rows.push( <tr key={i}>
                  <td>{result[2][i]}</td>
                  <td>{result[1][i].substr(0,6)}</td> 
                  <td>{result[0][i]}</td>
                  <td>{result[3][i]/1000000}</td>
                  <td>{result[4][i]/1000000}</td>
                  <td>{moment((moment.unix(result[5][i]))).startOf('minute').fromNow()}</td>
                <td>
               
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
         <td>{dataAsks[2][i]}</td>
         <td>{dataAsks[1][i].substr(0,6)}</td> 
         <td>{dataAsks[0][i]}</td>
         <td>{dataAsks[3][i]/1000000}</td>
         <td>{dataAsks[4][i]/1000000}</td>
          <td>{moment((moment.unix(dataAsks[5][i]))).startOf('minute').fromNow()}</td>
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
      marketplace.methods.getTotalBids().call().then(function(bidNum){
      console.log("Total bids:" , bidNum);
      setTotalBids(bidNum);
      setPagesCountBid(Math.ceil(bidNum / pageSize));
      
      if(bidNum>0)  
      marketplace.methods.getAllBids().call().then(function(result){
              setDataBids(result);
              console.log("RESULT1:" , result);

            marketplace.methods.getMyDevices().call({from: account.current}).then(function(total){
             console.log("total devices:" , total);
           
      for (var  x = 0  ; x < total.length ; x++) {
        marketplace.methods.getDeviceByID(total[x]).call({from: account.current})
           .then(function(result2){
            console.log("RESULT2:" , result2);
              var rows = [];
              for (var i = offset; i < pageSize + offset  ; i++) {
                if(i >=  bidNum)  break;
                rows.push( <tr key={i}>
                  <td>{result[2][i]}</td>
                  <td>{result[1][i].substr(0,6)}</td> 
                  <td>{result2[2]}</td>
                  <td>{result[3][i]/1000000}</td>
                  <td>{result[4][i]/1000000}</td>
                  <td>{moment((moment.unix(result[5][i]))).startOf('minute').fromNow()}</td>
                  <td> <Button variant="secondary" size="sm" data-id={result[2][i]} onClick={event=>{
                      setId(event.target.dataset.id);
                      setTableOpenAsks(false);
                      setTableOpenBids(true);
                      toggleModal(); }}
                      >Trade</Button>
                  </td>
                </tr>); 
                
              }
            
              setBids(rows)
            
            });
        }
          });
            
        });
      
         
    });
  }else{
    let rows = [];
    for (let i = offset; i < pageSize + offset  ; i++) {
      if(i < totalBids )  { 
      rows.push( <tr key={i}>
        <td>{dataBids[2][i]}</td>
        <td>{dataBids[1][i].substr(0,6)}</td> 
        <td>{dataBids[0][i]}</td>
        <td>{dataBids[3][i]/1000000}</td>
        <td>{dataBids[4][i]/1000000}</td>
        <td>{moment((moment.unix(dataBids[5][i]))).startOf('minute').fromNow()}</td>
        <td> <Button variant="secondary" size="sm" data-id={dataBids[2][i]} onClick={event=>{
          setId(event.target.dataset.id); 
          toggleModal();}}
          >Trade</Button>
        </td>
      </tr>);
       setDataBids(null);
      }
    }
    setBids(rows)
  }
  }

  const getDataMyAsks = (offset, update = false)=>{

    if(dataMyAsks===null || update){
      marketplace.methods.getCountOfAsks().call({from: account.current}).then(function(myAskNum){
      console.log("My total asks:" , myAskNum);
      setTotalMyAsks(myAskNum);
      setPagesCountMyAsk(Math.ceil(myAskNum / myPageSize));

      if(myAskNum>0)

      marketplace.methods.getMyAsks().call({from: account.current}).then(function(result){
            setDataMyAsks(result);
            var rows = [];
            for (var i = offset; i < myPageSize + offset  ; i++) {
              if(i >= myAskNum)  break;

              rows.push( <tr key={i}>
                 <td>{result[2][i]}</td>
                 <td>{result[0][i].substr(0,6)}</td>
                 <td>{result[1][i]/1000000}</td>
                 <td>{result[3][i]/1000000}</td>
                 <td>{moment((moment.unix(result[4][i]))).startOf('minute').fromNow()}</td>                 
                <td> <Button variant="secondary"  size="sm"  data-id={result[2][i]} class="btn" onClick={event => removeAsk(event.target.dataset.id )}><i data-id={result[2][i]} class="fa fa-trash" ></i></Button></td>
                <td> <Button class="btn" variant="secondary" size="sm" data-id={result[2][i]} onClick={event => {
                      setId(event.target.dataset.id);
                      setTableOpenMyAsks(true);
                      setTableOpenMyBids(false);
                      toggleModalUpdate();}}>
                      <i data-id={result[2][i]} class="fa fa-edit" ></i>
                     </Button>
                </td>
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
        <td>{dataMyAsks[3][i]/1000000}</td>
        <td>{moment((moment.unix(dataMyAsks[4][i]))).startOf('minute').fromNow()}</td>
        <td> <Button variant="secondary" size="sm" data-id={dataMyAsks[2][i]} class="btn" onClick={event => removeAsk(event.target.dataset.id)}><i data-id={dataMyAsks[2][i]} class="fa fa-trash" ></i></Button></td>
        <td> <Button class="btn" variant="secondary" size="sm" data-id={dataMyAsks[2][i]} onClick={event => {
                 setId(event.target.dataset.id);
                 setTableOpenMyAsks(true);
                 setTableOpenMyBids(false);
                 toggleModalUpdate();}}>
                 <i data-id={dataMyAsks[2][i]} class="fa fa-edit" ></i>
             </Button>
        </td>

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
      marketplace.methods.getCountOfBids().call().then(function(myBidNum){
      console.log("My total bids:" , myBidNum);
      setTotalMyBids(myBidNum);
      setPagesCountMyBid(Math.ceil(myBidNum / myPageSize));

      if(myBidNum>0)
      marketplace.methods.getMyBids().call().then(function(result){
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
                 <td>{result[3][i]/1000000}</td>
                 <td>{moment((moment.unix(result[4][i]))).startOf('minute').fromNow()}</td>
                 <td> <Button variant="secondary" size="sm" data-id={result[2][i]}  class="btn"  onClick={event => removeBid(event.target.dataset.id)}><i data-id={result[2][i]} class="fa fa-trash" ></i></Button></td>
                 <td> <Button variant="secondary" size="sm" data-id={result[2][i]} onClick={event => {
                         setId(event.target.dataset.id);
                         setTableOpenMyBids(true);
                         setTableOpenMyAsks(false);
                         toggleModalUpdate();}}class="btn">
                         <i data-id={result[2][i]} class="fa fa-edit" ></i>
                      </Button>
                 </td>
              </tr>);
            }
             setMyBids(rows);
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
        <td>{dataMyBids[3][i]/1000000}</td>
        <td>{moment((moment.unix(dataMyBids[4][i]))).startOf('minute').fromNow()}</td>
        <td> <Button variant="secondary" size="sm" data-id={dataMyBids[2][i]} class="btn" onClick={event => removeBid(event.target.dataset.id)}><i data-id={dataMyBids[2][i]} class="fa fa-trash" ></i></Button></td>
        <td> <Button variant="secondary" size="sm" data-id={dataMyBids[2][i]} onClick={event => {setId(event.target.dataset.id);
               setTableOpenMyBids(true);
               setTableOpenMyAsks(false);
               toggleModalUpdate();}}class="btn">
               <i data-id={dataMyBids[2][i]} class="fa fa-edit" ></i>
             </Button>
        </td>

      </tr>);
      setDataMyBids(null);
      }
    }
    console.log(rows);  
  }}
  

  const removeAsk = async (id) => {
    console.log("id: ", id);
    try{

      await marketplace.methods.removeAsk(id).send({from: account.current}).on('transactionHash', (th) => {
        console.log(th);
        toast("You deleted your ask successfully!") 
      })
      .then(function(receipt){
        getDataMyAsks(currentPageMA * myPageSize, true);
        getDataAsks(currentPageA * pageSize, true);
   
      })
    }catch(e){
      console.log(e);
    }
  }

  const removeBid = async (id) => {
    
    console.log("id: ", id);
    try{
      await marketplace.methods.removeBid(id).send({from: account.current}).on('transactionHash', (th) => {
        console.log(th);
        toast("You deleted your bid successfully!") 
      })
      .then(function(receipt){
        getDataMyBids(currentPageMB * myPageSize, true);
        getDataBids(currentPageΒ * pageSize, true);
        
      })
    }catch(e){
      console.log(e);
      
    }
  }

  const updateAsk = async (id, amount, price) => {

     
    try{
      await marketplace.methods.updateAsk(id, amount * 1000000, price * 1000000).send({from: account.current}).on('transactionHash', (th) => {
        console.log(th);
        toast("You updated your ask successfully!") 
        closeModalUpdate();
       
      })
      .then(function(receipt){
        getDataMyAsks(currentPageMA * myPageSize, true);  
        getDataAsks(currentPageA * pageSize, true);

      })
      setPriceModal(''); 
      setEnergyModalKW(''); 
    }catch(e){
      console.log(e);
      
    }
  }

  const updateBid = async (id, amount, price) => {
    
    try{
      await marketplace.methods.updateBid(id, amount * 1000000, price * 1000000).send({from: account.current}).on('transactionHash', (th) => {
        console.log(th);
        toast("You updated your bid successfully!") 
        closeModalUpdate();
      })
      .then(function(receipt){
        getDataMyBids(currentPageMB * myPageSize, true);
        getDataBids(currentPageΒ * pageSize, true);

      })
      setPriceModal(''); 
      setEnergyModalKW('');
    }catch(e){
      console.log(e);
      
    }
  }

  const tradeAsk = async (id, amount) => {

        setEnergyModalKW('')
        console.log("amount: ", amount);
        console.log("id: ", id);
    try{
        await marketplace.methods.buyAsk(id, amount * 1000000).send({from: account.current}).on('transactionHash', (th) => {
          console.log(th);
          toast("You traded successfully!") 
          closeModal();   
        })
        .then(function(receipt){
          getDataAsks(currentPageA * pageSize, true );
        })
      }catch(e){
        console.log(e);
      }}

  const tradeBid = async (id, ammount) => {
    setEnergyModalKW('')
    try{
         await marketplace.methods.buyBid(id, ammount * 1000000).send({from: account.current}).on('transactionHash', (th) => {
          console.log(th);
          toast("You traded successfully!")
          closeModal();   
        })
        .then(function(receipt){
          getDataBids(currentPageΒ * pageSize, true);
        })
        
      }catch(e){
        console.log(e);

      }}
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
       else if ( energyKW < 1 || energyKW > 1000000 ||  isNumeric(energyKW) === false ) {
        setErrorEnergy(true)  
      }
      else if ( priceBid < 0 ||  isNumeric(priceBid) === false){
        setErrorPriceBid(true)  
      }
      
      else if (priceBid.includes('.') && priceBid.split('.')[1].length > 6){
         console.log("split priceBid:" ,( priceBid.split(/([.])/)[1]) )
        setErrorPriceBid(true)  
     }
     
      else if (energyKW.includes('.') && energyKW.split('.')[1].length > 6 ){
       console.log("Split EnergyKWBid:" ,( energyKW.split(/([.])/)[1]) )
       setErrorEnergy(true)  
     }
    else{
      setIsLoading(true);
    try{
      await marketplace.methods.energyBid(energyKW * 1000000, priceBid * 1000000, selectValue).send({from: account.current}).on('transactionHash', (th) => {
        
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
        console.log("selectValue" , selectValue)
        setIsLoading(false);
      } 
      setEnergyKW("");
      setPriceBid("");
      setErrorEnergy(false);
      setErrorPriceBid(false);
      setError(false);
    }

    }else{ 
      console.log("priceAsk.split" , priceAsk.split('.'))
      console.log("EnergyKWAsk.split" , energyKW.split('.'))
      console.log(typeof priceAsk.split('.'))
      console.log("priceASK:" , priceAsk)
      if (energyKW === ""||energyKW > 1000000  || energyKW < 1 ||  isNumeric(energyKW) === false ){
        setErrorEnergy(true);
      }
      else if ( priceAsk < 0 ||  isNumeric(priceAsk) === false){
        setErrorPriceAsk(true)  
      }
       else if (priceAsk.includes('.') && priceAsk.split('.')[1].length > 6){
        console.log("split priceAsk:" ,( priceAsk.split(/([.])/)[1]) )
       setErrorPriceAsk(true)  
    }
    else  if (energyKW.includes('.') && energyKW.split('.')[1].length > 6 ){
      console.log("Split EnergyKWAsk:" ,( energyKW.split(/([.])/)[1]) )
      setErrorEnergy(true)  
    }
     else{
        setIsLoading(true);
    try{  
        await marketplace.methods.energyAsk(energyKW * 1000000, priceAsk * 1000000, selectValue).send({from: account.current}).on('transactionHash', (th) => {
      
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
        
  
  const getOptionData = ()=>{
    var optionArray = [];
    marketplace.methods.getMyDevices().call({from: account.current}).then(function(total){
         console.log("total devices:" , total);
         setTotalDevices(total.length);
         
     if (total.length > 0)
      for (var  i = 0  ; i < total.length ; i++) {
        marketplace.methods.getDeviceByID(total[i]).call({from: account.current})
           .then(function(result){  
            
             console.log("resultOptions:" ,result);
               optionArray.push( 
                <option  value={result[0]}>{result[1]}</option>               
                    );
             console.log("myOptions :" ,optionArray);
             setMyOptions(optionArray);
            
          });
       }
       setMyOptions(optionArray);
     });
    
  } 

  const handleSelect=(e)=>{
    
    setSelectValue(e.target.value);
    console.log("e.target.value" ,e.target.value); 
   
 }


  useEffect(() => {

    web3.eth.getAccounts().then(r=>{
      handleAccountsChanged(r);

    });
    convertId();
    getOptionData();
    getDataAsks(currentPageA * pageSize, true);
    getDataBids(currentPageΒ * pageSize, true);
    getDataMyAsks(currentPageMA * myPageSize, true);
    getDataMyBids(currentPageMB * myPageSize, true);
    
    marketplace.events.onNewBid({} , function(error, event){ 
    console.log("event:" , event); 
    getDataBids(currentPageΒ * pageSize);
    }) 
   .on('data',  function(event){
     console.log(event.returnValues);
   })

   marketplace.events.onNewAsk({} , function(error, event){ 
    console.log("event:" , event);  
    getDataAsks(currentPageA * pageSize);
  }) 
   .on('data',  function(event){
     console.log(event.returnValues);
   })

   marketplace.events.onUpdateAsk({} , function(error, event){ 
      console.log("event:" , event); 
      getDataAsks(currentPageA * pageSize);
      getDataMyAsks(currentPageMA * myPageSize);
  }) 
   .on('data',  function(event){
     console.log(event.returnValues);
   })

   marketplace.events.onUpdateBid({} , function(error, event){ 
    console.log("event:" , event);  
    getDataBids(currentPageΒ * pageSize);
    getDataMyBids(currentPageMB * myPageSize);
   }) 
   .on('data',  function(event){
     console.log(event.returnValues);
   })

   marketplace.events.bidRemoved({} , function(error, event){ 
      console.log("event:" , event); 
      getDataBids(currentPageΒ * pageSize); 
  }) 
    .on('data',  function(event){
      console.log(event.returnValues);
    })
    
    marketplace.events.askRemoved({} , function(error, event){ 
      console.log("event:" , event); 
      getDataAsks(currentPageA * pageSize);
       }) 
      .on('changed',  function(event){
         console.log(event.returnValues);
      })
    
      marketplace.events.onPurchased({} , function(error, event){ 
      console.log("event:" , event); 
      getDataBids(currentPageΒ * pageSize); 
      getDataAsks(currentPageA * pageSize);
  }) 
      .on('data',  function(event){
        console.log(event.returnValues);
       })

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
         
          <button variant="secondary" size="sm"  onClick= {()=>{setEnergyModalKW('');closeModal();}}>close</button>
          
           
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
      

      <button variant="secondary" size="sm"  onClick={()=>{ closeModalUpdate(); setPriceModal(''); setEnergyModalKW('');}}>close</button>
          </thead>
          
    </Modal>
        <Row>
          <Col md="7">
          <Card>
          <CardHeader>
          <h4 className="title">Select your device</h4>
          </CardHeader>
              <CardBody>
              <select 
                    id="inputDevices" class="form-control "
                    value= {selectValue}
                    onChange={handleSelect} 
              >
                
                {myOptions} 
               
               </select> 
              </CardBody>
          </Card>
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
                   <th>Type(id)</th>
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
                            <th>Type(id)</th>
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
                 
                
          </Col>
                </Row> 
                
</>         

                  :<div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                   <p className="description">Connect your wallet to make a new Bid/Ask</p>
                   
                     < Button className="btn-fill" variant="primary"  size="lg"  color="secondary" type="button" onClick= {signInMetamask}>   
                  <img src={"https://docs.metamask.io/metamask-fox.svg"} style={{"height": "30px"}}></img>{"  "} Connect Wallet
                  </Button>         
             </div>
                
                }
                { alert && <div class="alert alert-warning" size= "lg" role="alert">
                  You must add a device first!
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