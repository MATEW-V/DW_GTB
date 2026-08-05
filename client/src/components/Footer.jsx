import React from 'react';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="matching-footer">
      {/* Left Side: Social Icon Links */}
      <div className="footer-left">
        <a href="https://discord.gg" target="_blank" rel="noreferrer" className="social-btn" aria-label="Discord">
          <svg viewBox="0 0 127.14 96.36" className="social-svg"><path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,68.43,68.43,0,0,1-10.4-5c.87-.64,1.71-1.32,2.51-2a75.52,75.52,0,0,0,72.72,0c.8.69,1.64,1.37,2.51,2a68.43,68.43,0,0,1-10.4,5,77.7,77.7,0,0,0,6.63,10.85,105.73,105.73,0,0,0,31.06-18.83C129.87,50.62,123.82,27.82,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53S36.18,40.36,42.45,40.36,53.92,46,53.72,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.41,40.36,84.69,40.36,96.16,46,96,53,91,65.69,84.69,65.69Z" fill="currentColor"/></svg>
        </a>
        <a href="mailto:yourgame@gmail.com" className="social-btn" aria-label="Gmail">
          <svg viewBox="0 0 24 24" className="social-svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
        </a>
      </div>

      {/* Center: Title & Small Subtext */}
      <div className="footer-center">
        <h3 className="footer-title-text">GUESS THE BUILD footer placelholder</h3>
        <p className="footer-subtext">© 2026 All rights reserved. unhuh</p>
        
      </div>

      {/* Right Side: Empty layout balancer matching header dimensions */}
      <div className="footer-right">
        <a href="mailto:yourgame@gmail.com" className="social-btn" aria-label="Gmail">
          <svg viewBox="0 0 24 24" className="social-svg"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
        </a>
      </div>
    </footer>
  );
}
