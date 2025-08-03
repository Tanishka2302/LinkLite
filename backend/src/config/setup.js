const pool = require('./database');
const bcrypt = require('bcrypt');

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up database...');
    
    // Create tables
    await pool.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      
      DROP TABLE IF EXISTS posts CASCADE;
      DROP TABLE IF EXISTS users CASCADE;
      
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar VARCHAR(500),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        content TEXT NOT NULL,
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
      CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `);
    
    console.log('✅ Tables created successfully');
    
    // Insert demo data
    const demoPassword = await bcrypt.hash('demo123', 10);
    
    // Locate this section in your setupDatabase.js file
await pool.query(`
  INSERT INTO users (name, email, password_hash, bio, avatar) VALUES
  ('Swarit', 'swarit@example.com', $1, 'Founder of SwaritTech - Innovating in the AI space. Always eager to connect and collaborate.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Swarit'),
  ('Rutuja', 'rutuja@example.com', $1, 'Experienced Full Stack Developer, specializing in Node.js and React. Building robust web applications.', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rutuja'),
  ('Shravani', 'shravani@example.com', $1, 'UI/UX Designer with a passion for creating intuitive and beautiful user experiences. Let''s build something great!', 'https://api.dicebear.com/7.x/avataaars/svg?seed=Shravani')
  ON CONFLICT (email) DO NOTHING;
`, [demoPassword]);

    // Insert demo posts
    // ... (rest of your setup.js file, including the updated INSERT INTO users) ...

// AFTER the INSERT INTO users block
// Make sure these email addresses match the emails you used in the INSERT INTO users statement
await pool.query(`
  INSERT INTO posts (content, author_id, likes) VALUES
  ('Just launched a new AI-powered analytics dashboard! Check out the live demo. #AI #DataScience', (SELECT id FROM users WHERE email='swarit@example.com'), 25),
  ('Thrilled to share my latest article on optimizing React performance with custom hooks. Feedback welcome! #React #Frontend', (SELECT id FROM users WHERE email='rutuja@example.com'), 18),
  ('Exploring new trends in responsive web design. What are your favorite CSS frameworks right now? #UIUX #WebDesign', (SELECT id FROM users WHERE email='shravani@example.com'), 10)
  ON CONFLICT DO NOTHING;
`);

// ... (rest of your setup.js file) ...

    console.log('✅ Demo data inserted successfully');
    console.log('🎉 Database setup complete!');
    
  } catch (error) {
    console.error('❌ Database setup error:', error);
  } finally {
    await pool.end();
    process.exit(0);
  }
};

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;