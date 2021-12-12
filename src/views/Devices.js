import React, {useEffect, useState, useRef} from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import 'bootstrap';
import TablePagination from '../components/pagination/TablePagination';
import { Button } from 'reactstrap';
import "assets/css/black-dashboard-react.css";
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import moment from 'moment';

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

// var contractAddress = '0xf204b9E3f564ef0F5d827B50A8879D058FA191A9' ;
// const deviceRegistry = new web3.eth.Contract(abi, contractAddress);
var contractAddress =  '0xf9221224C2c6B1571Ae2a7D6a53E14e234a5F5F1' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"name","type":"string"}],"name":"onDeviceAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"}],"name":"onDeviceRemoved","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"oldOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"onDeviceTransferOwnership","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"string","name":"name","type":"string"},{"indexed":false,"internalType":"string","name":"typeDevice","type":"string"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"onDeviceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"}],"name":"onEnergyRecorded","type":"event"},{"constant":false,"inputs":[{"internalType":"string","name":"_typeOfDevice","type":"string"},{"internalType":"string","name":"_name","type":"string"}],"name":"createDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfDevices","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getDeviceByID","outputs":[{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"string","name":"","type":"string"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getEnergyPerDevice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getMyDevices","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getTotalEnergy","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"recordEnergyPerDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"removeDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"address","name":"_to","type":"address"}],"name":"transferOwnershipOfDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"},{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_typeOfDevice","type":"string"}],"name":"updateDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"}] ; 
const Device = new web3.eth.Contract(abi, contractAddress);




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
   const [selectValue,setSelectValue]=useState('');
   const [deviceData, setDeviceData] = useState(null);
   const [totalDevices, setTotalDevices] = useState(0);
   const [myDevices, setMyDevices] = useState(null);
   const [currentPage, setCurrentPage] = useState(0);
   const [pagesCount, setPagesCount] = useState(0);
   const pageSize = 5;

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
          Device.methods.getCountOfDevices().call({from: account.current}).then(function(total){
            console.log("total devices:" , total);
            setTotalDevices(total);
          setPagesCount(Math.ceil(total / pageSize));
          
           
          if(total>0)
          Device.methods.getMyDevices().call({from: account.current})
              .then(function(result){
                setDeviceData(result);
                console.log(pageSize + offset);
                var rows = [];
                for (var i = offset; i < pageSize + offset  ; i++) {
                  if(i >= total)  break;
    
                  rows.push( <tr key={i}>
                    <td>{result[0]}</td>
                    <td>{moment((moment.unix(result[1]))).startOf('minute').fromNow()}</td>
                    <td> <Button variant="secondary" size="sm" data-id={result[0]} class="btn" onClick={event => removeDevice(event.target.dataset.id)}>
                         <i data-id={result[0]} class="fa fa-trash" ></i></Button>
                    </td>
                    <td>
                    <Button variant="secondary" size="sm" data-id={result[0]} onClick={event => {setId(event.target.dataset.id); }}class="btn">
                         <i data-id={result[0]} class="fa fa-edit" ></i>
                    </Button>
                    </td>
                  </tr>);
                }
                setMyDevices(rows);
                console.log(rows);
              });
        });
      }
      else{
        let rows = [];
        for (let i = offset; i < pageSize + offset  ; i++) {
          if(i < totalDevices )  {
          rows.push( <tr key={i}>
           <td>{deviceData[0]}</td>
           <td>{moment((moment.unix(deviceData[1]))).startOf('minute').fromNow()}</td>
           <td> <Button variant="secondary" size="sm" data-id={deviceData[0]} class="btn" onClick={event => removeDevice(event.target.dataset.id)}>
                 <i data-id={deviceData[0]} class="fa fa-trash" ></i></Button>
           </td>
           <td>
               <Button variant="secondary" size="sm" data-id={deviceData[0]} onClick={event => {setId(event.target.dataset.id); }}class="btn">
                   <i data-id={deviceData[0]} class="fa fa-edit" ></i>
               </Button>
           </td>
          </tr>);
          setDeviceData(null);
          }
        }
        setMyDevices(rows)//* update table*/
        console.log(rows);
      }}

      const handleSelect=(e)=>{
        setSelectValue(e.target.value);
        console.log(e.target.value);
     }
    
       const addDevice= () =>{
           //   if (account.current ===  Object.values(result)[0]){
           //      toast("This device has been already added!");
           //   }
      
        Device.methods.createDevice(input, selectValue ).send({from: account.current}).on('transactionHash', (th) => {
          console.log("name:" , input);
          console.log("type:" , selectValue );
           toast("A device has been succesfully added!")  
        })
      }

      if(deviceData===null){
        getDeviceData(currentPage * pageSize, true);
      }

      const removeDevice= async (id) => {
    
        console.log("id: ", id);
        try{
          await Device.methods.removeDevice(id).send({from: account.current}).on('transactionHash', (th) => {
            console.log(th);
            toast("You deleted your device successfully!") 
          })
          .then(function(receipt){
            getDeviceData(currentPage * pageSize, true);   
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
        });
    
          }, []);


          const [Ress, setRess] = useState('');

          function setRes(){
            web3.eth.getAccounts().then(function(accounts){
var acc=accounts[0];
           Device.methods.getTotalEnergy().call({from: acc}).then(function(res){
            
            
                setRess(res);
            
            console.log(res);
            
            })}
            )}setRes();

         
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
                               < div class="form-group  col-md-13 "><br></br>
     
                                <select 
                                id="inputDevices" class="form-control "
                                value= {selectValue}
                                onChange={handleSelect} 
                                // onSelect={handleSelect}
                                >
                                        <option >Select Devices</option>
                                        <option value="Wind">Wind</option>
                                        <option value="Biomass">Biomass</option>
                                        <option value="Hydo turbine">Hydo turbine</option>
                                        <option value="Solar Thermal">Solar Thermal</option>
                                        <option value="PV">PV</option>
                                        <option value="EV">EV</option>
                                        <option value="Battery">Battery</option>
                                      </select> 
                                     {/* <h4>You selected {selectValue}</h4> */}

                                      
                                </div>
                               {
                                 error && <div style={{color: `red`}}>Please enter a valid ID</div>
                               }

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
      <h1 className="energy-info">{Ress}</h1>
    </>
  );
}


export default Devices;
