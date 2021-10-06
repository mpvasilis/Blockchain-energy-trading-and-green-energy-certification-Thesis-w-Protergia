import React, {useEffect, useState, useRef} from "react";
import TablePagination from '../components/pagination/TablePagination';
import detectEthereumProvider from '@metamask/detect-provider';
import PropTypes from 'prop-types';
import { toast } from 'react-toastify';
import moment from 'moment';




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
var abi =  [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askEnergyNotifier","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfDevice","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"deviceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"offerEnergyNotifier","type":"event"},{"constant":false,"inputs":[{"internalType":"string","name":"typeOfDevice","type":"string"}],"name":"addDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"askEnergy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"}],"name":"energyOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getAsksByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getBidsByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"deviceID","type":"address"}],"name":"getDeviceByAddress","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getPurchaseByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"ownerOfDevice","type":"address"},{"internalType":"string","name":"typeOfDevice","type":"string"}],"name":"updateDevice","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"viewAllAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAllBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAllEnergyPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}] ;
// const deviceRegistry = new web3.eth.Contract(abi, contractAddress);
const energyTrading = new web3.eth.Contract(abi, contractAddress);





function EnergyTrading() {
  const [open, setOpen] = useState('bid');
  const [totalAsks, setTotalAsks] = useState(0);
  const [asks, setAsks] = useState(null);
  const [totalBids, setTotalBids] = useState(0);
  const [dataBids, setDataBids] = useState(null);
  const [dataAsks, setDataAsks] = useState(null);
  const [bids, setBids] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;
  const [pagesCountAsk, setPagesCountAsk] = useState(0);
  const [pagesCountBid, setPagesCountBid] = useState(0);
  const [energyKW, setEnergyKW] = useState('');
  const [priceBid, setPriceBid] = useState('');
  const account = useRef('');
  const[error, setError] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [disable, setDisable] = useState(false);
  const[alert, setAlert] = useState(false);
  
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
  
  const handlePageClick = (e, page) => {
    console.log(page);
    e.preventDefault();
    setCurrentPage(page);
    console.log(page);
    getDataBids(page  * pageSize);
    console.log(page);
  };

  const handlePreviousClick= e => {
    const _currentPage = currentPage - 1 ;
    e.preventDefault();
    setCurrentPage(_currentPage);
     getDataBids(_currentPage   * pageSize);
     console.log(_currentPage);

  };

  const handleNextClick= e => {
    const _currentPage = currentPage + 1 ;
    e.preventDefault();
    setCurrentPage(_currentPage);
     getDataBids(_currentPage  * pageSize);
     console.log(_currentPage);

  };
  
  

  const getDataAsks = (offset, update = false)=>{

    if(dataAsks===null || update){
    energyTrading.methods.getCountOfAsks().call().then(function(askNum){
      console.log("Total asks:" , askNum);
      setTotalAsks(askNum);
      setPagesCountAsk(Math.ceil(askNum / pageSize));

      if(askNum>0)
      energyTrading.methods.viewAllAsks().call()
          .then(function(result){
            setDataAsks(result);
            console.log(pageSize + offset);
            var rows = [];
            for (var i = offset; i < pageSize + offset  ; i++) {
              if(i >= askNum)  break;
              rows.push( <tr key={i}>
               <td>{result[0][i].substr(0,6)}</td>
                <td>{moment(moment.unix(result[1][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
                <td>{result[2][i]/1000000}</td>
                <td>{result[3][i]}</td>
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
       <td>{dataAsks[0][i].substr(0,6)}</td>
        <td>{moment(moment.unix(dataAsks[1][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
        <td>{dataAsks[2][i]/1000000}</td>
        <td>{dataAsks[3][i]}</td>
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
    energyTrading.methods.getCountOfBids().call().then(function(bidNum){
      console.log("Total bids:" , bidNum);
      setTotalBids(bidNum);
      setPagesCountBid(Math.ceil(bidNum / pageSize));
      

      if(bidNum>0)
        energyTrading.methods.viewAllBids().call()
            .then(function(result){
              setDataBids(result);
              console.log(pageSize + offset);
              var rows = [];
              for (var i = offset; i < pageSize + offset  ; i++) {
                if(i >=  bidNum)  break;
                rows.push( <tr key={i}>
                  <td>{result[0][i].substr(0,6)}</td>
                  <td>{moment(moment.unix(result[1][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
                  <td>{result[2][i]/1000000}</td>
                  <td>{result[3][i]}</td>
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
         <td>{dataBids[0][i].substr(0,6)}</td>
        <td>{moment(moment.unix(dataBids[1][i]).format("YYYYMMDD"), "YYYYMMDD").fromNow()}</td>
        <td>{dataBids[2][i]/1000000}</td>
        <td>{dataBids[3][i]}</td>
      </tr>);
    
      }
    }
    setBids(rows)
    console.log(rows);
  }
  }

  const addBidOrAsk = () => {

     
    
    if (open === 'bid'){
      
      if (energyKW === ""||priceBid === ""||energyKW < 1){

        setError(true);

      }
    else{
    
      energyTrading.methods.energyOffer(energyKW * 1000000, priceBid * 100).send({from: account.current}).on('transactionHash', (th) => {
       
        toast("Bid has been succesfully submited!")
      }).then(function(e) {

          setDataBids(null);
          getDataBids(currentPage   * pageSize, true);
          console.log(e)
      });
      setEnergyKW("");
      setPriceBid("");
    }
    }else{
      if (energyKW === ""||energyKW > 1000000){

        setError(true);
        
      }
      energyTrading.methods.askEnergy(energyKW * 1000000).send({from: account.current}).on('transactionHash', (th) => {
       
        toast("Ask has been succesfully submited!")
      }).then(function(e) {

        setDataAsks(null);
        getDataAsks(currentPage   * pageSize, true);
            console.log(e)
      });
      setEnergyKW("");
    }
    
  }
 
 
  
  useEffect(() => {

    getDataAsks(currentPage * pageSize);
    getDataBids(currentPage * pageSize);
   

    console.log("pagecountbids: ", totalBids);
    console.log("pagecountask: ", totalAsks);
   
 
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
                <h4 className="title">Open Asks</h4>
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
                <TablePagination
                       pagesCount={pagesCountAsk}
                       currentPage={currentPage}
                       handlePageClick={handlePageClick}
                       handlePreviousClick={handlePreviousClick}
                       handleNextClick={handleNextClick}
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
                    {bids !==null ?
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
                          <script src="extensions/auto-refresh/bootstrap-table-auto-refresh.js"></script>
                        </Table> : <></>}
                        <TablePagination
                             previousLabel={"previous"}
                             nextLabel={"next"}
                             breakLabel={"..."}
                             pagesCount={pagesCountBid}
                             currentPage={currentPage}
                             handlePageClick={handlePageClick}
                             handlePreviousClick={handlePreviousClick}
                             handleNextClick={handleNextClick}
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
                          value = {energyKW}
                          placeholder="Enter KWhs"
                          type="text"
                          onChange={event => setEnergyKW(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='ask'? 'none':"block")}} >
                      <label>Price (EUR)</label>
                      <Input
                          value = {priceBid}
                          placeholder="Bid price (EUR)"
                          type="text"
                          onChange={event => setPriceBid(event.target.value)}
                      />
                    </FormGroup>
                    <FormGroup>
                    {
                        error && <div style={{color: `red`}}>Please enter a valid amount of price or KWHs</div>
                      }
                    <Button  variant="secondary" size="lg" disabled={disable} onClick={() => addBidOrAsk()}>
                      Place {open==='ask'? 'Ask':"Bid"}
                    </Button>
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
          </Col>

        </Row>
      </div>
    </>
  );

 
}



export default EnergyTrading; 
