import React, {useEffect, useState, useRef} from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import 'bootstrap';
import TablePagination from '../components/pagination/TablePagination';
import { Button } from 'reactstrap';
import "assets/css/black-dashboard-react.css";
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import moment from 'moment';
import { CgSun } from "react-icons/fa";
import { GiWindTurbine } from "react-icons/fa";
import { IoWaterSharp } from "react-icons/fa";
// fas fa-solar-panel
// fas fa-battery-full
// fas fa-wind
// fas fa-charging-station
import {

  Card,
  CardHeader,
  CardBody,
  CardFooter,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  CardText,
  FormGroup,
  Form,
  Input,
  Row,
  Col, Table,
} from "reactstrap";
import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || "wss://ropsten.infura.io/ws/v3/5f552c63b2834a588871339fd81f7943");

// var contractAddress = '0xf204b9E3f564ef0F5d827B50A8879D058FA191A9' ;
// var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askEnergyNotifier","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"offerEnergyNotifier","type":"event"},{"constant":false,"inputs":[{"internalType":"string","name":"typeOfDevice","type":"string"}],"name":"addDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"askEnergy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"}],"name":"energyOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getAsksByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getBidsByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"deviceID","type":"address"}],"name":"getDeviceByAddress","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getPurchaseByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"ownerOfDevice","type":"address"},{"internalType":"string","name":"typeOfDevice","type":"string"}],"name":"updateDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"viewAllAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAllBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAllEnergyPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}] ; 
// const deviceRegistry = new web3.eth.Contract(abi, contractAddress);
var contractAddress = '0x70F05Ba769Ddc1917711917fc0Ba3946FedC772F' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"bidRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"}],"name":"onDeviceAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"}],"name":"onDeviceRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"onDeviceTransferOwnership","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"uint256","name":"typeDevice","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"onDeviceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"}],"name":"onEnergyRecorded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onNewAsk","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onNewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onPurchased","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onUpdateAsk","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"onUpdateBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"onUpdated","type":"event"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"buyBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_typeOfDevice","type":"uint256"}],"name":"createDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"},{"internalType":"uint256","name":"_idOfDevice","type":"uint256"}],"name":"energyAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"},{"internalType":"uint256","name":"_idOfDevice","type":"uint256"}],"name":"energyBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAllAsks","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllBids","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getAskByID","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getBidByID","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfDevices","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getDeviceByID","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getEnergyPerDevice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyDevices","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalEnergy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getTypeOfDevice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"recordEnergyPerDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfDevice","type":"uint256"}],"name":"setDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"transferOwnershipOfDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfAsk","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"updateAsk","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfBid","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_price","type":"uint256"}],"name":"updateBid","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"uint256","name":"_typeOfDevice","type":"uint256"}],"name":"updateDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"updateDeviceByMarketplace","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}] ;
const marketplace = new web3.eth.Contract(abi, contractAddress);

