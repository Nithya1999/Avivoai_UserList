const axios = require('axios');
const { pool, initializeDatabase } = require('../config/database');
require('dotenv').config();

/**
 * Fetch users from DummyJSON API and seed the database
 */
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Initialize database first
    await initializeDatabase();
    
    // Check if users already exist
    const [existingUsers] = await pool.execute('SELECT COUNT(*) as count FROM users');
    
    if (existingUsers[0].count > 0) {
      console.log(`📊 Database already contains ${existingUsers[0].count} users`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise((resolve) => {
        readline.question('Do you want to clear existing data and reseed? (y/N): ', resolve);
      });
      
      readline.close();
      
      if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
        console.log('❌ Seeding cancelled');
        return;
      }
      
      // Clear existing data
      await pool.execute('DELETE FROM users');
      console.log('🗑️  Existing data cleared');
    }
    
    // Fetch users from DummyJSON API
    console.log('📡 Fetching users from DummyJSON API...');
    const response = await axios.get('https://dummyjson.com/users?limit=0');
    const users = response.data.users;
    
    console.log(`📥 Fetched ${users.length} users from API`);
    
    // Prepare insert query
    const insertQuery = `
      INSERT INTO users (
        firstName, lastName, email, phone, username, password, birthDate, image,
        bloodGroup, height, weight, eyeColor, hair_color, hair_type, domain, ip,
        macAddress, university,
        address_address, address_city, address_coordinates_lat, address_coordinates_lng,
        address_postalCode, address_state, address_country,
        bank_cardExpire, bank_cardNumber, bank_cardType, bank_currency, bank_iban,
        company_department, company_name, company_title,
        company_address_address, company_address_city, company_address_coordinates_lat,
        company_address_coordinates_lng, company_address_postalCode, company_address_state,
        company_address_country,
        crypto_coin, crypto_wallet, crypto_network
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    let successCount = 0;
    let errorCount = 0;
    
    // Insert users one by one to handle errors gracefully
    for (const user of users) {
      try {
        const values = [
          user.firstName || null,
          user.lastName || null,
          user.email || null,
          user.phone || null,
          user.username || null,
          user.password || null, // In real app, this should be hashed
          user.birthDate || null,
          user.image || null,
          user.bloodGroup || null,
          user.height || null,
          user.weight || null,
          user.eyeColor || null,
          user.hair?.color || null,
          user.hair?.type || null,
          user.domain || null,
          user.ip || null,
          user.macAddress || null,
          user.university || null,
          user.address?.address || null,
          user.address?.city || null,
          user.address?.coordinates?.lat || null,
          user.address?.coordinates?.lng || null,
          user.address?.postalCode || null,
          user.address?.state || null,
          user.address?.country || null,
          user.bank?.cardExpire || null,
          user.bank?.cardNumber || null,
          user.bank?.cardType || null,
          user.bank?.currency || null,
          user.bank?.iban || null,
          user.company?.department || null,
          user.company?.name || null,
          user.company?.title || null,
          user.company?.address?.address || null,
          user.company?.address?.city || null,
          user.company?.address?.coordinates?.lat || null,
          user.company?.address?.coordinates?.lng || null,
          user.company?.address?.postalCode || null,
          user.company?.address?.state || null,
          user.company?.address?.country || null,
          user.crypto?.coin || null,
          user.crypto?.wallet || null,
          user.crypto?.network || null
        ];
        
        await pool.execute(insertQuery, values);
        successCount++;
        
        if (successCount % 10 === 0) {
          console.log(`📝 Inserted ${successCount}/${users.length} users...`);
        }
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error inserting user ${user.firstName} ${user.lastName}:`, error.message);
      }
    }
    
    console.log('\n🎉 Database seeding completed!');
    console.log(`✅ Successfully inserted: ${successCount} users`);
    if (errorCount > 0) {
      console.log(`❌ Failed to insert: ${errorCount} users`);
    }
    
    // Verify the data
    const [finalCount] = await pool.execute('SELECT COUNT(*) as count FROM users');
    console.log(`📊 Total users in database: ${finalCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error.message);
    throw error;
  }
};

/**
 * Add some additional sample users for testing
 */
const addSampleUsers = async () => {
  try {
    console.log('👥 Adding sample test users...');
    
    const sampleUsers = [
      {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1-555-0123',
        username: 'johndoe',
        password: 'password123',
        company_name: 'Tech Solutions Inc',
        company_title: 'Software Engineer',
        address_country: 'United States',
        address_city: 'New York',
        address_address: '123 Main St'
      },
      {
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane.smith@example.com',
        phone: '+1-555-0124',
        username: 'janesmith',
        password: 'password123',
        company_name: 'Design Studio',
        company_title: 'UI/UX Designer',
        address_country: 'Canada',
        address_city: 'Toronto',
        address_address: '456 Queen St'
      },
      {
        firstName: 'Mike',
        lastName: 'Johnson',
        email: 'mike.johnson@example.com',
        phone: '+44-20-1234-5678',
        username: 'mikej',
        password: 'password123',
        company_name: 'Global Corp',
        company_title: 'Project Manager',
        address_country: 'United Kingdom',
        address_city: 'London',
        address_address: '789 Oxford St'
      }
    ];
    
    const insertQuery = `
      INSERT INTO users (
        firstName, lastName, email, phone, username, password,
        company_name, company_title, address_country, address_city, address_address
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    for (const user of sampleUsers) {
      try {
        await pool.execute(insertQuery, [
          user.firstName,
          user.lastName,
          user.email,
          user.phone,
          user.username,
          user.password,
          user.company_name,
          user.company_title,
          user.address_country,
          user.address_city,
          user.address_address
        ]);
        
        console.log(`✅ Added sample user: ${user.firstName} ${user.lastName}`);
      } catch (error) {
        console.log(`⚠️  Sample user ${user.firstName} ${user.lastName} might already exist`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error adding sample users:', error.message);
  }
};

/**
 * Main seeding function
 */
const main = async () => {
  try {
    await seedDatabase();
    await addSampleUsers();
    
    console.log('\n🚀 Database is ready! You can now start the server with:');
    console.log('npm run dev');
    
  } catch (error) {
    console.error('❌ Seeding process failed:', error.message);
    process.exit(1);
  } finally {
    // Close database connection
    try {
      await pool.end();
      console.log('🔌 Database connection closed');
    } catch (error) {
      console.error('Error closing database connection:', error.message);
    }
  }
};

// Run the seeding if this file is executed directly
if (require.main === module) {
  main();
}

module.exports = {
  seedDatabase,
  addSampleUsers
};
