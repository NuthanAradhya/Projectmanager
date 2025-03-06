import React, { lazy, Suspense, useState, useEffect } from 'react';
import './App.css'; // Make sure your CSS file is imported
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// Import Firebase and initialize
import { initializeApp } from "firebase/app";
// Import our custom LoadingScreen
import LoadingScreen from '../src/react/LoadingScreen';

// Lazy load the Home component
const Home = lazy(() => import('./react/Home'));

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbKoccRA0-t--F8-Q3uec8fPg382MJ0Vg",
  authDomain: "nuthan-portfolio.firebaseapp.com",
  projectId: "nuthan-portfolio",
  storageBucket: "nuthan-portfolio.firebasestorage.app",
  messagingSenderId: "60076951704",
  appId: "1:60076951704:web:4fab9f23d48d63253be8ed"
};

// Initialize Firebase
initializeApp(firebaseConfig);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Ensure the loading screen displays for at least 3 seconds
  useEffect(() => {
    if (!isLoading) return;
    
    // This timer ensures the loading screen shows for at least 3 seconds
    const minLoadingTimer = setTimeout(() => {
      // Do nothing here - we'll let the LoadingScreen component
      // control when it's done via the callback
    }, 3000);
    
    return () => clearTimeout(minLoadingTimer);
  }, [isLoading]);

  // If still loading, show the loading screen
  if (isLoading) {
    return <LoadingScreen onLoadingComplete={() => setIsLoading(false)} />;
  }

  // Otherwise show the actual app
  return (
    <div className="App">
      <Router>
        <Suspense fallback={<div style={{ display: 'none' }}>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;