const {expect} = require('chai');
const object = require('../src/object');

describe('Evolve Keys', function(){

  it('should skip keys that arent present', function(){
    expect(object.evolveKeys({foo: 'bar'}, {a: 1, b: 2}))
      .to.deep.equal({a: 1, b: 2});
  });

  it('should change keys', function(){
    expect(object.evolveKeys({foo: 'bar'}, {a: 1, foo: 3, b: 2}))
      .to.deep.equal({a: 1, bar: 3, b: 2});
  });

});
