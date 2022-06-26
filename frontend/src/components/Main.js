import React, {useEffect, useState} from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import Rodal from 'rodal';
import './main.css';
import logo from '../assets/logo.png'
import 'rodal/lib/rodal.css';
import { deleteFlow } from "./DeleteFlow";

export function Main() {
  const kirby = ['#00BCD4', '#00BCD4', '#00BCD4', '#00BCD4', '#00BCD4', '#00BCD4', '#00BCD4', '#00BCD4', '#00BCD4', '#00BCD4', '#F7B7CD', '#F7B7CD', '#F7B7CD', '#F7B7CD', '#00BCD4', '#00BCD4', '#00BCD4', '#F7B7CD', '#F7B7CD', '#F7B7CD', '#F7B7CD', '#F7B7CD', '#F7B7CD', '#00BCD4', '#00BCD4', '#FC7EAC', '#F7B7CD', '#000000', '#F7B7CD', '#000000', '#F7B7CD', '#FC7EAC', '#FC7EAC', '#F7B7CD', '#F7B7CD', '#3F51B5', '#F7B7CD', '#3F51B5', '#F7B7CD', '#FC7EAC', '#FC7EAC', '#FC7EAC', '#F54F89', '#F7B7CD', '#F7B7CD', '#F7B7CD', '#F54F89', '#00BCD4', '#00BCD4', '#C51162', '#FC7EAC', '#FC7EAC', '#F7B7CD', '#F7B7CD', '#C51162', '#00BCD4', '#00BCD4', '#00BCD4', '#D81B60', '#D81B60', '#00BCD4', '#C51162', '#D81B60', '#00BCD4']
  // const [colors, setShowColors] = useState(Array(64).fill('#cccccc'));
  const [colors, setShowColors] = useState(kirby);
  const [showModal, setShowModal] = useState(false);
  const [activeButton, setActiveButton] = useState(0);
  const [color, setColor] = useState("#cccccc");
  const [changedPixels, setChangedPixels] = useState([]);

  const [currentAccount, setCurrentAccount] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");

  const [isConnected, setIsConnected] = useState(currentAccount !== "");
  const [isStarted, setIsStarted] = useState(false);

  const ethers = require("ethers");
  const { Framework } = require("@superfluid-finance/sdk-core");
  const { defaultAbiCoder } = require("ethers/lib/utils");

  const receiver = "0x75825e4F250230375Aa664e456C94eED28737F20"
  const flowRate = 385802469135802; // $1k per month
  
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts"
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const onModalSubmit = () => {
    setShowModal(false);
    colors[activeButton] = color;
    setChangedPixels([...changedPixels, activeButton])
  }

  const onPixelClick = (i) => {
    setShowModal(true); 
    setActiveButton(i);
  }

  const onConnectWallet = async () => {
    connectWallet();
    setIsConnected(true);
    
    getBalance()
  }

  const getBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sender = provider.getSigner();
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const senderAddress = await sender.getAddress();

    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
      customSubgraphQueriesEndpoint: "",
      dataMode: "WEB3_ONLY"
    });

    const DAIxContract = await sf.loadSuperToken("fDAIx");
    const hi = await DAIxContract.balanceOf({
      account: senderAddress,
      providerOrSigner: sender
    });
    setCurrentBalance(`${hi.toString().substring(0, 2)}.${hi.toString().substring(2, 9)}`);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      getBalance()
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const onStartStream = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const sender = provider.getSigner();
    const chainId = await window.ethereum.request({ method: "eth_chainId" });
    const senderAddress = await sender.getAddress();

    const sf = await Framework.create({
      chainId: Number(chainId),
      provider: provider,
      customSubgraphQueriesEndpoint: "",
      dataMode: "WEB3_ONLY"
    });
    const message = defaultAbiCoder.encode(['uint[]', 'string[]'], [[0, 1, 2], ["#FF0000", "#00FF00", "#0000FF"]]);

    const DAIxContract = await sf.loadSuperToken("fDAIx");
    const DAIx = DAIxContract.address;
    
    try {
      const createFlowOperation = sf.cfaV1.createFlow({
        receiver: receiver,
        flowRate: flowRate,
        superToken: DAIx,
        userData: `${message}`
      });
  
      console.log("Creating your stream...");
  
      const result = await createFlowOperation.exec(sender);
      console.log(result);
      console.log(defaultAbiCoder.decode(['uint[]', 'string[]'], message))
  
      console.log(
        `Congrats - you've just created a money stream!
      View Your Stream At: https://app.superfluid.finance/dashboard/${receiver}
      Chain ID: ${chainId}
      Super Token: DAIx
      Sender: ${senderAddress}
      Receiver: ${receiver}
      FlowRate: ${flowRate}
      `
      );
    } catch (error) {
      console.log(
        "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
      );
      console.error(error);
    }
    setIsStarted(true);
  }

  const onStopStream = () => {
    deleteFlow();
    setIsStarted(false);
  }

  return (
    <div className="container">
      <div className="header-container">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo"/>
          <p>eth/place</p>
        </div>
        <div className="header-right">
        
          {isConnected ? <p className = "wallet-balance">{`${currentAccount.substring(0, 4)}...${currentAccount.substring(39)}`}</p> : null}
          {isConnected ? <p className = "wallet-balance">{currentBalance}</p> : null}
          <div className="header-button-container">
            {!isConnected ? <button className="connect-button" onClick={() => onConnectWallet()}>Connect Wallet</button> : null}
            {isConnected && !isStarted ? <button className="start-button" onClick={() => onStartStream()}>Start Stream</button> : null}
            {isConnected && isStarted ? <button className="stop-button" onClick={() => onStopStream()}>Stop Stream</button> : null}
          </div>
        </div>
      </div>
      <div className="canvas-container">
        <div className="canvas">
        {colors.map((color, i) => {
          return <button 
              className="pixel" 
              key={i} 
              style={{ backgroundColor: `${color}`, cursor: 'pointer'}}
              onClick={() => onPixelClick(i)}
            />;
        })}
        </div>
      </div>
      <Rodal visible={showModal} onClose={() => setShowModal(false)} height={450} width={450}>
        <div className="modal-container">
          <p className="modal-title">Claim This Pixel</p>
          <div className="color-container">
            <HexColorPicker className="color-picker" color={color} onChange={setColor} />
            <div className="color-right">
              <div style={{ backgroundColor: `${color}`, height: '100px', width: '100px'}}/>
              <HexColorInput className="color-code" color={color} onChange={setColor} />
            </div>
          </div>
          <div className="submit-container">
            <button className="submit-button" onClick={() => onModalSubmit()}>Submit</button>
          </div>
        </div>
      </Rodal>
    </div>
  );
}
