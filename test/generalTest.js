const {expect} = require('chai');
const general = require('../src/general');

describe('TryGet', function(){

  it('should return Nothing for null/undefined', function(){
    expect(general.tryGet(2, undefined).isNothing).to.be.true;
    expect(general.tryGet(2, null).isNothing).to.be.true;
  });

  it('should return Nothing for array out of range', function(){
    expect(general.tryGet(0, []).isNothing).to.be.true;
    expect(general.tryGet(2, ['foo']).isNothing).to.be.true;
  });

  it('should return Nothing for object without key', function(){
    expect(general.tryGet('foo', {}).isNothing).to.be.true;
    expect(general.tryGet('foo', {bar: 2}).isNothing).to.be.true;
  });

  it('should return value from array if in range and not nil', function(){
    const value = general.tryGet(1, ['foo', 'bar']);
    expect(value.isJust).to.be.true;
    expect(value.get()).to.equal('bar');
  });

  it('should return value from object if in range and not nil', function(){
    const value = general.tryGet('foo', {foo: 2, bar: 3});
    expect(value.isJust).to.be.true;
    expect(value.get()).to.equal(2);
  });
});
