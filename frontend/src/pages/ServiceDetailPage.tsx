import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  Calendar,
  Sparkles,
  Award,
  ShieldCheck,
  Star
} from 'lucide-react';

interface ServiceInfo {
  name: string;
  icon: any;
  shortDesc: string;
  fullDesc: string;
  benefits: string[];
  procedure: string[];
  duration: string;
  priceRange: string;
  faqs: { question: string; answer: string }[];
}

const servicesData: { [key: string]: ServiceInfo } = {
  'teeth-whitening': {
    name: 'Teeth Whitening',
    icon: Sparkles,
    shortDesc: 'Pemutihan gigi profesional',
    fullDesc: 'Teeth Whitening atau pemutihan gigi adalah prosedur kosmetik yang dirancang untuk mencerahkan warna gigi dan menghilangkan noda serta perubahan warna. Kami menggunakan teknologi whitening terkini yang aman dan efektif untuk memberikan hasil maksimal tanpa merusak enamel gigi Anda.',
    benefits: [
      'Gigi tampak lebih putih dan cerah hingga 8 shade',
      'Meningkatkan kepercayaan diri',
      'Prosedur yang aman dan tidak menyakitkan',
      'Hasil yang tahan lama dengan perawatan yang tepat',
      'Dilakukan oleh dokter gigi profesional'
    ],
    procedure: [
      'Konsultasi dan pemeriksaan kondisi gigi',
      'Pembersihan gigi menyeluruh',
      'Aplikasi gel pemutih profesional',
      'Aktivasi dengan lampu khusus (untuk whitening di klinik)',
      'Evaluasi hasil dan instruksi perawatan'
    ],
    duration: '60-90 menit',
    priceRange: 'Rp 1.500.000 - Rp 3.000.000',
    faqs: [
      {
        question: 'Apakah teeth whitening aman?',
        answer: 'Ya, sangat aman bila dilakukan oleh profesional. Kami menggunakan bahan yang telah teruji klinis dan approved.'
      },
      {
        question: 'Berapa lama hasil bertahan?',
        answer: 'Dengan perawatan yang baik, hasil dapat bertahan 1-3 tahun tergantung gaya hidup dan kebiasaan konsumsi.'
      },
      {
        question: 'Apakah ada efek samping?',
        answer: 'Efek samping minimal, mungkin ada sedikit sensitivitas sementara yang akan hilang dalam beberapa hari.'
      }
    ]
  },
  'orthodontics': {
    name: 'Orthodontics',
    icon: Award,
    shortDesc: 'Perawatan behel dan kawat gigi',
    fullDesc: 'Orthodontics atau ortodonti adalah spesialisasi kedokteran gigi yang fokus pada diagnosis, pencegahan, dan perawatan ketidakteraturan gigi dan rahang. Kami menyediakan berbagai pilihan perawatan ortodonti termasuk behel metal, ceramic, dan clear aligners.',
    benefits: [
      'Memperbaiki posisi dan susunan gigi',
      'Meningkatkan fungsi mengunyah',
      'Memperbaiki estetika senyum',
      'Mencegah masalah gigi di masa depan',
      'Meningkatkan kesehatan mulut secara keseluruhan'
    ],
    procedure: [
      'Konsultasi dan analisis foto serta rontgen',
      'Pembuatan cetakan gigi',
      'Pemasangan behel/aligner',
      'Kontrol rutin setiap bulan',
      'Pelepasan behel dan pemasangan retainer'
    ],
    duration: '12-24 bulan (tergantung kondisi)',
    priceRange: 'Rp 5.000.000 - Rp 25.000.000',
    faqs: [
      {
        question: 'Berapa lama harus pakai behel?',
        answer: 'Durasi perawatan bervariasi, umumnya 12-24 bulan tergantung kondisi gigi Anda.'
      },
      {
        question: 'Apakah sakit saat pakai behel?',
        answer: 'Mungkin ada rasa tidak nyaman di awal, namun akan terbiasa dalam beberapa hari.'
      },
      {
        question: 'Berapa kali harus kontrol?',
        answer: 'Kontrol rutin dilakukan setiap 3-4 minggu sekali untuk penyesuaian behel.'
      }
    ]
  },
  'dental-implants': {
    name: 'Dental Implants',
    icon: Award,
    shortDesc: 'Implan gigi permanen',
    fullDesc: 'Dental Implants adalah solusi permanen untuk menggantikan gigi yang hilang. Implan gigi terdiri dari sekrup titanium yang ditanam pada tulang rahang dan berfungsi sebagai akar gigi buatan, kemudian dipasang mahkota yang terlihat dan berfungsi seperti gigi asli.',
    benefits: [
      'Solusi permanen untuk gigi hilang',
      'Terlihat dan berfungsi seperti gigi asli',
      'Mencegah kehilangan tulang rahang',
      'Tidak merusak gigi sebelahnya',
      'Tingkat keberhasilan sangat tinggi (95-98%)'
    ],
    procedure: [
      'Konsultasi dan CT scan',
      'Penanaman implan pada tulang rahang',
      'Periode penyembuhan (3-6 bulan)',
      'Pemasangan abutment',
      'Pemasangan mahkota gigi permanen'
    ],
    duration: '3-6 bulan (keseluruhan proses)',
    priceRange: 'Rp 10.000.000 - Rp 20.000.000 per gigi',
    faqs: [
      {
        question: 'Apakah implan gigi permanen?',
        answer: 'Ya, implan gigi dirancang untuk bertahan seumur hidup dengan perawatan yang baik.'
      },
      {
        question: 'Apakah prosedurnya sakit?',
        answer: 'Prosedur dilakukan dengan anestesi lokal, sehingga tidak terasa sakit.'
      },
      {
        question: 'Siapa yang bisa pasang implan?',
        answer: 'Kebanyakan orang dewasa dengan kesehatan gigi dan gusi yang baik bisa melakukan implan.'
      }
    ]
  },
  'root-canal': {
    name: 'Root Canal',
    icon: Award,
    shortDesc: 'Perawatan saluran akar',
    fullDesc: 'Root Canal Treatment atau perawatan saluran akar adalah prosedur untuk menyelamatkan gigi yang pulpanya (bagian dalam gigi) terinfeksi atau rusak. Prosedur ini menghilangkan bakteri dan jaringan mati dari dalam gigi, kemudian mengisinya dengan bahan khusus.',
    benefits: [
      'Menyelamatkan gigi dari pencabutan',
      'Menghilangkan rasa sakit akibat infeksi',
      'Mencegah penyebaran infeksi',
      'Mempertahankan fungsi mengunyah normal',
      'Hasil yang tahan lama'
    ],
    procedure: [
      'Rontgen untuk melihat kondisi akar',
      'Anestesi lokal',
      'Membuka gigi dan membersihkan saluran akar',
      'Mengisi dan menyegel saluran akar',
      'Menutup gigi dengan tambalan atau crown'
    ],
    duration: '1-2 kunjungan (60-90 menit per sesi)',
    priceRange: 'Rp 1.500.000 - Rp 4.000.000',
    faqs: [
      {
        question: 'Apakah perawatan saluran akar sakit?',
        answer: 'Tidak, prosedur dilakukan dengan anestesi lokal sehingga tidak terasa sakit.'
      },
      {
        question: 'Berapa lama recovery time?',
        answer: 'Kebanyakan pasien dapat kembali beraktivitas normal setelah prosedur.'
      },
      {
        question: 'Apakah perlu crown setelah root canal?',
        answer: 'Biasanya direkomendasikan untuk melindungi gigi yang telah dirawat.'
      }
    ]
  },
  'tooth-extraction': {
    name: 'Tooth Extraction',
    icon: Award,
    shortDesc: 'Cabut gigi tanpa rasa sakit',
    fullDesc: 'Tooth Extraction atau pencabutan gigi adalah prosedur pengangkatan gigi dari soketnya di tulang rahang. Kami melakukan pencabutan dengan teknik modern dan anestesi yang efektif untuk memastikan prosedur berjalan nyaman dan minim rasa sakit.',
    benefits: [
      'Menghilangkan rasa sakit dari gigi rusak',
      'Mencegah infeksi menyebar',
      'Prosedur yang cepat dan efisien',
      'Minim rasa sakit dengan anestesi modern',
      'Perawatan pasca cabut yang komprehensif'
    ],
    procedure: [
      'Pemeriksaan dan rontgen gigi',
      'Pemberian anestesi lokal',
      'Ekstraksi gigi dengan teknik yang sesuai',
      'Pembersihan area ekstraksi',
      'Instruksi perawatan pasca cabut'
    ],
    duration: '30-60 menit',
    priceRange: 'Rp 200.000 - Rp 1.500.000',
    faqs: [
      {
        question: 'Apakah cabut gigi sakit?',
        answer: 'Tidak, dengan anestesi lokal Anda tidak akan merasakan sakit selama prosedur.'
      },
      {
        question: 'Berapa lama masa penyembuhan?',
        answer: 'Biasanya 1-2 minggu, tergantung kompleksitas pencabutan.'
      },
      {
        question: 'Apa yang harus dilakukan setelah cabut gigi?',
        answer: 'Gigit kasa, hindari berkumur keras, dan ikuti instruksi dokter.'
      }
    ]
  },
  'dental-crown': {
    name: 'Dental Crown',
    icon: Award,
    shortDesc: 'Mahkota gigi berkualitas',
    fullDesc: 'Dental Crown atau mahkota gigi adalah penutup berbentuk gigi yang ditempatkan di atas gigi yang rusak untuk mengembalikan bentuk, ukuran, kekuatan, dan penampilan gigi. Kami menyediakan berbagai jenis crown berkualitas tinggi yang tahan lama.',
    benefits: [
      'Melindungi gigi yang lemah atau rusak',
      'Mengembalikan bentuk dan fungsi gigi',
      'Estetika yang natural',
      'Tahan lama hingga 15 tahun',
      'Berbagai pilihan material (porcelain, zirconia, dll)'
    ],
    procedure: [
      'Konsultasi dan pemeriksaan gigi',
      'Preparasi gigi',
      'Pencetakan gigi',
      'Pemasangan crown sementara',
      'Pemasangan crown permanen'
    ],
    duration: '2-3 kunjungan',
    priceRange: 'Rp 2.000.000 - Rp 6.000.000 per gigi',
    faqs: [
      {
        question: 'Berapa lama crown bertahan?',
        answer: 'Dengan perawatan yang baik, crown dapat bertahan 10-15 tahun atau lebih.'
      },
      {
        question: 'Apakah crown terlihat natural?',
        answer: 'Ya, terutama crown porcelain atau zirconia yang sangat menyerupai gigi asli.'
      },
      {
        question: 'Apakah perlu anestesi?',
        answer: 'Ya, anestesi lokal digunakan saat preparasi gigi untuk kenyamanan Anda.'
      }
    ]
  },
  'veneers': {
    name: 'Veneers',
    icon: Sparkles,
    shortDesc: 'Veneer gigi untuk senyum sempurna',
    fullDesc: 'Dental Veneers adalah lapisan tipis berwarna gigi yang dipasang pada permukaan depan gigi untuk memperbaiki penampilan. Veneer dapat mengubah warna, bentuk, ukuran, atau panjang gigi untuk menciptakan senyum yang sempurna.',
    benefits: [
      'Transformasi senyum instan',
      'Memperbaiki warna gigi secara permanen',
      'Memperbaiki bentuk dan ukuran gigi',
      'Tahan lama dan tahan noda',
      'Penampilan yang natural'
    ],
    procedure: [
      'Konsultasi dan smile design',
      'Preparasi minimal pada gigi',
      'Pencetakan gigi',
      'Pemasangan veneer sementara',
      'Bonding veneer permanen'
    ],
    duration: '2-3 kunjungan',
    priceRange: 'Rp 3.000.000 - Rp 8.000.000 per gigi',
    faqs: [
      {
        question: 'Apakah veneer merusak gigi?',
        answer: 'Preparasi minimal dilakukan, dan veneer justru melindungi gigi yang telah dipreparasi.'
      },
      {
        question: 'Berapa lama veneer bertahan?',
        answer: 'Dengan perawatan yang baik, veneer dapat bertahan 10-15 tahun.'
      },
      {
        question: 'Apakah bisa lepas?',
        answer: 'Tidak, veneer di-bonding secara permanen pada gigi Anda.'
      }
    ]
  },
  'scaling': {
    name: 'Scaling',
    icon: Sparkles,
    shortDesc: 'Pembersihan karang gigi menyeluruh',
    fullDesc: 'Scaling adalah prosedur pembersihan profesional untuk menghilangkan plak dan karang gigi (tartar) yang menumpuk di permukaan gigi dan di bawah garis gusi. Prosedur ini penting untuk mencegah penyakit gusi dan menjaga kesehatan mulut.',
    benefits: [
      'Menghilangkan karang gigi dan plak',
      'Mencegah penyakit gusi',
      'Mengurangi bau mulut',
      'Gigi terasa lebih bersih dan segar',
      'Mencegah gigi tanggal'
    ],
    procedure: [
      'Pemeriksaan kondisi gigi dan gusi',
      'Pembersihan karang gigi dengan ultrasonic scaler',
      'Pembersihan manual dengan hand scaler',
      'Polishing gigi',
      'Aplikasi fluoride (opsional)'
    ],
    duration: '30-60 menit',
    priceRange: 'Rp 200.000 - Rp 500.000',
    faqs: [
      {
        question: 'Apakah scaling sakit?',
        answer: 'Umumnya tidak sakit, mungkin ada sedikit sensitivitas pada gigi yang sensitif.'
      },
      {
        question: 'Berapa sering harus scaling?',
        answer: 'Direkomendasikan setiap 6 bulan sekali untuk menjaga kesehatan gigi.'
      },
      {
        question: 'Apakah scaling merusak enamel?',
        answer: 'Tidak, scaling justru melindungi gigi dengan menghilangkan karang yang merusak.'
      }
    ]
  }
};

