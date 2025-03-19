// In-memory database for development
const db = {
  users: [],
  products: [],
  orders: [],
  deposits: []
};

async function setupDatabase() {
  console.log('Using in-memory database for development');
  
  // Add some sample products
  if (db.products.length === 0) {
    db.products.push(
      { id: 1, name: 'Product 1', price: 10, description: 'Description for product 1', stock: 10 },
      { id: 2, name: 'Product 2', price: 20, description: 'Description for product 2', stock: 5 },
      { id: 3, name: 'Product 3', price: 30, description: 'Description for product 3', stock: 3 }
    );
  }
  
  return db;
}

module.exports = {
  setupDatabase,
  db
};
