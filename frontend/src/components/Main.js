import React, {useState} from "react";
import { HexColorPicker, HexColorInput } from "react-colorful";
import Rodal from 'rodal';
import './main.css';
import logo from '../assets/logo.png'
import 'rodal/lib/rodal.css';

export function Main() {
  const [colors, setShowColors] = useState(Array(9).fill('#cccccc'));
  const [showModal, setShowModal] = useState(false);
  const [activeButton, setActiveButton] = useState(0);
  const [color, setColor] = useState("#cccccc");
  const [changedPixels, setChangedPixels] = useState([]);

  const [isConnected, setIsConnected] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  console.log(changedPixels)

  const onModalSubmit = () => {
    setShowModal(false);
    colors[activeButton] = color;
    setChangedPixels([...changedPixels, activeButton])
  }

  const onPixelClick = (i) => {
    setShowModal(true); 
    setActiveButton(i);
  }

  const onConnectWallet = () => {
    setIsConnected(true);
  }

  const onStartStream = () => {
    setIsStarted(true);
  }

  const onStopStream = () => {
    setIsStarted(false);
  }

  return (
    <div className="container">
      <div className="header-container">
        <div className="header-left">
          <img src={logo} alt="Logo" className="logo"/>
          <p>r/place</p>
        </div>
        <div className="header-right">
          {isConnected ? <p className = "wallet-balance">3.6789652</p> : null}
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
