import React, {useState} from "react";
import './main.css';
import logo from '../assets/logo.png'

export function Main() {
  const colors = ["#A84FF2", "#F0F24F", "#F2974F", "#F0F24F", "#F0F24F", "#F0F24F", "#F0F24F", "#F0F24F"]
  const [showModal, setShowModal] = useState(false);
  console.log(showModal)

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
              onClick={() => setShowModal(true)}
            />;
        })}
        </div>
      </div>
    </div>
  );
}
