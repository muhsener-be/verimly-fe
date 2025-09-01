import React, { useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { useSession } from './SessionProvider';
import { getMe } from '../services/api';
import App from '../App';

const AppInitializer = () => {
  const {login } =   useAuth();
  const { initializeSession } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('console log -1');
    const checkUserAndSession = async () => {
          console.log('console log -2');
      try {
        const response = await getMe();
        // /me endpoint'inin { user: ..., active_session: ... } gibi bir yapı döndürdüğünü varsayıyoruz
        const userData = response.data; // veya response.data.user
        const sessionData = response.data.active_sessions[0];

        login(userData);
        if (sessionData) {
          initializeSession(sessionData);
        }
      } catch (error) {
        console.log("No active session found.");
        // Hata durumunda context'ler zaten varsayılan (null) değerlerinde kalır.
      } finally {
        setLoading(false);
      }
    };

    checkUserAndSession();
  }, [login, initializeSession]);



  if (loading) {
    // Buraya tam sayfa bir yükleniyor animasyonu koyabilirsiniz
    return <div>Uygulama Yükleniyor...</div>;
  }

  return <App /> 
};

export default AppInitializer;