export function ServiceDetailPage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const service = serviceId ? servicesData[serviceId] : null;

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Layanan Tidak Ditemukan</h1>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-blue-900 hover:text-amber-700"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Halaman Utama</span>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = service.icon;

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
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Kembali</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 py-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center space-x-6">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <Icon className="w-12 h-12 text-white" />
            </div>
            <div className="text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{service.name}</h1>
              <p className="text-xl text-blue-100">{service.shortDesc}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Tentang Layanan</h2>
                <p className="text-gray-700 leading-relaxed">{service.fullDesc}</p>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Manfaat</h2>
                <div className="space-y-4">
                  {service.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <CheckCircle2 className="w-6 h-6 text-blue-900 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-700">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Procedure */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Prosedur</h2>
                <div className="space-y-4">
                  {service.procedure.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-900 to-blue-800 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                      <p className="text-gray-700 pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQs */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Pertanyaan Umum</h2>
                <div className="space-y-6">
                  {service.faqs.map((faq, index) => (
                    <div key={index}>
                      <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Quick Info & CTA */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-6">
                {/* Quick Info Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Info Cepat</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-blue-900 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Durasi</p>
                        <p className="text-gray-700 text-sm">{service.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <ShieldCheck className="w-5 h-5 text-blue-900 flex-shrink-0 mt-1" />
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">Harga</p>
                        <p className="text-gray-700 text-sm">{service.priceRange}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CTA Card */}
                <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl shadow-lg p-6 text-white">
                  <h3 className="text-xl font-bold mb-2">Tertarik?</h3>
                  <p className="text-blue-100 mb-6">
                    Jadwalkan konsultasi gratis dengan dokter gigi kami sekarang!
                  </p>
                  <Link
                    to="/consultation"
                    className="block w-full px-6 py-3 bg-white text-blue-900 rounded-xl hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold text-center"
                  >
                    <Calendar className="w-5 h-5 inline mr-2" />
                    Buat Reservasi
                  </Link>
                </div>

                {/* Rating Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">4.9/5</p>
                    <p className="text-sm text-gray-600">dari 500+ pasien puas</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
