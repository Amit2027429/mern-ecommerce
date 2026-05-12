import crypto from 'crypto';
import Order from '../models/orderModel.js';

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

// Correct beneficiary/merchant details for Razorpay
const MERCHANT_DETAILS = {
  businessName: process.env.RAZORPAY_MERCHANT_NAME || 'ShopSphere',
  merchantName: process.env.RAZORPAY_MERCHANT_NAME || 'ShopSphere',
  accountHolder: process.env.RAZORPAY_ACCOUNT_HOLDER || 'ShopSphere Business',
  accountNumber: process.env.RAZORPAY_ACCOUNT_NUMBER || '',
  ifscCode: process.env.RAZORPAY_IFSC_CODE || '',
  // Use a valid VPA format or merchant identifier
  merchantVPA: process.env.RAZORPAY_MERCHANT_VPA || 'merchant@razorpay'
};

export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: 'Amount is required' });
    }

    // Amount should be in paise (multiply by 100)
    const amountInPaise = Math.round(amount * 100);

    // Create Razorpay order via API
    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64')
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        // Add notes for better tracking - Razorpay will use merchant account's UPI
        notes: {
          businessName: MERCHANT_DETAILS.businessName,
          merchantName: MERCHANT_DETAILS.merchantName,
          orderType: 'ecommerce'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create Razorpay order');
    }

    const data = await response.json();

    res.json({
      order_id: data.id,
      amount: data.amount,
      currency: data.currency,
      // Send merchant details to frontend for QR code display
      merchant: MERCHANT_DETAILS
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Create signature to verify payment
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', razorpayKeySecret)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed'
      });
    }

    res.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get merchant/beneficiary details for QR code display
export const getMerchantDetails = (req, res) => {
  try {
    res.json({
      merchant: MERCHANT_DETAILS,
      message: 'Merchant details retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create payment for order
export const createPaymentForOrder = async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
      return res.status(400).json({ message: 'Order ID and amount are required' });
    }

    // Verify order exists
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create Razorpay order
    const amountInPaise = Math.round(amount * 100);

    const response = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(`${razorpayKeyId}:${razorpayKeySecret}`).toString('base64')
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `order_${orderId}_${Date.now()}`,
        notes: {
          businessName: MERCHANT_DETAILS.businessName,
          merchantName: MERCHANT_DETAILS.merchantName,
          orderId: orderId,
          orderType: 'ecommerce'
        }
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create Razorpay order');
    }

    const data = await response.json();

    res.json({
      success: true,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      merchant: MERCHANT_DETAILS
    });
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
