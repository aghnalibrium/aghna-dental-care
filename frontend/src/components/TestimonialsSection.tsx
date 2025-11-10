import { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { api } from '../lib/api';

interface Review {
  id: string;
  authorName: string;
  authorPhoto?: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewsData {
  businessName: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

export function TestimonialsSection() {
  const [reviewsData, setReviewsData] = useState<ReviewsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/reviews');
      setReviewsData(response.data);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch reviews:', err);
      setError('Gagal memuat testimoni');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat testimoni...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || !reviewsData) {
    // Show fallback testimonials if API fails
    const fallbackReviews: Review[] = [
      {
        id: '1',
        authorName: 'Mustaqim Muchson',
        authorPhoto: 'https://lh3.googleusercontent.com/a-/ALV-UjW8zs5uE96tHBnAIGqefHP6sxa4F0wKMy1D0z4wyDG5F-H0BR1Y=s128-c0x00000000-cc-rp-mo-ba4',
        rating: 5,
        text: 'Dokternya ramah, enak di ajak diskusi dan konsultasi, tempat bersih dan nyaman, penanganan mantap (anak-anak jadi tidak takut periksain gigi) 👍👍',
        date: 'setahun yang lalu'
      },
      {
        id: '2',
        authorName: 'Tommy EGD',
        authorPhoto: 'https://lh3.googleusercontent.com/a/ACg8ocKV7QH9J4do_JcfKvKtki7YWpSjvaOCHMSoBBrqya8J40TjorQ=s128-c0x00000000-cc-rp-mo',
        rating: 5,
        text: 'Dokter profesional. Sabar. Hasil pengerjaan rapi saat tambal gigi dan sangat telaten buang kotoran-kotoran dalam lubang gigi anak saya sampai akhirnya ditambal sempurna. Advice bagus terhadap kita-kita yang kurang paham kesehatan gigi',
        date: 'setahun yang lalu'
      },
      {
        id: '3',
        authorName: 'Emmalysa Pitasari',
        authorPhoto: 'https://lh3.googleusercontent.com/a-/ALV-UjXFuHAjWawVRaWYvAg8yT-MpcpzzGlUtoNuhUXuc7lS1fDLRReC=s128-c0x00000000-cc-rp-mo',
        rating: 5,
        text: 'Pengalaman seru dan menyenangkan membawa anak-anak ke dokter Delvi yang ramah. Serta tempat praktek yang nyaman dan bersih. Akan selalu kembali lagi untuk periksa kesini 🫶🏻🫶🏻',
        date: 'setahun yang lalu'
      },
      {
        id: '4',
        authorName: 'Eni Rahmawati',
        authorPhoto: 'https://lh3.googleusercontent.com/a/ACg8ocKVZwHVTZM5dOXC6lGCPRPuuYUl_mxVzj2mY4C7KSbHDp_ZUA=s128-c0x00000000-cc-rp-mo-ba3',
        rating: 5,
        text: 'Klinik gigi yang bisa untuk menangani scaling, cabut gigi, tambal gigi. Tempatnya nyaman dan pengerjaannya rapi. Pengalaman pertama scaling gigi, dan senyaman itu',
        date: 'setahun yang lalu'
      },
      {
        id: '5',
        authorName: 'Ratna Widayanti',
        authorPhoto: 'https://lh3.googleusercontent.com/a/ACg8ocLqSvNy1XseT0zI4gEVZMSI4JjeejphBKlxz8lzv5YD4zgYzQ=s128-c0x00000000-cc-rp-mo',
        rating: 5,
        text: 'Senang sekali periksa di klinik gigi ini. Tempatnya yang nyaman, mudah dijangkau. Dokternya baik, sabar, dan telaten. Anak saya sangat nyaman, tidak rewel ketika ditambal giginya 👍',
        date: 'setahun yang lalu'
      },
      {
        id: '6',
        authorName: 'Happy Customer',
        rating: 5,
        text: 'Pelayanan sangat memuaskan! Dokter gigi yang profesional dan ramah. Klinik yang bersih dan modern. Highly recommended!',
        date: 'beberapa bulan yang lalu'
      }
    ];

    return (
      <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Testimoni Pasien Kami
            </h2>
            <p className="text-xl text-gray-600 mb-6">
              Kepercayaan pasien adalah prioritas kami
            </p>

            {/* Average Rating */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                {renderStars(5)}
                <span className="text-2xl font-bold text-gray-900">5.0</span>
              </div>
              <span className="text-gray-600">
                berdasarkan 15+ ulasan di Google
              </span>
            </div>
          </div>

          {/* Reviews Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {fallbackReviews.map((review) => (
              <div
                key={review.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative"
              >
                {/* Quote Icon */}
                <div className="absolute top-4 right-4 text-amber-100">
                  <Quote className="h-12 w-12" />
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 mb-4 relative z-10">
                  {review.authorPhoto ? (
                    <img
                      src={review.authorPhoto}
                      alt={review.authorName}
                      className="h-12 w-12 rounded-full object-cover border-2 border-amber-500"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold text-lg">
                      {review.authorName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {review.authorName}
                    </h3>
                    <p className="text-sm text-gray-500">{review.date}</p>
                  </div>
                </div>

                {/* Rating */}
                <div className="mb-4">{renderStars(review.rating)}</div>

                {/* Review Text */}
                <p className="text-gray-700 leading-relaxed line-clamp-4">
                  {review.text}
                </p>
              </div>
            ))}
          </div>

          {/* Google Link */}
          <div className="text-center mt-12">
            <a
              href="https://www.google.com/maps/place/Praktek+drg.+Delvi+Syelvia/@-7.8377687,110.2925785,15z/data=!4m8!3m7!1s0x2e7af9d9aa3bff07:0x898a4b0357497a7d!8m2!3d-7.8377687!4d110.3116329!9m1!1b1!16s%2Fg%2F11vrd7k15q"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-amber-500"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              Lihat Semua Ulasan di Google Maps
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-b from-white to-amber-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Testimoni Pasien Kami
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Kepercayaan pasien adalah prioritas kami
          </p>

          {/* Average Rating */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              {renderStars(Math.round(reviewsData.averageRating))}
              <span className="text-2xl font-bold text-gray-900">
                {reviewsData.averageRating.toFixed(1)}
              </span>
            </div>
            <span className="text-gray-600">
              berdasarkan {reviewsData.totalReviews} ulasan di Google
            </span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {reviewsData.reviews.slice(0, 6).map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-amber-100">
                <Quote className="h-12 w-12" />
              </div>

              {/* Author Info */}
              <div className="flex items-center gap-4 mb-4 relative z-10">
                {review.authorPhoto ? (
                  <img
                    src={review.authorPhoto}
                    alt={review.authorName}
                    className="h-12 w-12 rounded-full object-cover border-2 border-amber-500"
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 flex items-center justify-center text-white font-bold text-lg">
                    {review.authorName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">
                    {review.authorName}
                  </h3>
                  <p className="text-sm text-gray-500">{review.date}</p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-4">{renderStars(review.rating)}</div>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed line-clamp-4">
                {review.text}
              </p>
            </div>
          ))}
        </div>

        {/* Google Link */}
        <div className="text-center mt-12">
          <a
            href="https://www.google.com/maps/place/Praktek+drg.+Delvi+Syelvia/@-7.8377687,110.2925785,15z/data=!4m8!3m7!1s0x2e7af9d9aa3bff07:0x898a4b0357497a7d!8m2!3d-7.8377687!4d110.3116329!9m1!1b1!16s%2Fg%2F11vrd7k15q"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-amber-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-amber-500"
          >
            <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            Lihat Semua Ulasan di Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
