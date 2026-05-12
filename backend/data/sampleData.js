// Product data generator for 1000 products with diverse categories
const categories = ['Electronics', 'Footwear', 'Accessories', 'Kitchen', 'Beauty', 'Fitness', 'Books', 'Home Decor', 'Sports', 'Clothing'];
const brands = ['StrideX', 'EchoSphere', 'Aurora', 'Roamer', 'Visionary', 'CookCraft', 'PureGlow', 'IronFlex', 'PageTurner', 'CozyNest', 'TechZone', 'StyleMax', 'FitPro', 'NatureBlend', 'ProElite'];

const productNameTemplates = {
  Electronics: ['Smart {type}', 'Premium {type}', '4K {type}', 'Wireless {type}', 'Digital {type}'],
  Footwear: ['{Brand} {type} Shoes', 'Professional {type} Boots', 'Casual {type} Sneakers', 'Sports {type}'],
  Accessories: ['{type} Backpack', '{Brand} {type} Bag', 'Leather {type}', 'Professional {type}'],
  Kitchen: ['{Brand} {type} Set', 'Non-stick {type}', 'Stainless Steel {type}', 'Premium {type}'],
  Beauty: ['Organic {type}', '{Brand} {type} Kit', 'Natural {type}', 'Professional {type}'],
  Fitness: ['{Brand} {type} Set', 'Adjustable {type}', 'Pro {type}', 'Heavy Duty {type}'],
  Books: ['{type} Novel', 'Bestselling {type}', '{type} - Complete Guide', '{type} Handbook'],
  'Home Decor': ['{Brand} {type}', 'Handwoven {type}', 'Modern {type}', 'Decorative {type}'],
  Sports: ['{Brand} {type} Kit', 'Professional {type}', 'Sports {type}', 'Training {type}'],
  Clothing: ['{Brand} {type}', 'Premium {type}', 'Casual {type}', 'Formal {type}']
};

const descriptions = {
  Electronics: 'High-quality electronic device with cutting-edge technology and premium features.',
  Footwear: 'Comfortable and stylish footwear designed for daily wear and performance.',
  Accessories: 'Versatile accessory perfect for travel, work, and everyday use.',
  Kitchen: 'Durable kitchen item designed for modern cooking and food preparation.',
  Beauty: 'Premium beauty and skincare product made with natural ingredients.',
  Fitness: 'Professional fitness equipment designed for effective workouts.',
  Books: 'Engaging and informative book with compelling content.',
  'Home Decor': 'Beautiful decorative item to enhance your living space.',
  Sports: 'High-performance sports equipment for athletes and enthusiasts.',
  Clothing: 'Quality clothing piece with style and comfort.'
};

function generateProducts(count = 1000) {
  const products = [];
  const typeVariations = {
    Electronics: ['Speaker', 'Headphones', 'TV', 'Tablet', 'Smartwatch', 'Camera', 'Lamp', 'Monitor', 'Keyboard', 'Mouse'],
    Footwear: ['Running', 'Casual', 'Sports', 'Winter', 'Summer', 'Formal', 'Hiking', 'Basketball', 'Tennis', 'Training'],
    Accessories: ['Travel', 'Office', 'Laptop', 'Camera', 'Sports', 'Crossbody', 'Messenger', 'Rolling', 'Waterproof', 'Gaming'],
    Kitchen: ['Cookware', 'Utensil', 'Blender', 'Toaster', 'Mixer', 'Knife', 'Pan', 'Pot', 'Skillet', 'Colander'],
    Beauty: ['Skincare', 'Makeup', 'Haircare', 'Wellness', 'Face Mask', 'Serum', 'Moisturizer', 'Cleanser', 'Toner', 'Oil'],
    Fitness: ['Dumbbell', 'Yoga Mat', 'Resistance Band', 'Jump Rope', 'Kettlebell', 'Barbell', 'Foam Roller', 'Ab Wheel', 'Pull-up Bar', 'Bench'],
    Books: ['Mystery', 'Sci-Fi', 'Romance', 'Fantasy', 'Thriller', 'Biography', 'Self-Help', 'History', 'Science', 'Business'],
    'Home Decor': ['Throw Pillow', 'Wall Art', 'Lamp', 'Rug', 'Curtains', 'Mirror', 'Vase', 'Plant Pot', 'Wall Shelf', 'Clock'],
    Sports: ['Baseball', 'Basketball', 'Soccer', 'Tennis', 'Volleyball', 'Badminton', 'Skateboard', 'Bicycle', 'Swimming', 'Running'],
    Clothing: ['T-Shirt', 'Jeans', 'Jacket', 'Sweater', 'Dress', 'Pants', 'Shorts', 'Hoodie', 'Blazer', 'Shirt']
  };

  for (let i = 1; i <= count; i++) {
    const category = categories[Math.floor(Math.random() * categories.length)];
    const brand = brands[Math.floor(Math.random() * brands.length)];
    const typeOptions = typeVariations[category] || ['Item'];
    const type = typeOptions[Math.floor(Math.random() * typeOptions.length)];
    
    const price = parseFloat((Math.random() * 500 + 10).toFixed(2));
    const countInStock = Math.floor(Math.random() * 100) + 5;
    const rating = parseFloat((Math.random() * 2 + 3).toFixed(1));
    const numReviews = Math.floor(Math.random() * 200);
    
    // Generate image URL using placeholder service with unique identifier
    const imageId = Math.floor(Math.random() * 200) + 1;
    const imageUrl = `https://picsum.photos/300/300?random=${i}`;
    
    const productName = `${brand} ${type} - Product ${i}`;

    products.push({
      name: productName,
      category,
      brand,
      price,
      countInStock,
      rating: Math.min(rating, 5),
      numReviews,
      description: `${descriptions[category]} High-quality product #${i} with excellent performance.`,
      image: imageUrl
    });
  }

  return products;
}

const products = generateProducts(1000);

export default products;
