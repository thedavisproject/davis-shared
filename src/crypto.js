// Evolved from:
//  https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb
//  AND
//  https://github.com/mozilla/node-client-sessions

const crypto = require('crypto');
const R = require('ramda');
const Either = require('data.either');
const base64 = require('base64url');

const encryptionAlgorithm = 'aes-256-cbc';
const hmacAlgorithm = 'sha256';

// IV length in Bytes
const ivLength = 16;

const encrypt = R.curry((key, iv, plainText) => {

  if(!key || key === ''){
    throw new Error('Encryption key not defined');
  }

  const cipher = crypto.createCipheriv(
    encryptionAlgorithm,
    new Buffer(key),
    iv);

  let encrypted = cipher.update(plainText);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return encrypted;
});

const computeHmac = R.curry((key, iv, cipherText) => {

  if(!key || key === ''){
    throw new Error('Validation key not defined');
  }

  const hmacAlg = crypto.createHmac(hmacAlgorithm, key);

  hmacAlg.update(iv);
  hmacAlg.update('.');
  hmacAlg.update(cipherText);

  return hmacAlg.digest();
});

const encode = R.curry((encryptionKey, validationKey, payload) => {

  const iv = crypto.randomBytes(16);
  const plainText = new Buffer(JSON.stringify(payload), 'utf8');
  const cipherText = encrypt(encryptionKey, iv, plainText);
  const hmac = computeHmac(validationKey, iv, cipherText);

  return [
    base64.encode(iv),
    base64.encode(cipherText),
    base64.encode(hmac)
  ].join('.');
});

const decode = R.curry((encryptionKey, validationKey, content) => {

  const components = content.split('.');

  if(components.length !== 3){
    return Either.Left('Invalid content. Must be in format IV.Ciphertext.HMAC');
  }

  let iv, cipherText, hmac;

  try {
    [iv, cipherText, hmac] = components.map(c => base64.toBuffer(c));
  } catch(e){
    return Either.Left('Invalid content. Could not base64 decode components.');
  }

  if(iv.length !== ivLength){
    return Either.Left('Invalid content. IV is incorrect length.');
  }

  const expectedHmac = computeHmac(validationKey, iv, cipherText);

  if(!crypto.timingSafeEqual(expectedHmac, hmac)){
    return Either.Left('Invalid HMAC.');
  }

  const decipher = crypto.createDecipheriv(
    encryptionAlgorithm,
    new Buffer(encryptionKey),
    iv);

  let plainText = decipher.update(cipherText, 'binary', 'utf8');
  plainText += decipher.final('utf8');

  try {
    return Either.Right(JSON.parse(plainText));
  }
  catch(e){
    return Either.Left('Invalid JSON payload: ${plainText}');
  }
});

module.exports = { encode, decode };
