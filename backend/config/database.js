const mysql = require('mysql2/promise');
require('dotenv').config();

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'nithya',
  database: process.env.DB_NAME || 'user_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Remove invalid options for mysql2
  charset: 'utf8mb4'
};

// Create connection pool for better performance
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    return false;
  }
};

// Initialize database and create tables if they don't exist
const initializeDatabase = async () => {
  try {
    const connection = await pool.getConnection();
    
    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\``);
    // await connection.execute(`USE \`${dbConfig.database}\``);
    
    // Create users table with comprehensive schema matching DummyJSON structure
    const createUsersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        firstName VARCHAR(100) NOT NULL,
        lastName VARCHAR(100) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20),
        username VARCHAR(100) UNIQUE,
        password VARCHAR(255),
        birthDate DATE,
        image VARCHAR(500),
        bloodGroup VARCHAR(10),
        height DECIMAL(5,2),
        weight DECIMAL(5,2),
        eyeColor VARCHAR(50),
        hair_color VARCHAR(50),
        hair_type VARCHAR(50),
        domain VARCHAR(100),
        ip VARCHAR(45),
        macAddress VARCHAR(17),
        university VARCHAR(200),
        
        -- Address information
        address_address VARCHAR(255),
        address_city VARCHAR(100),
        address_coordinates_lat DECIMAL(10, 8),
        address_coordinates_lng DECIMAL(11, 8),
        address_postalCode VARCHAR(20),
        address_state VARCHAR(100),
        address_country VARCHAR(100),
        
        -- Bank information
        bank_cardExpire VARCHAR(10),
        bank_cardNumber VARCHAR(20),
        bank_cardType VARCHAR(50),
        bank_currency VARCHAR(10),
        bank_iban VARCHAR(50),
        
        -- Company information
        company_department VARCHAR(100),
        company_name VARCHAR(200),
        company_title VARCHAR(150),
        company_address_address VARCHAR(255),
        company_address_city VARCHAR(100),
        company_address_coordinates_lat DECIMAL(10, 8),
        company_address_coordinates_lng DECIMAL(11, 8),
        company_address_postalCode VARCHAR(20),
        company_address_state VARCHAR(100),
        company_address_country VARCHAR(100),
        
        -- Crypto information
        crypto_coin VARCHAR(50),
        crypto_wallet VARCHAR(100),
        crypto_network VARCHAR(50),
        
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_email (email),
        INDEX idx_username (username),
        INDEX idx_name (firstName, lastName),
        INDEX idx_company (company_name),
        INDEX idx_country (address_country)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await connection.execute(createUsersTable);
    console.log('✅ Users table created or verified successfully');
    
    connection.release();
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    throw error;
  }
};

// Graceful shutdown
const closePool = async () => {
  try {
    await pool.end();
    console.log('Database pool closed');
  } catch (error) {
    console.error('Error closing database pool:', error.message);
  }
};

module.exports = {
  pool,
  testConnection,
  initializeDatabase,
  closePool
};
