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
        <h2>chimeclipembed</h2>
        <Feature />
      </main>
      <Footer />
    </div>
  );
}
