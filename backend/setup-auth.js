const db = require('./db');
const bcrypt = require('bcryptjs');

// Create users table if it doesn't exist
const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(128) NOT NULL Unique,
    password VARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

// Insert default admin user if none exists
const setupAuth = async () => {
  try {
    console.log('Setting up authentication...');
    
    // Create users table
    db.query(createUsersTable, (err) => {
      if (err) {
        console.error('Error creating users table:', err);
        return;
      }
      console.log('Users table created/verified');
      
      // Check if any users exist
      db.query('SELECT COUNT(*) as count FROM users', async (err, result) => {
        if (err) {
          console.error('Error checking users:', err);
          return;
        }
        
        if (result[0].count === 0) {
          // Create default admin user
          const hashedPassword = await bcrypt.hash('admin123', 10);
          db.query(
            'INSERT INTO users (email, password) VALUES (?, ?)',
            ['admin@example.com', hashedPassword],
            (err) => {
              if (err) {
                console.error('Error creating default user:', err);
                return;
              }
              console.log('Default admin user created:');
              console.log('Email: admin@example.com');
              console.log('Password: admin123');
            }
          );
        } else {
          console.log('Users already exist in database');
        }
      });
    });
  } catch (error) {
    console.error('Error setting up auth:', error);
  }
};

module.exports = setupAuth;

// Run setup if called directly
if (require.main === module) {
  setupAuth();
}
