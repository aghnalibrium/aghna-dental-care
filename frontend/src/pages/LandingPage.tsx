import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  Sparkles,
  Users,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Smile,
  Shield,
  Scissors,
  Crown,
  Baby,
  Circle,
  Stethoscope,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Instagram,
  Facebook,
  MessageCircle
} from 'lucide-react';
import { TestimonialsSection } from '../components/TestimonialsSection';

export function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: 'Promo Spesial Pemutihan Gigi',
      description: 'Dapatkan diskon 20% untuk treatment pemutihan gigi bulan ini!',
      bgColor: 'from-amber-500 to-yellow-600'
    },
    {
      title: 'Konsultasi Gratis',
      description: 'Konsultasi pertama gratis untuk pasien baru. Reservasi sekarang!',
      bgColor: 'from-blue-900 to-blue-700'
    },
    {
      title: 'Perawatan Gigi Anak',
      description: 'Pelayanan ramah anak dengan dokter spesialis berpengalaman',
      bgColor: 'from-green-600 to-emerald-700'
    }
  ];

  const articles = [
    {
      title: 'Tips Menjaga Kesehatan Gigi',
      excerpt: 'Pelajari cara merawat gigi dengan benar untuk senyum yang sehat dan indah',
      image: '🦷',
      link: '#'
    },
    {
      title: 'Kapan Waktu yang Tepat untuk Scaling?',
      excerpt: 'Ketahui tanda-tanda kapan Anda perlu melakukan scaling gigi',
      image: '✨',
      link: '#'
    },
    {
      title: 'Manfaat Pemutihan Gigi Profesional',
      excerpt: 'Mengapa pemutihan gigi di klinik lebih baik daripada produk rumahan',
      image: '😁',
      link: '#'
    },
    {
      title: 'Perawatan Gigi untuk Anak',
      excerpt: 'Panduan lengkap merawat gigi anak sejak dini',
      image: '👶',
      link: '#'
    }
  ];

  const services = [
    { name: 'Gigi Anak', slug: 'pediatric-dentistry', icon: Baby, desc: 'Perawatan gigi khusus untuk anak dengan pendekatan ramah' },
    { name: 'Scaling & Pembersihan', slug: 'scaling', icon: Shield, desc: 'Pembersihan karang gigi menyeluruh' },
    { name: 'Tambal Gigi', slug: 'dental-filling', icon: Circle, desc: 'Penambalan gigi untuk memperbaiki kerusakan' },
    { name: 'Cabut Gigi', slug: 'tooth-extraction', icon: Scissors, desc: 'Cabut gigi dengan teknologi modern' },
    { name: 'Perawatan Saluran Akar', slug: 'root-canal', icon: Stethoscope, desc: 'Perawatan saluran akar tanpa rasa sakit' },
    { name: 'Mahkota Gigi', slug: 'dental-crown', icon: Crown, desc: 'Mahkota gigi berkualitas premium' },
    { name: 'Pemutihan Gigi', slug: 'teeth-whitening', icon: Sparkles, desc: 'Pemutihan gigi profesional untuk senyum lebih cerah' },
    { name: 'Gigi Tiruan', slug: 'dentures', icon: Smile, desc: 'Gigi tiruan berkualitas tinggi dan nyaman' },
  ];

  // Auto-play carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };


  return (
    <div className="min-h-screen bg-white">
      {/* Header/Navbar */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Aghna Dental Care"
                className="h-28 object-contain"
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">
                Layanan
              </a>
              <Link to="/about" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">
                Tentang Kami
              </Link>
              <Link to="/facilities" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">
                Fasilitas
              </Link>
              <Link to="/articles" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">
                Berita
              </Link>
              <a href="#testimonials" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">
                Testimoni
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-900 transition-colors font-medium">
                Kontak
              </a>
              <Link
                to="/consultation"
                className="px-6 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                Reservasi Online
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Promo Carousel Section */}
      <section className="bg-white">
        <div className="container mx-auto px-6 py-8">
          <div className="relative overflow-hidden rounded-3xl shadow-2xl">
            {/* Slides */}
            <div className="relative h-80 md:h-96">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <div className={`w-full h-full bg-gradient-to-r ${slide.bgColor} flex items-center justify-center px-8`}>
                    <div className="text-center text-white max-w-3xl">
                      <h2 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h2>
                      <p className="text-xl md:text-2xl mb-8 opacity-90">{slide.description}</p>
                      <Link
                        to="/consultation"
                        className="inline-block px-8 py-4 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                      >
                        Reservasi Sekarang
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-900" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-900" />
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 py-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Senyum Sehat <br />
                <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">
                  Dimulai Dari Sini
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Sejak 2022, Aghna Dental Care telah dipercaya oleh ribuan keluarga Indonesia
                untuk perawatan gigi berkualitas dengan teknologi terkini.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/consultation"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-center"
                >
                  Reservasi Online
                </Link>
                <a
                  href="https://wa.me/6285769382624"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 bg-white text-blue-900 border-2 border-blue-900 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-center"
                >
                  WhatsApp Kami
                </a>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative">
                <div className="w-96 h-96 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-3xl shadow-2xl flex items-center justify-center">
                  <Sparkles className="w-48 h-48 text-white opacity-80" />
                </div>
                <div className="absolute -top-6 -right-6 w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-900">3+</p>
                    <p className="text-sm text-gray-600">Tahun</p>
                  </div>
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white rounded-2xl shadow-xl flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-4xl font-bold text-blue-900">10K+</p>
                    <p className="text-sm text-gray-600">Pasien</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-4">
              Layanan Kami
            </h2>
            <p className="text-xl text-gray-600">
              Perawatan gigi lengkap dengan teknologi terkini
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Link
                  key={index}
                  to={`/services/${service.slug}`}
                  className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl hover:border-amber-500 transition-all duration-300 cursor-pointer group block"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h3>
                  <p className="text-gray-600">{service.desc}</p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <div className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-3xl h-96 flex items-center justify-center shadow-2xl">
                <Users className="w-48 h-48 text-white opacity-80" />
              </div>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Mengapa Pilih <span className="bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent">Aghna?</span>
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Dokter Berpengalaman</h3>
                    <p className="text-gray-600">Tim dokter gigi profesional dengan pengalaman puluhan tahun</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Teknologi Modern</h3>
                    <p className="text-gray-600">Menggunakan peralatan dental terkini dan sterilisasi standar internasional</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Harga Terjangkau</h3>
                    <p className="text-gray-600">Paket perawatan dengan harga kompetitif dan cicilan tersedia</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">Pelayanan Ramah</h3>
                    <p className="text-gray-600">Staff yang friendly dan siap membantu dengan senyuman</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <Link
                  to="/about"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-600 text-white rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
                >
                  Selengkapnya Tentang Kami →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Articles/News Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-4">
              Tips & Artikel Kesehatan Gigi
            </h2>
            <p className="text-xl text-gray-600">
              Informasi dan tips kesehatan gigi dari para ahli kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.link}
                className="group bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 block"
              >
                <div className="relative h-48 bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                  <div className="text-7xl opacity-80">{article.image}</div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>
                  <div className="flex items-center text-amber-600 font-semibold text-sm group-hover:gap-2 transition-all">
                    <span>Baca Selengkapnya</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/articles"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-xl hover:from-blue-800 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              Lihat Semua Artikel →
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Google Reviews */}
      <TestimonialsSection />

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Hubungi Kami
            </h2>
            <p className="text-xl text-blue-100">
              Siap melayani Anda dengan sepenuh hati
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
              <Phone className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Telepon</h3>
              <p className="text-blue-100">+62 857-6938-2624</p>
            </div>
            <a
              href="mailto:aghnadentalcare@gmail.com"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-200 block"
            >
              <Mail className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Email</h3>
              <p className="text-blue-100">aghnadentalcare@gmail.com</p>
            </a>
            <a
              href="https://maps.app.goo.gl/WUfNJfnvsGVZy1MZ9"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center hover:bg-white/20 transition-all duration-200 block"
            >
              <MapPin className="w-12 h-12 text-white mx-auto mb-4" />
              <h3 className="font-semibold text-white mb-2">Alamat</h3>
              <p className="text-blue-100">Bangunjiwo, Kasihan, Bantul,<br />DI Yogyakarta</p>
              <p className="text-blue-200 text-sm mt-2 underline">Lihat di Google Maps</p>
            </a>
          </div>
          <div className="text-center mt-12">
            <Link
              to="/consultation"
              className="inline-block px-8 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              Buat Janji Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img
                  src="/logo.png"
                  alt="Aghna Dental Care"
                  className="h-20 object-contain"
                />
              </div>
              <p className="text-gray-400">
                Klinik gigi keluarga terpercaya dengan layanan berkualitas tinggi.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Layanan</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Teeth Whitening</li>
                <li>Orthodontics</li>
                <li>Dental Implants</li>
                <li>Root Canal</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Jam Operasional</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Senin - Jumat: 09:00 - 20:00</li>
                <li>Sabtu: 09:00 - 18:00</li>
                <li>Minggu: 10:00 - 16:00</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Ikuti Kami</h4>
              <div className="flex space-x-3 mb-6">
                <a
                  href="https://instagram.com/aghnadentalcare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-amber-500 transition-all duration-200 group"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://wa.me/6285769382624"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-green-500 transition-all duration-200 group"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=100089328853511"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-all duration-200 group"
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                </a>
              </div>
              <Link
                to="/login"
                className="inline-block px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-sm"
              >
                Login User
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Aghna Dental Care. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
