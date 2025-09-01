import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUser } from '../services/api';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';


const SignupPage = () => {
  const navigate = useNavigate();

  // Bileşenin "hafızasını" oluşturuyoruz.
  // Kullanıcının forma girdiği bilgileri burada tutacağız.
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  // Formdaki herhangi bir input değiştiğinde bu fonksiyon çalışacak.
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };




  // Form gönderildiğinde bu fonksiyon çalışacak.
  const handleSubmit = async (e) => {
    e.preventDefault(); // Sayfanın yeniden yüklenmesini engelle
    setLoading(true); // API çağrısı başlarken butonu "Yükleniyor" moduna al
    setError(null);   // Önceki hataları temizle

    try {

      await createUser(formData);

      // Başarılı olursa...
      alert('Hesap başarıyla oluşturuldu! Giriş sayfasına yönlendiriliyorsunuz.');
      navigate('/login'); // Kullanıcıyı login sayfasına yönlendir

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Bir hata oluştu. Lütfen tekrar deneyin.';
      setError(errorMessage);
      console.error("Kayıt hatası:", err)
    } finally {
      // İşlem başarılı da olsa hata da olsa "Yükleniyor" modunu kapat
      setLoading(false);
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      {/* Sol Taraf: Resim Alanı (Sadece büyük ekranlarda görünür) */}
      <div className="hidden bg-gray-100 lg:block">
        <div className="flex items-center justify-center h-full">
          {/* Buraya isterseniz bir resim veya logo ekleyebilirsiniz */}
          <h1 className="text-4xl font-bold text-gray-400">Verim.ly</h1>
        </div>
      </div>

      {/* Sağ Taraf: Form Alanı */}
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Hesap Oluştur</h1>
            <p className="text-balance text-gray-500">
              Başlamak için aşağıya bilgilerinizi girin
            </p>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="first_name">Ad</Label>
                <Input id="first_name" placeholder="John" required onChange={handleChange} />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="last_name">Soyad</Label>
                <Input id="last_name" placeholder="Doe" required onChange={handleChange} />
              </div>
            </div>
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
              <Label htmlFor="password">Şifre</Label>
              <Input id="password" type="password" required onChange={handleChange} />
            </div>

            {error && <p className='text-sm text-red-600'>{error}</p>}

            <Button type="submit" className="w-full"  disabled= {loading}>
              {loading ? 'Oluşturuluyor...' : 'Hesap Oluştur'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Zaten bir hesabın var mı?{" "}
            <Link to="/login" className="underline">
              Giriş Yap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;