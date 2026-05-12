import express from 'express';
import { getUsers, deleteUser, getUserById, updateUser } from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();
router.use(protect, admin);
router.route('/').get(getUsers);
router.route('/:id').get(getUserById).put(updateUser).delete(deleteUser);

export default router;
