const {expect} = require('chai');
const string = require('../src/string');

describe('Is Nil or Empty', function(){

  it('should pass for null', function(){
    expect(string.isNilOrEmpty(null)).to.be.true;
  });

  it('should pass for undefined', function(){
    expect(string.isNilOrEmpty(undefined)).to.be.true;
  });

  it('should pass for empty', function(){
    expect(string.isNilOrEmpty('')).to.be.true;
  });

  it('should fail for string', function(){
    expect(string.isNilOrEmpty('any string')).to.be.false;
  });
});

describe('Is not Nil or Empty', function(){

  it('should fail for null', function(){
    expect(string.isNotNilOrEmpty(null)).to.be.false;
  });

  it('should fail for undefined', function(){
    expect(string.isNotNilOrEmpty(undefined)).to.be.false;
  });

  it('should faile for empty', function(){
    expect(string.isNotNilOrEmpty('')).to.be.false;
  });

  it('should pass for string', function(){
    expect(string.isNotNilOrEmpty('any string')).to.be.true;
  });
});
