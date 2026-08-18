import React, { useMemo } from 'react';
import Header from '../components/Header';
import Feature from '../components/Feature';
import Footer from '../components/Footer';
import data from '../assets/buildbank.json';
import './MainView.css';

// INDEX FOR JSON BUILD OF THE DAY
const TARGET_PRESET_ID = 0;

export default function HomeView() {
  // Access entry directly by array index
  const targetBuild = useMemo(() => {
    if (!Array.isArray(data) || !data[TARGET_PRESET_ID]) return null;
    return data[TARGET_PRESET_ID];
  }, []);

  const videoUrl = targetBuild?.yt || '';
  const submitter = targetBuild?.user || 'xxxx';
  const date = targetBuild?.date || 'mm/dd/yyyy';

  return (
    <div className="home-view-container">
      <Header />
      <main className="home-content">
        <div className="main-side-grid">
          <div className="clipbox">
            <div className="embed" style={{ width: '100%', maxWidth: '876px', aspectRatio: '16/9' }}>
              <iframe className="yt"
                width="100%"
                height="100%"
                src={videoUrl}
                title="YouTube video player"
                frameBorder="0"
                allowFullScreen
              />
            </div>
            <h2>Date: {date}</h2>
            <h2>Submitter: {submitter}</h2>
          </div>
          <Feature />
        </div>
      </main>
      <Footer />
    </div>
  );
}