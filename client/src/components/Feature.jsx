import React, { useState } from 'react';
import './Feature.css';

export default function Feature() {
  const [partAValues, setPartAValues] = useState(Array(6).fill(''));
  const [partBValues, setPartBValues] = useState(Array(6).fill(''));

  const handleAChange = (index, value) => {
    setPartAValues(prev => prev.map((val, i) => i === index ? value : val));
  };

  const handleBChange = (index, value) => {
    setPartBValues(prev => prev.map((val, i) => i === index ? value : val));
  };

  const labels = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5", "Item 6"];

  return (
    <div className="feature-wrapper">
      <div className="feature-side-grid">
        
        {/* Left Feature Card (Part A) */}
        <div className="feature-part-card">
          <h3 className="part-title">PART ONE</h3>
          <div className="vertical-rows-container">
            {labels.map((label, index) => (
              <div key={`partA-${index}`} className="feature-row-line">
                <span className="feature-label-text">{label}:</span>
                <input 
                  type="number" 
                  className="feature-input-box" 
                  placeholder="0"
                  value={partAValues[index]}
                  onChange={(e) => handleAChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Feature Card (Part B) */}
        <div className="feature-part-card">
          <h3 className="part-title">PART TWO</h3>
          <div className="vertical-rows-container">
            {labels.map((label, index) => (
              <div key={`partB-${index}`} className="feature-row-line">
                <span className="feature-label-text">{label}:</span>
                <input 
                  type="number" 
                  className="feature-input-box" 
                  placeholder="0"
                  value={partBValues[index]}
                  onChange={(e) => handleBChange(index, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
