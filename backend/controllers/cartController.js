import Cart from '../models/cartModel.js';

export const getCart = async (req, res) => {

  try {

    let cart = await Cart.findOne({
      user: req.user._id
    });

    if (!cart) {

      cart = await Cart.create({
        user: req.user._id,
        items: []
      });

    }

    res.json(cart);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

export const updateCart = async (req, res) => {

  try {

    const { items } = req.body;

    let cart = await Cart.findOneAndUpdate(
      {
        user: req.user._id
      },
      {
        items
      },
      {
        new: true,
        upsert: true
      }
    );

    res.json(cart);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};

export const clearCart = async (req, res) => {

  try {

    const cart = await Cart.findOne({
      user: req.user._id
    });

    if (cart) {

      cart.items = [];

      await cart.save();

    }

    res.json({
      message: 'Cart cleared'
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

};