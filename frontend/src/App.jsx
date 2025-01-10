import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import Tasks from './pages/Tasks';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import backgroundImage from './assets/todo_background.png'; // Add this import

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div style={{
          minHeight: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed', // This keeps the background fixed while scrolling
        }}>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tasks" element={<Tasks />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
};

export default App;
