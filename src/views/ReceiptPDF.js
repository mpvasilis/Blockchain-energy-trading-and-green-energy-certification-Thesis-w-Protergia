import React, {useEffect, useState, useRef} from "react";
import detectEthereumProvider from '@metamask/detect-provider';
import PropTypes from 'prop-types';
import TablePagination from '../components/pagination/TablePagination';
import { toast } from 'react-toastify';
import { Document, Page, Text, View, StyleSheet,Image } from '@react-pdf/renderer';
import ReactPDF from '@react-pdf/renderer';
import { PDFViewer } from '@react-pdf/renderer';
import { useParams } from 'react-router-dom';
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

function ReceiptPDF() {
  let { id } = useParams();
  const [renderPDF, setrenderPDF] = useState(false);
  const [producer, setproducer] = useState("");
  const [consumer, setconsumer] = useState("");
  const [date, setdate] = useState("");


// Create styles
  const styles = StyleSheet.create({
    page: {
      backgroundColor: '#ffffff'
    },
    section: {
      margin: 20,
      padding: 20,
    },
  text: {
      margin: 20,
    fontSize:15
  }
  });

  useEffect(() => {
    PPA.methods.getApprovedPPAByID(id).call().then(function(result){
      console.log(result);
      setproducer(result[0]);
      setconsumer(result[1]);
      setdate(result[3]);
      setrenderPDF(true);

    });
  }, []);




  const MyDocument = () => (
  <Document>
        <Page size="A4" style={styles.page}>

          <View style={styles.text}>

            <Text style={{textAlign:"center", fontWeight:"200"}}>POWER PURCHASE AGREEMENT </Text>
            <Text style={{textAlign:"center", marginTop:"10"}}>BETWEEN {producer} AND {consumer} <br/></Text>
            <Text style={{marginTop:"20",fontSize:12}}>This POWER PURCHASE AGREEMENT (the “Agreement”) for an Eligible Renewable Energy Resource is dated for purposes of identification as this {date} by and between {consumer} (“BUYER”), and {producer} (“SELLER”). BUYER and SELLER are sometimes referred to in this Agreement individually as a “Party” and collectively as the “Parties”. </Text>

          <Text style={{marginTop:"20",fontSize:12}}>Verification QR code:</Text>
            <Image  style={{marginTop:"10",width:150}} src={"https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://protergia-energy-ui.vasilis.pw/viewPPA/"+id}/>

          </View>

        </Page>
      </Document>
  );

  return (
    <>      <div className="content">

    {renderPDF ?  <PDFViewer style={{height:"700px",width:"100%",}}>
          <MyDocument />
        </PDFViewer> : <p>Loading PDF....</p>}
      <p> PowerTrade PPA Receipt</p>
    </div>
    </>

  );
}



export default ReceiptPDF;
