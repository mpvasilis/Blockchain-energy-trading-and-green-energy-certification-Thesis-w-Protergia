import React, {useEffect, useState, useRef} from "react";
import  TablePaginationAsk  from  '../components/pagination/TablePaginationAsk';
import  TablePaginationBid  from '../components/pagination/TablePaginationBid';
import detectEthereumProvider from '@metamask/detect-provider';
import PropTypes from 'prop-types';

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

var contractAddress = '0x5c3bF6C9AaaC0e9F40Eb4462b8E6630677153217' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint32","name":"agreedPrice","type":"uint32"}],"name":"acceptedCorpPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint64","name":"energy","type":"uint64"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"availableEnergyNotification","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ppaBuyer","type":"address"}],"name":"buyerDeregistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ppaBuyer","type":"address"}],"name":"buyerRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint32","name":"price","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"createdCorpPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":false,"internalType":"uint32","name":"price","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"createdPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"startDay","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endDay","type":"uint256"},{"indexed":false,"internalType":"enum PPA.Status","name":"status","type":"uint8"}],"name":"expiredPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"}],"name":"producerDeregistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"}],"name":"producerRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"purchasedPPA","type":"event"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"acceptCorporatePPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_buyer","type":"address"},{"internalType":"uint64","name":"_energy","type":"uint64"},{"internalType":"uint256","name":"_idOfMatchPPA","type":"uint256"}],"name":"availableKwhs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfPPA","type":"uint256"}],"name":"buyPPAKwhs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAuctionPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"claimPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_buyer","type":"address"},{"internalType":"uint32","name":"_agreedKwhPrice","type":"uint32"},{"internalType":"uint256","name":"_startDay","type":"uint256"},{"internalType":"uint256","name":"_endDay","type":"uint256"},{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"corporatePPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint32","name":"_kwhPrice","type":"uint32"},{"internalType":"uint256","name":"_startDay","type":"uint256"},{"internalType":"uint256","name":"_endDay","type":"uint256"}],"name":"createPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"abuyer","type":"address"}],"name":"deregisterPPABuyer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deregisterProducer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfContract","type":"uint256"},{"internalType":"uint64","name":"_buyEnergy","type":"uint64"}],"name":"energyTradingPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getApprovedPPAByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getApprovedPPAs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAvKwhs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getAvailableEnergyByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCorpPPAs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getCorporatePPAByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getPPAByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPPAs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getPurchasesByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"killPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"abuyer","type":"address"}],"name":"registerPPABuyer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"registerProducer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAllPPAs","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint32[]","name":"","type":"uint32[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAllpurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint64[]","name":"","type":"uint64[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewApprovalPPAs","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint64[]","name":"","type":"uint64[]"},{"internalType":"uint32[]","name":"","type":"uint32[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAvailableKwhs","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint64[]","name":"","type":"uint64[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewCorporatePPAlist","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint32[]","name":"","type":"uint32[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}] ;
const PPA = new web3.eth.Contract(abi, contractAddress);

function PPAs() {
  const [open, setOpen] = useState('PPA');
  const [totalAsks, setTotalAsks] = useState(0);
  const [asks, setAsks] = useState(null);
  const [totalBids, setTotalBids] = useState(0);
  const [bids, setBids] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const pagesCountAsk = Math.ceil(totalAsks / pageSize);
  const pagesCountBid = Math.ceil(totalBids / pageSize);
  const [price, setPrice] = useState(0);
  // const [priceBid, setPriceBid] = useState(0);
  const [placeStartDay, setPlaceStartDay] = useState(0);
  const [placeEndDay, setPlaceEndDay] = useState(0);
  const [ID, setID] = useState(0);
  const [address, setAddress] = useState('');
  const account = useRef('');
  const[error, setError] = useState(false);
  const[isDisabled, setIsDisabled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  
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
    console.log('Current addr: ', account.current);
  }
}
  
  
  
  const createPPA = () => {
    
    if (open == 'PPA'){
      if (price == ""||placeStartDay == ""||placeEndDay == ""){

        setError(true); 
      }
      else{
       
        PPA.methods.createPPA(price, placeStartDay, placeEndDay).send({from: account.current}).then(function(e) {
          console.log(e);
        });
      }
    }

    if (open == 'CPPA'){
      if (price == ""||placeStartDay == ""||placeEndDay == ""||ID == ""||address == ""){

        setError(true); 
      }
      else{
       
        PPA.methods.corporatePPA(address, price, placeStartDay, placeEndDay, ID, ).send({from: account.current}).then(function(e) {
          console.log(e);
        });
      }
    }
  }
  const claimPPA = () => {
    
    if (open == 'PPA'){
      if (ID == ""){

        setError(true); 
      }
      else{
       
        PPA.methods.claimPPA(ID).send({from: account.current}).then(function(e) {
          console.log(e);
        });
      }
    }
  }

  
  useEffect(() => {

    

    web3.eth.getAccounts().then(r=>{
      handleAccountsChanged(r);
    });
  
  }, []);
  

  return (
    <>
      <div className="content">
        <Row>
    
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                
              <div>
                  {isConnected
                  ? <>  <div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                  <p className="description">Create a PPA</p>
                  <br/>
                  <Button variant="primary" size="lg" onClick={()=>{setOpen('PPA')}}>
                    Create PPA
                  </Button>{' '}
                  <Button variant="secondary" size="lg" onClick={()=>{setOpen('CPPA')}}>
                    Create CorporatePPA
                  </Button>
                </div>
                <Row>
                  <Col className="pr-md-1 form"  md="11"  >
                    <FormGroup>
                      <label>{open==='CPPA'? 'CPPA':"PPA"} Price (EUR)</label>
                      <Input
                          placeholder="Enter Price(EUR)"
                          type="text"
                          onChange={event => setPrice(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='CPPA'? 'none':"block")}} >
                      <label>Start Day</label>
                      <Input
                          placeholder="Start Day"
                          type="text"
                          onChange={event => setPlaceStartDay(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='CPPA'? 'none':"block")}} >
                      <label>End Day</label>
                      <Input
                          placeholder="End Day"
                          type="text"
                          onChange={event => setPlaceEndDay(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='PPA'? 'none':"block")}} >
                      <label>Start Day</label>
                      <Input
                          placeholder="Start Day"
                          type="text"
                          onChange={event => setPlaceStartDay(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='PPA'? 'none':"block")}} >
                      <label>End Day</label>
                      <Input
                          placeholder="End Day"
                          type="text"
                          onChange={event => setPlaceEndDay(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='PPA'? 'none':"block")}} >
                      <label>ID</label>
                      <Input
                          placeholder="ID"
                          type="text"
                          onChange={event => setID(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='PPA'? 'none':"block")}} >
                      <label>Address</label>
                      <Input
                          placeholder="Address"
                          type="text"
                          onChange={event => setAddress(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                    {
                        error && <div style={{color: `red`}}>Not valid details</div>
                      }
                    <Button variant="secondary" size="lg" onClick={() => createPPA()}>
                      Create {open==='CPPA'? 'CPPA':"PPA"}
                    </Button>
                    
                    
                    
                  </FormGroup>
          </Col>
                </Row>
</>
                  :<div className="author">
                  <div className="block block-one" />
                  <div className="block block-two" />
                  <div className="block block-three" />
                  <div className="block block-four" />
                   <p className="description">Connect your wallet to create a new PPA</p>
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
          </Col>
     
        </Row>
      </div>
    </>
  );
}



export default PPAs;
