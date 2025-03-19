// Database setup and operations
const fs = require('fs');
const path = require('path');

// Mock database for development
const DB_FILE = path.join(__dirname, '../data/db.json');
let db = {
  users: [],
  products: [],
  orders: [],
  transactions: []
};

// Setup database
async function setupDatabase() {
  try {
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Load database from file if it exists
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      db = JSON.parse(data);
      console.log('Database loaded from file');
    } else {
      // Initialize with sample data
      initializeSampleData();
      saveDatabase();
      console.log('Database initialized with sample data');
    }
    
    return true;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}

// Save database to file
function saveDatabase() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error saving database:', error);
    return false;
  }
}

// Initialize sample data
function initializeSampleData() {
  // Sample products
  db.products = [
    {
      id: 1,
      name: 'Digital Product 1',
      description: 'This is a digital product description',
      price: 10.0,
      category: 'digital',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'Digital Product 2',
      description: 'Another digital product description',
      price: 20.0,
      category: 'digital',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 3,
      name: 'Physical Product 1',
      description: 'This is a physical product description',
      price: 30.0,
      category: 'physical',
      image: 'https://via.placeholder.com/150'
    }
  ];
}

// Get all products
function getAllProducts() {
  return db.products;
}

// Get product by ID
function getProductById(id) {
  return db.products.find(product => product.id === id);
}

// Add user
function addUser(user) {
  const existingUser = db.users.find(u => u.id === user.id);
  if (existingUser) {
    return existingUser;
  }
  
  db.users.push(user);
  saveDatabase();
  return user;
}

// Get user by ID
function getUserById(id) {
  return db.users.find(user => user.id === id);
}

module.exports = {
  setupDatabase,
  getAllProducts,
  getProductById,
  addUser,
  getUserById
};
