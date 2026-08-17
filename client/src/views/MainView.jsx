import React from 'react';
import Header from '../components/Header';
import Feature from '../components/Feature'
import Footer from '../components/Footer';
import './MainView.css';

export default function HomeView() {
  return (
    <div className="home-view-container">
      <Header />
      <main className="home-content">
        <h2>Date: xx/xx/xxxx Submitter: xxx </h2>
        <div className='main-side-grid'>
          <div className="clipbox">
            <div className="embed" style={{ width: '100%', maxWidth: '876px', aspectRatio: '16/9' }}>
              <iframe className="yt"
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/TzsKJAGuHMo"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <Feature />
        </div>
      </main>
      <Footer />
    </div>
  );
}
