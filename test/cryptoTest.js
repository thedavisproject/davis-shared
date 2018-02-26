const R = require('ramda');
const {expect} = require('chai');
const crypto = require('../src/crypto');
var randomstring = require('randomstring');

describe('Crypto', function(){

  const encoderDecoder = () => {
    const encryptKey = randomstring.generate(32);
    const validationKey = randomstring.generate(32);
    return [
      crypto.encode(encryptKey, validationKey),
      crypto.decode(encryptKey, validationKey)
    ];
  };

  it('should encode and decode successfully', function(){

    const payload = 'foobar';
    const [encode, decode] = encoderDecoder();

    const encoded = encode(payload);
    const decoded = decode(encoded);

    expect(decoded.isRight).to.be.true;
    expect(decoded.get()).to.equal(payload);
    expect(encoded).to.not.equal(payload);
  });

  it('should encode and decode objects', function(){

    const payload = {
      foo: 'bar'
    };

    const [encode, decode] = encoderDecoder();

    const encoded = encode(payload);
    const decoded = decode(encoded);

    expect(decoded.isRight).to.be.true;
    expect(decoded.get().foo).to.equal('bar');
  });

  it('encoded values should be seeded with random IV', function(){

    const text = 'foobar';
    const [encode1] = encoderDecoder();
    const [encode2] = encoderDecoder();

    const encoded1 = encode1(text);
    const encoded2 = encode2(text);

    expect(encoded1).to.not.equal(encoded2);
  });

  it('encrypt should throw for missing key', function(){

    const validationKey = randomstring.generate(32);

    expect(() => crypto.encode(null, validationKey, 'foo')).to.throw(/Encryption key not defined/);
    expect(() => crypto.encode('', validationKey, 'foo')).to.throw(/Encryption key not defined/);
  });

  it('hmac should throw for missing key', function(){

    const cryptoKey = randomstring.generate(32);

    expect(() => crypto.encode(cryptoKey, null, 'foo')).to.throw(/Validation key not defined/);
    expect(() => crypto.encode(cryptoKey, '', 'foo')).to.throw(/Validation key not defined/);
  });

  it('should error for bad encoded values structure', function(){

    const payload = 'foobar';
    const [encode, decode] = encoderDecoder();

    // Encode, then lop off the last part
    const encoded = encode(payload)
      .split('.')
      .slice(0, 2)
      .join('.');

    const decoded = decode(encoded);

    expect(decoded.isLeft).to.be.true;
    expect(decoded.merge()).to.match(/Invalid content. Must be in format IV.Ciphertext.HMAC/);
  });

  it('should error for bad iv', function(){

    const payload = 'foobar';
    const [encode, decode] = encoderDecoder();

    // Encode, then lop off the last part
    let encoded = encode(payload);
    // Inject non base64 character
    encoded = encoded.substring(2,encoded.length);

    const decoded = decode(encoded);

    expect(decoded.isLeft).to.be.true;
    expect(decoded.merge()).to.match(/Invalid content. IV is incorrect length./);
  });

  it('should error for tampered hmac', function(){

    const payload = 'foobar';
    const [encode, decode] = encoderDecoder();

    // Encode, then lop off the last part
    const encoded = encode(payload);

    const [iv, ct, hmac] = encoded.split('.');

    const badHmac = R.repeat('a', hmac.length).join('');
    const newEncoded = [iv, ct, badHmac].join('.');

    const decoded = decode(newEncoded);

    expect(decoded.isLeft).to.be.true;
    expect(decoded.merge()).to.match(/Invalid HMAC./);
  });

  it('should error for tampered ciphertext', function(){

    const payload = 'foobar';
    const [encode, decode] = encoderDecoder();

    // Encode, then lop off the last part
    const encoded = encode(payload);

    const [iv, ct, hmac] = encoded.split('.');

    const badCt = R.repeat('a', ct.length).join('');
    const newEncoded = [iv, badCt, hmac].join('.');

    const decoded = decode(newEncoded);

    expect(decoded.isLeft).to.be.true;
    expect(decoded.merge()).to.match(/Invalid HMAC./);
  });

  it('should error for tampered iv', function(){

    const payload = 'foobar';
    const [encode, decode] = encoderDecoder();

    // Encode, then lop off the last part
    const encoded = encode(payload);

    const [iv, ct, hmac] = encoded.split('.');

    const badIv = R.repeat('a', iv.length).join('');
    const newEncoded = [badIv, ct, hmac].join('.');

    const decoded = decode(newEncoded);

    expect(decoded.isLeft).to.be.true;
    expect(decoded.merge()).to.match(/Invalid HMAC./);
  });
});
