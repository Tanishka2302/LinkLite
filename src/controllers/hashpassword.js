const bcrypt = require('bcrypt');

async function hashPassword() {
  const plainPassword = "123456"; // the password you want for existing users
  const hashed = await bcrypt.hash(plainPassword, 10);
  console.log("Hashed password:", hashed);
}

hashPassword();
