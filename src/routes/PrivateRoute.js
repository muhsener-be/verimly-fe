import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Oturum kontrolü bitene kadar bekle
    return <div>Yükleniyor...</div>;
  }

  // Eğer kullanıcı yoksa, login sayfasına yönlendir
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Kullanıcı varsa, istenen sayfayı göster
  return children;
};

export default PrivateRoute;