import express from 'express';

import {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  getMyOrders,
  getOrders,
  updateOrderToDelivered,
  createPaymentIntent,
  cancelOrder
} from '../controllers/orderController.js';

import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

/*
  Create New Order
*/
router.post('/', protect, createOrder);

/*
  Create Payment Intent
*/
router.post('/payment-intent', protect, createPaymentIntent);

/*
  Get Logged In User Orders
*/
router.get('/my-orders', protect, getMyOrders);

/*
  Get Single Order By ID
*/
router.route('/:id').get(protect, getOrderById);

/*
  Mark Order As Paid
*/
router.route('/:id/pay').put(protect, updateOrderToPaid);

/*
  Mark Order As Delivered (Admin)
*/
router.route('/:id/deliver').put(
  protect,
  admin,
  updateOrderToDelivered
);

/*
  Cancel Order
*/
router.route('/:id/cancel').put(
  protect,
  cancelOrder
);

/*
  Get All Orders (Admin)
*/
router.get('/', protect, admin, getOrders);

export default router;