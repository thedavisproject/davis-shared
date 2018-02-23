const {expect} = require('chai');
const crypto = require('../src/crypto');
var randomstring = require('randomstring');

describe('Crypto', function(){

  it('should encrypt and decrypt successfully', function(){
    const text = 'foobar';
    const key = randomstring.generate(32);
    const encrypted = crypto.encrypt(key, text);
    const decrypted = crypto.decrypt(key, encrypted);

    expect(decrypted).to.equal(text);
    expect(encrypted).to.not.equal(text);
  });

  it('encrypted values should be seeded with random IV', function(){

    const text = 'foobar';
    const key = randomstring.generate(32);

    const encrypted1 = crypto.encrypt(key, text);
    const encrypted2 = crypto.encrypt(key, text);

    expect(encrypted1).to.not.equal(encrypted2);
  });

  it('encrypt should throw for missing key', function(){
    expect(() => crypto.encrypt(null, 'foo')).to.throw(/Encryption key not defined/);
    expect(() => crypto.encrypt('', 'foo')).to.throw(/Encryption key not defined/);
  });

  it('encrypt should throw for missing key', function(){
    expect(() => crypto.decrypt(null, 'foo')).to.throw(/Encryption key not defined/);
    expect(() => crypto.decrypt('', 'foo')).to.throw(/Encryption key not defined/);
  });

});
