import React, { useState } from 'react';
import './Feature.css';

export default function Feature() {
  const [partAValues, setPartAValues] = useState(Array(6).fill(''));
  const [partBValues, setPartBValues] = useState(Array(7).fill(''));

const handleAChange = (index, value) => {
  // Strip everything that isn't a digit
  let cleanValue = value.replace(/[^0-9]/g, '');

  // Cap between 0 and 100
  if (cleanValue !== '') {
    const num = Number(cleanValue);
    if (num > 100) cleanValue = '100';
    if (num < 0) cleanValue = '0';
  }

  setPartAValues(prev => prev.map((val, i) => i === index ? cleanValue : val));
};

const handleBChange = (index, value) => {
  // Strip everything that isn't a digit
  let cleanValue = value.replace(/[^0-9]/g, '');

  // Cap between 0 and 100
  if (cleanValue !== '') {
    const num = Number(cleanValue);
    if (num > 100) cleanValue = '100';
    if (num < 0) cleanValue = '0';
  }

  setPartBValues(prev => prev.map((val, i) => i === index ? cleanValue : val));
};


  const coreLabels = ["Strength", "Agility", "Fortitude", "Inteligence", "Willpower", "Charisma"];
  const attunmentLabels = ["Flamecharm", "Frostdraw", "Thundercall", "Galebreath", "Shadowcast", "Ironsing", "Bloodrend"];

  return (
    <div className="feature-wrapper">
      <div className="feature-side-grid">
        {/* Core stats */}
        <div className="feature-part-card">
          <h3 className="part-title">Core Stats</h3>
          <div className="vertical-rows-container">
            {coreLabels.map((coreLabels, index) => (
              <div key={`partA-${index}`} className="feature-row-line">
                <span className="feature-label-text">{coreLabels}:</span>
                <input 
                    type="text" 
                    className="feature-input-box" 
                    placeholder="0"
                    value={partAValues[index]}
                    onChange={(e) => handleAChange(index, e.target.value)}
                  />
              </div>
            ))}
          </div>
        </div>
        {/* Attunement stats*/}
        <div className="feature-part-card">
          <h3 className="part-title">Attunements</h3>
          <div className="vertical-rows-container">
            {attunmentLabels.map((attunmentLabels, index) => (
              <div key={`partB-${index}`} className="feature-row-line">
                <span className="feature-label-text">{attunmentLabels}:</span>
                <input 
                    type="text"
                    className="feature-input-box" 
                    placeholder="0"
                    value={partBValues[index]}
                    onChange={(e) => handleBChange(index, e.target.value)}
                  />
              </div>
            ))}
          </div>
        </div>
      </div>{/* featuresidegrid */}
      <div className="feature-buttons">
        <h3 className="part-title">SHRINES&BUTTONS</h3>
            <button className="soo">Shrine of Order</ button>
            <button className="som">Shrine of Mastery</ button>
            <button className="sob">Shrine of Blasphemy</ button>
            <button className="reset">Reset</ button>
            <button className="submit">Submit</ button>
      </div> {/* shrine, submit, extra buttons*/}
    </div>
  );
}
