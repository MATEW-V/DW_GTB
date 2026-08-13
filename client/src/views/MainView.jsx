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
          <div className="clipbox"></div>
          <Feature />
        </div>
      </main>
      <Footer />
    </div>
  );
}
