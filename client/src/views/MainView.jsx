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

  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);
  const playerRef = useRef(null);
  const isStoppedRef = useRef(false);

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

  const handleGameOver = () => {
    handleStopTimer();
    setShowModal(true);
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
    setShowModal(false);

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

  return (
    <div className="home-view-container">
      <Header />
      <main className="home-content">
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
            {/* EDIT YOUR POPUP CONTENT HERE */}
            <h2>Game Over</h2>
            <p>Time taken: {formatTime(seconds)}</p>
          </div>
        </div>
      )}
    </div>
  );
}