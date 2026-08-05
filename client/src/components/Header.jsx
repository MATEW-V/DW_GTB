import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="main-header">
      <div className="header-left">
        <button className="menu-btn">
          <span className="menu-line"></span>
          <span className="menu-line"></span>
          <span className="menu-line"></span>
        </button>
      </div>
      <h1 className="header-title">GUESS THE BUILD</h1>
      <div className="header-right">
        <button className="nav-btn tutorial-btn">Tutorial</button>
        <button className="nav-btn login-btn" onClick={() => navigate('/login')}>Login</button>
      </div>
    </header>
  ); 
}
