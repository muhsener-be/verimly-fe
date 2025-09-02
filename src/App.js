import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import PrivateRoute from './routes/PrivateRoute';
import SessionPage from './pages/SessionPage'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/dashboard'
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>

          } />
        {/* Yeni rotayı ekle */}
        <Route path='/session'
          element={
            <PrivateRoute>
              <SessionPage />
            </PrivateRoute>
          } />
      </Routes>
    </Router>
  );
}

export default App;
