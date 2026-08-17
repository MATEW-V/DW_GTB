import React, { useState } from 'react';
import data from '/src/assets/buildbank.json';
import './Feature.css';

const CORE_LABELS = ["Strength", "Fortitude", "Agility", "Inteligence", "Willpower", "Charisma", "Heavy", "Medium", "Light"];
const ATTUN_LABELS = ["Flamecharm", "Frostdraw", "Thundercall", "Galebreath", "Shadowcast", "Ironsing", "Bloodrend"];

// ID FOR JSON BUILD OF THE DAY
const TARGET_PRESET_ID = 0;

export default function Feature() {
  const [coreValues, setCoreValues] = useState(Array(9).fill(''));
  const [attunValues, setAttunValues] = useState(Array(7).fill(''));
  const [preCoreValues, setPreCoreValues] = useState(Array(9).fill('0'));
  const [preAttunValues, setPreAttunValues] = useState(Array(7).fill('0'));

  const [coreIndicators, setCoreIndicators] = useState(Array(9).fill('grey'));
  const [attunIndicators, setAttunIndicators] = useState(Array(7).fill('grey'));

  const [preCoreIndicators, setPreCoreIndicators] = useState(Array(9).fill('grey'));
  const [preAttunIndicators, setPreAttunIndicators] = useState(Array(7).fill('grey'));

  const [isBlasphemy, setIsBlasphemy] = useState(false);
  const [isMastery, setIsMastery] = useState(false);

  // Total point usage tracking
  const totalPointUsed = coreValues.reduce((sum, val) => sum + Number(val || 0), 0) + attunValues.reduce((sum, val) => sum + Number(val || 0), 0);

  const pointsRemaining = 330 - totalPointUsed;

  const handleStatChange = (part, index, value) => {
    let cleanValue = value.replace(/[^0-9]/g, ''); // Strip non-digit chars
    if (cleanValue !== '') {
      let num = Number(cleanValue);
      const targetArray = part === 'A' ? coreValues : attunValues;

      // Point tracking for 330 total max
      const currentVal = Number(targetArray[index] || 0);
      const totalUsedByOthers = totalPointUsed - currentVal;
      const maxAllowedForThisField = 330 - totalUsedByOthers;
      if (num > maxAllowedForThisField) {
        num = maxAllowedForThisField;
      }
      // Individual stat limits
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
  };

  const handleClear = () => {
    setCoreValues(Array(9).fill(''));
    setAttunValues(Array(7).fill(''));
    setPreCoreValues(Array(9).fill(''));
    setPreAttunValues(Array(7).fill(''));
  }

  const handleReset = () => {
    setCoreValues(Array(9).fill(''));
    setAttunValues(Array(7).fill(''));
    setPreCoreValues(Array(9).fill(''));
    setPreAttunValues(Array(7).fill(''));
    setCoreIndicators(Array(9).fill('grey'));
    setAttunIndicators(Array(7).fill('grey'));
    setPreCoreIndicators(Array(9).fill('grey'));
    setPreAttunIndicators(Array(7).fill('grey'));
  };

  const getIndicatorColor = (inputVal, targetVal) => {
    const diff = Math.abs(Number(inputVal || 0) - Number(targetVal || 0));
    if (diff === 0) return '#008b33';
    if (diff <= 15) return '#faca3b';
    return '#777777';
  };

  const getTooltipText = (color) => {
    if (color === '#008b33') return 'correct';
    if (color === '#faca3b') return 'within 15 points';
    return 'no match';
  };

  const handleSubmit = () => {
    if (!data || data.length === 0) return;
    if (pointsRemaining > 0) {
      alert("must invest all stats");
      return;
    } else {
      // Direct lookup by ID/Index
      const targetEntry = data[TARGET_PRESET_ID];

      const numCore = coreValues.map(v => Number(v || 0));
      const numAttun = attunValues.map(v => Number(v || 0));
      const numPreCore = preCoreValues.map(v => Number(v || 0));
      const numPreAttun = preAttunValues.map(v => Number(v || 0));

      let totalDiffSum = 0;

      numCore.forEach((val, i) => {
        totalDiffSum += Math.abs(val - Number(targetEntry.postshrine.corevalues[i] || 0));
      });
      numAttun.forEach((val, i) => {
        totalDiffSum += Math.abs(val - Number(targetEntry.postshrine.attunvalues[i] || 0));
      });
      numPreCore.forEach((val, i) => {
        totalDiffSum += Math.abs(val - Number(targetEntry.preshrine.corevalues[i] || 0));
      });
      numPreAttun.forEach((val, i) => {
        totalDiffSum += Math.abs(val - Number(targetEntry.preshrine.attunvalues[i] || 0));
      });

      setCoreIndicators(numCore.map((val, i) => getIndicatorColor(val, targetEntry.postshrine.corevalues[i])));
      setAttunIndicators(numAttun.map((val, i) => getIndicatorColor(val, targetEntry.postshrine.attunvalues[i])));

      setPreCoreIndicators(numPreCore.map((val, i) => getIndicatorColor(val, targetEntry.preshrine.corevalues[i])));
      setPreAttunIndicators(numPreAttun.map((val, i) => getIndicatorColor(val, targetEntry.preshrine.attunvalues[i])));
    }
  };

  const handleSOO = () => {
    setPreCoreValues(coreValues.map(val => (val === '' ? '0' : val)));
    setPreAttunValues(attunValues.map(val => (val === '' ? '0' : val)));

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
    }
    for (let i = 0; i < 7; i++) {
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

  return (
    <div className="feature-wrapper">
      <div className="feature-side-grid">
        <div className="feature-part-card">
          <h3 className="part-title">Extra</h3>
          <div className="vertical-rows-container">
            <p className="build-indicators">
              Shrine of Blasphemy = <button
                className="truefalse"
                onClick={() => setIsBlasphemy(!isBlasphemy)}
                style={{ color: isBlasphemy ? 'green' : 'red' }}
              >[{isBlasphemy ? 'TRUE' : 'FALSE'}]
              </button>
            </p>
            <p className="build-indicators">Shrine of Mastery = <button
              className="truefalse"
              onClick={() => setIsMastery(!isMastery)}
              style={{ color: isMastery ? 'green' : 'red' }}
            >[{isMastery ? 'TRUE' : 'FALSE'}]
            </button>
            </p>
            <p className="build-indicators">Unobtainable = [placeholder]</p>
          </div>
        </div>

        {/* Weapon Section (Core indices 6 through 8) */}
        <div className="feature-part-card">
          <h3 className="part-title">Weapon</h3>
          <div className="vertical-rows-container">
            {CORE_LABELS.slice(6, 9).map((label, index) => {
              const actualIdx = index + 6;
              return (
                <div key={`partA-${actualIdx}`} className="feature-row-line">
                  <span className="feature-label-text">{label}:</span>
                  <p className="preshrine">{preCoreValues[actualIdx]}</p>
                  <input
                    type="text"
                    className="feature-input-box"
                    placeholder="0"
                    value={coreValues[actualIdx]}
                    onChange={(e) => handleStatChange('A', actualIdx, e.target.value)}
                  />
                  <div className="pre-stat-indicator"
                    style={{ backgroundColor: preCoreIndicators[actualIdx] }}
                    data-tooltip={getTooltipText(preCoreIndicators[actualIdx])}></div>
                  <div className="stat-indicator"
                    style={{ backgroundColor: coreIndicators[actualIdx] }}
                    data-tooltip={getTooltipText(coreIndicators[actualIdx])}></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="feature-side-grid">
        {/* Core Stats Section (Core indices 0 through 5) */}
        <div className="feature-part-card">
          <h3 className="part-title">Core Stats</h3>
          <div className="vertical-rows-container">
            {CORE_LABELS.slice(0, 6).map((label, index) => (
              <div key={`partA-${index}`} className="feature-row-line">
                <span className="feature-label-text">{label}:</span>
                <p className="preshrine">{preCoreValues[index]}</p>
                <input
                  type="text"
                  className="feature-input-box"
                  placeholder="0"
                  value={coreValues[index]}
                  onChange={(e) => handleStatChange('A', index, e.target.value)}
                />
                <div className="pre-stat-indicator"
                  style={{ backgroundColor: preCoreIndicators[index] }}
                  data-tooltip={getTooltipText(preCoreIndicators[index])}></div>
                <div className="stat-indicator"
                  style={{ backgroundColor: coreIndicators[index] }}
                  data-tooltip={getTooltipText(coreIndicators[index])}></div>
              </div>
            ))}
          </div>
        </div>

        {/* Attunement Section */}
        <div className="feature-part-card">
          <h3 className="part-title">Attunements</h3>
          <div className="vertical-rows-container">
            {ATTUN_LABELS.map((label, index) => (
              <div key={`partB-${index}`} className="feature-row-line">
                <span className="feature-label-text">{label}:</span>
                <p className="preshrine">{preAttunValues[index]}</p>
                <input
                  type="text"
                  className="feature-input-box"
                  placeholder="0"
                  value={attunValues[index]}
                  onChange={(e) => handleStatChange('B', index, e.target.value)}
                />
                <div className="pre-stat-indicator"
                  style={{ backgroundColor: preAttunIndicators[index] }}
                  data-tooltip={getTooltipText(preAttunIndicators[index])}></div>
                <div className="stat-indicator"
                  style={{ backgroundColor: attunIndicators[index] }}
                  data-tooltip={getTooltipText(attunIndicators[index])}></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="feature-buttons">
        <h3 className="part-title">SHRINE & BUTTONS</h3>
        <p className="feature-label-text">Points Remaining: {pointsRemaining}</p>
        <button className="soo" onClick={handleSOO}>Shrine of Order</button>
        <button className="soo" onClick={handleLoadPre}>Load Preshrine</button>
        <button className="soo" onClick={handleClear}>Clear Stats</button>
        <button className="reset" onClick={handleReset}>RESET</button>
        <button className="submit" onClick={handleSubmit}>SUBMIT</button>
      </div>
    </div>
  );
}