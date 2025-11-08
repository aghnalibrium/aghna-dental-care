import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, Mail, Phone, MessageSquare, ArrowLeft } from 'lucide-react';
import axios from 'axios';

const medicalServicesList = [
  'Teeth Whitening',
  'Orthodontics',
  'Dental Implants',
  'Root Canal',
  'Tooth Extraction',
  'Dental Crown',
  'Veneers',
  'Scaling',
  'Fluoride Treatment',
  'Dental Bridge',
  'Dentures',
  'Gum Treatment',
  'Teeth Cleaning',
  'X-Ray',
  'Consultation'
];

export function ConsultationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    medicalServices: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);

  const timeSlots = [
    '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'
  ];

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => {
      if (prev.includes(service)) {
        return prev.filter(s => s !== service);
      } else {
        return [...prev, service];
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Kirim data ke API backend dengan medicalServices dari selectedServices
      const dataToSubmit = {
        ...formData,
        medicalServices: selectedServices.join(', ')
      };
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await axios.post(`${API_URL}/public/reservations`, dataToSubmit);

      if (response.status === 201) {
        setSuccess(true);

        // Format pesan WhatsApp
        const whatsappMessage = `Halo Aghna Dental Care,\n\nSaya ingin membuat reservasi:\n\nNama: ${formData.name}\nEmail: ${formData.email}\nTelepon: ${formData.phone}\nLayanan: ${formData.medicalServices}\nTanggal: ${formData.date}\nWaktu: ${formData.time}\nPesan: ${formData.message}`;

        const whatsappUrl = `https://wa.me/6285769382624?text=${encodeURIComponent(whatsappMessage)}`;

        // Buka WhatsApp
        window.open(whatsappUrl, '_blank');

        // Reset form setelah 2 detik
        setTimeout(() => {
          setFormData({
            name: '',
            email: '',
            phone: '',
            date: '',
            time: '',
            medicalServices: '',
            message: ''
          });
          setSelectedServices([]);
          setSuccess(false);
        }, 3000);
      }
    } catch (err: any) {
      console.error('Reservation error:', err);
      setError(err.response?.data?.error || 'Terjadi kesalahan saat membuat reservasi. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Reservasi Online
            </h1>
            <p className="text-xl text-gray-600">
              Jadwalkan konsultasi Anda dengan dokter gigi kami
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nama */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 text-amber-600" />
                  <span>Nama Lengkap</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="Masukkan nama lengkap Anda"
                />
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 text-amber-600" />
                  <span>Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="email@example.com"
                />
              </div>

              {/* Telepon */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 text-amber-600" />
                  <span>Nomor Telepon</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              {/* Tanggal */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 text-amber-600" />
                  <span>Tanggal Kunjungan</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Waktu */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Waktu Kunjungan</span>
                </label>
                <select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                >
                  <option value="">Pilih waktu kunjungan</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time} WIB
                    </option>
                  ))}
                </select>
              </div>

              {/* Layanan Medis Tambahan */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>Pilih Layanan Medis (Opsional)</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4 border border-gray-300 rounded-xl max-h-64 overflow-y-auto bg-gray-50">
                  {medicalServicesList.map((service) => (
                    <label
                      key={service}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-amber-50 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={selectedServices.includes(service)}
                        onChange={() => handleServiceToggle(service)}
                        className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
                {selectedServices.length > 0 && (
                  <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <p className="text-sm text-amber-900">
                      <strong>Layanan dipilih:</strong> {selectedServices.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Pesan */}
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>Pesan / Keluhan (Opsional)</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all resize-none"
                  placeholder="Ceritakan keluhan atau pertanyaan Anda..."
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-800 text-sm font-semibold">
                    Reservasi berhasil dibuat! Data Anda telah tersimpan dan WhatsApp akan terbuka.
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-yellow-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Memproses...' : 'Kirim Reservasi via WhatsApp'}
              </button>

              <p className="text-center text-sm text-gray-600">
                Data Anda akan tersimpan di sistem kami dan WhatsApp akan terbuka untuk konfirmasi
              </p>
            </form>
          </div>

          {/* Info Box */}
          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-xl p-6">
            <h3 className="font-semibold text-amber-900 mb-2">Informasi Penting:</h3>
            <ul className="space-y-1 text-sm text-amber-800">
              <li>• Reservasi akan dikonfirmasi melalui WhatsApp</li>
              <li>• Harap datang 10 menit sebelum waktu yang dijadwalkan</li>
              <li>• Untuk perubahan jadwal, hubungi kami minimal 24 jam sebelumnya</li>
              <li>• Bawa kartu identitas saat kunjungan pertama</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
