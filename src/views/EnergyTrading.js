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

var contractAddress = '0xe03AC856cEb6f46778F9Efea5B4f954da80702C0' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askEnergyNotifier","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfBattery","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"batteryAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfBattery","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"batteryUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"offerEnergyNotifier","type":"event"},{"constant":false,"inputs":[{"internalType":"string","name":"uuID","type":"string"}],"name":"addNewBattery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"askEnergy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"}],"name":"energyOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getAsksByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"batteryID","type":"address"}],"name":"getBatteryByAddress","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getBidsByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getPurchaseByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"batteryID","type":"address"},{"internalType":"string","name":"uuID","type":"string"}],"name":"updateBattery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAllAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAllBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"},{"internalType":"uint256","name":"offset","type":"uint256"}],"name":"viewAllEnergyPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}]
const energyTrading = new web3.eth.Contract(abi, contractAddress);

function EnergyTrading() {
  const [open, setOpen] = useState('bid');
  const [totalAsks, setTotalAsks] = useState(0);
  const [asks, setAsks] = useState(null);
  const [totalBids, setTotalBids] = useState(0);
  const [bids, setBids] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const pagesCountAsk = Math.ceil(totalAsks / pageSize);
  const pagesCountBid = Math.ceil(totalBids / pageSize);
  const [energyKW, setEnergyKW] = useState(0);
  const [priceBid, setPriceBid] = useState(0);
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
  
  const handlePageClickAsk = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
  };

  const handlePreviousClickAsk = e => {
    e.preventDefault();
    const index = currentPage - 1;
    setCurrentPage(index);
    getDataAsks(currentPage * pageSize);

  };

  const handleNextClickAsk = e => {
    e.preventDefault();
    const index = currentPage + 1;
    setCurrentPage(index);
    getDataAsks(currentPage * pageSize);

  };

  const handlePageClickBid = (e, index) => {
    e.preventDefault();
    setCurrentPage(index);
  };

  const handlePreviousClickBid = e => {
    e.preventDefault();
    const index = currentPage - 1;
    setCurrentPage(index);
    getDataBids(currentPage * pageSize);

  };

  const handleNextClickBid = e => {
    e.preventDefault();
    const index = currentPage + 1;
    setCurrentPage(index);
    getDataBids(currentPage * pageSize);

  };

  const getDataAsks = (offset)=>{

    energyTrading.methods.getCountOfAsks().call().then(function(askNum){
      console.log("Total asks:" , askNum);
      setTotalAsks(askNum)
      if(askNum>0)
      energyTrading.methods.viewAllAsks(pageSize, offset).call()
          .then(function(result){
            console.log(result);
            var rows = [];
            for (var i = 0; i < askNum; i++) {
              rows.push( <tr key={i}>
                <td>{result[0][i].substr(0,6)}</td>
                <td>{result[1][i]}</td>
                <td>{result[2][i]}</td>
                <td>{result[3][i]}</td>
              </tr>);
            }
            setAsks(rows)
          });
    });

  }

  const getDataBids = (offset)=>{
    energyTrading.methods.getCountOfBids().call().then(function(bidsnum){
      console.log("Total bids:" , bidsnum);
      setTotalBids(bidsnum)
      if(bidsnum>0)
        energyTrading.methods.viewAllBids(pageSize, offset).call()
            .then(function(result){
              console.log(result);
              var rows = [];
              for (var i = 0; i < bidsnum; i++) {
                rows.push( <tr key={i}>
                  <td>{result[0][i].substr(0,6)}</td>
                  <td>{result[1][i]}</td>
                  <td>{result[2][i]}</td>
                  <td>{result[3][i]}</td>
                </tr>);
              }
              setBids(rows)
            });
    });
  }

  const addBidOrAsk = () => {
    
    if (open == 'bid'){
      if (energyKW == ""||priceBid == ""){

        setError(true); 
      }
    else{
    
      energyTrading.methods.energyOffer(energyKW, priceBid).send({from: account.current}).then(function(e) {
        console.log(e);
      });
    }
    }else{
      if (energyKW == ""){

        setError(true);
        
      }
      energyTrading.methods.askEnergy(energyKW).send({from: account.current}).then(function(e) {
        console.log(e);
      });
    }
  }

  useEffect(() => {

    getDataAsks(currentPage * pageSize);
    getDataBids(currentPage * pageSize);
    // signInMetamask();
    web3.eth.getAccounts().then(r=>{
      handleAccountsChanged(r);
    });
  
  }, []);
  

  return (
    <>
      <div className="content">
        <Row>
          <Col md="8">
            {totalAsks>0 ?
                <Card>
              <CardHeader>
                <h5 className="title">Open Asks {totalAsks}</h5>
              </CardHeader>
              <CardBody>
                {asks!==null ?
                  <Table className="tablesorter" responsive>                  
                      <thead className="text-primary">
                  <tr>
                    <th>Owner</th>
                    <th>Date</th>
                    <th>Total KWhs</th>
                    <th>Remaining KWhs</th>
                  </tr>
                  </thead>
                  <tbody>
                  {asks}
                  </tbody>
                </Table> : <></>}
                <TablePaginationAsk
                       pagesCountAsk={pagesCountAsk}
                       currentPage={currentPage}
                       handlePageClickAsk={handlePageClickAsk}
                       handlePreviousClickAsk={handlePreviousClickAsk}
                       handleNextClickAsk={handleNextClickAsk}
                   />
              </CardBody>
              <CardFooter>

              </CardFooter>
            </Card> : <></>}
            <br/>
            {totalBids>0 ?
                <Card>
                  <CardHeader>
                    <h5 className="title">Open Bids {totalBids}</h5>
                  </CardHeader>
                  <CardBody>
                    {bids!==null ?
                        <Table className="tablesorter" responsive>
                          <thead className="text-primary">
                          <tr>
                            <th>Owner</th>
                            <th>Date</th>
                            <th>Total KWhs</th>
                            <th>Price (EUR)</th>
                          </tr>
                          </thead>
                          <tbody>
                          {bids}
                          </tbody>
                        </Table> : <></>}
                        <TablePaginationBid
                             pagesCountBid={pagesCountBid}
                             currentPage={currentPage}
                             handlePageClickBid={handlePageClickBid}
                             handlePreviousClickBid={handlePreviousClickBid}
                             handleNextClickBid={handleNextClickBid}
                         />
                  </CardBody>
                  <CardFooter>

                  </CardFooter>
                </Card> : <></>}
          </Col>
          <Col md="4">
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
                          placeholder="Enter KWhs"
                          type="text"
                          onChange={event => setEnergyKW(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='ask'? 'none':"block")}} >
                      <label>Price (EUR)</label>
                      <Input
                          placeholder="Bid price (EUR)"
                          type="text"
                          onChange={event => setPriceBid(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                    {
                        error && <div style={{color: `red`}}>Please enter a valid amount of price or KWHs</div>
                      }
                    <Button variant="secondary" size="lg" onClick={() => addBidOrAsk()}>
                      Place {open==='ask'? 'Ask':"Bid"}
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
          </Col>

        </Row>
      </div>
    </>
  );
}



export default EnergyTrading;
