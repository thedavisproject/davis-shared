// Evolved from: https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb
const crypto = require('crypto');
const R = require('ramda');

const IV_LENGTH = 16; // For AES, this is always 16

const encrypt = R.curry((key, text) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(key), iv);

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('base64') + ':' + encrypted.toString('base64');
});

const decrypt = R.curry((key, text) => {

  const textParts = text.split(':');
  const iv = new Buffer(textParts.shift(), 'base64');
  const encryptedText = new Buffer(textParts.join(':'), 'base64');
  const decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(key), iv);

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
});

module.exports = { decrypt, encrypt };
