import React, {useEffect, useState, useRef} from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import 'bootstrap';
import { Button } from 'reactstrap';
import "assets/css/black-dashboard-react.css";
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';

// reactstrap components
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

var contractAddress = '0xf204b9E3f564ef0F5d827B50A8879D058FA191A9' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askEnergyNotifier","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"offerEnergyNotifier","type":"event"},{"constant":false,"inputs":[{"internalType":"string","name":"typeOfDevice","type":"string"}],"name":"addDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"askEnergy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"}],"name":"energyOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getAsksByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getBidsByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"deviceID","type":"address"}],"name":"getDeviceByAddress","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getPurchaseByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"ownerOfDevice","type":"address"},{"internalType":"string","name":"typeOfDevice","type":"string"}],"name":"updateDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"viewAllAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAllBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAllEnergyPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}] ; 
const deviceRegistry = new web3.eth.Contract(abi, contractAddress);


function Devices() {
  const [open, setOpen] = useState('add');
  const [address, setAddress] = useState(0);
  const [input, setInput] = useState(''); 
  const account = useRef('');
  const [error, setError] = useState(false);
  const [deviceAdded, setDeviceAdded] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
   const [accounts, setAccounts] = useState([]);
   const [id, setId] = useState(0);

   

   
  

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
  
  useEffect(() => {
    web3.eth.getAccounts().then(r=>{
      handleAccountsChanged(r);
    });

      }, []);
   
    
       const addDevice= () =>{

        deviceRegistry.methods.getDeviceByAddress(account.current).call({from: account.current}).then(function(result){
          
          console.log(typeof result);
          console.log("result:" , result);
          console.log("Object.values(result)[0]:", Object.values(result)[0])
      
        if (account.current ===  Object.values(result)[0]){


            toast("This device has been already added!");
            
        }
         else{

         deviceRegistry.methods.addDevice(input).send({from: account.current}).on('transactionHash', (th) => {
       
            toast("A device has been succesfully added!")   
        })} 
       
      })}
     
  return (
    <>
      <div className="content">
              <Col md="6">
            <Card className="card-user">
              <CardBody>
                <CardText />
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
                           <Row>
                           <Col className="pr-md-1 form"  md="11"  >
                             <FormGroup>
                             <Input
                                   value = {setInput}
                                   placeholder="Enter your ID"
                                   type="text"
                                   value={input}
                                   onInput={e => setInput(e.target.value)}
                               />
                               {
                                 error && <div style={{color: `red`}}>Please enter a valid ID</div>
                               }

      < div class="form-group  col-md-13 "><br></br>
     
      <select id="inpurDevices" class="form-control ">
      
                    <option selected >Select Devices</option>
                    <option value="1">Wind</option>
                     <option value="2">Biomass</option>
                     <option value="3">Hydo turbine</option>
                     <option value="4">Solar Thermal</option>
                     <option value="5">PV</option>
                     <option value="6">EV</option>
                     <option value="7">Battery</option>
                    </select>
                    
             </div>
             
               
               <Button variant="primary" size="lg" onClick={addDevice}  > Add Device  </Button>{' '}
                               
                             </FormGroup>
                             </Col>
                             </Row>
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
      </div>
    </>
  );
}


export default Devices;
