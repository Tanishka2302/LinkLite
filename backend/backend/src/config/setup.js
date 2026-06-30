const pool = require('./database');
const bcrypt = require('bcrypt');

const setupDatabase = async () => {
  const client = await pool.connect();

  try {
    console.log('🔄 Setting up database...');

    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      DROP TABLE IF EXISTS comments CASCADE;
      DROP TABLE IF EXISTS post_likes CASCADE;
      DROP TABLE IF EXISTS posts CASCADE;
      DROP TABLE IF EXISTS users CASCADE;

      DROP FUNCTION IF EXISTS trigger_set_timestamp();

      CREATE FUNCTION trigger_set_timestamp()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        bio TEXT,
        avatar TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE posts (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        content TEXT NOT NULL,
        media_url TEXT,
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        likes INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE post_likes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(post_id, user_id)
      );

      CREATE TABLE comments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        content TEXT NOT NULL,
        post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TRIGGER set_timestamp_users
      BEFORE UPDATE ON users
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_timestamp();

      CREATE TRIGGER set_timestamp_posts
      BEFORE UPDATE ON posts
      FOR EACH ROW
      EXECUTE FUNCTION trigger_set_timestamp();

      CREATE INDEX idx_users_email ON users(email);
      CREATE INDEX idx_posts_author_id ON posts(author_id);
      CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
      CREATE INDEX idx_comments_post_id ON comments(post_id);
    `);

    console.log('✅ Tables created');

    const password = await bcrypt.hash('demo123', 10);

    await client.query(
      `
      INSERT INTO users (name,email,password_hash,bio,avatar)
      VALUES
      ('Swarit','swarit@example.com',$1,'Founder of SwaritTech','https://api.dicebear.com/7.x/avataaars/svg?seed=Swarit'),
      ('Rutuja','rutuja@example.com',$1,'Full Stack Developer','https://api.dicebear.com/7.x/avataaars/svg?seed=Rutuja'),
      ('Shravani','shravani@example.com',$1,'UI UX Designer','https://api.dicebear.com/7.x/avataaars/svg?seed=Shravani');
      `,
      [password]
    );

    await client.query(`
      INSERT INTO posts(content,author_id,likes)
      VALUES
      (
        'Welcome to LinkLite 🚀',
        (SELECT id FROM users WHERE email='swarit@example.com'),
        15
      ),
      (
        'React + Node.js + PostgreSQL ❤️',
        (SELECT id FROM users WHERE email='rutuja@example.com'),
        20
      ),
      (
        'Working on UI improvements 🎨',
        (SELECT id FROM users WHERE email='shravani@example.com'),
        12
      );
    `);

    console.log('✅ Demo data inserted');
    console.log('🎉 Database setup completed successfully');

  } catch (err) {
    console.error(err);
  } finally {
    client.release();
    process.exit();
  }
};

if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;
