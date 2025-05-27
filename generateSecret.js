const crypto = require('crypto');

// Generate a 32-byte random string, then encode it in base64 or hex
// 32 bytes = 256 bits. Base64 will make it ~43 chars, Hex will make it 64 chars.
const apiKey = crypto.randomBytes(32).toString('hex');
console.log(apiKey);
