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
  const [color, setColor] = useState("");

  const onModalSubmit = () => {
    setShowModal(false);
    colors[activeButton] = color;
  }

  const onPixelClick = (i) => {
    setShowModal(true); 
    setActiveButton(i);
  }

  return (
    <div className="container">
      <div className="header-container">
        <img src={logo} alt="Logo" className="logo"/>
        <p>r/place</p>
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
      <Rodal visible={showModal} onClose={() => setShowModal(false)} height={500}>
        <div className="modal-container">
          <p className="modal-title">Claim This Pixel</p>
          <div className="color-container">
            <HexColorPicker color={color} onChange={setColor} />
            <div className="color-right">
              <div style={{ backgroundColor: `${color}`, height: '100px', width: '100px'}}/>
              <HexColorInput color={color} onChange={setColor} />
            </div>
          </div>
          <button onClick={() => onModalSubmit()}>Submit</button>
        </div>
      </Rodal>
    </div>
  );
}
