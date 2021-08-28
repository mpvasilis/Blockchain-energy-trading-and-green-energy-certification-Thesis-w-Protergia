import React, {useEffect, useState} from "react";

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

var contractAddress = '0x590DfFcAcaDBE970bE52dE1186A0D7A646f7AF92' ;
var abi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"buyer","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"askEnergyNotifier","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"ownerOfBattery","type":"address"},{"indexed":false,"internalType":"uint256","name":"date","type":"uint256"},{"indexed":false,"internalType":"string","name":"id","type":"string"}],"name":"batteryAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"seller","type":"address"},{"indexed":true,"internalType":"uint256","name":"day","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"price","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"energy","type":"uint256"}],"name":"offerEnergyNotifier","type":"event"},{"constant":false,"inputs":[{"internalType":"string","name":"uuID","type":"string"}],"name":"addNewBattery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"}],"name":"askEnergy","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"uint256","name":"_energy","type":"uint256"},{"internalType":"uint256","name":"_eprice","type":"uint256"}],"name":"energyOffer","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getAsksByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"batteryID","type":"address"}],"name":"getBatteryByID","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"string","name":"","type":"string"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"_index","type":"uint256"}],"name":"getBidsByIndex","outputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfAsks","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBatteries","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getCountOfBids","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"batteryID","type":"address"},{"internalType":"string","name":"uuID","type":"string"}],"name":"updateBattery","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"}],"name":"viewAllAsks","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"}],"name":"viewAllBids","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"uint256","name":"n","type":"uint256"}],"name":"viewAllEnergyPurchases","outputs":[{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"address[]","name":"","type":"address[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"}];
const energyTrading = new web3.eth.Contract(abi, contractAddress);

function EnergyTrading() {
  const [open, setOpen] = useState('bid');
  const [totalAsks, setTotalAsks] = useState(0);
  const [asks, setAsks] = useState(null);
  const [totalBids, setTotalBids] = useState(0);
  const [bids, setBids] = useState(null);

  useEffect(() => {

    energyTrading.methods.getCountOfAsks().call().then(function(askNum){
      console.log("Total asks:" , askNum);
      setTotalAsks(askNum)
      if(askNum>0)
      energyTrading.methods.viewAllAsks(askNum).call()
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

    energyTrading.methods.getCountOfBids().call().then(function(bidsnum){
      console.log("Total bids:" , bidsnum);
      setTotalBids(bidsnum)
      if(bidsnum>0)
        energyTrading.methods.viewAllBids(bidsnum).call()
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
                  </CardBody>
                  <CardFooter>

                  </CardFooter>
                </Card> : <></>}
          </Col>
          <Col md="4">
            <Card className="card-user">
              <CardBody>
                <CardText />
                <div className="author">
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
                      />
                    </FormGroup>
                    <FormGroup style={{display:(open==='ask'? 'none':"block")}} >
                      <label>Price (EUR)</label>
                      <Input
                          placeholder="Bid price (EUR)"
                          type="text"
                      />
                    </FormGroup>
                    <FormGroup>
                    <Button variant="secondary" size="lg" onClick={()=>{setOpen('ask')}}>
                      Place {open==='ask'? 'Ask':"Bid"}
                    </Button>
                  </FormGroup>

          </Col>
                </Row>

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
