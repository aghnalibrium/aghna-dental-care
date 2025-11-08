import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function ArticlesPage() {
  const articles = [
    {
      title: 'Tips Menjaga Kesehatan Gigi',
      excerpt: 'Pelajari cara merawat gigi dengan benar untuk senyum yang sehat dan indah',
      image: '🦷',
      link: '#',
      category: 'Tips Kesehatan',
      date: '10 Januari 2025'
    },
    {
      title: 'Kapan Waktu yang Tepat untuk Scaling?',
      excerpt: 'Ketahui tanda-tanda kapan Anda perlu melakukan scaling gigi',
      image: '✨',
      link: '#',
      category: 'Perawatan',
      date: '8 Januari 2025'
    },
    {
      title: 'Manfaat Pemutihan Gigi Profesional',
      excerpt: 'Mengapa pemutihan gigi di klinik lebih baik daripada produk rumahan',
      image: '😁',
      link: '#',
      category: 'Estetika',
      date: '5 Januari 2025'
    },
    {
      title: 'Perawatan Gigi untuk Anak',
      excerpt: 'Panduan lengkap merawat gigi anak sejak dini',
      image: '👶',
      link: '#',
      category: 'Gigi Anak',
      date: '3 Januari 2025'
    },
    {
      title: 'Bahaya Karang Gigi yang Dibiarkan',
      excerpt: 'Dampak negatif karang gigi terhadap kesehatan mulut Anda',
      image: '⚠️',
      link: '#',
      category: 'Tips Kesehatan',
      date: '1 Januari 2025'
    },
    {
      title: 'Cara Memilih Sikat Gigi yang Tepat',
      excerpt: 'Tips memilih sikat gigi yang sesuai dengan kebutuhan Anda',
      image: '🪥',
      link: '#',
      category: 'Tips Kesehatan',
      date: '28 Desember 2024'
    },
    {
      title: 'Makanan yang Baik untuk Kesehatan Gigi',
      excerpt: 'Daftar makanan yang dapat membantu menjaga kesehatan gigi Anda',
      image: '🥗',
      link: '#',
      category: 'Nutrisi',
      date: '25 Desember 2024'
    },
    {
      title: 'Mengatasi Gigi Sensitif',
      excerpt: 'Solusi untuk mengatasi masalah gigi sensitif yang mengganggu',
      image: '🧊',
      link: '#',
      category: 'Perawatan',
      date: '20 Desember 2024'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Header */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3">
              <img
                src="/logo.png"
                alt="Aghna Dental Care"
                className="h-20 object-contain"
              />
            </Link>
            <Link
              to="/"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Tips & Artikel Kesehatan Gigi
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Informasi terkini dan tips kesehatan gigi dari para ahli kami
              untuk membantu Anda menjaga senyum yang sehat dan indah
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {articles.map((article, index) => (
              <a
                key={index}
                href={article.link}
                className="group bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 block"
              >
                <div className="relative h-56 bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center">
                  <div className="text-8xl opacity-80">{article.image}</div>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 text-amber-700 text-xs font-bold px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-500 mb-2">{article.date}</p>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors line-clamp-2">
                    {article.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
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
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Punya Pertanyaan Seputar Kesehatan Gigi?
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Konsultasikan dengan dokter gigi profesional kami
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/consultation"
                className="px-8 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                Konsultasi Gratis
              </Link>
              <a
                href="https://wa.me/6285769382624"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-blue-900 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                WhatsApp Kami
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <img
                src="/logo.png"
                alt="Aghna Dental Care"
                className="h-16 object-contain"
              />
            </div>
            <p className="text-gray-400 mb-4">
              Klinik gigi keluarga terpercaya dengan layanan berkualitas tinggi
            </p>
            <p className="text-gray-500 text-sm">
              &copy; 2025 Aghna Dental Care. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
