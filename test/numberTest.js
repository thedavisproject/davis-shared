const {expect} = require('chai');
const number = require('../src/number');

describe('Is integer', function(){

  it('should pass for integer', function(){
    expect(number.isInteger(2)).to.be.true;
  });

  it('should fail for decimal', function(){
    expect(number.isInteger(4.5)).to.be.false;
  });

  it('should fail for non number', function(){
    expect(number.isInteger('hi')).to.be.false;
  });

  it('should fail for null', function(){
    expect(number.isInteger('null')).to.be.false;
    expect(number.isInteger(undefined)).to.be.false;
  });
});

