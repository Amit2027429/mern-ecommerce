import Product from '../models/productModel.js';

export const getProducts = async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;
  const keyword = req.query.search
    ? { name: { $regex: req.query.search, $options: 'i' } }
    : {};
  const category = req.query.category && req.query.category !== 'all'
    ? { category: req.query.category }
    : {};
  const sortBy = req.query.sort === 'price-asc'
    ? { price: 1 }
    : req.query.sort === 'price-desc'
    ? { price: -1 }
    : req.query.sort === 'rating'
    ? { rating: -1 }
    : { createdAt: -1 };

  const filter = { ...keyword, ...category };
  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .sort(sortBy)
    .skip(pageSize * (page - 1))
    .limit(pageSize);
  res.json({ products, page, pages: Math.ceil(count / pageSize), count });
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const createProduct = async (req, res) => {
  const product = new Product({
    name: req.body.name,
    description: req.body.description,
    category: req.body.category,
    brand: req.body.brand,
    price: req.body.price,
    countInStock: req.body.countInStock,
    image: req.body.image || '/uploads/default.png'
  });
  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
};

export const updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.countInStock = req.body.countInStock || product.countInStock;
    product.image = req.body.image || product.image;
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    await product.remove();
    res.json({ message: 'Product removed' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const addReview = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    const alreadyReviewed = product.reviews.find(
      (review) => review.user.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Product already reviewed' });
    }
    const review = {
      name: req.user.name,
      rating: Number(req.body.rating),
      comment: req.body.comment,
      user: req.user._id
    };
    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;
    await product.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
};

export const getCategories = async (req, res) => {
  const categories = await Product.distinct('category');
  res.json(categories);
};
