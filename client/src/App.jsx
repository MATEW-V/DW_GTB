import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainView from "./views/MainView"; 
import './App.css';

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainView />} />
          <Route path="/register" element={<div>Register View</div>} />
          <Route path="/login" element={<div>Login View</div>} />
          <Route path="*" element={<div>404 Page Not Found</div>} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
