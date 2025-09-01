import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './contexts/AuthProvider';
import { SessionProvider } from './contexts/SessionProvider';
import AppInitializer from './contexts/AppInitializer';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <SessionProvider>

          <AppInitializer />

      </SessionProvider>
    </AuthProvider>
  </React.StrictMode>
);