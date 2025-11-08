import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Heart,
  Shield,
  Users,
  CheckCircle2,
  Phone,
  Clock,
  MapPin
} from 'lucide-react';

export function AboutPage() {
  const values = [
    {
      icon: Award,
      title: 'Kompetensi',
      description: 'Tim dokter gigi profesional dengan sertifikasi internasional dan pengalaman lebih dari 10 tahun dalam berbagai bidang kedokteran gigi.',
      image: '🦷'
    },
    {
      icon: Heart,
      title: 'Kepedulian',
      description: 'Kami menempatkan kenyamanan dan kepuasan pasien sebagai prioritas utama dalam setiap layanan yang kami berikan.',
      image: '❤️'
    },
    {
      icon: Shield,
      title: 'Kualitas',
      description: 'Menggunakan teknologi dental terkini dan material berkualitas tinggi untuk hasil perawatan yang optimal dan tahan lama.',
      image: '✨'
    },
    {
      icon: Users,
      title: 'Kepercayaan',
      description: 'Membangun hubungan jangka panjang dengan pasien melalui transparansi, kejujuran, dan pelayanan yang konsisten.',
      image: '🤝'
    }
  ];

  const facilities = [
    'Ruang perawatan modern dengan sterilisasi standar internasional',
    'Digital X-Ray untuk diagnosis akurat',
    'Dental Chair ergonomis untuk kenyamanan maksimal',
    'Ruang tunggu yang nyaman dan bersih',
    'Sistem reservasi online untuk kemudahan Anda',
    'Parkir luas dan mudah diakses'
  ];

  const achievements = [
    { number: '3+', label: 'Tahun Pengalaman' },
    { number: '10K+', label: 'Pasien Terlayani' },
    { number: '4.9/5', label: 'Rating Google' },
    { number: '95%', label: 'Kepuasan Pasien' }
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
              Tentang Aghna Dental Care
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Kami berdedikasi untuk memberikan perawatan gigi terbaik dengan teknologi modern
              dan sentuhan personal yang hangat untuk setiap senyum Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
                Filosofi Kami
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                "Kesehatan gigi adalah investasi untuk masa depan yang lebih cerah"
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-3xl p-8 md:p-12 shadow-xl">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Di Aghna Dental Care, kami percaya bahwa setiap orang berhak mendapatkan
                senyum yang sehat dan indah. Sejak didirikan pada tahun 2022, kami telah
                melayani ribuan pasien dengan pendekatan yang holistik dan personal.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Kami tidak hanya berfokus pada perawatan gigi, tetapi juga pada edukasi
                dan pencegahan untuk memastikan kesehatan gigi jangka panjang. Tim dokter
                dan staff kami yang berpengalaman siap memberikan pelayanan terbaik dengan
                teknologi dental terkini.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Kenyamanan dan kepuasan Anda adalah prioritas kami. Dari konsultasi pertama
                hingga perawatan selesai, kami berkomitmen untuk memberikan pengalaman yang
                menyenangkan dan hasil yang memuaskan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Nilai-Nilai Kami
            </h2>
            <p className="text-xl text-gray-600">
              Fondasi yang membuat Aghna Dental Care dipercaya oleh ribuan pasien
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-blue-950 mb-3">{value.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Pencapaian Kami
            </h2>
            <p className="text-xl text-gray-600">
              Angka-angka yang berbicara tentang dedikasi dan kepercayaan
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl p-8 text-center shadow-lg"
              >
                <div className="text-5xl font-bold text-white mb-2">
                  {achievement.number}
                </div>
                <div className="text-amber-100 font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
                Fasilitas Kami
              </h2>
              <p className="text-xl text-gray-600">
                Dilengkapi dengan teknologi modern untuk kenyamanan Anda
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {facilities.map((facility, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md flex items-start space-x-4"
                >
                  <CheckCircle2 className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <p className="text-gray-700">{facility}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Kunjungi Kami
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Kami siap melayani Anda dengan sepenuh hati
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <MapPin className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Alamat</h3>
                <p className="text-blue-100 text-sm">
                  Jl. Perumahan Griya Hinggil No.D2<br />
                  Gendeng, Bangunjiwo, Kec. Kasihan<br />
                  Kabupaten Bantul, DIY 55184
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Phone className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Telepon</h3>
                <p className="text-blue-100">+62 857-6938-2624</p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6">
                <Clock className="w-12 h-12 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Jam Operasional</h3>
                <p className="text-blue-100 text-sm">
                  Senin - Jumat: 09:00 - 20:00<br />
                  Sabtu: 09:00 - 18:00<br />
                  Minggu: 10:00 - 16:00
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/consultation"
                className="px-8 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                Buat Janji Sekarang
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
