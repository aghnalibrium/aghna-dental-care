import { Router } from 'express';
import {
  getAllAppointments,
  getAppointment,
  createAppointment,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointment.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllAppointments);
router.get('/:id', getAppointment);
router.post('/', createAppointment);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
