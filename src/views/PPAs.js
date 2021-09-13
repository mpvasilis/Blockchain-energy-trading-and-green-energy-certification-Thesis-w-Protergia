import React, {useEffect, useState, useRef} from "react";
import  TablePaginationAsk  from  '../components/pagination/TablePaginationAsk';
import  TablePaginationBid  from '../components/pagination/TablePaginationBid';
import detectEthereumProvider from '@metamask/detect-provider';
import PropTypes from 'prop-types';
import TablePagination from '../components/pagination/TablePagination';

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

var contractAddress = '0x03cAB524a1240F12357cb7D889F35033D387Cb2F' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint32","name":"agreedPrice","type":"uint32"}],"name":"acceptedCorpPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint64","name":"energy","type":"uint64"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"availableEnergyNotification","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ppaBuyer","type":"address"}],"name":"buyerDeregistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ppaBuyer","type":"address"}],"name":"buyerRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint32","name":"price","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"createdCorpPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":false,"internalType":"uint32","name":"price","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"createdPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"startDay","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endDay","type":"uint256"},{"indexed":false,"internalType":"enum PPA.Status","name":"status","type":"uint8"}],"name":"expiredPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"}],"name":"producerDeregistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"}],"name":"producerRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"purchasedPPA","type":"event"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"acceptCorporatePPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_buyer","type":"address"},{"internalType":"uint64","name":"_energy","type":"uint64"},{"internalType":"uint256","name":"_idOfMatchPPA","type":"uint256"}],"name":"availableKwhs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfPPA","type":"uint256"}],"name":"buyPPAKwhs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAuctionPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"claimPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_buyer","type":"address"},{"internalType":"uint32","name":"_agreedKwhPrice","type":"uint32"},{"internalType":"uint256","name":"_startDay","type":"uint256"},{"internalType":"uint256","name":"_endDay","type":"uint256"},{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"corporatePPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint32","name":"_kwhPrice","type":"uint32"},{"internalType":"uint256","name":"_startDay","type":"uint256"},{"internalType":"uint256","name":"_endDay","type":"uint256"}],"name":"createPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"abuyer","type":"address"}],"name":"deregisterPPABuyer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deregisterProducer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfContract","type":"uint256"},{"internalType":"uint64","name":"_buyEnergy","type":"uint64"}],"name":"energyTradingPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getApprovedPPAByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getApprovedPPAs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAvKwhs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getAvailableEnergyByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCorpPPAs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getCorporatePPAByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getPPAByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPPAs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getPurchasesByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"killPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"abuyer","type":"address"}],"name":"registerPPABuyer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"registerProducer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAllPPAs","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint32[]","name":"","type":"uint32[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAllpurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint64[]","name":"","type":"uint64[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewApprovalPPAs","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint64[]","name":"","type":"uint64[]"},{"internalType":"uint32[]","name":"","type":"uint32[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAvailableKwhs","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint64[]","name":"","type":"uint64[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewCorporatePPAlist","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint32[]","name":"","type":"uint32[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}];
const PPA = new web3.eth.Contract(abi, contractAddress);

function PPAs() {
  const [open, setOpen] = useState('PPA');
  
  const [totalBids, setTotalBids] = useState(0);
  const [bids, setBids] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 14;
  const [totalPPAs, setTotalPPAs] = useState(0);
  const [PPAs, setPPAs] = useState(null);
  const [totalCPPAs, setTotalCPPAs] = useState(0);
  const [CPPAs, setCPPAs] = useState(null);
  const pagesCountPPA = Math.ceil(totalPPAs / pageSize);
  const pagesCountCPPA = Math.ceil(totalCPPAs / pageSize);
  
  const [price, setPrice] = useState('');
  // const [priceBid, setPriceBid] = useState(0);
  const [placeStartDay, setPlaceStartDay] = useState('');
  const [placeEndDay, setPlaceEndDay] = useState('');
  const [ID, setID] = useState('');
  const [address, setAddress] = useState('');
  const account = useRef('');
  const[error, setError] = useState(false);
  const[isDisabled, setIsDisabled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
 
  const handlePageClickPPA  = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
  };

  const handlePreviousClickPPA = e => {
    e.preventDefault();
    const index = currentPage - 1;
    setCurrentPage(index);
    getDataPPAs(currentPage * pageSize);

  };

  const handleNextClickPPA = e => {
    e.preventDefault();
    const index = currentPage + 1;
    setCurrentPage(index);
    getDataPPAs(currentPage * pageSize);

  };
  const handlePageClickCPPA  = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
  };

  const handlePreviousClickCPPA = e => {
    e.preventDefault();
    const index = currentPage - 1;
    setCurrentPage(index);
    getDataCPPAs(currentPage * pageSize);

  };

  const handleNextClickCPPA = e => {
    e.preventDefault();
    const index = currentPage + 1;
    setCurrentPage(index);
    getDataCPPAs(currentPage * pageSize);

  };
  
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
      if (price === ""||placeStartDay === ""||placeEndDay === ""||placeEndDay < placeStartDay||price <= 0){

        setError(true); 
      }
      else{
       
        PPA.methods.createPPA(price, placeStartDay, placeEndDay).send({from: account.current}).then(function(e) {
          console.log(e);
    
        }); 
        setPrice("");
        setPlaceStartDay("");
        setPlaceEndDay("");
      }
    }

    if (open == 'CPPA'){
      if (price === ""||placeStartDay === ""||placeEndDay === ""||ID === ""||address === ""||price <= 0||placeEndDay < placeStartDay){

        setError(true); 
      }
      else{
        
        
        PPA.methods.corporatePPA(address, price, placeStartDay, placeEndDay, ID, ).send({from: account.current}).then(function(e) {
          console.log(e);
        });
        setAddress("");
        setPrice("");
        setPlaceStartDay("");
        setPlaceEndDay("");
        setID("");
        
      }
    }
  }
  const claimPPA = () => {
    
    
      if (ID == ""){

        setError(true); 
      }
      else{
       
        PPA.methods.claimPPA(ID).send({from: account.current}).then(function(e) {
          console.log(e);
        });
      }
    
  }

  const getDataPPAs = (offset)=>{

    PPA.methods.getPPAs().call().then(function(askNum){
      console.log("Total PPAs:" , askNum);
      setTotalPPAs(askNum)
      if(askNum>0)
      PPA.methods.viewAllPPAs(pageSize, offset).call()
          .then(function(result){
            console.log(result);
            var rows = [];
            for (var i = 0; i < askNum; i++) {
              rows.push( <tr key={i}>
                <td>{result[0][i].substr(0,6)}</td>
                <td>{result[1][i]}</td>
                <td>{result[2][i]}</td>
                <td>{result[3][i]}</td>
                <td>{result[4][i]}</td>
                <td>{result[5][i]}</td>
                
              </tr>);
            }
            setPPAs(rows)
          });
    });
  }
  const getDataCPPAs = (offset)=>{

    PPA.methods.getCorpPPAs().call().then(function(askNum){
      console.log("Total CPPAs:" , askNum);
      setTotalCPPAs(askNum)
      if(askNum>0)
      PPA.methods.viewCorporatePPAlist(pageSize, offset).call()
          .then(function(result){
            console.log(result);
            var rows = [];
            for (var i = 0; i < askNum; i++) {
              rows.push( <tr key={i}>
                <td>{result[0][i].substr(0,6)}</td>
                <td>{result[1][i].substr(0,6)}</td>
                <td>{result[2][i]}</td>
                <td>{result[3][i]}</td>
                <td>{result[4][i]}</td>
                <td>{result[5][i]}</td>
              </tr>);
            }
            setCPPAs(rows)
          });
    });

  }

  
  useEffect(() => {

    getDataPPAs(currentPage * pageSize);
    getDataCPPAs(currentPage * pageSize);

    web3.eth.getAccounts().then(r=>{
      handleAccountsChanged(r);
    });
  
  }, []);
  

  return (
    <>
      <div className="content">
        
      <Row>
           
            <Col md="7">
            {totalPPAs>0 ?
                <Card>
              <CardHeader>
                <h4 className="title">Open PPAs </h4>
              </CardHeader>
              <CardBody>
                {PPAs!==null ?
                  <Table className="tablesorter" responsive>                  
                      <thead className="text-primary">
                  <tr>
                    <th>Address</th>
                    <th>Price</th>
                    <th>ID</th>
                    <th>StartDay</th>
                    <th>EndDay</th>
                  </tr>
                  </thead>
                  <tbody>
                  {PPAs}
                  </tbody>
                </Table> : <></>}
                <TablePagination
                  pagesCountPPA={pagesCountPPA}
                  currentPage={currentPage}
                  handlePageClickPPA={handlePageClickPPA}
                  handlePreviousClickPPA={handlePreviousClickPPA}
                  handleNextClickPPA={handleNextClickPPA}
                />
              </CardBody>
              <CardFooter>

              </CardFooter>
            </Card> : <></>}

          {totalCPPAs>0 ?
                <Card>
              <CardHeader>
                <h4 className="title">Open Corporate PPAs</h4>
              </CardHeader>
              <CardBody>
                {CPPAs!==null ?
                  <Table className="tablesorter" responsive>                  
                      <thead className="text-primary">
                  <tr>
                    <th>Producer Address</th>
                    <th>Buyer Address</th>
                    <th>Price</th>
                    <th>ID</th>
                    <th>StartDay</th>
                    <th>EndDay</th>
                  </tr>
                  </thead>
                  <tbody>
                  {CPPAs}
                  </tbody>
                </Table> : <></>}
                <TablePagination
                  pagesCountCPPA={pagesCountCPPA}
                  currentPage={currentPage}
                  handlePageClickCPPA={handlePageClickCPPA}
                  handlePreviousClickCPPA={handlePreviousClickCPPA}
                  handleNextClickCPPA={handleNextClickCPPA}
                />
              </CardBody>
              <CardFooter>

              </CardFooter>
            </Card> : <></>}
           
             
         
            </Col>
            <Col md="5">
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
                    Create Corporate PPA
                  </Button>
                </div>
                <Row>
                  <Col className="pr-md-1 form"  md="11"  >
                    <FormGroup>
                      <label>{open==='CPPA'? 'CPPA':"PPA"} Price (EUR)</label>
                      <Input
                          value = {price}
                          placeholder="Enter Price(EUR)"
                          type="text"
                          onChange={event => setPrice(event.target.value)}
                      />
                    
                    </FormGroup>
                    <FormGroup style={{display:(open==='CPPA'? 'none':"block")}} >
                      <label>Start Day</label>
                      <Input
                           value = {placeStartDay}
                          placeholder="Start Day"
                          type="text"
                          onChange={event => setPlaceStartDay(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='CPPA'? 'none':"block")}} >
                      <label>End Day</label>
                      <Input
                           value = {placeEndDay}
                          placeholder="End Day"
                          type="text"
                          onChange={event => setPlaceEndDay(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='PPA'? 'none':"block")}} >
                      <label>Start Day</label>
                      <Input
                          value = {placeStartDay}
                          placeholder="Start Day"
                          type="text"
                          onChange={event => setPlaceStartDay(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='PPA'? 'none':"block")}} >
                      <label>End Day</label>
                      <Input
                          value = {placeEndDay}
                          placeholder="End Day"
                          type="text"
                          onChange={event => setPlaceEndDay(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='PPA'? 'none':"block")}} >
                      <label>ID</label>
                      <Input
                          value = {ID}
                          placeholder="ID"
                          type="text"
                          onChange={event => setID(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='PPA'? 'none':"block")}} >
                      <label>Address</label>
                      <Input
                          value = {address}
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
