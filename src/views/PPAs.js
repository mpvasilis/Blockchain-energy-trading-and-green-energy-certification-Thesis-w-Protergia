import React, {useEffect, useState, useRef} from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import PropTypes from 'prop-types';
import TablePagination from '../components/pagination/TablePagination';
import { toast } from 'react-toastify';
import moment from 'moment';

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

var contractAddress = '0xAF7f02C05Fe4bb1D8Cc392063fEE2415962F248c' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"},{"indexed":false,"internalType":"uint32","name":"agreedPrice","type":"uint32"}],"name":"acceptedCorpPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint64","name":"energy","type":"uint64"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"availableEnergyNotification","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ppaBuyer","type":"address"}],"name":"buyerDeregistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ppaBuyer","type":"address"}],"name":"buyerRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint32","name":"price","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"createdCorpPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":false,"internalType":"uint32","name":"price","type":"uint32"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"createdPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":false,"internalType":"uint256","name":"startDay","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"endDay","type":"uint256"},{"indexed":false,"internalType":"enum PPA.Status","name":"status","type":"uint8"}],"name":"expiredPPA","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"}],"name":"producerDeregistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"producer","type":"address"}],"name":"producerRegistered","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"address","name":"producer","type":"address"},{"indexed":false,"internalType":"uint256","name":"id","type":"uint256"}],"name":"purchasedPPA","type":"event"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"acceptCorporatePPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_buyer","type":"address"},{"internalType":"uint64","name":"_energy","type":"uint64"},{"internalType":"uint256","name":"_idOfMatchPPA","type":"uint256"}],"name":"availableKwhs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfPPA","type":"uint256"}],"name":"buyPPAKwhs","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAuctionPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"claimPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"_buyer","type":"address"},{"internalType":"uint32","name":"_agreedKwhPrice","type":"uint32"},{"internalType":"uint256","name":"_startDay","type":"uint256"},{"internalType":"uint256","name":"_endDay","type":"uint256"},{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"corporatePPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint32","name":"_kwhPrice","type":"uint32"},{"internalType":"uint256","name":"_startDay","type":"uint256"},{"internalType":"uint256","name":"_endDay","type":"uint256"}],"name":"createPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"abuyer","type":"address"}],"name":"deregisterPPABuyer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"deregisterProducer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_idOfContract","type":"uint256"},{"internalType":"uint64","name":"_buyEnergy","type":"uint64"}],"name":"energyTradingPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"getApprovedPPAByID","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getApprovedPPAByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getApprovedPPAs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAvKwhs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getAvailableEnergyByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCorpPPAs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getCorporatePPAByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfCorpPPAByAddress","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getPPAByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint32","name":"","type":"uint32"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPPAs","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getPurchases","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_idx","type":"uint256"}],"name":"getPurchasesByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint64","name":"","type":"uint64"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_id","type":"uint256"}],"name":"killPPA","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"abuyer","type":"address"}],"name":"registerPPABuyer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"registerProducer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"viewAllPPAs","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint32[]","name":"","type":"uint32[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAllpurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint64[]","name":"","type":"uint64[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewApprovalPPAs","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint32[]","name":"","type":"uint32[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewAvailableKwhs","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint64[]","name":"","type":"uint64[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"viewCorporatePPAlist","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint32[]","name":"","type":"uint32[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}] ;
const PPA = new web3.eth.Contract(abi, contractAddress);

function PPAs() {
  const [open, setOpen] = useState('PPA');

  const [totalBids, setTotalBids] = useState(0);
  const [bids, setBids] = useState(null);
  const [dataPPAs, setDataPPAs] = useState(null);
  const [dataCPPAs, setDataCPPAs] = useState(null);
  const [currentPagePPA, setCurrentPagePPA] = useState(0);
  const [currentPageCPPA, setCurrentPageCPPA] = useState(0);
  const pageSize = 10;
  const [totalPPAs, setTotalPPAs] = useState(0);
  const [PPAs, setPPAs] = useState(null);
  const [totalCPPAs, setTotalCPPAs] = useState(0);
  const [totalCPPACount, setTotalCPPACount] = useState(0);
  const [CPPAs, setCPPAs] = useState(null);
  const [pagesCountPPA, setPagesCountPPA] = useState(0);
  const [pagesCountCPPA, setPagesCountCPPA] = useState(0);


  const [price, setPrice] = useState('');
  // const [priceBid, setPriceBid] = useState(0);
  const [placeStartDay, setPlaceStartDay] = useState('');
  const [placeEndDay, setPlaceEndDay] = useState('');
  const [ID, setID] = useState('');
  const [address, setAddress] = useState('');
  const account = useRef('');
  const[error, setError] = useState(false);
  const[errorP, setErrorP] = useState(false);
  const[errorS, setErrorS] = useState(false);
  const[errorE, setErrorE] = useState(false);
  const[errorI, setErrorI] = useState(false);
  const[errorA, setErrorA] = useState(false);


  const[isDisabled, setIsDisabled] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handlePageClickPPA = (e, page) => {
    console.log(page);
    e.preventDefault();
    setCurrentPagePPA(page);
    console.log(page);
    getDataPPAs(page * pageSize);
    console.log(page);
  };

  const handlePreviousClickPPA= e => {
    const _currentPagePPA = currentPagePPA - 1 ;
    e.preventDefault();
    setCurrentPagePPA(_currentPagePPA);
    getDataPPAs(_currentPagePPA * pageSize);
    console.log(_currentPagePPA);
  };

  const handleNextClickPPA= e => {
    const _currentPagePPA = currentPagePPA + 1 ;
    e.preventDefault();
    setCurrentPagePPA(_currentPagePPA);
    getDataPPAs(_currentPagePPA  * pageSize);
    console.log(_currentPagePPA);

  };
  const handlePageClickCPPA = (e, page) => {
    console.log(page);
    e.preventDefault();
    setCurrentPageCPPA(page);
    console.log(page);
    getDataCPPAs(page * pageSize);
    console.log(page);
  };

  const handlePreviousClickCPPA= e => {
    const _currentPageCPPA = currentPageCPPA - 1 ;
    e.preventDefault();
    setCurrentPageCPPA(_currentPageCPPA);
    getDataCPPAs(_currentPageCPPA * pageSize);
    console.log(_currentPageCPPA);
  };

  const handleNextClickCPPA= e => {
    const _currentPageCPPA = currentPageCPPA + 1 ;
    e.preventDefault();
    setCurrentPageCPPA(_currentPageCPPA);
    getDataCPPAs(_currentPageCPPA  * pageSize);
    console.log(_currentPageCPPA);

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


  const getDataPPAs = (offset, update = false)=>{

    if(dataPPAs===null  || update){
    PPA.methods.getPPAs().call().then(function(ppaNum){
      console.log("Total PPAs:" , ppaNum);
      setTotalPPAs(ppaNum)
      setPagesCountPPA(Math.ceil(ppaNum / pageSize));

      if(ppaNum>0)
      PPA.methods.viewAllPPAs().call()
          .then(function(result){
            setDataPPAs(result);
            console.log(pageSize + offset);
            var rows = [];
            for (var i = offset; i < pageSize + offset ; i++) {
              // if(i >= pageSize)  break;
              if(i >= ppaNum)  break;
              rows.push( <tr key={i}>
                <td>{result[2][i]}</td>
                <td>{result[0][i].substr(0,6)}</td>
                <td>{result[1][i]/100}</td>
                <td>{moment.unix(result[3][i]).format("DD/MM/YYYY")}</td>
                <td>{moment.unix(result[4][i]).format("DD/MM/YYYY")}</td>
                <td>{result[5][i]}</td>
                <td> <Button variant="secondary" size="sm" data-id={result[2][i]} onClick={event => claimPPA(event.target.dataset.id)}>Claim</Button></td>
                 </tr>);
            }
            setPPAs(rows)
          });
    });
  }else{
    let rows = [];
    for (let i = offset; i < pageSize + offset  ; i++) {
      if(i < totalPPAs )  {
      rows.push( <tr key={i}>
        <td>{dataPPAs[2][i]}</td>
        <td>{dataPPAs[0][i].substr(0,6)}</td>
        <td>{dataPPAs[1][i]/100}</td>
        <td>{moment.unix(dataPPAs[3][i]).format("DD/MM/YYYY")}</td>
        <td>{moment.unix(dataPPAs[4][i]).format("DD/MM/YYYY")}</td>
        <td>{dataPPAs[5][i]}</td>
        <td> <Button variant="secondary" size="sm" data-id={dataPPAs[2][i]} onClick={event => claimPPA(event.target.dataset.id)}>Claim</Button></td>
      </tr>);
      }
    }
    setPPAs(rows)
    console.log(rows);
  }
}
  const getDataCPPAs = (offset , update = false)=>{

    if(dataCPPAs===null || update){
      PPA.methods.getCountOfCorpPPAByAddress().call({from:  account.current}).then(function(count){
        console.log("Total count:" , count);
        setTotalCPPAs(count)
      setPagesCountCPPA(Math.ceil(count / pageSize));

      if(count>0)

      PPA.methods.viewCorporatePPAlist().call({from: account.current}).then(function(result){
            setDataCPPAs(result);
            console.log(pageSize + offset);
            var rows = [];
            for (var i = offset; i < pageSize + offset ; i++) {
              // if(i >= pageSize)  break;
              if(i >= count)  break;

              rows.push( <tr key={i}>
                <td>{result[3][i]}</td>
                <td>{result[0][i].substr(0,6)}</td>
                <td>{result[1][i].substr(0,6)}</td>
                <td>{result[2][i]/100}</td>
                <td>{moment.unix(result[4][i]).format("DD/MM/YYYY")}</td>
                <td>{moment.unix(result[5][i]).format("DD/MM/YYYY")}</td>
                <td><Button variant="secondary" size="sm" data-id={result[3][i]} onClick={event => acceptCorporatePPA(event.target.dataset.id)}>Claim</Button></td>
              </tr>);
            }
            setCPPAs(rows)
          });
      });
  }
  else{
    let rows = [];
    for (let i = offset; i < pageSize + offset  ; i++) {
      if(i < totalCPPAs )  {
      rows.push( <tr key={i}>
        <td>{dataCPPAs[3][i]}</td>
        <td>{dataCPPAs[0][i].substr(0,6)}</td>
        <td>{dataCPPAs[1][i].substr(0,6)}</td>
        <td>{dataCPPAs[2][i]/100}</td>
        <td>{moment.unix(dataCPPAs[4][i]).format("DD/MM/YYYY")}</td>
        <td>{moment.unix(dataCPPAs[5][i]).format("DD/MM/YYYY")}</td>
        <td><Button variant="secondary" size="sm" data-id={dataCPPAs[3][i]} onClick={event => acceptCorporatePPA(event.target.dataset.id)}>Claim</Button></td>

      </tr>);
      }
    }
    setCPPAs(rows)
    console.log(rows);
  }
  }

  const createPPA = () => {

    const re = /^[0-9\b]+$/;

    if (open === 'PPA'){
      if (price === ""||placeStartDay === "" || placeEndDay === ""  ){

        setError(true);
        
      }
      else if ( price < 1 ){

        setErrorP(true);
      }
        
     else if (placeStartDay.length !== 10 ){

        setErrorS(true)
     }
       
     else  if (placeEndDay.length !== 10 ){
      
          setErrorE(true) 
     }
    
      else{

        PPA.methods.createPPA(price * 100, placeStartDay, placeEndDay).send({from: account.current}).on('transactionHash', (th) => {

          toast("A PPA has been succesfully submited!")
        }).then(function(e) {
          setDataPPAs(null);
          getDataPPAs(currentPagePPA   * pageSize, true);
          console.log(e);
        });
        setPrice("");
        setPlaceStartDay("");
        setPlaceEndDay("");
        setErrorP(false);
        setError(false);
        setErrorS(false);
        setErrorE(false);
      }
    }

    if (open === 'CPPA'){

      if (price === ""||placeStartDay === "" || placeEndDay === "" || ID === "" ||address === ""){

        setError(true);
        
      }
      else if (price < 1  ){

        setErrorP(true);
      }
      else if (placeStartDay.length !== 10){

        setErrorS(true)
      }
      else if (placeEndDay.length !== 10){
      
        setErrorE(true)
      }
      else if (ID < 0){

        setErrorI(true)
      }
      else if (address.length !== 42){

        setErrorA(true)
      }
      else{

        PPA.methods.corporatePPA(address, price * 100, placeStartDay, placeEndDay, ID, ).send({from: account.current}).on('transactionHash', (th) => {

          toast("A Corporate CPPA has been succesfully submited!")
        }).then(function(e) {
          setDataCPPAs(null);
          getDataCPPAs(currentPageCPPA   * pageSize, true);

            console.log(e)
        });
        setAddress("");
        setPrice("");
        setPlaceStartDay("");
        setPlaceEndDay("");
        setID("");
        setError(false);
        setErrorP(false);
        setErrorS(false);
        setErrorE(false);
        setErrorI(false);
        setErrorA(false);
      }
    }
  }
  const claimPPA = (id) => {

    console.log(id);
        PPA.methods.claimPPA(id).send({from: account.current}).then(function(e) {
          console.log(e);
          toast("Claimed PPA successfully!")
          const newWindow = window.open("/receipt/"+id, '_blank', 'noopener,noreferrer')
          if (newWindow) newWindow.opener = null
        });
  }

  const acceptCorporatePPA = (id) => {
      PPA.methods.acceptCorporatePPA(id).send({from: account.current}).then(function(e) {
        console.log(e);
      });
}

  useEffect(() => {

    getDataPPAs(currentPagePPA * pageSize);
    web3.eth.getAccounts().then(r=>{
      handleAccountsChanged(r);
      getDataCPPAs(currentPageCPPA * pageSize);
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
                    <th>ID</th>
                    <th>Address</th>
                    <th>Price</th>
                    <th>StartDay</th>
                   <th>EndDay</th>
                   <th>Status</th>
                  </tr>

                  </thead>
                  <tbody>
                  {PPAs}
                  </tbody>

                </Table> : <></>}
                <TablePagination
                  pagesCount={pagesCountPPA}
                  currentPage={currentPagePPA}
                  handlePageClick={handlePageClickPPA}
                  handlePreviousClick={handlePreviousClickPPA}
                  handleNextClick={handleNextClickPPA}
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
                    <th>ID</th>
                    <th>Producer Address</th>
                    <th>Buyer Address</th>
                    <th>Price</th>
                    <th>StartDay</th>
                    <th>EndDay</th>

                  </tr>
                  </thead>
                  <tbody>
                  {CPPAs}
                  </tbody>
                </Table> : <></>}
                <TablePagination
                  pagesCount={pagesCountCPPA}
                  currentPage={currentPageCPPA}
                  handlePageClick={handlePageClickCPPA}
                  handlePreviousClick={handlePreviousClickCPPA}
                  handleNextClick={handleNextClickCPPA}
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
                      {
                        errorP && <div style={{color: `red`}}>Set a valid Price</div>
                      }

                    </FormGroup>
                    <FormGroup style={{display:(open==='CPPA'? 'none':"block")}} >
                      <label>Start Day</label>
                      <Input
                           value = {placeStartDay}
                          placeholder="Start Day"
                          type="text"
                          onChange={event => setPlaceStartDay(event.target.value)}
                      />
                       {
                        errorS && <div style={{color: `red`}}>Set a valid Start day</div>
                      }
                    </FormGroup>
                    <FormGroup style={{display:(open==='CPPA'? 'none':"block")}} >
                      <label>End Day</label>
                      <Input
                           value = {placeEndDay}
                          placeholder="End Day"
                          type="text"
                          onChange={event => setPlaceEndDay(event.target.value)}
                      />
                      {
                        errorE && <div style={{color: `red`}}>Set a valid End day</div>
                      }
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
                    {
                        errorS && <div style={{color: `red`}}>Set a valid Start day</div>
                      }
                    <FormGroup style={{display:(open==='PPA'? 'none':"block")}} >
                      <label>End Day</label>
                      <Input
                          value = {placeEndDay}
                          placeholder="End Day"
                          type="text"
                          onChange={event => setPlaceEndDay(event.target.value)}
                      />
                      {
                        errorE && <div style={{color: `red`}}>Set a valid End day</div>
                      }
                    </FormGroup>
                    <FormGroup style={{display:(open==='PPA'? 'none':"block")}} >
                      <label>ID</label>
                      <Input
                          value = {ID}
                          placeholder="ID"
                          type="text"
                          onChange={event => setID(event.target.value)}
                      />
                      {
                        errorI && <div style={{color: `red`}}>Set a valid ID</div>
                      }
                    </FormGroup>
                    <FormGroup style={{display:(open==='PPA'? 'none':"block")}} >
                      <label>Address</label>
                      <Input
                          value = {address}
                          placeholder="Address"
                          type="text"
                          onChange={event => setAddress(event.target.value)}
                      />
                       {
                        errorA && <div style={{color: `red`}}>Set a valid address</div>
                      }
                    </FormGroup>
                    {
                        error && <div style={{color: `red`}}>Fill all the blanks</div>
                      }
                    <FormGroup>
                    
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
