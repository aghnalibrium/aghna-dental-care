import { Request, Response } from 'express';
import axios from 'axios';

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const GOOGLE_PLACE_ID = process.env.GOOGLE_PLACE_ID;

interface GoogleReview {
  author_name: string;
  author_url?: string;
  language?: string;
  profile_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  time: number;
}

interface GooglePlaceDetails {
  result: {
    name: string;
    rating: number;
    user_ratings_total: number;
    reviews: GoogleReview[];
  };
  status: string;
}

export const getGoogleReviews = async (req: Request, res: Response): Promise<void> => {
  try {
    // Check if API key and Place ID are configured
    if (!GOOGLE_PLACES_API_KEY || !GOOGLE_PLACE_ID) {
      res.status(500).json({
        error: 'Google Places API not configured',
        message: 'Please set GOOGLE_PLACES_API_KEY and GOOGLE_PLACE_ID in environment variables'
      });
      return;
    }

    // Fetch place details with reviews from Google Places API
    const response = await axios.get<GooglePlaceDetails>(
      'https://maps.googleapis.com/maps/api/place/details/json',
      {
        params: {
          place_id: GOOGLE_PLACE_ID,
          fields: 'name,rating,user_ratings_total,reviews',
          key: GOOGLE_PLACES_API_KEY,
          language: 'id', // Indonesian language
        },
      }
    );

    if (response.data.status !== 'OK') {
      res.status(400).json({
        error: 'Failed to fetch reviews from Google',
        status: response.data.status
      });
      return;
    }

    const { result } = response.data;

    // Format reviews for frontend
    const reviews = (result.reviews || []).map((review) => ({
      id: `${review.author_name}-${review.time}`,
      authorName: review.author_name,
      authorPhoto: review.profile_photo_url,
      rating: review.rating,
      text: review.text,
      date: review.relative_time_description,
      timestamp: review.time,
    }));

    res.json({
      businessName: result.name,
      averageRating: result.rating,
      totalReviews: result.user_ratings_total,
      reviews,
    });
  } catch (error: any) {
    console.error('Get Google reviews error:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Internal server error',
      message: error.message
    });
  }
};