function Devices() {
  const [open, setOpen] = useState('add');
  const [input, setInput] = useState(''); 
  const account = useRef('');
  const [error, setError] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
   const [selectValue,setSelectValue]=useState('');
   const [typeOfDevice,setTypeOfDevice]=useState('');
   const [deviceData, setDeviceData] = useState(null);
   const [totalDevices, setTotalDevices] = useState(0);
   const [myDevices, setMyDevices] = useState(null);
   const [currentPage, setCurrentPage] = useState(0);
   const [pagesCount, setPagesCount] = useState(0);
   const[isLoading, setIsLoading] = useState(false);
   const pageSize = 10 ;

   // <i class="cil-battery-charge"></i>
   // fas fa-wind	
   //<span class="material-icons">electric_car</span> electric_car
   //<span class="iconify" data-icon="mdi:solar-power"></span>

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
    provider.on('connect', handleAccountsChanged);

  
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
      console.log('Current addr: ', account.current);
    }
  }
  const handlePageClick = (e, page) => {
    console.log(page);
    e.preventDefault();
    setCurrentPage(page);
    console.log(page);
    getDeviceData(page  * pageSize);
    console.log(page);
  };

  const handlePreviousClick= e => {
    const _currentPage = currentPage - 1 ;
    e.preventDefault();
    setCurrentPage(_currentPage);
    getDeviceData(_currentPage  * pageSize);
     console.log(_currentPage);
  };

  const handleNextClick= e => {
    const _currentPage = currentPage + 1 ;
    e.preventDefault();
    setCurrentPage(_currentPage);
    getDeviceData(_currentPage  * pageSize);
     console.log(_currentPage);
  };

      const getDeviceData = (offset, update = false)=>{

        if(deviceData===null || update){
        marketplace.methods.getMyDevices().call({from: account.current}).then(function(total){
            console.log("total devices:" , total);
            setTotalDevices(total.length);
            setPagesCount(Math.ceil(total.length / pageSize));
            var rows = [];

         for (var  i = 0  ; i < total.length ; i++) {
          marketplace.methods.getDeviceByID(total[i]).call({from: account.current})
              .then(function(result){
              //  console.log("result:" ,result);
                setDeviceData(result);
              
                  rows.push( <tr key = {"deviceData_"+i + i++}>
                    <td>{result[0]}</td>
                    <td >{result[2]}</td>
                    <td >{ result[1] == "3" ? 
                            <i className="fas fa-solar-panel"> </i>: null }
                         { result[1] == "4" ? 
                             <i className="fas fa-charging-station"> </i>: null }
                         { result[1] == "2" ? 
                             <i className="fas fa-tint"> </i>: null }
                         { result[1] == "1" ? 
                             <i className="fas fa-wind"></i>: null }
                         { result[1] == "5" ? 
                             <i className="fas fa-battery-full" ></i>: null }
                              
                    </td>  
                    
                    <td>{moment((moment.unix(result[3]))).startOf('minute').fromNow()}</td>
                    <td> <Button variant="secondary" size="sm" data-id={result[0]} className="btn" onClick={event => removeDevice(event.target.dataset.id)}>
                         <i data-id={result[0]} className="fa fa-trash" ></i></Button>
                    </td>
                  </tr>);
                setMyDevices(rows);
              });
          }
        })
      }
      // else {
      //   let rows = [];
      //   for (let i = offset; i < pageSize + offset  ; i++) {
          
      //     console.log("offset2:" ,offset);
      //     rows.push( <tr>
      //               <td>{deviceData[0]}</td>
      //               <td>{deviceData[1]}</td>
      //               <td>{deviceData[2]}</td>
      //               <td>{moment((moment.unix(deviceData[3]))).startOf('minute').fromNow()}</td>
      //               <td> <Button variant="secondary" size="sm" data-id={deviceData[0]} className="btn" onClick={event => removeDevice(event.target.dataset.id)}>
      //                    <i data-id={deviceData[0]} className="fa fa-trash" ></i></Button>
      //               </td>
      //     </tr>);
      //     setDeviceData(null);
          
      //   }
      //   setMyDevices(rows)
      //   console.log(rows);
      // }
    }
  
      const handleSelect=(e)=>{
        setSelectValue(e.target.value);
        console.log("(e.target.value:" ,e.target.value);
     }

       const addDevice = async () =>{
           //   if (account.current ===  Object.values(result)[0]){
           //      toast("This device has been already added!");
           //   }
           setIsLoading(true);
      
       await  marketplace.methods.createDevice(input, selectValue ).send({from: account.current}).on('transactionHash', (th) => {
          console.log("name:" , input);
          console.log("type:" , selectValue );
           toast("A device has been succesfully added!")    
        })
        .then(function(e) {
          getDeviceData(currentPage * pageSize, true);
          setIsLoading(false);
          })
        }
        
      const removeDevice = async (id) => {
    
        console.log("id: ", id);
        try{
          await marketplace.methods.removeDevice(id).send({from: account.current}).on('transactionHash', (th) => {
            console.log(th);
            toast("You deleted your device successfully!") 
          })
          .then(function(){
            getDeviceData();   
          })
        }catch(e){
          console.log(e);
          
        }
      }
      // const updateDevice = async (id) => {
    
      //   try{
      //     await marketPlace.methods.updateAsk(id, amount * 1000000, price * 1000000).send({from: account.current}).on('transactionHash', (th) => {
      //       console.log(th);
      //       toast("You updated your ask successfully!") 
      //       closeModalUpdate();
           
      //     })
      //     .then(function(receipt){
      //       getDataMyAsks(currentPageMA * myPageSize, true);  
      //       getDataAsks(currentPageA * pageSize, true);
    
      //     })
      //     setPriceModal(''); 
      //     setEnergyModalKW(''); 
      //   }catch(e){
      //     console.log(e);
          
      //   }
      // }

      useEffect(() => {

        web3.eth.getAccounts().then(r=>{
          handleAccountsChanged(r);
          console.log("r:", r)
          getDeviceData();
        });


          }, []);

  return (
    <>
      <div className="content">
      
              <Col md="6">
            <Card className="card-user">
              <CardBody>
                <CardText/>
                <div>
                   {isConnected
                      ?   <form>
                      <div className="author">
                        <div className="block block-one" />
                        <div className="block block-two" />
                        <div className="block block-three" />
                        <div className="block block-four" />
                         <p className="description">Add new Device</p>
                           <br/>
                           <Col className="pr-md-1 form"  md="11"  >
                             <FormGroup>
                             <Input
                                   value = {setInput}
                                   placeholder="Enter your ID"
                                   type="text"
                                   value={input}
                                   onInput={e => setInput(e.target.value)}     
                               />
                               < div className="form-group  col-md-13 "><br></br>
     
                                <select 
                                id="inputDevices" className="form-control "
                                value= {selectValue}
                                onChange={handleSelect} 
                                // onSelect={handleSelect}
                                >

                                        <option value="1">Wind</option>
                                        <option value="2">Hydropower</option>
                                        <option value="3">Photovoltaic(PV)</option>
                                        <option value="4">Electric vehicles(EV) </option>
                                        <option value="5">Battery</option>
                                      </select> 
                                     <h4>You selected {selectValue}</h4>       
                                </div>
                               {
                                 error && <div style={{color: `red`}}>Please enter a valid ID</div>
                               }
                               { isLoading ? 
                               <div className="lds-hourglass"></div>
                                 :
                                <Button variant="primary" size="lg" onClick={addDevice}  > Add Device  </Button>
                                }
                             </FormGroup>
                             </Col>       
                             </div>    
                             </form>

                      :<div className="author">
                      <div className="block block-one" />
                      <div className="block block-two" />
                      <div className="block block-three" />
                      <div className="block block-four" />
                       <p className="description">Connect your wallet to add a device</p>
                         < Button className="btn-fill" variant="primary"  size="lg"  color="secondary" type="button" onClick= { signInMetamask }>
                      <img src={"https://docs.metamask.io/metamask-fox.svg"} style={{"height": "30px"}}></img>{"  "} Connect Wallet
                      </Button>         
                       
                       </div>   
                    }
               </div> 
                </CardBody>
                </Card>
                </Col>
                <Col md="7">
                   
                   <Card>
                 <CardHeader>
                   <h5 className="title">List of my devices</h5>
                 </CardHeader>
                 <CardBody>

                   {myDevices!==null ?
                       <Table className="tablesorter" responsive>
                         <thead className="text-primary">
                     <tr>
                       <th>id</th>
                       <th>Name</th>
                       <th>Type of device</th>
                       <th>Date</th>
                     </tr>
                     </thead>
                     <tbody>
                     {myDevices}

                     </tbody>
                   </Table> 
                   : <></>}
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
               </Card>
                 
                 </Col>
                 
                
                
      </div>
    </>
  );
}


export default Devices;
