import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from './context'; // Keeps your global state if needed
import './App.css';

// 1. IMPORT YOUR NEW VIEWS/COMPONENTS HERE
// Example: import GameView from "./views/GameView";
// Example: import LeaderboardView from "./views/LeaderboardView";

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          {/* ========================================================= */}
          {/* PUBLIC ROUTES (Accessible by anyone)                      */}
          {/* ========================================================= */}
          
          {/* Land page / Main Menu */}
          <Route path="/" element={<div>Main Menu View Goes Here</div>} />
          
          {/* Registration & Login */}
          <Route path="/register" element={<div>Register View Goes Here</div>} />
          <Route path="/login" element={<div>Login View Goes Here</div>} />

          {/* ========================================================= */}
          {/* PROTECTED ROUTES (Requires user authentication/login)      */}
          {/* ========================================================= */}
          {/* 
            Uncomment this wrapper block once you bring over your 
            ProtectedRoutes utility component!
            
            <Route element={<ProtectedRoutes />}>
              <Route path="/game" element={<div>Game Grid View Goes Here</div>} />
              <Route path="/settings" element={<div>Settings View Goes Here</div>} />
            </Route>
          */}

          {/* ========================================================= */}
          {/* 404 ERROR FALLBACK (Catch-all route for broken links)     */}
          {/* ========================================================= */}
          <Route path="*" element={<div>404 Page Not Found</div>} />
          
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
