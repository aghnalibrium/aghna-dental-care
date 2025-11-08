import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

// All user routes require authentication
router.use(authenticate);

// Only ADMIN can manage users
router.get('/', authorize('ADMIN'), getAllUsers);
router.get('/:id', authorize('ADMIN'), getUser);
router.post('/', authorize('ADMIN'), createUser);
router.put('/:id', authorize('ADMIN'), updateUser);
router.delete('/:id', authorize('ADMIN'), deleteUser);

export default router;
