import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import { useAuth } from '../contexts/AuthProvider'; // Sadece useAuth'a ihtiyacımız var

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Artık tek bir login fonksiyonu her şeyi hallediyor

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await loginUser(formData);
      // Gelen verinin tamamını login fonksiyonuna veriyoruz
      login(data); 
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
      setError(errorMessage);
    } finally {
      setLoading(false); 
    }
  };

  // ... JSX kısmı (form) aynı kalabilir ...
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Giriş Yap</h1>
            <p className="text-balance text-gray-500">
              Devam etmek için hesabınıza giriş yapın
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                required
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
                <div className="flex items-center">
                    <Label htmlFor="password" >Şifre</Label>
                </div>
              <Input id="password" type="password" placeholder= '*******' required onChange={handleChange} />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Hesabın yok mu?{" "}
            <Link to="/signup" className="underline">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </div>
      <div className="hidden bg-gray-100 lg:block">
         <div className="flex items-center justify-center h-full">
            <h1 className="text-4xl font-bold text-gray-400">Verim.ly</h1>
         </div>
      </div>
    </div>
  );
};

export default LoginPage;