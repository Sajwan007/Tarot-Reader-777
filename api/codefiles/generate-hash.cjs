const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function generateHash() {
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);
  console.log('Password:', password);
  console.log('Hash:', hash);
  
  // Generate a random JWT secret
  const jwtSecret = crypto.randomBytes(64).toString('hex');
  console.log('JWT Secret:', jwtSecret);
}

generateHash().catch(console.error);
