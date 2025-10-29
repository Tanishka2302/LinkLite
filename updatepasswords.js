// hashPasswords.js
const pool = require('./config/database');
const bcrypt = require('bcrypt');

(async () => {
  try {
    const users = await pool.query('SELECT id, password FROM users;');

    for (const user of users.rows) {
      const current = user.password;

      // Skip if already hashed (starts with $2b$)
      if (current.startsWith('$2b$')) continue;

      const hashed = await bcrypt.hash(current, 10);
      await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, user.id]);
      console.log(`Hashed password for user id ${user.id}`);
    }

    console.log('✅ All passwords hashed.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
