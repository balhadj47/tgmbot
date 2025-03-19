const { db } = require('./database');

// Get all products
async function getAllProducts() {
  return db.products;
}

// Get product by ID
async function getProductById(id) {
  return db.products.find(product => product.id === id);
}

// Purchase product
async function purchaseProduct(userId, productId) {
  // Find user
  const user = db.users.find(u => u.id === userId);
  if (!user) {
    throw new Error('User not found');
  }
  
  // Find product
  const product = db.products.find(p => p.id === productId);
  if (!product) {
    throw new Error('Product not found');
  }
  
  // Check stock
  if (product.stock <= 0) {
    throw new Error('Product is out of stock');
  }
  
  // Calculate total balance (mock for development)
  const totalBalance = 1000; // Mock balance
  
  // Check if user has enough balance
  if (totalBalance < product.price) {
    throw new Error('Insufficient balance');
  }
  
  // Create order
  const order = {
    id: db.orders.length + 1,
    userId,
    productId,
    price: product.price,
    timestamp: new Date()
  };
  
  // Update product stock
  product.stock -= 1;
  
  // Save order
  db.orders.push(order);
  
  return order;
}

module.exports = {
  getAllProducts,
  getProductById,
  purchaseProduct
};
