import { Router } from 'express';
import { getGoogleReviews } from '../controllers/reviews.controller';

const router = Router();

// Public route - no authentication required
router.get('/', getGoogleReviews);

export default router;
