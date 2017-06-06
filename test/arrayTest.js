const {expect} = require('chai');
const array = require('../src/array');

describe('Is Array', function(){

  it('Normal array should match', function(){
    expect(array.isArray([1,2,3])).to.be.true;
  });

  it('Empty array should match', function(){
    expect(array.isArray([])).to.be.true;
  });

  it('Number should not match', function(){
    expect(array.isArray(56)).to.be.false;
  });

  it('Object should not match', function(){
    expect(array.isArray({
      foo: 'bar',
      baz: 'bar'
    })).to.be.false;
  });

});

describe('Convert to Array', function(){

  it('Normal array should stay unchanged', function(){
    expect(array.toArray([1,2,3])).to.deep.equal([1,2,3]);
  });

  it('Empty array should stay unchanged', function(){
    expect(array.toArray([])).to.deep.equal([]);
  });

  it('Numbers should be placed in an array', function(){
    expect(array.toArray(100)).to.deep.equal([100]);
  });

  it('Undefined should go to an empty array', function(){
    expect(array.toArray(undefined)).to.deep.equal([]);
  });

  it('Null should go to an empty array', function(){
    expect(array.toArray(null)).to.deep.equal([]);
  });

  it('Objects should be placed in an array', function(){
    expect(array.toArray({
      name: 'Name',
      id: 234
    })).to.deep.equal([{
      name: 'Name',
      id: 234}
    ]);
  });

});
