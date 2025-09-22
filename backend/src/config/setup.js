const pool = require('./database');
const bcrypt = require('bcrypt');

const setupDatabase = async () => {
  // Use a single client for the entire setup process
  const client = await pool.connect(); 
  try {
    console.log('🔄 Setting up database...');
    
    // ⚠️ WARNING: DROP TABLE is destructive and will delete all data. For development only.
    await client.query('DROP TABLE IF EXISTS posts CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');
    
    // ✅ CHANGE: Added a trigger function to automatically update 'updated_at' timestamps.
    await client.query(`
      CREATE OR REPLACE FUNCTION trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    // Create tables
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar VARCHAR(500),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        content TEXT NOT NULL,
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      -- ✅ CHANGE: Added triggers to the tables to use the function we created.
      CREATE TRIGGER set_timestamp_users
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();

      CREATE TRIGGER set_timestamp_posts
      BEFORE UPDATE ON posts
      FOR EACH ROW
      EXECUTE PROCEDURE trigger_set_timestamp();
      
      CREATE INDEX idx_posts_author_id ON posts(author_id);
      CREATE INDEX idx_users_email ON users(email);
    `);
    
    console.log('✅ Tables and triggers created successfully');
    
    // Insert demo data
    const demoPassword = await bcrypt.hash('demo123', 10);
    
    await client.query(`
      INSERT INTO users (name, email, password_hash, bio, avatar) VALUES
      ('Swarit', 'swarit@example.com', $1, 'Founder of SwaritTech - Innovating in the AI space.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Swarit'),
      ('Rutuja', 'rutuja@example.com', $1, 'Experienced Full Stack Developer, specializing in Node.js and React.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rutuja'),
      ('Shravani', 'shravani@example.com', $1, 'UI/UX Designer with a passion for creating beautiful user experiences.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shravani')
      ON CONFLICT (email) DO NOTHING;
    `, [demoPassword]);

    await client.query(`
      INSERT INTO posts (content, author_id, likes) VALUES
      ('Just launched a new AI-powered analytics dashboard! #AI #DataScience', (SELECT id FROM users WHERE email='swarit@example.com'), 25),
      ('Thrilled to share my latest article on optimizing React performance. #React', (SELECT id FROM users WHERE email='rutuja@example.com'), 18),
      ('Exploring new trends in responsive web design. #UIUX', (SELECT id FROM users WHERE email='shravani@example.com'), 10);
    `);

    console.log('✅ Demo data inserted successfully');
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
    // ✅ CHANGE: The script will now exit with an error code if it fails.
    process.exit(1); 
  } finally {
    await client.release(); // Release the client back to the pool
    // ✅ CHANGE: The script now only exits with success code after the try block completes.
    process.exit(0);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;