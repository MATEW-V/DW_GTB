import React, { useMemo, useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Feature from '../components/Feature';
import Footer from '../components/Footer';
import data from '../assets/buildbank.json';
import './MainView.css';

// INDEX FOR JSON BUILD OF THE DAY
const TARGET_PRESET_ID = 0;

// Converts total seconds into MM:SS format
function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function HomeView() {
  const [seconds, setSeconds] = useState(0);
  const [isStopped, setIsStopped] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [gameResults, setGameResults] = useState(null);

  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const playerRef = useRef(null);
  const isStoppedRef = useRef(false);
  const [attemptsUsed, setAttemptsUsed] = useState(0);

  const targetBuild = useMemo(() => {
    if (!Array.isArray(data) || !data[TARGET_PRESET_ID]) return null;
    return data[TARGET_PRESET_ID];
  }, []);

  const videoUrl = targetBuild?.yt || '';

  const videoId = useMemo(() => {
    if (!videoUrl) return '';
    return videoUrl.split('/').pop().split('?')[0];
  }, [videoUrl]);

  const submitter = targetBuild?.user || 'xxxx';
  const date = targetBuild?.date || 'mm/dd/yyyy';

  const startTimer = () => {
    if (startTimeRef.current || isStoppedRef.current) return;

    startTimeRef.current = Date.now();

    const updateTimer = () => {
      if (isStoppedRef.current) return;

      const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setSeconds(elapsedSeconds);
      animFrameRef.current = requestAnimationFrame(updateTimer);
    };

    animFrameRef.current = requestAnimationFrame(updateTimer);
  };

  const handleStopTimer = () => {
    isStoppedRef.current = true;
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    setIsStopped(true);

    // Pause the YouTube video if the player exists and has the method
    if (playerRef.current && typeof playerRef.current.pauseVideo === 'function') {
      playerRef.current.pauseVideo();
    }
  };

  const handleGameOver = (usedAttempts, resultsData) => {
    handleStopTimer();
    if (usedAttempts !== undefined) setAttemptsUsed(usedAttempts);
    if (resultsData) setGameResults(resultsData);
    setShowModal(true);
  };

  const getColorEmoji = (hexColor) => {
    if (hexColor === '#008b33') return '🟩';
    if (hexColor === '#faca3b') return '🟨';
    return '⬜';
  };

  const handleResetTimer = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    startTimeRef.current = null;
    isStoppedRef.current = false;
    setIsStopped(false);
    setSeconds(0);
    setAttemptsUsed(0);
    setShowModal(false);
    setGameResults(null);

    // Optionally stop or rewind the video on reset
    if (playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(0);
      playerRef.current.pauseVideo();
    }
  };

  useEffect(() => {
    if (!videoId) return;

    const onPlayerStateChange = (event) => {
      // 1 = YT.PlayerState.PLAYING
      if (event.data === 1 && !isStoppedRef.current) {
        startTimer();
      }
    };

    //test ciomemnt
    const createPlayer = () => {
      playerRef.current = new window.YT.Player('yt-player', {
        videoId: videoId,
        width: '100%',
        height: '100%',
        events: {
          onStateChange: onPlayerStateChange,
        },
      });
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = createPlayer;
    } else {
      createPlayer();
    }

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const handleCopyResults = () => {
    if (!gameResults) return;

    const { coreColors, attunColors } = gameResults;

    let gridText = '';
    for (let i = 0; i < 6; i++) {
      const coreEmoji = getColorEmoji(coreColors[i]);
      const attunEmoji = getColorEmoji(attunColors[i]);
      const wepIdx = i + 6;
      const wepEmoji = wepIdx < coreColors.length ? getColorEmoji(coreColors[wepIdx]) : '';

      const spacing1 = '         '; // 9 spaces
      const spacing2 = wepEmoji ? '         ' : ''; // 9 spaces if weapon emoji exists

      gridText += `${coreEmoji}${spacing1}${attunEmoji}${spacing2}${wepEmoji}\n`;
    }

    // 15 leading spaces aligns column 2 under ATT
    gridText += `               ${getColorEmoji(attunColors[6])}`;

    const shareText =
      `DWGTB | I completed today's DW Guess the Build!
submitted by ${submitter}
time: ${formatTime(seconds)}
attempts: ${attemptsUsed}/3

CORE    ATT        WEP
${gridText}
play daily here: link`;

    navigator.clipboard.writeText(shareText).then(() => {
      alert('Results copied to clipboard!');
    }).catch((err) => {
      console.error('Failed to copy: ', err);
    });
  };

  return (
    <div className="home-view-container">
      <Header />
      <main className="home-content">
        <h2>Next Build in: hh:mm:ss</h2>
        <div className="main-side-grid">
          <div className="clipbox">
            <div className="embed" style={{ width: '100%', maxWidth: '876px', aspectRatio: '16/9' }}>
              <div id="yt-player" style={{ width: '100%', height: '100%' }} />
            </div>
            <h2>Date: {date}</h2>
            <h2>Submitter: {submitter}</h2>
            <div>
              <h2>Time: {formatTime(seconds)}</h2>
            </div>
          </div>
          <Feature
            onStopTimer={handleStopTimer}
            onResetTimer={handleResetTimer}
            onGameOver={handleGameOver}
          />
        </div>
      </main>
      <Footer />

      {/* Blank Popup Modal with Close Button */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setShowModal(false)}>
              &times;
            </button>

            <div className="modal-results-container">
              <p className="modal-title">DWGTB | I completed today's DW Guess the Build!</p>
              <p>submitted by {submitter}</p>
              <p>time: {formatTime(seconds)}</p>
              <p>attempts: {attemptsUsed}/3</p>

              <div className="modal-grid-header">
                <span>CORE</span>
                <span>ATT</span>
                <span>WEP</span>
              </div>

              {gameResults && (() => {
                const { coreColors, attunColors } = gameResults;

                return (
                  <div className="modal-grid-body">
                    {Array.from({ length: 6 }).map((_, i) => {
                      const coreEmoji = getColorEmoji(coreColors[i]);
                      const attunEmoji = getColorEmoji(attunColors[i]);
                      const wepIdx = i + 6;
                      const wepEmoji = wepIdx < coreColors.length ? getColorEmoji(coreColors[wepIdx]) : '';

                      return (
                        <div key={i} className="modal-grid-row">
                          <span>{coreEmoji}</span>
                          <span>{attunEmoji}</span>
                          <span>{wepEmoji}</span>
                        </div>
                      );
                    })}

                    {/* 7th Attunement Row */}
                    <div className="modal-grid-row">
                      <span></span>
                      <span>{getColorEmoji(attunColors[6])}</span>
                      <span></span>
                    </div>
                  </div>
                );
              })()}

              <p className="modal-footer-link">play daily here: link</p>
            </div>

            <button className="copy-share-btn" onClick={handleCopyResults}>
              Share Results / Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}