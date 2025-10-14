const pool = require('./db');

const createTables = async () => {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        user_id VARCHAR(255) PRIMARY KEY,
        password VARCHAR(255),
        name VARCHAR(255)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        blog_id SERIAL PRIMARY KEY,
        creator_name VARCHAR(255),
        creator_user_id VARCHAR(255) REFERENCES users(user_id),
        title VARCHAR(255),
        body TEXT,
        date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Tables created successfully.');

    // Insert sample users
    await pool.query(`
      INSERT INTO users (user_id, password, name) VALUES
      ('alice123', 'password123', 'Alice'),
      ('bob456', 'securepass', 'Bob'),
      ('charlie789', 'mypassword', 'Charlie')
      ON CONFLICT (user_id) DO NOTHING;
    `);

    // Insert sample blogs
    await pool.query(`
      INSERT INTO blogs (creator_name, creator_user_id, title, body) VALUES
      ('Alice', 'alice123', 'Welcome to My Blog', 'This is my first post!'),
      ('Bob', 'bob456', 'Tech Tips', 'How to optimize your workflow...'),
      ('Charlie', 'charlie789', 'Travel Diary', 'Exploring the Rockies...'),
      ('Alice', 'alice123', 'Node.js Tricks', 'Let’s talk about middleware...'),
      ('Bob', 'bob456', 'Express Routing', 'Understanding route chaining...')
    ON CONFLICT DO NOTHING;
    `);

    console.log('Sample data inserted.');
  } catch (err) {
    console.error('❌ Error creating tables or inserting data:', err);
  } finally {
    pool.end();
  }
};

createTables();
