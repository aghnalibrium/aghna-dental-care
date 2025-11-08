import { Router } from 'express';
import {
  getAllInvoices,
  getInvoice,
  createInvoice,
  updateInvoice,
  deleteInvoice,
  addPayment,
} from '../controllers/invoice.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// All invoice routes require authentication
router.use(authenticate);

router.get('/', getAllInvoices);
router.get('/:id', getInvoice);
router.post('/', createInvoice);
router.put('/:id', updateInvoice);
router.delete('/:id', deleteInvoice);
router.post('/:id/payments', addPayment);

export default router;
