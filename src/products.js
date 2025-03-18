const { query } = require('./database');

// Get all active products
async function getAllProducts() {
  try {
    const [rows] = await query(
      'SELECT * FROM products WHERE active = TRUE ORDER BY category, price'
    );
    return rows;
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
}

// Get product by ID
async function getProductById(productId) {
  try {
    const [rows] = await query(
      'SELECT * FROM products WHERE id = ? AND active = TRUE',
      [productId]
    );
    return rows[0];
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
}

// Get products by category
async function getProductsByCategory(category) {
  try {
    const [rows] = await query(
      'SELECT * FROM products WHERE category = ? AND active = TRUE ORDER BY price',
      [category]
    );
    return rows;
  } catch (error) {
    console.error('Error getting products by category:', error);
    throw error;
  }
}

// Add a new product
async function addProduct(productData) {
  try {
    const { name, description, price, category, stock, imageUrl } = productData;
    
    const [result] = await query(
      'INSERT INTO products (name, description, price, category, stock, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [name, description, price, category, stock, imageUrl]
    );
    
    return result.insertId;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
}

// Update product stock
async function updateProductStock(productId, newStock) {
  try {
    await query(
      'UPDATE products SET stock = ? WHERE id = ?',
      [newStock, productId]
    );
  } catch (error) {
    console.error('Error updating product stock:', error);
    throw error;
  }
}

// Purchase a product
async function purchaseProduct(userId, productId) {
  try {
    // Start transaction
    await query('START TRANSACTION');
    
    // Get product details
    const [productRows] = await query(
      'SELECT * FROM products WHERE id = ? AND active = TRUE',
      [productId]
    );
    
    if (productRows.length === 0) {
      await query('ROLLBACK');
      throw new Error('Product not found or inactive');
    }
    
    const product = productRows[0];
    
    // Check stock
    if (product.stock <= 0) {
      await query('ROLLBACK');
      throw new Error('Product out of stock');
    }
    
    // Get user balance
    const [userRows] = await query(
      'SELECT balance FROM users WHERE user_id = ?',
      [userId]
    );
    
    if (userRows.length === 0) {
      await query('ROLLBACK');
      throw new Error('User not found');
    }
    
    const user = userRows[0];
    
    // Check if user has enough balance
    if (user.balance < product.price) {
      await query('ROLLBACK');
      throw new Error('Insufficient balance');
    }
    
    // Update user balance
    await query(
      'UPDATE users SET balance = balance - ? WHERE user_id = ?',
      [product.price, userId]
    );
    
    // Update product stock
    await query(
      'UPDATE products SET stock = stock - 1 WHERE id = ?',
      [productId]
    );
    
    // Create a record in numbers table (assuming this is for phone numbers or similar products)
    // In a real application, you might generate or assign a specific number here
    const phoneNumber = generateRandomNumber(); // Implement this function based on your needs
    
    await query(
      'INSERT INTO numbers (user_id, product_id, phone_number, expiry_date) VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 30 DAY))',
      [userId, productId, phoneNumber]
    );
    
    // Commit transaction
    await query('COMMIT');
    
    return {
      success: true,
      product,
      phoneNumber
    };
  } catch (error) {
    // Rollback transaction on error
    await query('ROLLBACK');
    console.error('Error purchasing product:', error);
    throw error;
  }
}

// Helper function to generate a random phone number
// This is just a placeholder - implement according to your actual requirements
function generateRandomNumber() {
  return '+' + Math.floor(Math.random() * 9000000000 + 1000000000);
}

// Get user's purchased numbers
async function getUserNumbers(userId) {
  try {
    const [rows] = await query(
      `SELECT n.*, p.name as product_name, p.description as product_description 
       FROM numbers n 
       JOIN products p ON n.product_id = p.id 
       WHERE n.user_id = ? 
       ORDER BY n.purchase_date DESC`,
      [userId]
    );
    return rows;
  } catch (error) {
    console.error('Error getting user numbers:', error);
    throw error;
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductsByCategory,
  addProduct,
  updateProductStock,
  purchaseProduct,
  getUserNumbers
};
