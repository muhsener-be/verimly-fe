import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Logo from './Logo';
import { LogOut } from 'lucide-react';
import ActiveSessionTracker from './ActiveSessionTracker';
import { useSession } from '../../contexts/SessionProvider';

const Header = () => {
  const { user, logout } = useAuth(); // Kullanıcı bilgisi için
  const { activeSession } = useSession(); // Aktif seans göstergesi için

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container mx-auto flex h-16 items-center">
        <Logo />
        <div className="flex-1 flex justify-center">
          {activeSession && <ActiveSessionTracker />}
        </div>
        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link to={'/dashboard'}>
                <span className="text-sm font-medium text-gray-700">
                  Hoş geldin, {user.first_name || user.name}
                </span>
              </Link>

              <Button variant="ghost" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Çıkış Yap
              </Button>
            </>
          ) : (
            <>
              <a href="/#features" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Özellikler
              </a>
              <Link to="/hakkinda" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Hakkında
              </Link>
              <Link to="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">Giriş Yap</Button>
              </Link>
              <Link to="/signup">
                <Button variant="default">Ücretsiz Başla</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default React.memo(Header);