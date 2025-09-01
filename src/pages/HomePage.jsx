import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button'; // Güncellediğimiz Button bileşeni
import Header from '../components/layout/Header';
import FeatureCard from '../components/ui/FeatureCard';
import { ArrowRight, Clock, CheckCircle, Folder, Play, BarChart, User } from 'lucide-react'; // İkonları import ettik


const HomePage = () => {

const featuresData = [
  {
    icon: <Clock />,
    title: 'Zaman Takibi',
    description: 'Görevlerinize harcadığınız zamanı detaylı olarak takip edin ve analiz edin',
  },
  {
    icon: <CheckCircle />,
    title: 'Görev Yönetimi',
    description: 'Görevlerinizi organize edin, öncelik verin ve ilerlemenizi takip edin',
  },
  {
    icon: <Folder />,
    title: 'Proje Organizasyonu',
    description: 'Projelerinizi klasörler halinde düzenleyin ve kolay erişim sağlayın',
  },
  {
    icon: <Play />,
    title: 'Çalışma Seansları',
    description: 'Odaklanmış çalışma seansları başlatın, duraklatın ve yönetin',
  },
  {
    icon: <BarChart />,
    title: 'Detaylı Raporlar',
    description: 'Verimliliğinizi analiz edin ve gelişim alanlarınızı keşfedin',
  },
  {
    icon: <User />,
    title: 'Kişisel Kullanım',
    description: 'Bireysel ihtiyaçlarınıza özel tasarlanmış kullanıcı deneyimi',
  },
];


  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 1. BÖLÜM: HEADER (ÜST MENÜ) */}
      <Header />
      {/* <header className="px-4 lg:px-6 h-14 flex items-center">
        <Link to="/" className="flex items-center justify-center">
          <Clock className="h-6 w-6 text-indigo-600" />
          <span className="ml-2 font-bold">Verim.ly</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link to="/login">
            <Button variant="ghost">Giriş Yap</Button>
          </Link>
          <Link to="/signup">
            <Button variant="default">Kayıt Ol</Button>
          </Link>
        </nav>
      </header> */}

      {/* 2. BÖLÜM: MAIN (ANA İÇERİK) */}
      <main className="flex-1">
        {/* 1. BÖLÜM: ANA KARŞILAMA */}
        <section className="w-full py-20 md:py-32">
          <div className="container px-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Görevlerinizi <span className="text-emerald-600">Verimli</span> Yönetin
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl mt-4">
              Zaman takibi, görev yönetimi ve proje organizasyonu için modern ve kullanıcı dostu platform. İş verimliliğinizi artırın, hedeflerinize odaklanın.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/signup">
                <Button size="lg">
                  Hemen Başla <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Giriş Yap
                </Button>
              </Link>
            </div>
          </div>
        </section>

    {/* 2. BÖLÜM: GÜÇLÜ ÖZELLİKLER (Güncellendi) */}
        <section id="features" className="w-full py-20 md:py-32 bg-slate-50">
          <div className="container px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Güçlü Özellikler
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl mt-4">
                İş süreçlerinizi optimize etmek için ihtiyacınız olan tüm araçlar
              </p>
            </div>
            
            {/* Kartların olduğu grid yapısı */}
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {featuresData.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default HomePage;