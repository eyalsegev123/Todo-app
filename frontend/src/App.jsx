import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import Tasks from './pages/Tasks';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <div>
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
