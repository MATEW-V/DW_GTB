import React from 'react';
import { useNavigate } from 'react-router-dom';
import menuIcon from '../assets/favicon.ico';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="main-header">
      <div className="header-left">
        <button className="menu-btn" onClick={() => navigate('/')} >
          <img src={menuIcon} alt="Menu" className="menu-icon-img" />
        </button>
      </div>
      <h1 className="header-title">GUESS THE BUILD</h1>
      <div className="header-right">
        <button className="nav-btn login-btn" onClick={() => navigate('/login')}>Login</button>
        <button className="nav-btn login-btn" onClick={() => navigate('/submit')}>Submit a Build</button>
      </div>
    </header>
  ); 
}