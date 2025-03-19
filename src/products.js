// Product management functionality
const { getAllProducts: dbGetAllProducts, getProductById: dbGetProductById } = require('./database');

// Get all products
async function getAllProducts() {
  try {
    return dbGetAllProducts();
  } catch (error) {
    console.error('Error getting all products:', error);
    return [];
  }
}

// Get product by ID
async function getProductById(id) {
  try {
    return dbGetProductById(id);
  } catch (error) {
    console.error(`Error getting product with ID ${id}:`, error);
    return null;
  }
}

module.exports = {
  getAllProducts,
  getProductById
};
