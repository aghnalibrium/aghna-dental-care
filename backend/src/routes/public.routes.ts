import { Router } from 'express';
import { createPublicReservation } from '../controllers/public.controller';

const router = Router();

// Public routes (no authentication required)
router.post('/reservations', createPublicReservation);

export default router;
