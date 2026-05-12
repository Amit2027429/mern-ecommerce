import Order from '../models/orderModel.js';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Validate and format order items
    const formattedItems = orderItems.map(item => {
      if (!item.name || !item.price || !item.image || !item.product || !item.qty) {
        throw new Error(`Invalid order item: missing required fields. Item: ${JSON.stringify(item)}`);
      }
      return {
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item.product
      };
    });

    const order = new Order({
      user: req.user._id,
      orderItems: formattedItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(400).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (order) res.json(order);
  else res.status(404).json({ message: 'Order not found' });
};

export const updateOrderToPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

export const getMyOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
};

export const getOrders = async (req, res) => {
  const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
  res.json(orders);
};

export const updateOrderToDelivered = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updated = await order.save();
    res.json(updated);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
};

export const createPaymentIntent = async (req, res) => {
  const { amount, currency = 'usd' } = req.body;
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency,
    payment_method_types: ['card']
  });
  res.json({ clientSecret: paymentIntent.client_secret });
};
export const cancelOrder = async (req, res) => {
  try {

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: 'Order not found'
      });
    }

    if (order.status === 'Delivered') {
      return res.status(400).json({
        message: 'Delivered orders cannot be cancelled'
      });
    }

    order.status = 'Cancelled';

    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
};
