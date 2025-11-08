import { Router } from 'express';
import {
  getAllPatients,
  getPatient,
  createPatient,
  updatePatient,
  deletePatient,
} from '../controllers/patient.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/', getAllPatients);
router.get('/:id', getPatient);
router.post('/', createPatient);
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;
