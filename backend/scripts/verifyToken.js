const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const token = process.argv[2];
if (!token) {
  console.error('Usage: node verifyToken.js <token>');
  process.exit(2);
}

const secret = process.env.JWT_SECRET || 'super-secret-key';

try {
  const payload = jwt.verify(token, secret);
  console.log('VERIFIED');
  console.log(JSON.stringify(payload, null, 2));
} catch (err) {
  console.error('VERIFY_ERROR');
  console.error(err && err.message ? err.message : err);
  process.exit(1);
}