import React, { useState } from 'react';
import './Feature.css';

export default function Feature() {
  const [coreValues, setCoreValues] = useState(Array(9).fill(''));
  const [attunValues, setAttunValues] = useState(Array(7).fill(''));
  const [preCoreValues, setPreCoreValues] = useState(Array(9).fill(''));
  const [preAttunValues, setPreAttunValues] = useState(Array(7).fill(''));

  const coreLabels = ["Strength", "Fortitude", "Agility", "Inteligence", "Willpower", "Charisma", "Heavy", "Medium", "Light"];
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

      // stat lims
      if (num > 100) num = 100;
      if (num < 0) num = 0;
      cleanValue = String(num);
    }

    if (part === 'A') {
      setCoreValues(prev => prev.map((val, i) => i === index ? cleanValue : val));
    } else {
      setAttunValues(prev => prev.map((val, i) => i === index ? cleanValue : val));
    }
  };

  const handleLoadPre = () => {
    if (!preCoreValues.every(element => element === "")) {
      setCoreValues(preCoreValues);
      setPreCoreValues(Array(9).fill(''));
    }
    if (!preAttunValues.every(element => element === "")) {
      setAttunValues(preAttunValues);
      setPreAttunValues(Array(7).fill(''));
    }
  }

  const handleSOO = () => { //ty cyfer for algo
    setPreCoreValues([...coreValues]);
    setPreAttunValues([...attunValues]);

    let internalCore = [...coreValues].map(Number);
    let internalAttun = [...attunValues].map(Number);
    let affectedCore = [];
    let affectedAttun = [];
    let totalShrine = 0;

    const originalCore = [...coreValues].map(Number);
    const originalAttun = [...attunValues].map(Number);

    for (let i = 0; i < 9; i++) {
      if (originalCore[i] > 0) {
        affectedCore.push(i);
        totalShrine += originalCore[i];
      }
      if (originalAttun[i] > 0) {
        affectedAttun.push(i);
        totalShrine += originalAttun[i];
      }
    }

    const totalAffectedCount = affectedCore.length + affectedAttun.length;
    if (totalAffectedCount === 0) return;

    const initialAverage = totalShrine / totalAffectedCount;
    affectedCore.forEach((i) => (internalCore[i] = initialAverage));
    affectedAttun.forEach((i) => (internalAttun[i] = initialAverage));

    const MAXIMUM_REDUCTION = 25;
    let bottleneckedCore = new Set();
    let bottleneckedDivideBy = totalAffectedCount;
    let hasBottleneckedThisPass;

    let previousCore = [...internalCore];
    let previousAttun = [...internalAttun];

    do {
      let bottleneckedPoints = 0;
      hasBottleneckedThisPass = false;

      for (let i of affectedCore) {
        if (!bottleneckedCore.has(i)) {
          const drop = originalCore[i] - internalCore[i];

          if (drop > MAXIMUM_REDUCTION) {
            internalCore[i] = originalCore[i] - MAXIMUM_REDUCTION;
            bottleneckedPoints += internalCore[i] - previousCore[i];
            bottleneckedCore.add(i);
            bottleneckedDivideBy--;
          }
        }
      }

      if (bottleneckedPoints !== 0 && bottleneckedDivideBy > 0) {
        const reductionChunk = bottleneckedPoints / bottleneckedDivideBy;

        for (let i of affectedCore) {
          if (!bottleneckedCore.has(i)) {
            internalCore[i] -= reductionChunk;
            // Verify if this new subtraction pushed this core stat past its 25 limit
            if (originalCore[i] - internalCore[i] > MAXIMUM_REDUCTION) {
              hasBottleneckedThisPass = true;
            }
          }
        }
        for (let i of affectedAttun) {
          internalAttun[i] -= reductionChunk;
        }
      }

      previousCore = [...internalCore];
      previousAttun = [...internalAttun];

    } while (hasBottleneckedThisPass);

    affectedCore.forEach((i) => (internalCore[i] = Math.floor(internalCore[i])));
    affectedAttun.forEach((i) => (internalAttun[i] = Math.floor(internalAttun[i])));

    let pointsSpentAfterShrine = 0;
    affectedCore.forEach((i) => (pointsSpentAfterShrine += internalCore[i]));
    affectedAttun.forEach((i) => (pointsSpentAfterShrine += internalAttun[i]));

    let sparePoints = totalShrine - pointsSpentAfterShrine;

    if (sparePoints >= totalAffectedCount) {
      affectedCore.forEach((i) => (internalCore[i] += 1));
      affectedAttun.forEach((i) => (internalAttun[i] += 1));
      sparePoints -= totalAffectedCount;
    }

    setCoreValues(internalCore);
    setAttunValues(internalAttun);
  };

  const handleReset = () => {
    setCoreValues(Array(9).fill(''));
    setAttunValues(Array(7).fill(''));
    setPreCoreValues(Array(9).fill(''));
    setPreAttunValues(Array(7).fill(''));
  };

  return (
    <div className="feature-wrapper">
      <div className="feature-side-grid">
        <div className="feature-part-card">
          <h3 className="part-title">Extra Build Facts</h3>
          <div className="vertical-rows-container">
            <p className="build-indicators">Shrine of Blasphemy = T/F</p>
            <p className="build-indicators">Shrine of Mastery = T/F</p>
            <p className="build-indicators">Unobtainable = T/F indicator</p>
          </div>
        </div>


        <div className="feature-part-card">{/* weapon */}
          <h3 className="part-title">Weapon</h3>
          <div className="vertical-rows-container">
            {coreLabels.slice(6, 9).map((coreLabels, index) => (
              <div key={`partA-${index + 6}`} className="feature-row-line">
                <span className="feature-label-text">{coreLabels}:</span>
                <p className="preshrine">{preCoreValues[index + 6]}</p>
                <input
                  type="text"
                  className="feature-input-box"
                  placeholder="0"
                  value={coreValues[index + 6]}
                  onChange={(e) => handleStatChange('A', index + 6, e.target.value)}
                />
                <div className="stat-indicator"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="feature-side-grid">
        <div className="feature-part-card">{/* Core stats */}
          <h3 className="part-title">Core Stats</h3>
          <div className="vertical-rows-container">
            {coreLabels.slice(0, 6).map((coreLabels, index) => (
              <div key={`partA-${index}`} className="feature-row-line">
                <span className="feature-label-text">{coreLabels}:</span>
                <p className="preshrine">{preCoreValues[index]}</p>
                <input
                  type="text"
                  className="feature-input-box"
                  placeholder="0"
                  value={coreValues[index]}
                  onChange={(e) => handleStatChange('A', index, e.target.value)}
                />
                <div className="stat-indicator"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="feature-part-card">{/* Attunement stats*/}
          <h3 className="part-title">Attunements</h3>
          <div className="vertical-rows-container">
            {attunmentLabels.map((attunmentLabels, index) => (
              <div key={`partB-${index}`} className="feature-row-line">
                <span className="feature-label-text">{attunmentLabels}:</span>
                <p className="preshrine">{preAttunValues[index]}</p>
                <input
                  type="text"
                  className="feature-input-box"
                  placeholder="0"
                  value={attunValues[index]}
                  onChange={(e) => handleStatChange('B', index, e.target.value)}
                />
                <div className="stat-indicator"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* shrine, submit, extra buttons*/}
      <div className="feature-buttons">
        <h3 className="part-title">SHRINES & BUTTONS</h3>
        <p className="feature-label-text">Points Remaining: {pointsRemaining}</p>
        <button className="soo" onClick={handleSOO}>Shrine of Order</button>
        <button className="soo" onClick={handleLoadPre}>Load Preshrine</button>
        <button className="reset" onClick={handleReset}>Reset</button>
        <button className="submit">Submit</button>
      </div>
    </div>
  );
}
