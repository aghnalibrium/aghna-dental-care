import { Router } from 'express';
import {
  getAllMedicalRecords,
  getMedicalRecord,
  createMedicalRecord,
  updateMedicalRecord,
  deleteMedicalRecord,
} from '../controllers/medical-record.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All medical record routes require authentication
router.use(authenticate);

router.get('/', getAllMedicalRecords);
router.get('/:id', getMedicalRecord);
router.post('/', createMedicalRecord);
router.put('/:id', updateMedicalRecord);
router.delete('/:id', deleteMedicalRecord);

export default router;
