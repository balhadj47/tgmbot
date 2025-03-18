const { query } = require('./database');

// In-memory products for development
const products = [
  {
    id: 1,
    name: 'Virtual Phone Number (US)',
    description: 'Get a virtual US phone number for verification purposes. Valid for 30 days.',
    price: 5.0,
    category: 'Phone Numbers',
    stock: 10,
    image_url: '',
    active: true
  },
  {
    id: 2,
    name: 'Virtual Phone Number (UK)',
    description: 'Get a virtual UK phone number for verification purposes. Valid for 30 days.',
    price: 6.0,
    category: 'Phone Numbers',
    stock: 8,
    image_url: '',
    active: true
  },
  {
    id: 3,
    name: 'Virtual Phone Number (Canada)',
    description: 'Get a virtual Canadian phone number for verification purposes. Valid for 30 days.',
    price: 5.5,
    category: 'Phone Numbers',
    stock: 12,
    image_url: '',
    active: true
  }
];

// Get all products
async function getAllProducts() {
  try {
    // In a real implementation, this would query the database
    // const [rows] = await query('SELECT * FROM products WHERE active = TRUE');
    // return rows;
    
    // For development, return the in-memory products
    return products;
  } catch (error) {
    console.error('Error getting products:', error);
    return [];
  }
}

// Get product by ID
async function getProductById(productId) {
  try {
    // In a real implementation, this would query the database
    // const [rows] = await query('SELECT * FROM products WHERE id = ?', [productId]);
    // return rows[0] || null;
    
    // For development, return the in-memory product
    return products.find(p => p.id === productId) || null;
  } catch (error) {
    console.error('Error getting product:', error);
    return null;
  }
}

// Purchase a product
async function purchaseProduct(userId, productId) {
  try {
    // Get user balance
    const [userRows] = await query('SELECT balance FROM users WHERE user_id = ?', [userId]);
    
    if (userRows.length === 0) {
      throw new Error('User not found');
    }
    
    const userBalance = userRows[0].balance || 0;
    
    // Get product
    const product = await getProductById(productId);
    
    if (!product) {
      throw new Error('Product not found');
    }
    
    // Check if product is in stock
    if (product.stock <= 0) {
      throw new Error('Product out of stock');
    }
    
    // Check if user has enough balance
    if (userBalance < product.price) {
      throw new Error('Insufficient balance');
    }
    
    // Generate a random phone number for demonstration
    const phoneNumber = `+${Math.floor(Math.random() * 9) + 1}${Math.random().toString().slice(2, 11)}`;
    
    // In a real implementation, these would be database transactions
    // 1. Deduct balance from user
    await query(
      'UPDATE users SET balance = balance - ? WHERE user_id = ?',
      [product.price, userId]
    );
    
    // 2. Reduce product stock
    await query(
      'UPDATE products SET stock = stock - 1 WHERE id = ?',
      [productId]
    );
    
    // 3. Create number record
    await query(
      'INSERT INTO numbers (user_id, product_id, phone_number, expiry_date) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
      [userId, productId, phoneNumber]
    );
    
    // For development, update the in-memory product stock
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
      products[productIndex].stock -= 1;
    }
    
    return {
      success: true,
      phoneNumber
    };
  } catch (error) {
    console.error('Error purchasing product:', error);
    throw error;
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  purchaseProduct
};
