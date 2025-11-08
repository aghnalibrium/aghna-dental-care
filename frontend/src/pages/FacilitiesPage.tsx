import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Shield,
  Wifi,
  Car,
  Coffee,
  Clock,
  Users,
  Sparkles,
  Monitor,
  FileCheck,
  Smile,
  Award,
  CheckCircle2
} from 'lucide-react';

export function FacilitiesPage() {
  const mainFacilities = [
    {
      icon: Shield,
      title: 'Sterilisasi Standar Internasional',
      description: 'Semua peralatan medis disterilkan menggunakan autoclave dan teknologi sterilisasi modern sesuai standar WHO untuk menjamin keamanan pasien.',
      features: [
        'Autoclave sterilisasi suhu tinggi',
        'Instrumen disposable sekali pakai',
        'Protokol kebersihan ketat',
        'Area sterilisasi terpisah'
      ]
    },
    {
      icon: Monitor,
      title: 'Digital X-Ray Radiografi',
      description: 'Teknologi X-Ray digital terkini dengan radiasi minimal memberikan hasil diagnosis yang akurat dan cepat untuk perencanaan perawatan yang tepat.',
      features: [
        'Radiasi 90% lebih rendah',
        'Hasil instan dan akurat',
        'Kualitas gambar superior',
        'Penyimpanan digital aman'
      ]
    },
    {
      icon: Sparkles,
      title: 'Dental Chair Ergonomis',
      description: 'Kursi perawatan dental modern dengan teknologi ergonomis untuk kenyamanan maksimal pasien selama prosedur perawatan berlangsung.',
      features: [
        'Desain ergonomis nyaman',
        'Kontrol elektronik presisi',
        'Lampu LED terang',
        'Posisi adjustable'
      ]
    },
    {
      icon: FileCheck,
      title: 'Sistem Reservasi Online',
      description: 'Kemudahan booking janji temu melalui sistem online 24/7, dengan notifikasi otomatis dan reminder appointment untuk kenyamanan Anda.',
      features: [
        'Booking 24/7 online',
        'Konfirmasi instan',
        'Reminder otomatis',
        'Pilih dokter & jadwal'
      ]
    }
  ];

  const additionalFacilities = [
    {
      icon: Wifi,
      title: 'WiFi Gratis',
      description: 'Akses internet gratis berkecepatan tinggi untuk kenyamanan Anda'
    },
    {
      icon: Coffee,
      title: 'Ruang Tunggu Nyaman',
      description: 'Area tunggu ber-AC dengan tempat duduk empuk dan majalah'
    },
    {
      icon: Car,
      title: 'Parkir Luas',
      description: 'Area parkir yang luas dan aman untuk mobil dan motor'
    },
    {
      icon: Users,
      title: 'Ruang Konsultasi Privat',
      description: 'Ruangan khusus untuk konsultasi yang privat dan nyaman'
    },
    {
      icon: Clock,
      title: 'Jam Operasional Fleksibel',
      description: 'Buka dari pagi hingga malam untuk kemudahan jadwal Anda'
    },
    {
      icon: Award,
      title: 'Tim Profesional',
      description: 'Dokter dan staff berpengalaman dengan sertifikasi resmi'
    }
  ];

  const operationalHours = [
    { day: 'Senin - Jumat', hours: '09:00 - 20:00 WIB' },
    { day: 'Sabtu', hours: '09:00 - 18:00 WIB' },
    { day: 'Minggu', hours: '10:00 - 16:00 WIB' }
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
              Fasilitas Modern
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 leading-relaxed">
              Dilengkapi dengan teknologi terkini dan fasilitas lengkap untuk
              memberikan pengalaman perawatan gigi yang nyaman dan optimal
            </p>
          </div>
        </div>
      </section>

      {/* Main Facilities Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Fasilitas Utama
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Teknologi dan peralatan modern untuk perawatan gigi berkualitas tinggi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {mainFacilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-blue-950 mb-2">
                        {facility.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {facility.description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 ml-20">
                    {facility.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-2">
                        <CheckCircle2 className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 text-sm">{feature}</p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Facilities */}
      <section className="py-20 bg-gradient-to-br from-amber-50 to-yellow-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
              Fasilitas Pendukung
            </h2>
            <p className="text-xl text-gray-600">
              Kenyamanan tambahan untuk pengalaman terbaik Anda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {additionalFacilities.map((facility, index) => {
              const Icon = facility.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-950 mb-2">
                    {facility.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {facility.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Operational Hours */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-blue-950 mb-6">
                Jam Operasional
              </h2>
              <p className="text-xl text-gray-600">
                Kami siap melayani Anda dengan jadwal yang fleksibel
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-8 shadow-lg">
              <div className="space-y-4">
                {operationalHours.map((schedule, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center py-4 border-b border-amber-200 last:border-0"
                  >
                    <div className="flex items-center space-x-3">
                      <Clock className="w-6 h-6 text-amber-600" />
                      <span className="text-lg font-semibold text-gray-900">
                        {schedule.day}
                      </span>
                    </div>
                    <span className="text-lg font-bold text-blue-900">
                      {schedule.hours}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-900 text-center">
                  <strong>Catatan:</strong> Untuk kunjungan darurat di luar jam operasional,
                  silakan hubungi kami melalui WhatsApp di +62 857-6938-2624
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 to-blue-800">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Smile className="w-16 h-16 mx-auto mb-6 opacity-80" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Siap Merasakan Pengalaman Terbaik?
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Kunjungi klinik kami dan rasakan kenyamanan fasilitas modern
              dengan pelayanan yang ramah dan profesional
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/consultation"
                className="px-8 py-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                Reservasi Online
              </Link>
              <a
                href="https://wa.me/6285769382624"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-blue-900 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
              >
                WhatsApp Kami
              </a>
              <a
                href="https://maps.app.goo.gl/WUfNJfnvsGVZy1MZ9"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white rounded-xl hover:bg-white/20 transition-all duration-200 font-semibold"
              >
                Lihat Lokasi
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
