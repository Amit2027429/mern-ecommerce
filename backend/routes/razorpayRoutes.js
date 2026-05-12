import express from 'express';
import {
  createOrder,
  verifyPayment,
  getMerchantDetails,
  createPaymentForOrder
} from '../controllers/razorpayController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create Razorpay order
router.post('/create-order', createOrder);

// Verify payment
router.post('/verify-payment', verifyPayment);

// Get merchant/beneficiary details
router.get('/merchant-details', getMerchantDetails);

// Create payment for existing order (protected route)
router.post('/create-payment', protect, createPaymentForOrder);

export default router;
