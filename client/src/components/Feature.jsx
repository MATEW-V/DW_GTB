import React, { useState } from 'react';
import './Feature.css';

export default function Feature() {
  const [coreValues, setCoreValues] = useState(Array(9).fill(''));
  const [attunValues, setAttunValues] = useState(Array(7).fill(''));

  const coreLabels = ["Strength", "Agility", "Fortitude", "Inteligence", "Willpower", "Charisma", "Heavy", "Medium", "Light"];
  const attunmentLabels = ["Flamecharm", "Frostdraw", "Thundercall", "Galebreath", "Shadowcast", "Ironsing", "Bloodrend"];

  const totalPointUsed = coreValues.reduce((sum, val) => sum + Number(val || 0), 0) + attunValues.reduce((sum, val) => sum + Number(val || 0), 0);

  const pointsRemaining = 330 - totalPointUsed;

  const handleStatChange = (part, index, value) => {
    let cleanValue = value.replace(/[^0-9]/g, ''); //striptodigit
    if (cleanValue !== '') {
      let num = Number(cleanValue);
      const targetArray = part === 'A' ? coreValues : attunValues; //A=core/weap, B=attunement

      //point tracking for 330 total
      const currentVal = Number(targetArray[index] || 0);
      const totalUsedByOthers = totalPointUsed - currentVal;
      const maxAllowedForThisField = 330 - totalUsedByOthers;
      if (num > maxAllowedForThisField) {
        num = maxAllowedForThisField;
      }

      // Individual field cap (0 - 100) stat limits
      if (num > 100) num = 100;
      if (num < 0) num = 0;
      cleanValue = String(num);
    }

    // Dispatch updates to the correct state buckets
    if (part === 'A') {
      setCoreValues(prev => prev.map((val, i) => i === index ? cleanValue : val));
    } else {
      setAttunValues(prev => prev.map((val, i) => i === index ? cleanValue : val));
    }
  };

  const handleReset = () => {
    // Restore both arrays back to empty values
    setCoreValues(Array(9).fill(''));
    setAttunValues(Array(7).fill(''));
  };

  return (
    <div className="feature-wrapper">
      <div className="feature-side-grid">
        <div className="feature-part-card">
          <div className="vertical-rows-container">
            {/* blank rn */}
          </div>
        </div>

        {/* weapon */}
        <div className="feature-part-card">
          <h3 className="part-title">Weapon</h3>
          <div className="vertical-rows-container">
            {coreLabels.slice(6, 9).map((coreLabels, index) => (
              <div key={`partA-${index + 6}`} className="feature-row-line">
                <span className="feature-label-text">{coreLabels}:</span>
                <p className="preshrine">0</p>
                <input
                  type="text"
                  className="feature-input-box"
                  placeholder="0"
                  value={coreValues[index + 6]}
                  onChange={(e) => handleStatChange('A', index + 6, e.target.value)}
                />
                <div className="buildindicator"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="feature-side-grid">
        {/* Core stats */}
        <div className="feature-part-card">
          <h3 className="part-title">Core Stats</h3>
          <div className="vertical-rows-container">
            {coreLabels.slice(0, 6).map((coreLabels, index) => (
              <div key={`partA-${index}`} className="feature-row-line">
                <span className="feature-label-text">{coreLabels}:</span>
                <p className="preshrine">0</p>
                <input
                  type="text"
                  className="feature-input-box"
                  placeholder="0"
                  value={coreValues[index]}
                  onChange={(e) => handleStatChange('A', index, e.target.value)}
                />
                <div className="buildindicator"></div>
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
                <p className="preshrine">0</p>
                <input
                  type="text"
                  className="feature-input-box"
                  placeholder="0"
                  value={attunValues[index]}
                  onChange={(e) => handleStatChange('B', index, e.target.value)}
                />
                <div className="buildindicator"></div>
              </div>
            ))}
          </div>
        </div>

      </div>{/* featuresidegrid */}
      <div className="feature-buttons">
        <h3 className="part-title">SHRINES & BUTTONS</h3>
        <p className="feature-label-text">Points Remaining: {pointsRemaining}</p>
        <button className="soo">Shrine of Order</button>
        <button className="som">Shrine of Mastery</button>
        <button className="sob">Shrine of Blasphemy</button>
        <button className="reset" onClick={handleReset}>Reset</button>
        <button className="submit">Submit</button>
      </div> {/* shrine, submit, extra buttons*/}
    </div>
  );
}
